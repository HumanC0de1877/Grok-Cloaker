import { prisma } from './prisma'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function randomString(length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return result
}

export async function generateSlug(): Promise<string> {
  let slug: string
  do {
    slug = randomString(6)
  } while (await prisma.campaign.findUnique({ where: { slug } }))
  return slug
}

export async function generatePrismaId(): Promise<string> {
  let prismaId: string
  do {
    prismaId = randomString(12)
  } while (await prisma.campaign.findUnique({ where: { prismaId } }))
  return prismaId
}
