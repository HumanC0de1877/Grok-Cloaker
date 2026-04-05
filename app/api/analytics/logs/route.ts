import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const status = searchParams.get('status') // allowed | blocked
  const campaignId = searchParams.get('campaignId')
  const country = searchParams.get('country')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const userCampaigns = await prisma.campaign.findMany({
    where: { userId, ...(campaignId ? { id: campaignId } : {}) },
    select: { id: true },
  })
  const campaignIds = userCampaigns.map((c) => c.id)

  const where = {
    campaignId: { in: campaignIds },
    ...(status ? { status } : {}),
    ...(country ? { country } : {}),
    ...(from || to ? {
      createdAt: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    } : {}),
  }

  const PAGE_SIZE = 50
  const [logs, total] = await Promise.all([
    prisma.trafficLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.trafficLog.count({ where }),
  ])

  return ok({ logs, total, page, pageSize: PAGE_SIZE })
}
