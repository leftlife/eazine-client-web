import { Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { adminTheme } from '@/app/theme'
import { AdminAuthProvider } from './auth/AuthContext'
import { LoginPage } from './auth/LoginPage'
import { RequireAuth } from './guards/RequireAuth'
import { RequirePermission } from './guards/RequirePermission'
import { AdminLayout } from './layout/AdminLayout'
import { UseCaseListPage } from './use-cases/UseCaseListPage'
import { UseCaseCreatePage } from './use-cases/UseCaseCreatePage'
import { UseCaseDetailPage } from './use-cases/UseCaseDetailPage'
import { QuotationListPage } from './quotations/QuotationListPage'
import { QuotationDetailPage } from './quotations/QuotationDetailPage'
import { RecruitmentListPage } from './recruitments/RecruitmentListPage'
import { RecruitmentDetailPage } from './recruitments/RecruitmentDetailPage'
import { AccountListPage } from './accounts/AccountListPage'
import { AuditLogListPage } from './audit-logs/AuditLogListPage'

/**
 * Lazy-loaded entry point for the whole /admin/* subtree (see app/router.tsx), which
 * mounts it as a single wildcard route rendering this component's own nested <Routes>.
 * That's what keeps MUI/TipTap/admin feature code out of the public bundle — everything
 * they pull in is only reachable through this one dynamic import.
 */
export default function AdminRoot() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AdminAuthProvider>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="use-cases" replace />} />
              <Route element={<RequirePermission permission="USE_CASE_READ" />}>
                <Route path="use-cases" element={<UseCaseListPage />} />
                <Route path="use-cases/new" element={<UseCaseCreatePage />} />
                <Route path="use-cases/:useCaseId" element={<UseCaseDetailPage />} />
              </Route>
              <Route element={<RequirePermission permission="QUOTATION_READ" />}>
                <Route path="quotations" element={<QuotationListPage />} />
                <Route path="quotations/:quotationId" element={<QuotationDetailPage />} />
              </Route>
              <Route element={<RequirePermission permission="RECRUITMENT_READ" />}>
                <Route path="recruitments" element={<RecruitmentListPage />} />
                <Route path="recruitments/:recruitmentId" element={<RecruitmentDetailPage />} />
              </Route>
              <Route element={<RequirePermission permission="ADMIN_READ" />}>
                <Route path="accounts" element={<AccountListPage />} />
              </Route>
              <Route element={<RequirePermission permission="AUDIT_READ" />}>
                <Route path="audit-logs" element={<AuditLogListPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AdminAuthProvider>
    </ThemeProvider>
  )
}
