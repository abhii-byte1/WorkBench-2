import { NextRequest, NextResponse } from 'next/server'
import { getRoleById, updateRole, deleteRole, isRoleNameTaken, logActivity } from '@/lib/store'
import type { Permission } from '@/lib/types'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const role = getRoleById(id)

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(role)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const existing = getRoleById(id)

    if (!existing) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    const body = await request.json() as {
      name?: string
      description?: string
      permissions?: Permission[]
    }

    if (body.name !== undefined && body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name cannot be empty' },
        { status: 400 }
      )
    }

    if (body.name && isRoleNameTaken(body.name, id)) {
      return NextResponse.json(
        { error: 'Role name is already taken' },
        { status: 400 }
      )
    }

    const updated = updateRole(id, {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.permissions !== undefined && { permissions: body.permissions }),
    })

    if (updated) {
      logActivity({
        type: 'role_updated',
        targetName: updated.name,
      })
    }

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const role = getRoleById(id)

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    if (role.isDefault) {
      return NextResponse.json(
        { error: 'Default roles cannot be deleted' },
        { status: 400 }
      )
    }

    const result = deleteRole(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    logActivity({
      type: 'role_deleted',
      targetName: role.name,
    })

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
