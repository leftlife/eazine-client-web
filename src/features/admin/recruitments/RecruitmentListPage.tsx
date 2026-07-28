import { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { RecruitmentStatus } from './api'
import { useRecruitmentList } from './hooks'

const STATUS_LABEL: Record<RecruitmentStatus, string> = {
  NEW: '신규',
  IN_REVIEW: '검토 중',
  CONTACTED: '연락 완료',
  ON_HOLD: '보류',
  CLOSED: '종료',
}

export function RecruitmentListPage() {
  const [page, setPage] = useState(0)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<RecruitmentStatus | ''>('')

  const { data, isLoading } = useRecruitmentList({
    page,
    size: 20,
    q: q || undefined,
    status: status || undefined,
  })

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        상시채용 지원
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="검색 (이름·이메일)"
          value={q}
          onChange={(e) => {
            setPage(0)
            setQ(e.target.value)
          }}
        />
        <TextField
          size="small"
          select
          label="처리 상태"
          value={status}
          sx={{ minWidth: 140 }}
          onChange={(e) => {
            setPage(0)
            setStatus(e.target.value as RecruitmentStatus | '')
          }}
        >
          <MenuItem value="">전체</MenuItem>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>접수번호</TableCell>
            <TableCell>지원 분야</TableCell>
            <TableCell>이름</TableCell>
            <TableCell>경력</TableCell>
            <TableCell>상태</TableCell>
            <TableCell>담당자</TableCell>
            <TableCell>접수일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell>
                <Link to={`/admin/recruitments/${r.id}`}>{r.receiptId}</Link>
              </TableCell>
              <TableCell>{r.position}</TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.careerType === 'EXPERIENCED' ? '경력' : '신입'}</TableCell>
              <TableCell>
                <Chip size="small" label={STATUS_LABEL[r.status]} />
              </TableCell>
              <TableCell>{r.assignee?.name ?? '-'}</TableCell>
              <TableCell>{r.submittedAt.slice(0, 10)}</TableCell>
            </TableRow>
          ))}
          {!isLoading && data?.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                접수된 지원이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {data && data.page.totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            page={page + 1}
            count={data.page.totalPages}
            onChange={(_, value) => setPage(value - 1)}
          />
        </Stack>
      )}
    </Box>
  )
}
