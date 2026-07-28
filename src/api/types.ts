export interface PageMeta {
  number: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface ApiSingleResponse<T> {
  data: T
}

export interface ApiListResponse<T> {
  data: T[]
  page: PageMeta
}

export interface ApiFieldError {
  field: string
  reason: string
  message: string
}

export interface ApiErrorBody {
  code: string
  message: string
  requestId: string
  fieldErrors?: ApiFieldError[]
}

/** Thrown by the api client for any non-2xx response. */
export class ApiError extends Error {
  code: string
  requestId: string
  status: number
  fieldErrors?: ApiFieldError[]

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
    this.requestId = body.requestId
    this.fieldErrors = body.fieldErrors
  }
}

export interface FileSummary {
  id: string
  category: 'COVER_IMAGE' | 'ATTACHMENT'
  originalName: string
  contentType: string
  size: number
  checksumSha256?: string
  createdAt: string
  downloadUrl?: string
}

export interface AdminSummary {
  id: string
  loginId: string
  name: string
}

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'CONTENT_MANAGER'
  | 'QUOTATION_MANAGER'
  | 'RECRUITMENT_MANAGER'

export type AdminPermission =
  | 'ADMIN_READ'
  | 'ADMIN_WRITE'
  | 'USE_CASE_READ'
  | 'USE_CASE_WRITE'
  | 'USE_CASE_PUBLISH'
  | 'USE_CASE_DELETE'
  | 'QUOTATION_READ'
  | 'QUOTATION_UPDATE'
  | 'QUOTATION_FILE_DOWNLOAD'
  | 'RECRUITMENT_READ'
  | 'RECRUITMENT_UPDATE'
  | 'RECRUITMENT_FILE_DOWNLOAD'
  | 'AUDIT_READ'
