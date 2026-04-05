import { NextResponse } from 'next/server'

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: SECURITY_HEADERS })
}

export function err(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status, headers: SECURITY_HEADERS }
  )
}
