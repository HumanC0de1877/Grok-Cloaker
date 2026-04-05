import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  safeUrl: z.string().url().optional(),
  moneyUrl: z.string().url().optional(),
  trafficSource: z.enum(['facebook', 'tiktok', 'google', 'kwai']).optional(),
  riskScore: z.number().int().min(0).max(100).optional(),
  status: z.enum(['active', 'paused']).optional(),
  countries: z.array(z.string().length(2)).optional(),
  languages: z.array(z.string()).optional(),
  advancedConfig: z.record(z.unknown()).optional(),
})

async function getOwned(id: string, userId: string) {
  const campaign = await prisma.campaign.findUnique({ where: { id } })
  if (!campaign) return null
  if (campaign.userId !== userId) return 'forbidden'
  return campaign
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)
  const { id } = await params
  const campaign = await getOwned(id, userId)
  if (!campaign) return err('Campanha não encontrada', 404)
  if (campaign === 'forbidden') return err('Acesso negado', 403)
  return ok({ campaign })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)
  const { id } = await params

  const existing = await getOwned(id, userId)
  if (!existing) return err('Campanha não encontrada', 404)
  if (existing === 'forbidden') return err('Acesso negado', 403)

  const body = await req.json().catch(() => null)
  if (!body) return err('Corpo da requisição inválido', 400)

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return err('Dados inválidos', 400, parsed.error.flatten().fieldErrors)
  }

  const { countries, languages, advancedConfig, ...rest } = parsed.data

  const campaign = await prisma.campaign.update({
    where: { id },
    data: {
      ...rest,
      ...(countries !== undefined ? { countries: JSON.stringify(countries) } : {}),
      ...(languages !== undefined ? { languages: JSON.stringify(languages) } : {}),
      ...(advancedConfig !== undefined ? { advancedConfig: JSON.stringify(advancedConfig) } : {}),
    },
  })

  return ok({ campaign })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)
  const { id } = await params

  const existing = await getOwned(id, userId)
  if (!existing) return err('Campanha não encontrada', 404)
  if (existing === 'forbidden') return err('Acesso negado', 403)

  await prisma.campaign.delete({ where: { id } })
  return ok({ success: true })
}
