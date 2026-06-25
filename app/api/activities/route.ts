import { NextResponse } from 'next/server'
import { getActivities } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(getActivities())
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
