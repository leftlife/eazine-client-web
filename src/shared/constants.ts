/**
 * Placeholder until the actual consent copy + version and file-limit values are confirmed
 * (기획서 section 13 / API Spec section 18 checklist items — both explicitly unconfirmed).
 */
export const PRIVACY_POLICY_VERSION = '2026-07-21'

export const MIB = 1024 * 1024

export const QUOTATION_FILE_LIMITS = {
  maxFiles: 5,
  maxFileSizeBytes: 20 * MIB,
  maxTotalSizeBytes: 50 * MIB,
  acceptExtensions:
    '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.hwpx,.zip,.png,.jpg,.jpeg',
}

export const RECRUITMENT_FILE_LIMITS = {
  maxPortfolios: 3,
  maxTotalSizeBytes: 50 * MIB,
  resumeAccept: '.pdf,.doc,.docx,.hwp,.hwpx',
  portfolioAccept: '.pdf,.zip',
}
