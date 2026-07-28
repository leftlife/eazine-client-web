import { useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAdminAccountList } from './hooks'

export function AccountListPage() {
  const [page, setPage] = useState(0)
  const [q, setQ] = useState('')

  const { data, isLoading } = useAdminAccountList({ page, size: 20, q: q || undefined })

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        관리자 계정
      </Typography>

      <TextField
        size="small"
        label="검색 (아이디·이름)"
        value={q}
        sx={{ mb: 2 }}
        onChange={(e) => {
          setPage(0)
          setQ(e.target.value)
        }}
      />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>로그인 ID</TableCell>
            <TableCell>이름</TableCell>
            <TableCell>역할</TableCell>
            <TableCell>상태</TableCell>
            <TableCell>마지막 로그인</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.map((admin) => (
            <TableRow key={admin.id} hover>
              <TableCell>{admin.loginId}</TableCell>
              <TableCell>{admin.name}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5}>
                  {admin.roles.map((role) => (
                    <Chip key={role} size="small" label={role} />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={admin.active ? 'success' : 'default'}
                  label={admin.active ? '활성' : '비활성'}
                />
              </TableCell>
              <TableCell>{admin.lastLoginAt?.slice(0, 10) ?? '-'}</TableCell>
            </TableRow>
          ))}
          {!isLoading && data?.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                등록된 관리자 계정이 없습니다.
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
