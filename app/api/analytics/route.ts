import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

const trackerSchema = z.object({
  campaignId: z.string().min(1),
  fingerprint: z.string(),
  cpuCores: z.number().optional(),
  deviceMemory: z.number().optional(),
  platform: z.string().optional(),
  languages: z.array(z.string()).optional(),
  screenResolution: z.string().optional(),
  hasWebdriver: z.boolean().optional(),
  isBot: z.boolean().optional(),
  mouseMovements: z.number().optional(),
  clicks: z.number().optional(),
  scrollDepth: z.number().optional(),
  timeOnPage: z.number().optional(),
})

// POST — public, receives tracker data
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return ok({ ok: true }) // silent fail — don't expose errors to tracker

  const parsed = trackerSchema.safeParse(body)
  if (!parsed.success) return ok({ ok: true })

  const d = parsed.data

  await prisma.behavioralLog.create({
    data: {
      campaignId: d.campaignId,
      fingerprint: d.fingerprint,
      isBot: d.isBot ?? false,
      cpuCores: d.cpuCores,
      deviceMemory: d.deviceMemory,
      platform: d.platform,
      languages: d.languages ? JSON.stringify(d.languages) : null,
      screenRes: d.screenResolution,
      hasWebdriver: d.hasWebdriver ?? false,
      mouseMovements: d.mouseMovements ?? 0,
      clicks: d.clicks ?? 0,
      scrollDepth: d.scrollDepth ?? 0,
      timeOnPage: d.timeOnPage ?? 0,
    },
  }).catch(() => {/* silent */})

  return ok({ ok: true })
}

// GET — protected, returns aggregated analytics
export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)

  const { searchParams } = req.nextUrl
  const campaignId = searchParams.get('campaignId')
  const period = searchParams.get('period') ?? '24h'

  const periodMap: Record<string, number> = { '24h': 24, '7d': 168, '30d': 720 }
  const hours = periodMap[period] ?? 24
  const since = new Date(Date.now() - hours * 60 * 60 * 1000)

  // Get user's campaign IDs
  const userCampaigns = await prisma.campaign.findMany({
    where: { userId, ...(campaignId ? { id: campaignId } : {}) },
    select: { id: true },
  })
  const campaignIds = userCampaigns.map((c) => c.id)

  if (campaignIds.length === 0) {
    return ok({ summary: { totalVisitors: 0, totalBlocked: 0, blockRate: 0 }, byCountry: [], byDevice: [], bySource: [], timeSeries: [] })
  }

  const logs = await prisma.trafficLog.findMany({
    where: { campaignId: { in: campaignIds }, createdAt: { gte: since } },
    select: { status: true, country: true, device: true, platform: true, createdAt: true },
  })

  const totalVisitors = logs.length
  const totalBlocked = logs.filter((l) => l.status === 'blocked').length
  const blockRate = totalVisitors > 0 ? Math.round((totalBlocked / totalVisitors) * 100) : 0

  const byCountry = aggregate(logs, 'country')
  const byDevice = aggregate(logs, 'device')
  const bySource = aggregate(logs, 'platform')

  // Time series by hour
  const tsMap = new Map<string, { visitors: number; blocked: number }>()
  for (const log of logs) {
    const hour = new Date(log.createdAt).toISOString().slice(0, 13) + ':00'
    const entry = tsMap.get(hour) ?? { visitors: 0, blocked: 0 }
    entry.visitors++
    if (log.status === 'blocked') entry.blocked++
    tsMap.set(hour, entry)
  }
  const timeSeries = Array.from(tsMap.entries())
    .map(([hour, v]) => ({ hour, ...v }))
    .sort((a, b) => a.hour.localeCompare(b.hour))

  return ok({ summary: { totalVisitors, totalBlocked, blockRate }, byCountry, byDevice, bySource, timeSeries })
}

function aggregate(logs: { [key: string]: unknown }[], field: string) {
  const map = new Map<string, number>()
  for (const log of logs) {
    const val = (log[field] as string) || 'unknown'
    map.set(val, (map.get(val) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ [field]: name, count }))
    .sort((a, b) => b.count - a.count)
}
