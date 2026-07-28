import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ApiError, type ApiErrorBody } from './types'
import { getCsrfToken, notifyUnauthenticated } from './session'

const STATE_CHANGING_METHODS = new Set(['post', 'put', 'patch', 'delete'])

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  withCredentials: true,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method?.toLowerCase()
  const isAdminRequest = config.url?.startsWith('/admin')

  if (isAdminRequest && method && STATE_CHANGING_METHODS.has(method)) {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      config.headers.set('X-CSRF-TOKEN', csrfToken)
    }
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error: ApiErrorBody }>) => {
    if (error.response) {
      const { status, data, config } = error.response

      if (status === 401 && config.url?.startsWith('/admin')) {
        notifyUnauthenticated()
      }

      if (data?.error) {
        return Promise.reject(new ApiError(status, data.error))
      }
    }

    return Promise.reject(error)
  },
)
