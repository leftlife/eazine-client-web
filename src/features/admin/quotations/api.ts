import { apiClient } from '@/api/client'
import type { AdminSummary, ApiListResponse, ApiSingleResponse, FileSummary } from '@/api/types'

export type QuotationStatus = 'NEW' | 'IN_REVIEW' | 'REPLIED' | 'CLOSED'

export interface QuotationSummary {
  id: string
  receiptId: string
  companyName: string
  contactName: string
  email: string
  phone: string
  subject: string
  status: QuotationStatus
  assignee: AdminSummary | null
  submittedAt: string
  updatedAt: string
  version: number
  attachmentCount: number
}

export interface QuotationDetail extends Omit<QuotationSummary, 'attachmentCount'> {
  content: string
  adminMemo: string | null
  attachments: FileSummary[]
}

export interface QuotationListParams {
  page?: number
  size?: number
  q?: string
  status?: QuotationStatus
  assigneeId?: string
  unassigned?: boolean
}

export async function listQuotations(params: QuotationListParams = {}) {
  const res = await apiClient.get<ApiListResponse<QuotationSummary>>('/admin/quotations', {
    params,
  })
  return res.data
}

export async function getQuotation(quotationId: string) {
  const res = await apiClient.get<ApiSingleResponse<QuotationDetail>>(
    `/admin/quotations/${quotationId}`,
  )
  return res.data.data
}

export interface UpdateQuotationPayload {
  status: QuotationStatus
  assigneeId: string | null
  adminMemo: string | null
  version: number
}

export async function updateQuotation(quotationId: string, payload: UpdateQuotationPayload) {
  const res = await apiClient.patch<ApiSingleResponse<QuotationDetail>>(
    `/admin/quotations/${quotationId}`,
    payload,
  )
  return res.data.data
}
