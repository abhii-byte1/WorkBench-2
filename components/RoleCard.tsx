'use client'

import type { Role } from '@/lib/types'
import { PERMISSION_MATRIX } from '@/lib/permissions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Pencil, Copy, Trash2 } from 'lucide-react'

interface RoleCardProps {
  role: Role
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function RoleCard({ role, onEdit, onDuplicate, onDelete }: RoleCardProps) {
  const coveredResources = PERMISSION_MATRIX.filter((group) =>
    role.permissions.some((p) => p.resource === group.resource)
  ).map((group) => group.resource)

  return (
    <TooltipProvider>
      <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-200 hover:bg-[var(--color-surface-2)]/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-[var(--color-text-1)]">
                {role.name}
              </h3>
              {role.isDefault && <Badge variant="secondary" className="bg-[var(--color-surface-2)]">Default</Badge>}
            </div>
            <p className="text-sm text-[var(--color-text-2)] line-clamp-2">
              {role.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(role.id)}
              aria-label={`Edit ${role.name}`}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDuplicate(role.id)}
              aria-label={`Duplicate ${role.name}`}
            >
              <Copy className="size-4" />
            </Button>
            {role.isDefault ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled
                      aria-label={`Delete ${role.name}`}
                    />
                  }
                >
                  <Trash2 className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Default roles cannot be deleted</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(role.id)}
                aria-label={`Delete ${role.name}`}
                className="text-[var(--color-danger)] hover:text-[var(--color-danger)]"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-[var(--color-border)] text-[var(--color-text-2)]">
            {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
          </Badge>
          {coveredResources.map((resource) => (
            <span
              key={resource}
              className="inline-flex rounded-md bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium capitalize text-[var(--color-text-2)]"
            >
              {resource}
            </span>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
