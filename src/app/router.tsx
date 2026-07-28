import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { PublicLayout } from '@/features/public/layout/PublicLayout'
import { HomePage } from '@/features/public/HomePage'
import { UseCaseListPage } from '@/features/public/use-cases/pages/UseCaseListPage'
import { UseCaseDetailPage } from '@/features/public/use-cases/pages/UseCaseDetailPage'
import { QuotationFormPage } from '@/features/public/quotations/QuotationFormPage'
import { RecruitmentFormPage } from '@/features/public/recruitments/RecruitmentFormPage'
import { NotFoundPage } from '@/shared/components/NotFoundPage'

// Code-split point: the entire /admin subtree (MUI, TipTap, admin feature code, and its
// own nested <Routes> defined inside AdminRoot) loads only once a user actually
// navigates there, keeping the public bundle free of admin-only dependencies.
const AdminRoot = lazy(() => import('@/features/admin/AdminRoot'))

const adminFallback = <div className="py-24 text-center text-sm text-gray-500">불러오는 중...</div>

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'use-cases', element: <UseCaseListPage /> },
      { path: 'use-cases/:useCaseId', element: <UseCaseDetailPage /> },
      { path: 'quotations/new', element: <QuotationFormPage /> },
      { path: 'recruitments/new', element: <RecruitmentFormPage /> },
    ],
  },
  {
    path: '/admin/*',
    element: (
      <Suspense fallback={adminFallback}>
        <AdminRoot />
      </Suspense>
    ),
  },
  { path: '*', element: <NotFoundPage /> },
])
