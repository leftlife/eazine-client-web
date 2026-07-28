import { apiClient } from '@/api/client'
import type { ApiSingleResponse } from '@/api/types'
import { PRIVACY_POLICY_VERSION } from '@/shared/constants'
import type { RecruitmentFormValues } from './schema'

export interface RecruitmentReceipt {
  receiptId: string
  submittedAt: string
}

export async function submitRecruitment(values: RecruitmentFormValues, idempotencyKey: string) {
  const { resume, portfolios, ...payload } = values

  const form = new FormData()
  form.append(
    'payload',
    new Blob([JSON.stringify({ ...payload, privacyPolicyVersion: PRIVACY_POLICY_VERSION })], {
      type: 'application/json',
    }),
  )
  form.append('resume', resume[0])
  portfolios.forEach((file) => form.append('portfolios', file))

  const res = await apiClient.post<ApiSingleResponse<RecruitmentReceipt>>(
    '/public/recruitments',
    form,
    { headers: { 'Idempotency-Key': idempotencyKey } },
  )
  return res.data.data
}
