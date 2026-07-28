import { Outlet } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import type { AdminPermission } from '@/api/types'
import { useAuth } from '../auth/AuthContext'

/**
 * Client-side gate only — hides menus/routes for UX. The server re-checks every
 * admin API call independently (기획서 section 3), so this is not a security boundary.
 */
export function RequirePermission({ permission }: { permission: AdminPermission | AdminPermission[] }) {
  const { can } = useAuth()

  if (!can(permission)) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">이 화면에 접근할 권한이 없습니다.</Alert>
      </Box>
    )
  }

  return <Outlet />
}
