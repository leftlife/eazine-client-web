import { describe, expect, it } from 'vitest'
import { quotationSchema } from './schema'

const validPayload = {
  companyName: '주식회사 예시',
  contactName: '홍길동',
  email: 'user@example.com',
  phone: '010-1234-5678',
  subject: '도입 견적 문의',
  content: '문의 내용',
  privacyConsent: true as const,
  attachments: [],
}

describe('quotationSchema', () => {
  it('accepts a valid submission', () => {
    expect(quotationSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects when privacy consent is missing', () => {
    const result = quotationSchema.safeParse({ ...validPayload, privacyConsent: false })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = quotationSchema.safeParse({ ...validPayload, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})
