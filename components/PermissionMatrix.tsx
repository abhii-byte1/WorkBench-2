'use client'

import { useCallback, useMemo } from 'react'
import type { Permission, EffectivePermission, Resource, Action } from '@/lib/types'
import {
  PERMISSION_MATRIX,
  ALL_ACTIONS,
  isActionAvailableForResource,
} from '@/lib/permissions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Check } from 'lucide-react'

interface PermissionMatrixProps {
  value: Permission[]
  onChange?: (permissions: Permission[]) => void
  readOnly?: boolean
  effectivePermissions?: EffectivePermission[]
}

function formatActionName(action: string): string {
  return action
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatResourceName(resource: string): string {
  return resource.charAt(0).toUpperCase() + resource.slice(1)
}

export function PermissionMatrix({
  value,
  onChange,
  readOnly = false,
  effectivePermissions,
}: PermissionMatrixProps) {
  const hasPermission = useCallback(
    (resource: Resource, action: Action): boolean => {
      if (readOnly && effectivePermissions) {
        return effectivePermissions.some(
          (ep) => ep.resource === resource && ep.action === action
        )
      }
      return value.some(
        (p) => p.resource === resource && p.action === action
      )
    },
    [value, readOnly, effectivePermissions]
  )

  const getGrantedBy = useCallback(
    (resource: Resource, action: Action): string[] => {
      if (!effectivePermissions) return []
      const match = effectivePermissions.find(
        (ep) => ep.resource === resource && ep.action === action
      )
      return match ? match.grantedBy : []
    },
    [effectivePermissions]
  )

  const togglePermission = useCallback(
    (resource: Resource, action: Action) => {
      if (readOnly || !onChange) return
      const exists = value.some(
        (p) => p.resource === resource && p.action === action
      )
      if (exists) {
        onChange(
          value.filter(
            (p) => !(p.resource === resource && p.action === action)
          )
        )
      } else {
        onChange([...value, { resource, action }])
      }
    },
    [value, onChange, readOnly]
  )

  const toggleAll = useCallback(
    (resource: Resource) => {
      if (readOnly || !onChange) return
      const group = PERMISSION_MATRIX.find((g) => g.resource === resource)
      if (!group) return

      const allSelected = group.actions.every((action) =>
        value.some((p) => p.resource === resource && p.action === action)
      )

      if (allSelected) {
        onChange(value.filter((p) => p.resource !== resource))
      } else {
        const existing = value.filter((p) => p.resource !== resource)
        const newPerms: Permission[] = group.actions.map((action) => ({
          resource,
          action,
        }))
        onChange([...existing, ...newPerms])
      }
    },
    [value, onChange, readOnly]
  )

  const resourceAllSelected = useMemo(() => {
    const map: Record<string, boolean> = {}
    for (const group of PERMISSION_MATRIX) {
      map[group.resource] = group.actions.every((action) =>
        value.some(
          (p) => p.resource === group.resource && p.action === action
        )
      )
    }
    return map
  }, [value])

  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-[160px] border-b border-r border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-2)]">
                Resource
              </th>
              {ALL_ACTIONS.map((action) => (
                <th
                  key={action}
                  className="border-b border-r border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-center text-xs font-semibold text-[var(--color-text-2)] last:border-r-0"
                >
                  {formatActionName(action)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_MATRIX.map((group, groupIdx) => {
              const isLast = groupIdx === PERMISSION_MATRIX.length - 1

              return (
                <tr key={group.resource} className="group/row">
                  <td
                    className={`sticky left-0 z-10 border-r bg-[var(--color-surface)] px-4 py-3 ${
                      !isLast ? 'border-b border-[var(--color-border)]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[var(--color-text-1)]">
                        {formatResourceName(group.resource)}
                      </span>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => toggleAll(group.resource)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide transition-all duration-200 ${
                            resourceAllSelected[group.resource]
                              ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30'
                              : 'bg-[var(--color-surface-2)] text-[var(--color-text-2)] hover:text-[var(--color-text-1)]'
                          }`}
                        >
                          {resourceAllSelected[group.resource]
                            ? 'Clear'
                            : 'All'}
                        </button>
                      )}
                    </div>
                  </td>
                  {ALL_ACTIONS.map((action, actionIdx) => {
                    const available = isActionAvailableForResource(
                      group.resource,
                      action
                    )
                    const active = available && hasPermission(group.resource, action)
                    const isLastCol = actionIdx === ALL_ACTIONS.length - 1

                    const cellBorderClasses = `${!isLast ? 'border-b border-[var(--color-border)]' : ''} ${!isLastCol ? 'border-r border-[var(--color-border)]' : ''}`

                    if (!available) {
                      return (
                        <td
                          key={action}
                          className={`cell-na px-3 py-3 text-center ${cellBorderClasses}`}
                        >
                          <span className="text-xs text-[var(--color-text-2)]/30">
                            —
                          </span>
                        </td>
                      )
                    }

                    if (readOnly) {
                      if (active) {
                        const grantedBy = getGrantedBy(group.resource, action)
                        return (
                          <td
                            key={action}
                            className={`cell-active-readonly px-3 py-3 text-center ${cellBorderClasses}`}
                          >
                            <Tooltip>
                              <TooltipTrigger className="inline-flex items-center justify-center">
                                <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--color-success)]/20">
                                  <span className="size-2 rounded-full bg-[var(--color-success)]" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Granted by: {grantedBy.join(', ')}
                              </TooltipContent>
                            </Tooltip>
                          </td>
                        )
                      }
                      return (
                        <td
                          key={action}
                          className={`cell-available px-3 py-3 text-center ${cellBorderClasses}`}
                        >
                          <span className="inline-flex size-5 items-center justify-center rounded-full border border-[var(--color-border)]">
                            <span className="size-2 rounded-full" />
                          </span>
                        </td>
                      )
                    }

                    return (
                      <td
                        key={action}
                        className={`${active ? 'cell-active' : 'cell-available'} px-3 py-3 text-center ${cellBorderClasses}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            togglePermission(group.resource, action)
                          }
                          className="group/check inline-flex items-center justify-center"
                          aria-label={`${formatResourceName(group.resource)} - ${formatActionName(action)}`}
                        >
                          <span
                            className={`inline-flex size-5 items-center justify-center rounded transition-all duration-200 ${
                              active
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'border border-[var(--color-border)] bg-[var(--color-surface-2)] group-hover/check:border-[var(--color-accent)]/50'
                            }`}
                          >
                            {active && <Check className="size-3" strokeWidth={3} />}
                          </span>
                        </button>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  )
}
