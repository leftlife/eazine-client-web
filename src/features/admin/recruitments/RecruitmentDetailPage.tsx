import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '@/api/types'
import type { RecruitmentStatus } from './api'
import { recruitmentKeys, useRecruitmentDetail, useUpdateRecruitment } from './hooks'

const STATUS_LABEL: Record<RecruitmentStatus, string> = {
  NEW: '신규',
  IN_REVIEW: '검토 중',
  CONTACTED: '연락 완료',
  ON_HOLD: '보류',
  CLOSED: '종료',
}

export function RecruitmentDetailPage() {
  const { recruitmentId = '' } = useParams()
  const { can } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useRecruitmentDetail(recruitmentId)

  const [status, setStatus] = useState<RecruitmentStatus>('NEW')
  const [memo, setMemo] = useState('')
  const [conflict, setConflict] = useState(false)

  useEffect(() => {
    if (data) {
      setStatus(data.status)
      setMemo(data.adminMemo ?? '')
    }
  }, [data])

  const mutation = useUpdateRecruitment(recruitmentId)

  const handleSave = () =>
    mutation.mutate(
      {
        status,
        assigneeId: data?.assignee?.id ?? null,
        adminMemo: memo || null,
        version: data!.version,
      },
      {
        onSuccess: () => setConflict(false),
        onError: (error) => {
          if (error instanceof ApiError && error.status === 409) {
            setConflict(true)
            void queryClient.invalidateQueries({ queryKey: recruitmentKeys.detail(recruitmentId) })
          }
        },
      },
    )

  if (isLoading) return <CircularProgress />
  if (isError || !data) return <Alert severity="error">지원 내역을 불러오지 못했습니다.</Alert>

  const canUpdate = can('RECRUITMENT_UPDATE')

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {data.receiptId}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {data.submittedAt.slice(0, 10)} 접수
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Stack spacing={1}>
          <Row label="지원 분야" value={data.position} />
          <Row label="이름" value={data.name} />
          <Row label="이메일" value={data.email} />
          <Row label="연락처" value={data.phone} />
          <Row label="경력 구분" value={data.careerType === 'EXPERIENCED' ? '경력' : '신입'} />
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography whiteSpace="pre-wrap">{data.introduction}</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" sx={{ mb: 1 }}>
          첨부파일
        </Typography>
        <Stack spacing={0.5}>
          <a href={`/api/v1/admin/files/${data.resume.id}/content`}>
            [이력서] {data.resume.originalName}
          </a>
          {data.portfolios.map((file) => (
            <a key={file.id} href={`/api/v1/admin/files/${file.id}/content`}>
              [포트폴리오] {file.originalName}
            </a>
          ))}
        </Stack>
      </Paper>

      {conflict && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          다른 관리자가 먼저 변경했습니다. 최신 내용을 다시 불러왔습니다.
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          select
          label="처리 상태"
          value={status}
          disabled={!canUpdate}
          onChange={(e) => setStatus(e.target.value as RecruitmentStatus)}
        >
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="관리자 메모"
          multiline
          minRows={3}
          value={memo}
          disabled={!canUpdate}
          onChange={(e) => setMemo(e.target.value)}
        />
        {canUpdate && (
          <Button
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
            disabled={mutation.isPending}
            onClick={handleSave}
          >
            저장
          </Button>
        )}
      </Stack>
    </Box>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography sx={{ width: 96, color: 'text.secondary' }}>{label}</Typography>
      <Typography>{value}</Typography>
    </Stack>
  )
}
