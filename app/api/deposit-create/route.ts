import { ENDPOINTS, rumahFetch } from '@/lib/rumahotp'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const amount = searchParams.get('amount')
  if (!amount) return NextResponse.json({ error: 'amount required' }, { status: 400 })
  try {
    const data = await rumahFetch(ENDPOINTS.depositCreate(amount))
    return NextResponse.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
