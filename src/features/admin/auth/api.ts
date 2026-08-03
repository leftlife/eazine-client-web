import { apiClient, refreshAccessToken } from '@/api/client'
import { setAccessToken } from '@/api/session'
import type { AdminPermission, AdminRole, ApiSingleResponse } from '@/api/types'

export interface AdminProfile {
  id: string
  loginId: string
  name: string
  roles: AdminRole[]
  permissions: AdminPermission[]
}

export interface AdminIdentity extends AdminProfile {
  accessTokenExpiresAt: string
}

interface LoginApiData {
  admin: AdminProfile
  accessToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export async function login(loginId: string, password: string) {
  // Dynamic import behind a DEV-only literal so the mock module (and its admin/admin
  // credentials) is never even fetched, let alone included, in a production build.
  if (import.meta.env.DEV) {
    const { isDevMockLogin, startDevMockSession } = await import('./devMockAuth')
    if (isDevMockLogin(loginId, password)) {
      return startDevMockSession()
    }
  }

  const res = await apiClient.post<ApiSingleResponse<LoginApiData>>('/admin/auth/login', {
    loginId,
    password,
  })
  const { admin, accessToken, accessTokenExpiresAt } = res.data.data
  setAccessToken(accessToken)
  return { identity: { ...admin, accessTokenExpiresAt } satisfies AdminIdentity }
}

export async function logout() {
  try {
    await apiClient.post('/admin/auth/logout')
  } finally {
    setAccessToken(null)
  }
}

/** Trades the HttpOnly Refresh Token cookie for a fresh Access Token — used to restore a session on hard reload. */
export async function restoreAccessToken() {
  await refreshAccessToken()
}

export async function fetchMe() {
  const res = await apiClient.get<ApiSingleResponse<AdminIdentity>>('/admin/auth/me')
  return res.data.data
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await apiClient.put('/admin/auth/password', { currentPassword, newPassword })
}
