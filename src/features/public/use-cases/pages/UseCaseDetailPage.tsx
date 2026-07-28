import { useParams } from 'react-router-dom'
import { ApiError } from '@/api/types'
import { useUseCaseDetail } from '../hooks'

export function UseCaseDetailPage() {
  const { useCaseId = '' } = useParams()
  const { data, isLoading, error } = useUseCaseDetail(useCaseId)

  if (isLoading) return <p className="text-gray-500">불러오는 중...</p>

  if (error instanceof ApiError && error.status === 404) {
    return <p className="text-gray-500">존재하지 않는 사용사례입니다.</p>
  }

  if (error || !data) {
    return <p className="text-red-600">사용사례를 불러오지 못했습니다.</p>
  }

  return (
    <article>
      {data.coverImage && (
        <img
          src={data.coverImage.url}
          alt=""
          className="mb-6 h-72 w-full rounded-lg object-cover"
        />
      )}
      <h1 className="mb-2 text-2xl font-semibold">{data.title}</h1>
      <p className="mb-8 text-sm text-gray-500">{data.summary}</p>

      {/* body is server-sanitized HTML (API spec 14.1) */}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data.body }} />

      {data.attachments.length > 0 && (
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="mb-3 text-sm font-medium text-gray-700">첨부파일</h2>
          <ul className="space-y-1 text-sm">
            {data.attachments.map((file) => (
              <li key={file.id}>
                <a href={file.downloadUrl} className="text-blue-700 hover:underline">
                  {file.originalName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
