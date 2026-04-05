import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

const globalForPrisma = global as unknown as { prisma: any }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// PATCH /api/campaigns/[id] — update status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const campaign = await prisma.campaign.update({
      where: { id },
      data: { status: body.status }
    })
    return NextResponse.json({ campaign })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE /api/campaigns/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await prisma.campaign.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
