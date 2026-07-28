import { useQuery } from '@tanstack/react-query'
import { listAuditLogs, type AuditLogListParams } from './api'

const auditLogKeys = {
  list: (params: AuditLogListParams) => ['admin', 'audit-logs', params] as const,
}

export function useAuditLogList(params: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => listAuditLogs(params),
    placeholderData: (previous) => previous,
  })
}
