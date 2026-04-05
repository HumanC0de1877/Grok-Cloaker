const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET', 'NEXTAUTH_SECRET'] as const

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[FATAL] Variável de ambiente obrigatória ausente: ${key}`)
    process.exit(1)
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  CNAME_TARGET: process.env.CNAME_TARGET ?? 'pages.cloaker.app',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
}
