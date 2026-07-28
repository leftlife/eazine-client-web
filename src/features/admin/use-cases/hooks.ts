import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUseCase,
  deleteUseCase,
  getAdminUseCase,
  listAdminUseCases,
  type CreateUseCasePayload,
  type UseCaseListParams,
} from './api'

export const useCaseKeys = {
  all: ['admin', 'use-cases'] as const,
  list: (params: UseCaseListParams) => ['admin', 'use-cases', params] as const,
  detail: (id: string) => ['admin', 'use-cases', id] as const,
}

export function useAdminUseCaseList(params: UseCaseListParams) {
  return useQuery({
    queryKey: useCaseKeys.list(params),
    queryFn: () => listAdminUseCases(params),
    placeholderData: (previous) => previous,
  })
}

export function useAdminUseCaseDetail(useCaseId: string) {
  return useQuery({
    queryKey: useCaseKeys.detail(useCaseId),
    queryFn: () => getAdminUseCase(useCaseId),
  })
}

export function useCreateUseCase() {
  return useMutation({
    mutationFn: (input: {
      payload: CreateUseCasePayload
      coverImage: File | null
      attachments: File[]
    }) => createUseCase(input.payload, input.coverImage, input.attachments),
  })
}

export function useDeleteUseCase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUseCase,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: useCaseKeys.all })
    },
  })
}
