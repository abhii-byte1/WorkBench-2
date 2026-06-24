'use client'

import { useUsers } from '@/hooks/useUsers'
import { UserCard } from '@/components/UserCard'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'

export default function UsersPage() {
  const { users, loading, error, mutate } = useUsers()

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="skeleton h-8 w-24" />
          <div className="skeleton mt-2 h-4 w-56" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton h-20 rounded-xl"
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-1)]">
          Users
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-2)]">
          Manage team members and their roles
        </p>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16">
          <Users className="size-12 text-[var(--color-text-2)]" />
          <div className="text-center">
            <h3 className="font-semibold text-[var(--color-text-1)]">
              No users yet
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-2)]">
              Users will appear here once added
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}
