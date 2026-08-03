/**
 * In-memory holder for the admin Access Token issued at login (POST /admin/auth/login)
 * or refresh (POST /admin/auth/refresh). Never persisted to storage — it lives only for
 * the tab's lifetime. The Refresh Token is issued as an HttpOnly cookie the browser
 * manages automatically; JS never sees it.
 */
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
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
