'use client'

import { useActivities } from '@/hooks/useActivities'
import { Plus, Edit2, Trash2, UserPlus, UserMinus, Activity as ActivityIcon } from 'lucide-react'
import type { Activity } from '@/lib/types'

export function ActivityTimeline() {
  const { activities, loading } = useActivities()

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-6 text-lg font-semibold text-[var(--color-text-1)]">
          Activity Timeline
        </h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton mt-1 size-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2 pt-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'role_created':
        return <Plus className="size-4 text-emerald-500" />
      case 'role_updated':
        return <Edit2 className="size-4 text-blue-500" />
      case 'role_deleted':
        return <Trash2 className="size-4 text-red-500" />
      case 'role_assigned':
        return <UserPlus className="size-4 text-indigo-500" />
      case 'role_removed':
        return <UserMinus className="size-4 text-amber-500" />
      default:
        return <ActivityIcon className="size-4 text-gray-500" />
    }
  }

  const getIconBg = (type: string) => {
    switch (type) {
      case 'role_created':
        return 'bg-emerald-500/10 border-emerald-500/20'
      case 'role_updated':
        return 'bg-blue-500/10 border-blue-500/20'
      case 'role_deleted':
        return 'bg-red-500/10 border-red-500/20'
      case 'role_assigned':
        return 'bg-indigo-500/10 border-indigo-500/20'
      case 'role_removed':
        return 'bg-amber-500/10 border-amber-500/20'
      default:
        return 'bg-gray-500/10 border-gray-500/20'
    }
  }

  const getMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'role_created':
        return (
          <span>
            Created role{' '}
            <span className="font-medium text-[var(--color-text-1)]">
              {activity.targetName}
            </span>
          </span>
        )
      case 'role_updated':
        return (
          <span>
            Updated role{' '}
            <span className="font-medium text-[var(--color-text-1)]">
              {activity.targetName}
            </span>
          </span>
        )
      case 'role_deleted':
        return (
          <span>
            Deleted role{' '}
            <span className="font-medium text-[var(--color-text-1)]">
              {activity.targetName}
            </span>
          </span>
        )
      case 'role_assigned':
        return (
          <span>
            Assigned{' '}
            <span className="font-medium text-[var(--color-text-1)]">
              {activity.targetName}
            </span>{' '}
            to {activity.userName}
          </span>
        )
      case 'role_removed':
        return (
          <span>
            Removed{' '}
            <span className="font-medium text-[var(--color-text-1)]">
              {activity.targetName}
            </span>{' '}
            from {activity.userName}
          </span>
        )
      default:
        return <span>Unknown activity</span>
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h2 className="mb-6 text-lg font-semibold text-[var(--color-text-1)]">
        Activity Timeline
      </h2>
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ActivityIcon className="mb-3 size-8 text-[var(--color-text-2)]/50" />
          <p className="text-sm text-[var(--color-text-2)]">No activity yet</p>
        </div>
      ) : (
        <div className="relative space-y-0 before:absolute before:inset-0 before:ml-[1.125rem] before:h-full before:w-px before:bg-[var(--color-border)]">
          {activities.map((activity) => (
            <div key={activity.id} className="relative flex gap-4 pb-8 last:pb-0">
              <div
                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-[var(--color-surface)] ${getIconBg(
                  activity.type
                )}`}
              >
                {getIcon(activity.type)}
              </div>
              <div className="flex flex-col pt-1.5">
                <p className="text-sm text-[var(--color-text-2)]">
                  {getMessage(activity)}
                </p>
                <time className="mt-1 text-xs text-[var(--color-text-2)]/70">
                  {formatTime(activity.timestamp)}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
