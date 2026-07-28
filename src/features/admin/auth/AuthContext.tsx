import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { setCsrfToken, setUnauthenticatedHandler } from '@/api/session'
import { hasPermission } from '@/shared/utils/permissions'
import type { AdminPermission } from '@/api/types'
import { fetchMe, login as loginRequest, logout as logoutRequest, type AdminIdentity } from './api'
import { DEV_MOCK_ADMIN_ID } from './devMockConstants'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  admin: AdminIdentity | null
  login: (loginId: string, password: string) => Promise<void>
  logout: () => Promise<void>
  can: (permission: AdminPermission | AdminPermission[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [admin, setAdmin] = useState<AdminIdentity | null>(null)

  const clearSession = useCallback(() => {
    setCsrfToken(null)
    setAdmin(null)
    setStatus('unauthenticated')
  }, [])

  useEffect(() => {
    setUnauthenticatedHandler(clearSession)
    return () => setUnauthenticatedHandler(null)
  }, [clearSession])

  useEffect(() => {
    let cancelled = false

    async function restore() {
      if (import.meta.env.DEV) {
        const { restoreDevMockSession } = await import('./devMockAuth')
        const mockIdentity = restoreDevMockSession()
        if (mockIdentity) {
          if (!cancelled) {
            setAdmin(mockIdentity)
            setStatus('authenticated')
          }
          return
        }
      }

      // Restores an existing session cookie on hard reload. NOTE: the API spec doesn't
      // define how to obtain a fresh CSRF token on restore (only /admin/auth/login returns
      // one) — until that's confirmed (see 기획서 section 18), a reloaded admin session can
      // read data but write requests will 403 CSRF_INVALID until the admin logs in again.
      try {
        const identity = await fetchMe()
        if (!cancelled) {
          setAdmin(identity)
          setStatus('authenticated')
        }
      } catch {
        if (!cancelled) setStatus('unauthenticated')
      }
    }

    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (loginId: string, password: string) => {
    const { identity, csrfToken } = await loginRequest(loginId, password)
    setCsrfToken(csrfToken)
    setAdmin(identity)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    if (admin?.id === DEV_MOCK_ADMIN_ID) {
      if (import.meta.env.DEV) {
        const { clearDevMockSession } = await import('./devMockAuth')
        clearDevMockSession()
      }
      clearSession()
      return
    }
    try {
      await logoutRequest()
    } finally {
      clearSession()
    }
  }, [admin, clearSession])

  const can = useCallback(
    (permission: AdminPermission | AdminPermission[]) =>
      admin ? hasPermission(admin.permissions, permission) : false,
    [admin],
  )

  const value = useMemo(
    () => ({ status, admin, login, logout, can }),
    [status, admin, login, logout, can],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AdminAuthProvider')
  return ctx
}
