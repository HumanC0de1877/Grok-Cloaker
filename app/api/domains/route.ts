import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

const schema = z.object({
  url: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/, 'Domínio inválido (sem protocolo)'),
})

export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)

  const domains = await prisma.domain.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  const cnameTarget = process.env.CNAME_TARGET ?? 'pages.cloaker.app'
  return ok({ domains, dnsInstructions: { type: 'CNAME', name: '@', value: cnameTarget } })
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)

  const body = await req.json().catch(() => null)
  if (!body) return err('Corpo da requisição inválido', 400)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return err('Dados inválidos', 400, parsed.error.flatten().fieldErrors)
  }

  const existing = await prisma.domain.findUnique({ where: { url: parsed.data.url } })
  if (existing) return err('Domínio já cadastrado', 409)

  const domain = await prisma.domain.create({
    data: { userId, url: parsed.data.url },
  })

  return ok({ domain }, 201)
}
