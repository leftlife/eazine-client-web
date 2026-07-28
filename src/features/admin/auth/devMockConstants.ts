/**
 * Split out of devMockAuth.ts on purpose: plain string data with zero logic, safe to
 * import statically from anywhere (AdminLayout's banner, LoginPage's hint text) without
 * dragging the actual mock-login functions into a statically-reachable bundle. The
 * functions themselves stay behind `if (import.meta.env.DEV) await import('./devMockAuth')`.
 */
export const DEV_MOCK_ADMIN_ID = 'dev-mock-admin'

export const DEV_MOCK_CREDENTIALS = { loginId: 'admin', password: 'admin' } as const
