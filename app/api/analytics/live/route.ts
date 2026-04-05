import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)

  const userCampaigns = await prisma.campaign.findMany({
    where: { userId },
    select: { id: true },
  })
  const campaignIds = userCampaigns.map((c) => c.id)

  const now = new Date()
  const last5min = new Date(now.getTime() - 5 * 60 * 1000)
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const [recentLogs, last5minLogs, suspiciousLogs, geoLogs] = await Promise.all([
    // Last 100 logs
    prisma.trafficLog.findMany({
      where: { campaignId: { in: campaignIds } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    // Last 5 min metrics
    prisma.trafficLog.findMany({
      where: { campaignId: { in: campaignIds }, createdAt: { gte: last5min } },
      select: { status: true, reason: true },
    }),
    // Suspicious (score >= 80) last 24h
    prisma.trafficLog.findMany({
      where: { campaignId: { in: campaignIds }, score: { gte: 80 }, createdAt: { gte: last24h } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    // Geo distribution last 24h
    prisma.trafficLog.findMany({
      where: { campaignId: { in: campaignIds }, createdAt: { gte: last24h } },
      select: { country: true },
    }),
  ])

  // Top block reasons last 5 min
  const reasonMap = new Map<string, number>()
  for (const log of last5minLogs) {
    if (log.status === 'blocked' && log.reason) {
      for (const r of log.reason.split(',')) {
        reasonMap.set(r, (reasonMap.get(r) ?? 0) + 1)
      }
    }
  }
  const topBlockReasons = Array.from(reasonMap.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Geo distribution
  const geoMap = new Map<string, number>()
  for (const log of geoLogs) {
    const c = log.country || 'unknown'
    geoMap.set(c, (geoMap.get(c) ?? 0) + 1)
  }
  const geoDistribution = Array.from(geoMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)

  return ok({
    recentLogs,
    last5min: {
      total: last5minLogs.length,
      blocked: last5minLogs.filter((l) => l.status === 'blocked').length,
      topBlockReasons,
    },
    suspiciousLogs,
    geoDistribution,
  })
}
