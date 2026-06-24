'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRoles } from '@/hooks/useRoles'
import { RoleCard } from '@/components/RoleCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, ShieldPlus } from 'lucide-react'
import { toast } from 'sonner'

export default function RolesPage() {
  const { roles, loading, error, mutate } = useRoles()
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = (id: string) => {
    router.push(`/roles/${id}`)
  }

  const handleDuplicate = async (id: string) => {
    const role = roles.find((r) => r.id === id)
    if (!role) return

    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Copy of ${role.name}`,
          description: role.description,
          permissions: role.permissions,
        }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to duplicate role')
      }

      const newRole = (await res.json()) as { id: string }
      toast.success('Role created')
      router.push(`/roles/${newRole.id}`)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to duplicate role'
      )
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/roles/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to delete role')
      }

      toast.success('Role deleted')
      setDeleteTarget(null)
      mutate()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete role'
      )
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-8 w-24" />
            <div className="skeleton mt-2 h-4 w-48" />
          </div>
          <div className="skeleton h-9 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton h-40 rounded-xl"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-[var(--color-danger)]">{error}</p>
        <Button variant="outline" onClick={mutate} className="mt-4">
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-1)]">
            Roles
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-2)]">
            Define what each role can do
          </p>
        </div>
        <Button onClick={() => router.push('/roles/new')}>
          <Plus className="size-4" data-icon="inline-start" />
          Create Role
        </Button>
      </div>

      {roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16">
          <ShieldPlus className="size-12 text-[var(--color-text-2)]" />
          <div className="text-center">
            <h3 className="font-semibold text-[var(--color-text-1)]">
              No roles yet
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-2)]">
              Create your first role to get started
            </p>
          </div>
          <Button onClick={() => router.push('/roles/new')}>
            <Plus className="size-4" data-icon="inline-start" />
            Create your first role
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={(id) => {
                const r = roles.find((rl) => rl.id === id)
                if (r) setDeleteTarget({ id, name: r.name })
              }}
            />
          ))}
        </div>
      )}

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{deleteTarget?.name}&rdquo;</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The role will be removed from all
              users who currently have it assigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
