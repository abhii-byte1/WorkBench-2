'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@/lib/types'

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: string | null
  mutate: () => void
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/users')
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`)
      }
      const data: User[] = await res.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, mutate: fetchUsers }
}
