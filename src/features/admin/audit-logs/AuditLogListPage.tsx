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
import Typography from '@mui/material/Typography'
import { useAuditLogList } from './hooks'

export function AuditLogListPage() {
  const [page, setPage] = useState(0)

  const { data, isLoading } = useAuditLogList({ page, size: 20 })

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        관리자 작업 이력
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>일시</TableCell>
            <TableCell>관리자</TableCell>
            <TableCell>작업</TableCell>
            <TableCell>대상</TableCell>
            <TableCell>결과</TableCell>
            <TableCell>IP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.map((log) => (
            <TableRow key={log.id} hover>
              <TableCell>{log.occurredAt.replace('T', ' ').slice(0, 19)}</TableCell>
              <TableCell>{log.admin.name}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>
                {log.resourceType} / {log.resourceId.slice(0, 8)}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={log.result === 'SUCCESS' ? 'success' : 'error'}
                  label={log.result}
                />
              </TableCell>
              <TableCell>{log.ipAddressMasked}</TableCell>
            </TableRow>
          ))}
          {!isLoading && data?.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                기록된 작업 이력이 없습니다.
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
