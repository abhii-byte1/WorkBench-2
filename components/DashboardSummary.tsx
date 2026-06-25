'use client'

import { useRoles } from '@/hooks/useRoles'
import { useUsers } from '@/hooks/useUsers'
import { ShieldCheck, Users, Key, Network } from 'lucide-react'

export function DashboardSummary() {
  const { roles, loading: rolesLoading } = useRoles()
  const { users, loading: usersLoading } = useUsers()

  const loading = rolesLoading || usersLoading

  const totalRoles = roles.length
  const totalUsers = users.length
  const totalPermissions = 19
  const totalAssignments = users.reduce((acc, user) => acc + user.roleIds.length, 0)

  if (loading) {
    return (
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-[120px] rounded-xl" />
        ))}
      </div>
    )
  }

  const metrics = [
    {
      title: 'Total Roles',
      value: totalRoles,
      subtitle: 'Active roles in system',
      icon: ShieldCheck,
      color: 'text-[var(--color-accent)]',
      bgColor: 'bg-[var(--color-accent)]/10',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      subtitle: 'Registered team members',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Permissions',
      value: totalPermissions,
      subtitle: 'Available actions to assign',
      icon: Key,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Role Assignments',
      value: totalAssignments,
      subtitle: 'Roles granted to users',
      icon: Network,
      color: 'text-[var(--color-success)]',
      bgColor: 'bg-[var(--color-success)]/10',
    },
  ]

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:border-[var(--color-text-2)]/30"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--color-text-2)]">
              {metric.title}
            </h3>
            <div
              className={`flex size-8 items-center justify-center rounded-lg ${metric.bgColor} transition-transform duration-200 group-hover:scale-110`}
            >
              <metric.icon className={`size-4 ${metric.color}`} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold tracking-tight text-[var(--color-text-1)]">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-2)]/70">
              {metric.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
