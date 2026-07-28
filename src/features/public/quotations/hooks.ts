import { useMutation } from '@tanstack/react-query'
import { submitQuotation } from './api'
import type { QuotationFormValues } from './schema'

export function useSubmitQuotation(idempotencyKey: string) {
  return useMutation({
    mutationFn: (values: QuotationFormValues) => submitQuotation(values, idempotencyKey),
  })
}
