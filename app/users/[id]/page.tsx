'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { EffectivePermissions } from '@/components/EffectivePermissions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ArrowLeft, Plus, X, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import type { UserDetail, Role } from '@/lib/types'

export default function UserDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [user, setUser] = useState<UserDetail | null>(null)
  const [allRoles, setAllRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [assigningRoleId, setAssigningRoleId] = useState<string | null>(null)
  const [removingRoleId, setRemovingRoleId] = useState<string | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      setFetchError(null)
      const [userRes, rolesRes] = await Promise.all([
        fetch(`/api/users/${id}`),
        fetch('/api/roles'),
      ])

      if (!userRes.ok) {
        if (userRes.status === 404) {
          setFetchError('User not found')
          return
        }
        throw new Error('Failed to load user')
      }

      const userData: UserDetail = await userRes.json()
      const rolesData: Role[] = await rolesRes.json()
      setUser(userData)
      setAllRoles(rolesData)
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : 'Failed to load user'
      )
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleAssignRole = async (roleId: string) => {
    setAssigningRoleId(roleId)
    try {
      const res = await fetch(`/api/users/${id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to assign role')
      }

      const updated: UserDetail = await res.json()
      setUser(updated)
      toast.success(`Role assigned to ${updated.name}`)
      setPopoverOpen(false)

      const rolesRes = await fetch('/api/roles')
      if (rolesRes.ok) {
        const rolesData: Role[] = await rolesRes.json()
        setAllRoles(rolesData)
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to assign role'
      )
    } finally {
      setAssigningRoleId(null)
    }
  }

  const handleRemoveRole = async (roleId: string) => {
    setRemovingRoleId(roleId)
    try {
      const res = await fetch(`/api/users/${id}/roles`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to remove role')
      }

      const updated: UserDetail = await res.json()
      setUser(updated)
      toast.success(`Role removed from ${updated.name}`)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to remove role'
      )
    } finally {
      setRemovingRoleId(null)
    }
  }

  const availableRoles = allRoles.filter(
    (role) => !user?.roleIds.includes(role.id)
  )

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="skeleton h-4 w-16" />
        <div className="flex items-center gap-4">
          <div className="skeleton size-14 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-6 w-36" />
            <div className="skeleton h-4 w-48" />
          </div>
        </div>
        <div className="skeleton h-32 rounded-xl" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    )
  }

  if (fetchError || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-[var(--color-danger)]">
          {fetchError ?? 'User not found'}
        </p>
        <Link
          href="/users"
          className="mt-4 text-sm text-[var(--color-accent)] hover:underline"
        >
          ← Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-2)] transition-colors hover:text-[var(--color-text-1)]"
      >
        <ArrowLeft className="size-4" />
        Users
      </Link>

      {/* SECTION 1: User Header */}
      <div className="flex items-center gap-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${user.avatarColor}`}
        >
          {user.avatarInitials}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-1)]">
            {user.name}
          </h1>
          <p className="text-sm text-[var(--color-text-2)]">{user.email}</p>
          <p className="mt-1 text-xs text-[var(--color-text-2)]">
            {user.roles.length} role{user.roles.length !== 1 ? 's' : ''} ·{' '}
            {user.effectivePermissions.length} of 22 permissions active
          </p>
        </div>
      </div>

      {/* SECTION 2: Assigned Roles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text-1)]">
            Assigned Roles
          </h2>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              render={
                <Button variant="outline" size="sm" />
              }
            >
              <Plus className="size-4" data-icon="inline-start" />
              Assign Role
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 bg-[var(--color-surface)] p-0 ring-1 ring-[var(--color-border)]">
              <div className="border-b border-[var(--color-border)] px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-2)]">
                  Available Roles
                </p>
              </div>
              {availableRoles.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-[var(--color-text-2)]">
                  All roles assigned
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto py-1">
                  {availableRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleAssignRole(role.id)}
                      disabled={assigningRoleId === role.id}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-[var(--color-text-1)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50"
                    >
                      <ShieldCheck className="size-4 shrink-0 text-[var(--color-text-2)]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{role.name}</p>
                        <p className="truncate text-xs text-[var(--color-text-2)]">
                          {role.permissions.length} permissions
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {user.roles.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8">
            <p className="text-sm text-[var(--color-text-2)]">
              No roles assigned yet. Add a role to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 transition-colors hover:border-[var(--color-text-2)]/20"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-[var(--color-text-1)]">
                      {role.name}
                    </h3>
                    {role.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--color-text-2)]">
                    {role.description}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-2)]">
                    {role.permissions.length} permission
                    {role.permissions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRole(role.id)}
                  disabled={removingRoleId === role.id}
                  className="shrink-0 text-[var(--color-text-2)] hover:text-[var(--color-danger)]"
                >
                  {removingRoleId === role.id ? (
                    'Removing…'
                  ) : (
                    <>
                      <X className="size-4" data-icon="inline-start" />
                      Remove
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: Effective Permissions */}
      <EffectivePermissions
        effectivePermissions={user.effectivePermissions}
        roleCount={user.roles.length}
      />
    </div>
  )
}
