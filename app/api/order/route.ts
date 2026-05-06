import { ENDPOINTS, rumahFetch } from '@/lib/rumahotp'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const numberId = searchParams.get('number_id')
  const providerId = searchParams.get('provider_id')
  const operatorId = searchParams.get('operator_id')
  if (!numberId || !providerId || !operatorId)
    return NextResponse.json({ error: 'number_id, provider_id, operator_id required' }, { status: 400 })
  try {
    const data = await rumahFetch(ENDPOINTS.order(numberId, providerId, operatorId))
    return NextResponse.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
