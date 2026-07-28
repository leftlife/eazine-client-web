import { z } from 'zod'
import { QUOTATION_FILE_LIMITS } from '@/shared/constants'

const PHONE_PATTERN = /^[0-9+\-() ]{7,30}$/

export const quotationSchema = z.object({
  companyName: z.string().min(1).max(100, '회사명은 100자 이하로 입력하세요.'),
  contactName: z.string().min(1).max(50, '담당자명은 50자 이하로 입력하세요.'),
  email: z.string().min(1, '이메일을 입력하세요.').max(254).email('올바른 이메일 형식이 아닙니다.'),
  phone: z.string().regex(PHONE_PATTERN, '올바른 연락처 형식이 아닙니다. (7~30자)'),
  subject: z.string().min(1).max(200, '문의 제목은 200자 이하로 입력하세요.'),
  content: z.string().min(1).max(5000, '문의 내용은 5000자 이하로 입력하세요.'),
  privacyConsent: z.literal(true, {
    message: '개인정보 수집·이용에 동의해야 접수할 수 있습니다.',
  }),
  attachments: z
    .array(z.instanceof(File))
    .max(QUOTATION_FILE_LIMITS.maxFiles, `첨부파일은 최대 ${QUOTATION_FILE_LIMITS.maxFiles}개까지 가능합니다.`)
    .refine(
      (files) => files.every((f) => f.size <= QUOTATION_FILE_LIMITS.maxFileSizeBytes),
      '파일 하나의 크기는 20MB를 초과할 수 없습니다.',
    )
    .refine(
      (files) => files.reduce((sum, f) => sum + f.size, 0) <= QUOTATION_FILE_LIMITS.maxTotalSizeBytes,
      '첨부파일 전체 용량은 50MB를 초과할 수 없습니다.',
    ),
})

export type QuotationFormValues = z.infer<typeof quotationSchema>
