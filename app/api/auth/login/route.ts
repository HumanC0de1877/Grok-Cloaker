import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'

  if (!rateLimit(`login:${ip}`, 10, 60_000)) {
    return err('Muitas tentativas. Tente novamente em 1 minuto.', 429)
  }

  const body = await req.json().catch(() => null)
  if (!body) return err('Corpo da requisição inválido', 400)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return err('Dados inválidos', 400, parsed.error.flatten().fieldErrors)
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  const valid = user ? await bcrypt.compare(password, user.password) : false

  if (!user || !valid) {
    return err('Credenciais inválidas', 401)
  }

  const token = jwt.sign(
    { sub: user.id, plan: user.plan },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  const response = ok({
    user: { id: user.id, fullName: user.fullName, email: user.email, plan: user.plan },
  })

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}
