import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getQuotation,
  listQuotations,
  updateQuotation,
  type QuotationListParams,
  type UpdateQuotationPayload,
} from './api'

export const quotationKeys = {
  all: ['admin', 'quotations'] as const,
  list: (params: QuotationListParams) => ['admin', 'quotations', params] as const,
  detail: (id: string) => ['admin', 'quotations', id] as const,
}

export function useQuotationList(params: QuotationListParams) {
  return useQuery({
    queryKey: quotationKeys.list(params),
    queryFn: () => listQuotations(params),
    placeholderData: (previous) => previous,
  })
}

export function useQuotationDetail(quotationId: string) {
  return useQuery({
    queryKey: quotationKeys.detail(quotationId),
    queryFn: () => getQuotation(quotationId),
  })
}

export function useUpdateQuotation(quotationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateQuotationPayload) => updateQuotation(quotationId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quotationKeys.all })
    },
  })
}
