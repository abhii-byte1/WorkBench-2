'use client'

import type { EffectivePermission } from '@/lib/types'
import { PermissionMatrix } from '@/components/PermissionMatrix'
import { ShieldAlert } from 'lucide-react'

interface EffectivePermissionsProps {
  effectivePermissions: EffectivePermission[]
  roleCount: number
}

export function EffectivePermissions({
  effectivePermissions,
  roleCount,
}: EffectivePermissionsProps) {
  const activeCount = effectivePermissions.length

  if (activeCount === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-1)]">
            Effective Permissions
          </h2>
          <p className="text-sm text-[var(--color-text-2)]">
            0 of 22 permissions active across {roleCount} roles
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12">
          <ShieldAlert className="size-8 text-[var(--color-text-2)]" />
          <p className="text-sm text-[var(--color-text-2)]">
            Assign at least one role to see permissions
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-1)]">
          Effective Permissions
        </h2>
        <p className="text-sm text-[var(--color-text-2)]">
          {activeCount} of 22 permissions active across {roleCount} roles
        </p>
      </div>
      <PermissionMatrix
        value={[]}
        readOnly
        effectivePermissions={effectivePermissions}
      />
    </div>
  )
}
