import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_API = ['/api/auth/', '/api/analytics']
const PUBLIC_PATHS = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public auth routes and tracker endpoint
  if (PUBLIC_API.some((p) => pathname.startsWith(p)) && pathname !== '/api/analytics/logs' && pathname !== '/api/analytics/live' && pathname !== '/api/analytics/export') {
    // /api/analytics POST (tracker) is public; GET is protected — handled per-route
    if (pathname === '/api/analytics' && req.method === 'POST') {
      return addSecurityHeaders(NextResponse.next())
    }
  }

  // Allow public pages
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return addSecurityHeaders(NextResponse.next())
  }

  // Allow /{slug} routes (cloaking engine — no auth needed)
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next') && !pathname.startsWith('/login') && !pathname.startsWith('/register') && pathname !== '/') {
    return addSecurityHeaders(NextResponse.next())
  }

  // Protect all /api/* except /api/auth/* and POST /api/analytics
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (pathname === '/api/analytics' && req.method === 'POST') {
      return addSecurityHeaders(NextResponse.next())
    }

    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(token, secret)
      const res = NextResponse.next()
      res.headers.set('X-User-Id', payload.sub as string)
      res.headers.set('X-User-Plan', (payload.plan as string) ?? 'starter')
      return addSecurityHeaders(res)
    } catch {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
    }
  }

  // Protect dashboard pages — redirect to login if no valid token
  if (pathname === '/') {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.redirect(new URL('/login', req.url))

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      await jwtVerify(token, secret)
    } catch {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return addSecurityHeaders(NextResponse.next())
}

function addSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'no-referrer')
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|placeholder|tracker.js).*)'],
}
