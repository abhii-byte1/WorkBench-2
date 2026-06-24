import { NextRequest, NextResponse } from 'next/server'
import { assignRoleToUser, unassignRoleFromUser, getRoleById, getUserById } from '@/lib/store'
import { buildUserDetail } from '@/app/api/users/[id]/route'

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const user = getUserById(id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json() as { roleId?: string }

    if (!body.roleId) {
      return NextResponse.json(
        { error: 'roleId is required' },
        { status: 400 }
      )
    }

    const role = getRoleById(body.roleId)
    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    const result = assignRoleToUser(id, body.roleId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const userDetail = buildUserDetail(id)
    return NextResponse.json(userDetail)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const user = getUserById(id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json() as { roleId?: string }

    if (!body.roleId) {
      return NextResponse.json(
        { error: 'roleId is required' },
        { status: 400 }
      )
    }

    const result = unassignRoleFromUser(id, body.roleId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const userDetail = buildUserDetail(id)
    return NextResponse.json(userDetail)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
