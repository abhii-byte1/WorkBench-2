'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Role } from '@/lib/types'

interface UseRolesReturn {
  roles: Role[]
  loading: boolean
  error: string | null
  mutate: () => void
}

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/roles')
      if (!res.ok) {
        throw new Error(`Failed to fetch roles: ${res.status}`)
      }
      const data: Role[] = await res.json()
      setRoles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoles()
  }, [fetchRoles])

  return { roles, loading, error, mutate: fetchRoles }
}
