import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { ApiError } from '@/api/types'
import { FileUploadField } from '@/shared/components/FileUploadField'
import { RichTextEditor } from './components/RichTextEditor'
import { useCreateUseCase } from './hooks'

const schema = z.object({
  title: z.string().min(1).max(200, '제목은 200자 이하로 입력하세요.'),
  summary: z.string().min(1).max(500, '요약은 500자 이하로 입력하세요.'),
  body: z.string().max(100000),
  status: z.enum(['DRAFT', 'PUBLISHED', 'PRIVATE']),
  coverImage: z.array(z.instanceof(File)).max(1),
  attachments: z.array(z.instanceof(File)).max(5, '첨부파일은 최대 5개까지 가능합니다.'),
})

type FormValues = z.infer<typeof schema>

export function UseCaseCreatePage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'DRAFT', body: '', coverImage: [], attachments: [] },
  })

  const status = watch('status')

  const mutation = useCreateUseCase()

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    if (values.status === 'PUBLISHED' && values.coverImage.length === 0) {
      setServerError('공개 상태로 등록하려면 대표 이미지가 필요합니다.')
      return
    }
    try {
      const created = await mutation.mutateAsync({
        payload: {
          title: values.title,
          summary: values.summary,
          body: values.body,
          status: values.status,
          publishedAt: values.status === 'PUBLISHED' ? new Date().toISOString() : null,
          displayOrder: 0,
        },
        coverImage: values.coverImage[0] ?? null,
        attachments: values.attachments,
      })
      navigate(`/admin/use-cases/${created.id}`, { replace: true })
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : '등록 중 오류가 발생했습니다.')
    }
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        새 사용사례 등록
      </Typography>

      <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
        {serverError && <Alert severity="error">{serverError}</Alert>}

        <TextField
          label="제목"
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title')}
        />
        <TextField
          label="요약"
          multiline
          minRows={2}
          error={!!errors.summary}
          helperText={errors.summary?.message}
          {...register('summary')}
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            본문
          </Typography>
          <Controller
            control={control}
            name="body"
            render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
          />
        </Box>

        <TextField select label="공개 상태" {...register('status')} value={status}>
          <MenuItem value="DRAFT">임시저장</MenuItem>
          <MenuItem value="PUBLISHED">공개</MenuItem>
          <MenuItem value="PRIVATE">비공개</MenuItem>
        </TextField>

        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <FileUploadField
              label="대표 이미지 (jpg, png, webp / 최대 10MB)"
              accept=".jpg,.jpeg,.png,.webp"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <FileUploadField
              label="첨부파일 (최대 5개)"
              multiple
              maxFiles={5}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            등록
          </Button>
          <Button onClick={() => navigate(-1)}>취소</Button>
        </Stack>
      </Stack>
    </Box>
  )
}
