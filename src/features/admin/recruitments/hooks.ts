import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getRecruitment,
  listRecruitments,
  updateRecruitment,
  type RecruitmentListParams,
  type UpdateRecruitmentPayload,
} from './api'

export const recruitmentKeys = {
  all: ['admin', 'recruitments'] as const,
  list: (params: RecruitmentListParams) => ['admin', 'recruitments', params] as const,
  detail: (id: string) => ['admin', 'recruitments', id] as const,
}

export function useRecruitmentList(params: RecruitmentListParams) {
  return useQuery({
    queryKey: recruitmentKeys.list(params),
    queryFn: () => listRecruitments(params),
    placeholderData: (previous) => previous,
  })
}

export function useRecruitmentDetail(recruitmentId: string) {
  return useQuery({
    queryKey: recruitmentKeys.detail(recruitmentId),
    queryFn: () => getRecruitment(recruitmentId),
  })
}

export function useUpdateRecruitment(recruitmentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateRecruitmentPayload) => updateRecruitment(recruitmentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: recruitmentKeys.all })
    },
  })
}
