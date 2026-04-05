import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { err } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status')
  const campaignId = searchParams.get('campaignId')
  const country = searchParams.get('country')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const userCampaigns = await prisma.campaign.findMany({
    where: { userId, ...(campaignId ? { id: campaignId } : {}) },
    select: { id: true },
  })
  const campaignIds = userCampaigns.map((c) => c.id)

  const logs = await prisma.trafficLog.findMany({
    where: {
      campaignId: { in: campaignIds },
      ...(status ? { status } : {}),
      ...(country ? { country } : {}),
      ...(from || to ? {
        createdAt: {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        },
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  const header = 'id,campaignId,ip,country,device,platform,status,reason,score,createdAt\n'
  const rows = logs.map((l) =>
    [l.id, l.campaignId, l.ip, l.country ?? '', l.device ?? '', l.platform ?? '', l.status, l.reason ?? '', l.score, l.createdAt.toISOString()].join(',')
  ).join('\n')

  return new NextResponse(header + rows, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="traffic-logs.csv"',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
