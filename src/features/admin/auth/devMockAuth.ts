import type { AdminIdentity } from './api'
import { DEV_MOCK_ADMIN_ID, DEV_MOCK_CREDENTIALS } from './devMockConstants'

/**
 * Temporary stand-in for POST /admin/auth/login while the backend doesn't exist yet.
 * Both call sites (api.ts, AuthContext.tsx) only reach this module through
 * `if (import.meta.env.DEV) await import('./devMockAuth')` — Vite inlines DEV as the
 * literal `false` in production builds, which prunes that whole branch, so this module
 * never ends up in a production bundle at all.
 *
 * Delete this file (and the two dynamic-import call sites) once the real
 * /admin/auth/login and /admin/auth/me endpoints are up.
 */
const STORAGE_KEY = 'eazine.devMockAdmin'

const DEV_MOCK_PERMISSIONS: AdminIdentity['permissions'] = [
  'ADMIN_READ',
  'ADMIN_WRITE',
  'USE_CASE_READ',
  'USE_CASE_WRITE',
  'USE_CASE_PUBLISH',
  'USE_CASE_DELETE',
  'QUOTATION_READ',
  'QUOTATION_UPDATE',
  'QUOTATION_FILE_DOWNLOAD',
  'RECRUITMENT_READ',
  'RECRUITMENT_UPDATE',
  'RECRUITMENT_FILE_DOWNLOAD',
  'AUDIT_READ',
]

function buildIdentity(): AdminIdentity {
  return {
    id: DEV_MOCK_ADMIN_ID,
    loginId: DEV_MOCK_CREDENTIALS.loginId,
    name: '임시 관리자 (백엔드 미연동)',
    roles: ['SUPER_ADMIN'],
    permissions: DEV_MOCK_PERMISSIONS,
    accessTokenExpiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  }
}

export function isDevMockLogin(loginId: string, password: string) {
  return loginId === DEV_MOCK_CREDENTIALS.loginId && password === DEV_MOCK_CREDENTIALS.password
}

/** Called after isDevMockLogin() confirms a match. Persists across reloads via sessionStorage. */
export function startDevMockSession() {
  sessionStorage.setItem(STORAGE_KEY, '1')
  return { identity: buildIdentity() }
}

/** Used on app boot instead of GET /admin/auth/me when a mock session is active. */
export function restoreDevMockSession(): AdminIdentity | null {
  if (sessionStorage.getItem(STORAGE_KEY) !== '1') return null
  return buildIdentity()
}

export function clearDevMockSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}
