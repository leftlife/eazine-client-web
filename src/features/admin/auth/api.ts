import { apiClient } from '@/api/client'
import type { AdminPermission, AdminRole, ApiSingleResponse } from '@/api/types'

export interface AdminProfile {
  id: string
  loginId: string
  name: string
  roles: AdminRole[]
  permissions: AdminPermission[]
}

export interface AdminIdentity extends AdminProfile {
  sessionExpiresAt: string
}

interface LoginApiData {
  admin: AdminProfile
  csrfToken: string
  sessionExpiresAt: string
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
  const { admin, csrfToken, sessionExpiresAt } = res.data.data
  return { identity: { ...admin, sessionExpiresAt } satisfies AdminIdentity, csrfToken }
}

export async function logout() {
  await apiClient.post('/admin/auth/logout')
}

export async function fetchMe() {
  const res = await apiClient.get<ApiSingleResponse<AdminIdentity>>('/admin/auth/me')
  return res.data.data
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await apiClient.put('/admin/auth/password', { currentPassword, newPassword })
}
