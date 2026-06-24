import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/store'

export async function GET() {
  try {
    return NextResponse.json(getUsers())
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
