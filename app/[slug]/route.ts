import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateCloaking } from '@/lib/cloak-engine'

export const runtime = 'edge'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = req.nextUrl
    const prismaid = searchParams.get('prismaid')

    const campaign = await prisma.campaign.findUnique({ where: { slug } })

    if (!campaign) {
      return NextResponse.redirect('https://google.com', 302)
    }

    if (campaign.status === 'paused') {
      return NextResponse.redirect(campaign.safeUrl, 302)
    }

    const ctx = {
      ip: req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? '',
      country: req.headers.get('cf-ipcountry') ?? '',
      userAgent: req.headers.get('user-agent') ?? '',
      acceptLanguage: req.headers.get('accept-language') ?? '',
      referrer: req.headers.get('referer') ?? '',
      cfAsn: req.headers.get('cf-ipasn') ?? '',
      prismaid,
    }

    const evaluation = evaluateCloaking(campaign, ctx)

    const device = /mobile|android|iphone|ipad/i.test(ctx.userAgent) ? 'Mobile' : 'Desktop'

    // Fire-and-forget: log + counters (don't await to keep response fast)
    prisma.$transaction([
      prisma.trafficLog.create({
        data: {
          campaignId: campaign.id,
          ip: ctx.ip,
          country: ctx.country || null,
          device,
          platform: campaign.trafficSource,
          status: evaluation.isBlocked ? 'blocked' : 'allowed',
          reason: evaluation.reason,
          score: evaluation.score,
        },
      }),
      prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          visitors: { increment: 1 },
          ...(evaluation.isBlocked ? { blockedCount: { increment: 1 } } : {}),
        },
      }),
    ]).catch(() => {/* silent — don't block redirect */})

    return NextResponse.redirect(evaluation.destination, 302)
  } catch {
    return NextResponse.redirect('https://google.com', 302)
  }
}
