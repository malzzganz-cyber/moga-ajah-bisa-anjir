import { ENDPOINTS, rumahFetch } from '@/lib/rumahotp'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country')
  const providerId = searchParams.get('provider_id')
  if (!country || !providerId) return NextResponse.json({ error: 'country and provider_id required' }, { status: 400 })
  try {
    const data = await rumahFetch(ENDPOINTS.operators(country, providerId))
    return NextResponse.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
