import { useQuery } from '@tanstack/react-query'
import { listAdminAccounts, type AccountListParams } from './api'

const accountKeys = {
  list: (params: AccountListParams) => ['admin', 'accounts', params] as const,
}

export function useAdminAccountList(params: AccountListParams) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => listAdminAccounts(params),
    placeholderData: (previous) => previous,
  })
}
