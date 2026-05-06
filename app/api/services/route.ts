import { ENDPOINTS, rumahFetch } from '@/lib/rumahotp'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await rumahFetch(ENDPOINTS.services())
    return NextResponse.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
