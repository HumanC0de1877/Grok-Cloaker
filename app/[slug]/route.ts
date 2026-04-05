import { NextResponse } from 'next/server'
// Prisma v7 re-exports generated client through @prisma/client -> .prisma/client
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

const globalForPrisma = global as unknown as { prisma: any }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const { searchParams } = new URL(request.url)
  const prismaid = searchParams.get('prismaid')

  // Identificação do visitante
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1'
  const userAgent = request.headers.get('user-agent') || ''
  const country = request.headers.get('cf-ipcountry') || 'ZZ'
  const acceptLanguage = request.headers.get('accept-language') || ''
  const referrer = request.headers.get('referer') || ''
  const cfAsn = request.headers.get('cf-ipasn') || ''

  try {
    // 1. Busca a campanha apenas pelo slug (MINIHASH) via Edge Prisma (D1 adapter in prod)
    // Para SQLite fallback local usamos o global client.
    const campaign = await prisma.campaign.findUnique({
      where: { slug }
    })

    // Se a campanha não existir, manda pra uma 404 fake genérica (ou home)
    if (!campaign) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Configurações
    let config: any = {}
    try { config = JSON.parse(campaign.advancedConfig) } catch (e) { config = {} }

    let isBlocked = false
    let blockReason = ''
    let score = 0

    // ============================================
    // REGRA 1: Validação do PrismaID (Security Layer 1)
    // ============================================
    if (!prismaid || prismaid !== campaign.prismaId) {
      isBlocked = true
      blockReason = 'Invalid or Missing PrismaID'
      score += 100
    }

    // ============================================
    // REGRA 2: Filtros Estáticos Ultra-Rápidos
    // ============================================
    const uaLower = userAgent.toLowerCase()

    // Módulo BOTS & CRAWLERS
    if (!isBlocked && config.bots !== false) {
      const knownBots = ['bot', 'crawler', 'spider', 'curl', 'wget', 'lighthouse', 'headless', 'python', 'java']
      if (knownBots.some(bot => uaLower.includes(bot))) {
        isBlocked = true
        blockReason = 'Explicit Bot User-Agent'
        score += 80
      }
    }

    // Módulo NETWORKS (FB/Google/TikTok/Kwai Approvers)
    if (!isBlocked && config.networks !== false) {
      const networkSignatures = ['facebookexternalhit', 'googlebot', 'tiktok', 'bytedance', 'kwai', 'adsbot']
      if (networkSignatures.some(sig => uaLower.includes(sig))) {
        isBlocked = true
        blockReason = 'Network Approver/Crawler Detected'
        score += 100
      }
    }

    // Módulo AdSpy Tools
    if (!isBlocked && config.adSpy !== false) {
      const adSpyReferrers = ['adspy.com', 'poweradspy.com', 'adplexity.com', 'magicad.com', 'bigspy.com']
      if (adSpyReferrers.some(spy => referrer.includes(spy))) {
        isBlocked = true
        blockReason = 'AdSpy Tool Referrer Detected'
        score += 100
      }
    }

    // Módulo GEO FILTERING
    if (!isBlocked && config.geo) {
      let allowed = true
      if (config.geo.whitelist && config.geo.whitelist.length > 0) {
        allowed = config.geo.whitelist.includes(country)
      }
      if (config.geo.blacklist && config.geo.blacklist.includes(country)) {
        allowed = false
      }
      if (!allowed) {
        isBlocked = true
        blockReason = `Geo Restricted (Country: ${country})`
        score += 50
      }
    }

    // Módulo LINGUAGEM DO NAVEGADOR
    if (!isBlocked && config.langs && config.langs.length > 0) {
      const hasValidLang = config.langs.some((l: string) => acceptLanguage.toLowerCase().includes(l.toLowerCase()))
      if (!hasValidLang) {
        isBlocked = true
        blockReason = `Browser Language Mismatch (Got: ${acceptLanguage})`
        score += 30
      }
    }

    // Módulo DISPOSITIVO E SO E BROWSER
    if (!isBlocked && config.devices) {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      if (isMobile && config.devices.mobile === false) {
        isBlocked = true; blockReason = 'Mobile traffic blocked'; score+=30;
      }
      if (!isMobile && config.devices.desktop === false) {
        isBlocked = true; blockReason = 'Desktop traffic blocked'; score+=30;
      }
    }

    // Módulo ISP e ASN Cloudflare (Proxy/VPN)
    if (!isBlocked && config.proxyVpn !== false) {
      const isSusUserAgent = !userAgent || userAgent.length < 20 || userAgent.includes('Linux x86_64')
      if (isSusUserAgent) {
         // Proxy providers usually use headless browsers or weird UAs
         score += 20
      }
      // ASN Blacklist (ex: Datacenters da AWS, DigitalOcean)
      const dataCenterASNs = ['14618', '16509', '14061'] // Amazon etc.
      if (cfAsn && dataCenterASNs.includes(cfAsn)) {
        isBlocked = true
        blockReason = `Datacenter ASN Blocked (${cfAsn})`
        score += 80
      }
    }

    // ============================================
    // AVALIAÇÃO DE HARD SCORE
    // ============================================
    if (score >= campaign.riskScore) {
       isBlocked = true
       if (!blockReason) blockReason = `Risk Score Triggered (${score}/${campaign.riskScore})`
    }

    const logStatus = isBlocked ? 'blocked' : 'allowed'

    // Assyncronous Log -> Usamos o waitUntil pra rodar no Edge sem parar a resposta
    // Como estamos no Prisma Edge/SQLite, só o insert:
    await prisma.trafficLog.create({
      data: {
        campaignId: campaign.id,
        ip,
        country,
        status: logStatus,
        reason: blockReason,
        score,
        device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
      }
    })

    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        visitors: { increment: 1 },
        blockedCount: isBlocked ? { increment: 1 } : { increment: 0 }
      }
    })

    // Redirecionamento Dinâmico (Bounce)
    const dest = isBlocked ? campaign.safeUrl : campaign.moneyUrl

    // Se estiver bloqueado -> Vai pra SafePage.
    // Se for Hot Lead -> Redirect Money Page (onde teremos o tracker.js de Comportamento para pós-clique)
    return NextResponse.redirect(dest, { status: 302 })

  } catch (error) {
    console.error('Cloaker Engine Error:', error)
    // Fail Open (mandamos p safeurl em erro)
    return NextResponse.redirect('https://google.com', { status: 302 })
  }
}
