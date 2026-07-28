import { useMutation } from '@tanstack/react-query'
import { submitRecruitment } from './api'
import type { RecruitmentFormValues } from './schema'

export function useSubmitRecruitment(idempotencyKey: string) {
  return useMutation({
    mutationFn: (values: RecruitmentFormValues) => submitRecruitment(values, idempotencyKey),
  })
}
