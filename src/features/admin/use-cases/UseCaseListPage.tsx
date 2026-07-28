import { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useAuth } from '../auth/AuthContext'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import type { UseCaseStatus } from './api'
import { useAdminUseCaseList, useDeleteUseCase } from './hooks'

const STATUS_LABEL: Record<UseCaseStatus, string> = {
  DRAFT: '임시저장',
  PUBLISHED: '공개',
  PRIVATE: '비공개',
}

export function UseCaseListPage() {
  const { can } = useAuth()
  const [page, setPage] = useState(0)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<UseCaseStatus | ''>('')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useAdminUseCaseList({
    page,
    size: 20,
    q: q || undefined,
    status: status || undefined,
  })

  const deleteMutation = useDeleteUseCase()

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">서비스 사용사례</Typography>
        {can('USE_CASE_WRITE') && (
          <Button component={Link} to="/admin/use-cases/new" variant="contained">
            새 사용사례 등록
          </Button>
        )}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="검색"
          value={q}
          onChange={(e) => {
            setPage(0)
            setQ(e.target.value)
          }}
        />
        <TextField
          size="small"
          select
          label="상태"
          value={status}
          sx={{ minWidth: 140 }}
          onChange={(e) => {
            setPage(0)
            setStatus(e.target.value as UseCaseStatus | '')
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
            <TableCell>제목</TableCell>
            <TableCell>상태</TableCell>
            <TableCell>게시일</TableCell>
            <TableCell>수정일</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.map((useCase) => (
            <TableRow key={useCase.id} hover>
              <TableCell>
                <Link to={`/admin/use-cases/${useCase.id}`}>{useCase.title}</Link>
              </TableCell>
              <TableCell>
                <Chip size="small" label={STATUS_LABEL[useCase.status]} />
              </TableCell>
              <TableCell>{useCase.publishedAt?.slice(0, 10) ?? '-'}</TableCell>
              <TableCell>{useCase.updatedAt.slice(0, 10)}</TableCell>
              <TableCell align="right">
                {can('USE_CASE_DELETE') && (
                  <IconButton size="small" onClick={() => setPendingDeleteId(useCase.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
          {!isLoading && data?.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                등록된 사용사례가 없습니다.
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

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="사용사례를 삭제할까요?"
        description="삭제된 게시물은 공개 목록에서 즉시 제외됩니다."
        confirmLabel="삭제"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() =>
          pendingDeleteId &&
          deleteMutation.mutate(pendingDeleteId, { onSuccess: () => setPendingDeleteId(null) })
        }
      />
    </Box>
  )
}
