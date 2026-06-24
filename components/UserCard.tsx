'use client'

import Link from 'next/link'
import type { User } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const roleCount = user.roleIds.length

  return (
    <Link
      href={`/users/${user.id}`}
      className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-200 hover:scale-[1.01] hover:border-[var(--color-text-2)]/30"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${user.avatarColor}`}
        >
          {user.avatarInitials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[var(--color-text-1)]">
            {user.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="secondary">
            {roleCount} role{roleCount !== 1 ? 's' : ''}
          </Badge>
          <ChevronRight className="size-4 text-[var(--color-text-2)] transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}
