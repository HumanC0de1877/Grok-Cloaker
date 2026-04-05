import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'
import { generateSlug, generatePrismaId } from '@/lib/campaign-utils'

const TRAFFIC_SOURCES = ['facebook', 'tiktok', 'google', 'kwai'] as const

const createSchema = z.object({
  name: z.string().min(1),
  safeUrl: z.string().url(),
  moneyUrl: z.string().url(),
  trafficSource: z.enum(TRAFFIC_SOURCES),
  riskScore: z.number().int().min(0).max(100).optional().default(75),
  countries: z.array(z.string().length(2)).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  advancedConfig: z.record(z.unknown()).optional().default({}),
})

export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)

  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, slug: true, prismaId: true, status: true,
      safeUrl: true, moneyUrl: true, trafficSource: true, riskScore: true,
      visitors: true, blockedCount: true, createdAt: true,
    },
  })

  return ok({ campaigns })
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  const userPlan = req.headers.get('X-User-Plan') ?? 'starter'
  if (!userId) return err('Não autorizado', 401)

  // Enforce plan limits
  if (userPlan === 'starter') {
    const activeCount = await prisma.campaign.count({
      where: { userId, status: 'active' },
    })
    if (activeCount >= 3) {
      return err('Limite do plano Starter atingido (máx. 3 campanhas ativas). Faça upgrade para Pro.', 403)
    }
  }

  const body = await req.json().catch(() => null)
  if (!body) return err('Corpo da requisição inválido', 400)

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return err('Dados inválidos', 400, parsed.error.flatten().fieldErrors)
  }

  const { name, safeUrl, moneyUrl, trafficSource, riskScore, countries, advancedConfig } = parsed.data

  const [slug, prismaId] = await Promise.all([generateSlug(), generatePrismaId()])

  const campaign = await prisma.campaign.create({
    data: {
      userId, name, safeUrl, moneyUrl, trafficSource, riskScore, slug, prismaId,
      countries: JSON.stringify(countries),
      advancedConfig: JSON.stringify(advancedConfig),
    },
  })

  return ok({ campaign }, 201)
}
