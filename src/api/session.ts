/**
 * In-memory holder for the admin CSRF token issued at login (POST /admin/auth/login).
 * Never persisted to storage — it lives only for the tab's lifetime, matching the
 * HttpOnly session-cookie model described in the API spec (section 3.1).
 */
let csrfToken: string | null = null

export function setCsrfToken(token: string | null) {
  csrfToken = token
}

export function getCsrfToken() {
  return csrfToken
}

type UnauthenticatedHandler = () => void
let unauthenticatedHandler: UnauthenticatedHandler | null = null

/** Registered by the admin auth provider so a 401 anywhere can clear session state and redirect to login. */
export function setUnauthenticatedHandler(handler: UnauthenticatedHandler | null) {
  unauthenticatedHandler = handler
}

export function notifyUnauthenticated() {
  unauthenticatedHandler?.()
}
