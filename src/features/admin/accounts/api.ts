import { apiClient } from '@/api/client'
import type { AdminPermission, AdminRole, ApiListResponse } from '@/api/types'

export interface AdminAccountSummary {
  id: string
  loginId: string
  name: string
  active: boolean
  roles: AdminRole[]
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  version: number
}

export interface AccountListParams {
  page?: number
  size?: number
  q?: string
  active?: boolean
  role?: AdminPermission
}

export async function listAdminAccounts(params: AccountListParams = {}) {
  const res = await apiClient.get<ApiListResponse<AdminAccountSummary>>('/admin/admins', {
    params,
  })
  return res.data
}
