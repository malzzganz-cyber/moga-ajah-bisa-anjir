import { ENDPOINTS, rumahFetch } from '@/lib/rumahotp'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const transaksiId = searchParams.get('transaksi_id')
  if (!transaksiId) return NextResponse.json({ error: 'transaksi_id required' }, { status: 400 })
  try {
    const data = await rumahFetch(ENDPOINTS.h2hStatus(transaksiId))
    return NextResponse.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
