import { NextResponse } from 'next/server'
import { PERMISSION_MATRIX } from '@/lib/permissions'

export async function GET() {
  try {
    return NextResponse.json(PERMISSION_MATRIX)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
