import { useState, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '@/api/types'
import { FileUploadField } from '@/shared/components/FileUploadField'
import { RECRUITMENT_FILE_LIMITS } from '@/shared/constants'
import { useIdempotencyKey } from '@/shared/hooks/useIdempotencyKey'
import type { RecruitmentReceipt } from './api'
import { useSubmitRecruitment } from './hooks'
import { recruitmentSchema, RECRUITMENT_POSITIONS, type RecruitmentFormValues } from './schema'

export function RecruitmentFormPage() {
  const { idempotencyKey, regenerate } = useIdempotencyKey()
  const [receipt, setReceipt] = useState<RecruitmentReceipt | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RecruitmentFormValues>({
    resolver: zodResolver(recruitmentSchema),
    defaultValues: { resume: [], portfolios: [] },
  })

  const mutation = useSubmitRecruitment(idempotencyKey)

  const onSubmit = async (values: RecruitmentFormValues) => {
    setServerError(null)
    try {
      const result = await mutation.mutateAsync(values)
      setReceipt(result)
      regenerate()
    } catch (error) {
      if (error instanceof ApiError && error.code === 'VALIDATION_ERROR' && error.fieldErrors) {
        error.fieldErrors.forEach((fieldError) => {
          setError(fieldError.field as keyof RecruitmentFormValues, { message: fieldError.message })
        })
        return
      }
      if (error instanceof ApiError && error.status === 409) {
        setServerError('이미 접수된 요청입니다. 잠시 후 다시 시도해주세요.')
        return
      }
      if (error instanceof ApiError && (error.status === 413 || error.status === 415)) {
        setServerError(error.message)
        return
      }
      setServerError('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  if (receipt) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-3 text-xl font-semibold">지원이 완료되었습니다</h1>
        <p className="text-gray-600">
          접수번호 <span className="font-mono">{receipt.receiptId}</span>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-5">
      <h1 className="text-2xl font-semibold">상시채용 지원</h1>

      {serverError && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

      <Field label="지원 분야" error={errors.position?.message}>
        <select className="input" {...register('position')} defaultValue="">
          <option value="" disabled>
            선택하세요
          </option>
          {RECRUITMENT_POSITIONS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="이름" error={errors.name?.message}>
        <input className="input" {...register('name')} />
      </Field>
      <Field label="이메일" error={errors.email?.message}>
        <input className="input" type="email" {...register('email')} />
      </Field>
      <Field label="연락처" error={errors.phone?.message}>
        <input className="input" placeholder="010-1234-5678" {...register('phone')} />
      </Field>

      <Field label="경력 구분" error={errors.careerType?.message}>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" value="ENTRY_LEVEL" {...register('careerType')} /> 신입
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" value="EXPERIENCED" {...register('careerType')} /> 경력
          </label>
        </div>
      </Field>

      <Field label="자기소개" error={errors.introduction?.message}>
        <textarea className="input min-h-32" {...register('introduction')} />
      </Field>

      <Controller
        control={control}
        name="resume"
        render={({ field }) => (
          <FileUploadField
            label="이력서 (필수)"
            accept={RECRUITMENT_FILE_LIMITS.resumeAccept}
            value={field.value}
            onChange={field.onChange}
            error={errors.resume?.message as string | undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="portfolios"
        render={({ field }) => (
          <FileUploadField
            label="포트폴리오 (선택, 최대 3개)"
            multiple
            maxFiles={RECRUITMENT_FILE_LIMITS.maxPortfolios}
            accept={RECRUITMENT_FILE_LIMITS.portfolioAccept}
            value={field.value}
            onChange={field.onChange}
            error={errors.portfolios?.message as string | undefined}
          />
        )}
      />

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1" {...register('privacyConsent')} />
        <span>개인정보 수집·이용에 동의합니다.</span>
      </label>
      {errors.privacyConsent && (
        <p className="text-sm text-red-600">{errors.privacyConsent.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-blue-700 py-2.5 font-medium text-white disabled:opacity-50"
      >
        지원하기
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
