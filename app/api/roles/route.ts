import { NextRequest, NextResponse } from 'next/server'
import { getRoles, createRole, isRoleNameTaken, logActivity } from '@/lib/store'
import type { Permission } from '@/lib/types'

export async function GET() {
  try {
    return NextResponse.json(getRoles())
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string
      description?: string
      permissions?: Permission[]
    }

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (isRoleNameTaken(body.name)) {
      return NextResponse.json(
        { error: 'Role name is already taken' },
        { status: 400 }
      )
    }

    const role = createRole({
      name: body.name.trim(),
      description: body.description ?? '',
      permissions: body.permissions ?? [],
    })

    logActivity({
      type: 'role_created',
      targetName: role.name,
    })

    return NextResponse.json(role, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
