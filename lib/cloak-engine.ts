export interface CloakContext {
  ip: string
  country: string
  userAgent: string
  acceptLanguage: string
  referrer: string
  cfAsn: string
  prismaid: string | null
}

export interface CloakEvaluation {
  isBlocked: boolean
  score: number
  reason: string
  destination: string
}

interface CampaignConfig {
  prismaId: string
  safeUrl: string
  moneyUrl: string
  riskScore: number
  countries: string   // JSON array
  languages: string   // JSON array
  advancedConfig: string // JSON object
}

// Known bot user-agent strings
const BOT_UA = ['bot', 'crawler', 'spider', 'curl', 'wget', 'lighthouse', 'headless', 'python', 'java']

// Ad platform crawlers
const NETWORK_UA = ['facebookexternalhit', 'googlebot', 'tiktok', 'bytedance', 'kwai', 'adsbot', 'bingbot', 'yandex', 'semrush', 'ahrefsbot']

// AdSpy tool domains
const ADSPY_DOMAINS = ['adspy.com', 'bigspy.com', 'adbeat.com', 'moat.com', 'pathmatics.com', 'adplexity.com', 'poweradspy.com', 'anstrex.com', 'dropispy.com', 'minea.com']

// Known datacenter ASNs
const DATACENTER_ASNS = ['AS14061', 'AS16509', 'AS15169', 'AS8075', 'AS13335', 'AS20940', 'AS16276', 'AS14618', 'AS396982', 'AS19527', 'AS36351', 'AS32934', 'AS54113']

export function evaluateCloaking(campaign: CampaignConfig, ctx: CloakContext): CloakEvaluation {
  let score = 0
  const reasons: string[] = []

  const ua = ctx.userAgent.toLowerCase()
  const ref = ctx.referrer.toLowerCase()
  const countries: string[] = JSON.parse(campaign.countries || '[]')
  const languages: string[] = JSON.parse(campaign.languages || '[]')
  const advanced = JSON.parse(campaign.advancedConfig || '{}')

  // Module 1: PrismaID check
  if (!ctx.prismaid || ctx.prismaid !== campaign.prismaId) {
    score += 100
    reasons.push('invalid_prismaid')
  }

  // Module 2: Generic bot user-agent
  if (BOT_UA.some((b) => ua.includes(b))) {
    score += 80
    reasons.push('bot_ua')
  }

  // Module 3: Ad network crawlers
  if (NETWORK_UA.some((n) => ua.includes(n))) {
    score += 100
    reasons.push('network_ua')
  }

  // Module 4: AdSpy referrer
  if (ref && ADSPY_DOMAINS.some((d) => ref.includes(d))) {
    score += 100
    reasons.push('adspy_referrer')
  }

  // Module 5: Geo filter
  if (countries.length > 0 && ctx.country && !countries.includes(ctx.country.toUpperCase())) {
    score += 50
    reasons.push('geo_blocked')
  }

  // Module 6: Language filter
  if (languages.length > 0 && ctx.acceptLanguage) {
    const hasLang = languages.some((l) => ctx.acceptLanguage.toLowerCase().includes(l.toLowerCase()))
    if (!hasLang) {
      score += 30
      reasons.push('lang_blocked')
    }
  }

  // Module 7: Device filter (from advancedConfig)
  if (advanced.devices) {
    const isMobile = /mobile|android|iphone|ipad/i.test(ctx.userAgent)
    if (isMobile && advanced.devices.mobile === false) {
      score += 30
      reasons.push('device_blocked')
    }
    if (!isMobile && advanced.devices.desktop === false) {
      score += 30
      reasons.push('device_blocked')
    }
  }

  // Module 8: ASN datacenter check
  if (ctx.cfAsn && DATACENTER_ASNS.includes(ctx.cfAsn.toUpperCase())) {
    score += 80
    reasons.push('datacenter_asn')
  }

  const isBlocked = score >= campaign.riskScore
  const reason = reasons.join(',') || 'clean'
  const destination = isBlocked ? campaign.safeUrl : campaign.moneyUrl

  return { isBlocked, score, reason, destination }
}

export function decideCloaking(campaign: { riskScore: number; safeUrl: string; moneyUrl: string }, score: number) {
  return score >= campaign.riskScore
    ? { destination: campaign.safeUrl, isBlocked: true }
    : { destination: campaign.moneyUrl, isBlocked: false }
}
