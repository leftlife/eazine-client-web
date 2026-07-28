import { NavLink, Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useAuth } from '../auth/AuthContext'
import { DEV_MOCK_ADMIN_ID } from '../auth/devMockConstants'
import type { AdminPermission } from '@/api/types'

const DRAWER_WIDTH = 240

const NAV_ITEMS: { label: string; to: string; permission: AdminPermission }[] = [
  { label: '서비스 사용사례', to: '/admin/use-cases', permission: 'USE_CASE_READ' },
  { label: '견적문의', to: '/admin/quotations', permission: 'QUOTATION_READ' },
  { label: '상시채용', to: '/admin/recruitments', permission: 'RECRUITMENT_READ' },
  { label: '관리자 계정', to: '/admin/accounts', permission: 'ADMIN_READ' },
  { label: '작업 이력', to: '/admin/audit-logs', permission: 'AUDIT_READ' },
]

export function AdminLayout() {
  const { admin, can, logout } = useAuth()

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Eazine 관리자
          </Typography>
          <Typography variant="body2">{admin?.name}</Typography>
          <Button color="inherit" onClick={() => void logout()}>
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {NAV_ITEMS.filter((item) => can(item.permission)).map((item) => (
            <ListItemButton key={item.to} component={NavLink} to={item.to}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {admin?.id === DEV_MOCK_ADMIN_ID && (
          <Box
            sx={{
              mb: 2,
              px: 2,
              py: 1,
              bgcolor: 'warning.light',
              borderRadius: 1,
              fontSize: 14,
            }}
          >
            임시 로그인 상태입니다. 백엔드가 연동되지 않아 목록·상세 데이터는 표시되지 않습니다.
          </Box>
        )}
        <Outlet />
      </Box>
    </Box>
  )
}
