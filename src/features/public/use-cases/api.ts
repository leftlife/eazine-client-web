import { apiClient } from '@/api/client'
import type { ApiListResponse, ApiSingleResponse, FileSummary } from '@/api/types'

export interface UseCaseSummary {
  id: string
  title: string
  summary: string
  coverImage: { id: string; url: string } | null
  publishedAt: string
}

export interface UseCaseDetail {
  id: string
  title: string
  summary: string
  body: string
  status: 'DRAFT' | 'PUBLISHED' | 'PRIVATE'
  publishedAt: string | null
  displayOrder: number
  coverImage: { id: string; url: string } | null
  attachments: FileSummary[]
  createdAt: string
  updatedAt: string
  version: number
}

export interface UseCaseListParams {
  page?: number
  size?: number
  sort?: string
  q?: string
}

export async function listUseCases(params: UseCaseListParams = {}) {
  const res = await apiClient.get<ApiListResponse<UseCaseSummary>>('/public/use-cases', {
    params: { sort: 'publishedAt,desc', ...params },
  })
  return res.data
}

export async function getUseCase(useCaseId: string) {
  const res = await apiClient.get<ApiSingleResponse<UseCaseDetail>>(
    `/public/use-cases/${useCaseId}`,
  )
  return res.data.data
}
