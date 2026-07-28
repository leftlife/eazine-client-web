import { apiClient } from '@/api/client'
import type { ApiListResponse } from '@/api/types'

export interface AuditLogEntry {
  id: string
  admin: { id: string; loginId: string; name: string }
  action: string
  resourceType: string
  resourceId: string
  result: 'SUCCESS' | 'FAILURE'
  requestId: string
  ipAddressMasked: string
  occurredAt: string
}

export interface AuditLogListParams {
  page?: number
  size?: number
  adminId?: string
  action?: string
  resourceType?: string
  from?: string
  to?: string
}

export async function listAuditLogs(params: AuditLogListParams = {}) {
  const res = await apiClient.get<ApiListResponse<AuditLogEntry>>('/admin/audit-logs', {
    params,
  })
  return res.data
}
