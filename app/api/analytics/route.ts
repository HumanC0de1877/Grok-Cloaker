import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // Here you would persist behavioral data to DB
    // For now just acknowledge receipt silently
    console.log('[Tracker]', JSON.stringify({ 
      campaignId: data.campaignId,
      isBot: data.isBot,
      timeOnPage: data.timeOnPage,
      scrollDepth: data.scrollDepth,
      clicks: data.clicks,
      fingerprint: data.fingerprint,
    }))
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
