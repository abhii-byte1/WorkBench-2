import { NextRequest, NextResponse } from 'next/server'
import { getUserById, getRoleById } from '@/lib/store'
import { resolveEffectivePermissions } from '@/lib/permissions'
import type { UserDetail, Role } from '@/lib/types'

export function buildUserDetail(userId: string): UserDetail | undefined {
  const user = getUserById(userId)
  if (!user) return undefined

  const roles: Role[] = user.roleIds
    .map((rid) => getRoleById(rid))
    .filter((r): r is Role => r !== undefined)

  const effectivePermissions = resolveEffectivePermissions(roles)

  return {
    ...user,
    roles,
    effectivePermissions,
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userDetail = buildUserDetail(id)

    if (!userDetail) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(userDetail)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
