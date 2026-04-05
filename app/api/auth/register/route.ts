import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-response'

const schema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e _'),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Precisa de ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Precisa de ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Precisa de ao menos um número'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return err('Corpo da requisição inválido', 400)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return err('Dados inválidos', 400, parsed.error.flatten().fieldErrors)
  }

  const { fullName, username, email, phone, password } = parsed.data

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  })

  if (existing) {
    const field = existing.email === email ? 'email' : 'username'
    return err(`${field} já está em uso`, 409)
  }

  const hash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { fullName, username, email, phone, password: hash },
    select: { id: true, fullName: true, email: true, plan: true },
  })

  return ok({ user }, 201)
}
