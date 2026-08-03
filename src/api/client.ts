import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ApiError, type ApiErrorBody, type ApiSingleResponse } from './types'
import { getAccessToken, notifyUnauthenticated, setAccessToken } from './session'

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

interface RefreshApiData {
  accessToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}

function isRefreshRequest(url?: string) {
  return !!url && url.startsWith('/admin/auth/refresh')
}

function isLoginRequest(url?: string) {
  return !!url && url.startsWith('/admin/auth/login')
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  withCredentials: true,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const isAdminRequest = config.url?.startsWith('/admin')

  if (isAdminRequest && !isLoginRequest(config.url) && !isRefreshRequest(config.url)) {
    const accessToken = getAccessToken()
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`)
    }
  }

  return config
})

// Coalesces concurrent 401s into a single POST /admin/auth/refresh call instead of
// firing one refresh request per failed request.
let pendingRefresh: Promise<string> | null = null

function refreshAccessToken() {
  pendingRefresh ??= apiClient
    .post<ApiSingleResponse<RefreshApiData>>('/admin/auth/refresh')
    .then((res) => {
      const { accessToken } = res.data.data
      setAccessToken(accessToken)
      return accessToken
    })
    .finally(() => {
      pendingRefresh = null
    })

  return pendingRefresh
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error: ApiErrorBody }>) => {
    const { response, config } = error

    if (response && config) {
      const { status, data } = response
      const isAdminRequest = config.url?.startsWith('/admin')

      if (status === 401 && isAdminRequest) {
        if (isRefreshRequest(config.url)) {
          // The Refresh Token itself is missing/expired/revoked — nothing left to retry.
          setAccessToken(null)
          notifyUnauthenticated()
        } else if (!isLoginRequest(config.url)) {
          if (!(config as RetryableConfig)._retried) {
            try {
              await refreshAccessToken()
              return apiClient({ ...config, _retried: true } as RetryableConfig)
            } catch {
              // refreshAccessToken()'s own failure already triggered notifyUnauthenticated above.
            }
          } else {
            // Already retried once with a freshly refreshed token and still 401 — give up.
            setAccessToken(null)
            notifyUnauthenticated()
          }
        }
      }

      if (data?.error) {
        return Promise.reject(new ApiError(status, data.error))
      }
    }

    return Promise.reject(error)
  },
)

export { refreshAccessToken }
