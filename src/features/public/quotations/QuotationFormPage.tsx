import { useState, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '@/api/types'
import { FileUploadField } from '@/shared/components/FileUploadField'
import { QUOTATION_FILE_LIMITS } from '@/shared/constants'
import { useIdempotencyKey } from '@/shared/hooks/useIdempotencyKey'
import type { QuotationReceipt } from './api'
import { useSubmitQuotation } from './hooks'
import { quotationSchema, type QuotationFormValues } from './schema'

export function QuotationFormPage() {
  const { idempotencyKey, regenerate } = useIdempotencyKey()
  const [receipt, setReceipt] = useState<QuotationReceipt | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: { attachments: [] },
  })

  const mutation = useSubmitQuotation(idempotencyKey)

  const onSubmit = async (values: QuotationFormValues) => {
    setServerError(null)
    try {
      const result = await mutation.mutateAsync(values)
      setReceipt(result)
      regenerate()
    } catch (error) {
      if (error instanceof ApiError && error.code === 'VALIDATION_ERROR' && error.fieldErrors) {
        error.fieldErrors.forEach((fieldError) => {
          setError(fieldError.field as keyof QuotationFormValues, { message: fieldError.message })
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
        <h1 className="mb-3 text-xl font-semibold">접수가 완료되었습니다</h1>
        <p className="text-gray-600">
          접수번호 <span className="font-mono">{receipt.receiptId}</span>
        </p>
        <p className="mt-2 text-sm text-gray-500">
          입력하신 이메일 또는 연락처로 담당자가 회신드립니다.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-5">
      <h1 className="text-2xl font-semibold">견적문의</h1>

      {serverError && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

      <Field label="회사명" error={errors.companyName?.message}>
        <input className="input" {...register('companyName')} />
      </Field>
      <Field label="담당자명" error={errors.contactName?.message}>
        <input className="input" {...register('contactName')} />
      </Field>
      <Field label="이메일" error={errors.email?.message}>
        <input className="input" type="email" {...register('email')} />
      </Field>
      <Field label="연락처" error={errors.phone?.message}>
        <input className="input" placeholder="010-1234-5678" {...register('phone')} />
      </Field>
      <Field label="문의 제목" error={errors.subject?.message}>
        <input className="input" {...register('subject')} />
      </Field>
      <Field label="문의 내용" error={errors.content?.message}>
        <textarea className="input min-h-32" {...register('content')} />
      </Field>

      <Controller
        control={control}
        name="attachments"
        render={({ field }) => (
          <FileUploadField
            label="첨부파일"
            multiple
            maxFiles={QUOTATION_FILE_LIMITS.maxFiles}
            accept={QUOTATION_FILE_LIMITS.acceptExtensions}
            value={field.value}
            onChange={field.onChange}
            error={errors.attachments?.message as string | undefined}
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
        접수하기
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
