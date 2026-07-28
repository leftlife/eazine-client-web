import { apiClient } from '@/api/client'
import type { AdminSummary, ApiListResponse, ApiSingleResponse, FileSummary } from '@/api/types'

export type RecruitmentStatus = 'NEW' | 'IN_REVIEW' | 'CONTACTED' | 'ON_HOLD' | 'CLOSED'
export type CareerType = 'ENTRY_LEVEL' | 'EXPERIENCED'

export interface RecruitmentSummary {
  id: string
  receiptId: string
  position: string
  name: string
  email: string
  phone: string
  careerType: CareerType
  status: RecruitmentStatus
  assignee: AdminSummary | null
  submittedAt: string
  updatedAt: string
  version: number
  attachmentCount: number
}

export interface RecruitmentDetail extends Omit<RecruitmentSummary, 'attachmentCount'> {
  introduction: string
  adminMemo: string | null
  resume: FileSummary
  portfolios: FileSummary[]
}

export interface RecruitmentListParams {
  page?: number
  size?: number
  q?: string
  position?: string
  careerType?: CareerType
  status?: RecruitmentStatus
}

export async function listRecruitments(params: RecruitmentListParams = {}) {
  const res = await apiClient.get<ApiListResponse<RecruitmentSummary>>('/admin/recruitments', {
    params,
  })
  return res.data
}

export async function getRecruitment(recruitmentId: string) {
  const res = await apiClient.get<ApiSingleResponse<RecruitmentDetail>>(
    `/admin/recruitments/${recruitmentId}`,
  )
  return res.data.data
}

export interface UpdateRecruitmentPayload {
  status: RecruitmentStatus
  assigneeId: string | null
  adminMemo: string | null
  version: number
}

export async function updateRecruitment(recruitmentId: string, payload: UpdateRecruitmentPayload) {
  const res = await apiClient.patch<ApiSingleResponse<RecruitmentDetail>>(
    `/admin/recruitments/${recruitmentId}`,
    payload,
  )
  return res.data.data
}
