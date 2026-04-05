import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) return err('Não autorizado', 401)
  const { id } = await params

  const domain = await prisma.domain.findUnique({ where: { id } })
  if (!domain) return err('Domínio não encontrado', 404)
  if (domain.userId !== userId) return err('Acesso negado', 403)

  const cnameTarget = process.env.CNAME_TARGET ?? 'pages.cloaker.app'

  try {
    // DNS lookup via Cloudflare DNS over HTTPS
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain.url}&type=CNAME`, {
      headers: { Accept: 'application/dns-json' },
    })
    const data = await res.json() as { Answer?: { data: string }[] }
    const answers = data.Answer ?? []
    const isActive = answers.some((a) => a.data.replace(/\.$/, '') === cnameTarget)

    await prisma.domain.update({ where: { id }, data: { isActive } })

    if (!isActive) {
      return err(`CNAME não encontrado. Configure: ${domain.url} → ${cnameTarget}`, 400)
    }

    return ok({ isActive, message: 'Domínio verificado com sucesso' })
  } catch {
    return err('Erro ao verificar DNS. Tente novamente.', 500)
  }
}
