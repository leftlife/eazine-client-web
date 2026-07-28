import { apiClient } from '@/api/client'
import type { ApiListResponse, ApiSingleResponse, FileSummary } from '@/api/types'

export type UseCaseStatus = 'DRAFT' | 'PUBLISHED' | 'PRIVATE'

export interface AdminUseCaseSummary {
  id: string
  title: string
  summary: string
  status: UseCaseStatus
  publishedAt: string | null
  updatedAt: string
  version: number
}

export interface AdminUseCaseDetail extends AdminUseCaseSummary {
  body: string
  displayOrder: number
  coverImage: FileSummary | null
  attachments: FileSummary[]
  createdAt: string
}

export interface UseCaseListParams {
  page?: number
  size?: number
  q?: string
  status?: UseCaseStatus
  sort?: string
}

export async function listAdminUseCases(params: UseCaseListParams = {}) {
  const res = await apiClient.get<ApiListResponse<AdminUseCaseSummary>>('/admin/use-cases', {
    params,
  })
  return res.data
}

export async function getAdminUseCase(useCaseId: string) {
  const res = await apiClient.get<ApiSingleResponse<AdminUseCaseDetail>>(
    `/admin/use-cases/${useCaseId}`,
  )
  return res.data.data
}

export interface CreateUseCasePayload {
  title: string
  summary: string
  body: string
  status: UseCaseStatus
  publishedAt: string | null
  displayOrder: number
}

export async function createUseCase(
  payload: CreateUseCasePayload,
  coverImage: File | null,
  attachments: File[],
) {
  const form = new FormData()
  form.append('payload', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  if (coverImage) form.append('coverImage', coverImage)
  attachments.forEach((file) => form.append('attachments', file))

  const res = await apiClient.post<ApiSingleResponse<AdminUseCaseDetail>>(
    '/admin/use-cases',
    form,
  )
  return res.data.data
}

export async function deleteUseCase(useCaseId: string) {
  await apiClient.delete(`/admin/use-cases/${useCaseId}`)
}
