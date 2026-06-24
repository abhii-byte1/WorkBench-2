'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { PermissionMatrix } from '@/components/PermissionMatrix'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Permission, Role } from '@/lib/types'
import Link from 'next/link'

export default function RoleEditorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchRole = useCallback(async () => {
    if (isNew) return
    try {
      setLoading(true)
      const res = await fetch(`/api/roles/${id}`)
      if (!res.ok) {
        if (res.status === 404) {
          setFetchError('Role not found')
          return
        }
        throw new Error('Failed to load role')
      }
      const role: Role = await res.json()
      setName(role.name)
      setDescription(role.description)
      setPermissions(role.permissions)
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : 'Failed to load role'
      )
    } finally {
      setLoading(false)
    }
  }, [id, isNew])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRole()
  }, [fetchRole])

  const validateName = async (value: string) => {
    if (!value.trim()) {
      setNameError('Name is required')
      return
    }
    setNameError(null)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError('Name is required')
      return
    }

    setSaving(true)
    try {
      const body = {
        name: name.trim(),
        description: description.trim(),
        permissions,
      }

      const url = isNew ? '/api/roles' : `/api/roles/${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        if (data.error) {
          if (
            data.error.toLowerCase().includes('name') ||
            data.error.toLowerCase().includes('taken')
          ) {
            setNameError(data.error)
          } else {
            toast.error(data.error)
          }
          return
        }
        throw new Error('Failed to save role')
      }

      toast.success(isNew ? 'Role created' : 'Role updated')
      router.push('/roles')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save role'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-8 w-32" />
        <div className="space-y-4">
          <div className="skeleton h-10 w-full max-w-md" />
          <div className="skeleton h-20 w-full max-w-md" />
          <div className="skeleton h-64 w-full" />
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-[var(--color-danger)]">{fetchError}</p>
        <Link
          href="/roles"
          className="mt-4 text-sm text-[var(--color-accent)] hover:underline"
        >
          ← Back to Roles
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link
        href="/roles"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-2)] transition-colors hover:text-[var(--color-text-1)]"
      >
        <ArrowLeft className="size-4" />
        Roles
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-1)]">
          {isNew ? 'Create Role' : 'Edit Role'}
        </h1>
      </div>

      <div className="space-y-6">
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="role-name"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-2)]"
            >
              Name
            </label>
            <input
              id="role-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError(null)
              }}
              onBlur={() => validateName(name)}
              placeholder="e.g. Editor, Billing Admin"
              className={`w-full rounded-lg border bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text-1)] placeholder:text-[var(--color-text-2)]/50 outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/50 ${
                nameError
                  ? 'border-[var(--color-danger)]'
                  : 'border-[var(--color-border)]'
              }`}
            />
            {nameError && (
              <p className="text-xs text-[var(--color-danger)]">{nameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="role-description"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-2)]"
            >
              Description
            </label>
            <textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this role do?"
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text-1)] placeholder:text-[var(--color-text-2)]/50 outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold text-[var(--color-text-1)]">
              Permissions
            </h2>
            <span className="text-sm text-[var(--color-text-2)]">
              {permissions.length} of 22 permissions selected
            </span>
          </div>
          <PermissionMatrix
            value={permissions}
            onChange={setPermissions}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--color-border)] pt-6">
          <Button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className={
              !name.trim() || saving
                ? 'cursor-not-allowed opacity-50'
                : ''
            }
          >
            {saving && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
            Save Role
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/roles')}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
