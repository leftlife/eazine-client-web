import type { PageMeta } from '@/api/types'

/** Plain Tailwind pagination for public pages. Admin screens use MUI's own Pagination/DataGrid instead. */
export function Pagination({
  page,
  onPageChange,
}: {
  page: PageMeta
  onPageChange: (nextPage: number) => void
}) {
  if (page.totalPages <= 1) return null

  return (
    <nav className="mt-8 flex items-center justify-center gap-2 text-sm">
      <button
        type="button"
        className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
        disabled={page.first}
        onClick={() => onPageChange(page.number - 1)}
      >
        이전
      </button>
      <span className="px-2 text-gray-600">
        {page.number + 1} / {page.totalPages}
      </span>
      <button
        type="button"
        className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
        disabled={page.last}
        onClick={() => onPageChange(page.number + 1)}
      >
        다음
      </button>
    </nav>
  )
}
