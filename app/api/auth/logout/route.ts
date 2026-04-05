import { NextResponse } from 'next/server'

export async function GET() {
  const res = NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL ?? 'http://localhost:3000'))
  res.cookies.set('token', '', { maxAge: 0, path: '/' })
  return res
}
