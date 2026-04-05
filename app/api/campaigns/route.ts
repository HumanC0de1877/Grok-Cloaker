import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

const globalForPrisma = global as unknown as { prisma: any }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// GET /api/campaigns — list all campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
        status: true,
        safeUrl: true,
        moneyUrl: true,
        trafficSource: true,
        prismaId: true,
        riskScore: true,
        visitors: true,
        blockedCount: true,
        createdAt: true,
      }
    })
    return NextResponse.json({ campaigns })
  } catch (err) {
    console.error('[GET /api/campaigns]', err)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

// POST /api/campaigns — create a campaign
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name, slug, prismaId, safeUrl, moneyUrl,
      trafficSource, filterBrowser, countries, languages,
      riskScore, advancedConfig
    } = body

    // Basic validation
    if (!name || !slug || !prismaId || !safeUrl || !moneyUrl) {
      return NextResponse.json({ error: 'Missing required fields: name, slug, prismaId, safeUrl, moneyUrl' }, { status: 400 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: String(name).slice(0, 200),
        slug: String(slug).toUpperCase(),
        prismaId: String(prismaId).toUpperCase(),
        safeUrl: String(safeUrl),
        moneyUrl: String(moneyUrl),
        trafficSource: trafficSource || 'facebook',
        filterBrowser: Boolean(filterBrowser ?? true),
        countries: typeof countries === 'string' ? countries : JSON.stringify(countries || []),
        languages: typeof languages === 'string' ? languages : JSON.stringify(languages || []),
        riskScore: Number(riskScore) || 75,
        advancedConfig: typeof advancedConfig === 'string' ? advancedConfig : JSON.stringify(advancedConfig || {}),
      }
    })

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (err: any) {
    // Unique constraint violation
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug or PrismaID already exists. Try again.' }, { status: 409 })
    }
    console.error('[POST /api/campaigns]', err)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
