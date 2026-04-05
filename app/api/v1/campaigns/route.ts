import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return err('API Key obrigatória', 401)

  const apiKey = authHeader.slice(7)
  const user = await prisma.user.findUnique({ where: { apiKey } })

  if (!user) return err('API Key inválida', 401)
  if (user.plan !== 'black') return err('Plano Black necessário para acesso à API', 403)

  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return ok({ campaigns })
}
