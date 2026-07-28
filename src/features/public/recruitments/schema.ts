import { z } from 'zod'

const PHONE_PATTERN = /^[0-9+\-() ]{7,30}$/

export const recruitmentSchema = z.object({
  position: z.string().min(1, '지원 분야를 선택하세요.'),
  name: z.string().min(1).max(50, '이름은 50자 이하로 입력하세요.'),
  email: z.string().min(1, '이메일을 입력하세요.').max(254).email('올바른 이메일 형식이 아닙니다.'),
  phone: z.string().regex(PHONE_PATTERN, '올바른 연락처 형식이 아닙니다. (7~30자)'),
  careerType: z.enum(['ENTRY_LEVEL', 'EXPERIENCED'], {
    message: '경력 구분을 선택하세요.',
  }),
  introduction: z.string().min(1).max(3000, '자기소개는 3000자 이하로 입력하세요.'),
  privacyConsent: z.literal(true, {
    message: '개인정보 수집·이용에 동의해야 접수할 수 있습니다.',
  }),
  resume: z
    .array(z.instanceof(File))
    .length(1, '이력서를 첨부하세요.'),
  portfolios: z.array(z.instanceof(File)).max(3, '포트폴리오는 최대 3개까지 가능합니다.'),
})

export type RecruitmentFormValues = z.infer<typeof recruitmentSchema>

/**
 * TODO: replace with GET /public/recruitment-positions once the backend confirms whether
 * 지원 분야 is DB-managed or code-constant (API Spec section 13/18 — currently unconfirmed).
 */
export const RECRUITMENT_POSITIONS = [
  { code: 'BACKEND_DEVELOPER', name: '백엔드 개발' },
  { code: 'FRONTEND_DEVELOPER', name: '프론트엔드 개발' },
  { code: 'DESIGNER', name: '디자인' },
  { code: 'MARKETING', name: '마케팅' },
]
