'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Activity } from '@/lib/types'

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch('/api/activities')
      if (!res.ok) {
        throw new Error('Failed to fetch activities')
      }
      const data = await res.json()
      setActivities(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActivities()
  }, [fetchActivities])

  return { activities, loading, error, mutate: fetchActivities }
}
