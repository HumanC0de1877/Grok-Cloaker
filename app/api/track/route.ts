import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Use a global to prevent connection limits in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const prismaId = searchParams.get('prismaid')
  
  if (!prismaId) {
    return NextResponse.json({ error: 'Missing prismaid parameter' }, { status: 400 })
  }

  try {
    // Busca a campanha baseada no prismaid
    const campaign = await prisma.campaign.findUnique({
      where: { prismaId }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Coleta dados báscios do Request para o Log
    // Em produção Cloudflare (Edge), `request.headers.get('cf-connecting-ip')` deve ser usado
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '0.0.0.0'
    const country = request.headers.get('cf-ipcountry') || 'Unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // ----------------------------------------------------
    // LÓGICA DE DETECÇÃO DO MOTOR DE CLOAKING (SIMPLIFICADA)
    // ----------------------------------------------------
    let isBlocked = false
    let reason = ''
    let score = 0

    // 1. Filtro Básicos (Exemplo)
    if (userAgent.toLowerCase().includes('bot') || userAgent.toLowerCase().includes('crawler') || userAgent.toLowerCase().includes('spider')) {
      isBlocked = true
      reason = 'Identified as Bot/Crawler'
      score = 99
    }

    // 2. Filtro de Idioma/Nav caso a campanha exija `filterBrowser`
    if (!isBlocked && campaign.filterBrowser && (!userAgent || userAgent.trim() === '')) {
      isBlocked = true
      reason = 'No valid User-Agent'
      score = 80
    }

    // (Futuramente: Integre aqui API externa de fraude, Proxy Check, ou libere para Edge ML)
    if (!isBlocked) {
        // Se a campanha ditar riskScore máximo permitido (ex: 75), e batermos o limite, bloqueamos
        if (score > campaign.riskScore) {
           isBlocked = true
           reason = `Risk Score threshold exceeded (${score} > ${campaign.riskScore})`
        }
    }

    const logStatus = isBlocked ? 'blocked' : 'allowed'

    // Registrar no banco (Async, não bloqueia o redirect se não quisermos)
    await prisma.trafficLog.create({
      data: {
        campaignId: campaign.id,
        ip,
        country,
        status: logStatus,
        reason,
        score,
        device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
      }
    })

    // Atualiza contadores na Campanha
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        visitors: { increment: 1 },
        blockedCount: isBlocked ? { increment: 1 } : { increment: 0 }
      }
    })

    // Redirecionamento Final
    const destinationUrl = isBlocked ? campaign.safeUrl : campaign.moneyUrl

    // Se for 'allowed', o lojista ganha o tráfego que pagou; senão, o bot vai para a safeURL.
    return NextResponse.redirect(destinationUrl)

  } catch (error) {
    console.error('Track API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
