'use client'

import type { EffectivePermission } from '@/lib/types'
import { ShieldAlert, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
            0 of 19 permissions active across {roleCount} roles
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

  // Group permissions by resource
  const grouped = effectivePermissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = []
    acc[perm.resource].push(perm)
    return acc
  }, {} as Record<string, EffectivePermission[]>)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-1)]">
          Effective Permissions
        </h2>
        <p className="text-sm text-[var(--color-text-2)]">
          {activeCount} of 19 permissions active across {roleCount} roles
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([resource, perms]) => (
          <div
            key={resource}
            className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
              <Shield className="size-4 text-[var(--color-text-2)]" />
              <h3 className="text-sm font-semibold capitalize text-[var(--color-text-1)]">
                {resource}
              </h3>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {perms.map((perm) => (
                <div
                  key={perm.action}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-[var(--color-surface-2)]/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium capitalize text-[var(--color-text-1)]">
                      {perm.action.replace('_', ' ')}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-[var(--color-text-2)]">
                      {resource}.{perm.action}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-2 text-xs font-medium text-[var(--color-text-2)]">
                      Granted By:
                    </span>
                    {perm.grantedBy.map((roleName) => (
                      <Badge
                        key={roleName}
                        variant="secondary"
                        className="bg-[var(--color-border)]/50 font-normal text-[var(--color-text-1)] hover:bg-[var(--color-border)]"
                      >
                        {roleName}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
