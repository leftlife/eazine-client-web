import { useQuery } from '@tanstack/react-query'
import { getUseCase, listUseCases, type UseCaseListParams } from './api'

export function useUseCaseList(params: UseCaseListParams) {
  return useQuery({
    queryKey: ['public', 'use-cases', params],
    queryFn: () => listUseCases(params),
    placeholderData: (previous) => previous,
  })
}

export function useUseCaseDetail(useCaseId: string) {
  return useQuery({
    queryKey: ['public', 'use-cases', useCaseId],
    queryFn: () => getUseCase(useCaseId),
  })
}
