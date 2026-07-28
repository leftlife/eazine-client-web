import { apiClient } from '@/api/client'
import type { ApiSingleResponse } from '@/api/types'
import { PRIVACY_POLICY_VERSION } from '@/shared/constants'
import type { QuotationFormValues } from './schema'

export interface QuotationReceipt {
  receiptId: string
  submittedAt: string
}

export async function submitQuotation(values: QuotationFormValues, idempotencyKey: string) {
  const { attachments, ...payload } = values

  const form = new FormData()
  form.append(
    'payload',
    new Blob([JSON.stringify({ ...payload, privacyPolicyVersion: PRIVACY_POLICY_VERSION })], {
      type: 'application/json',
    }),
  )
  attachments.forEach((file) => form.append('attachments', file))

  const res = await apiClient.post<ApiSingleResponse<QuotationReceipt>>(
    '/public/quotations',
    form,
    { headers: { 'Idempotency-Key': idempotencyKey } },
  )
  return res.data.data
}
