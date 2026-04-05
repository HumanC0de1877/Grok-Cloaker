import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)
  const { id } = await params

  const domain = await prisma.domain.findUnique({ where: { id } })
  if (!domain) return err('Domínio não encontrado', 404)
  if (domain.userId !== userId) return err('Acesso negado', 403)

  await prisma.domain.delete({ where: { id } })
  return ok({ success: true })
}
