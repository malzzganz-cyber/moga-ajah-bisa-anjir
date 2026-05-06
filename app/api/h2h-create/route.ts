import { ENDPOINTS, rumahFetch } from '@/lib/rumahotp'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const target = searchParams.get('target')
  const id = searchParams.get('id')
  if (!target || !id) return NextResponse.json({ error: 'target and id required' }, { status: 400 })
  try {
    const data = await rumahFetch(ENDPOINTS.h2hCreate(target, id))
    return NextResponse.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
