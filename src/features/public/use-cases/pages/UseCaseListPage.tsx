import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUseCaseList } from '../hooks'
import { Pagination } from '@/shared/components/Pagination'
import { useCountStore } from '@/api/store/countStore'

export function UseCaseListPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, error } = useUseCaseList({ page, size: 12 })

  const count = useCountStore(state => state.count)
  const double = useCountStore(state => state.double)
  const increase = useCountStore(state => state.increase)
  const decrease = useCountStore(state => state.decrease)

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">서비스 사용사례</h1>

      {isLoading && <p className="text-gray-500">불러오는 중...</p>}
      {isError && <p className="text-red-600">사용사례를 불러오지 못했습니다.</p>}

      <h2>Count: {count}</h2>
      <h2>Double: {double}</h2>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>

      {data && data.data.length === 0 && (
        <p className="text-gray-500">등록된 사용사례가 없습니다.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((useCase) => (
          <Link
            key={useCase.id}
            to={`/use-cases/${useCase.id}`}
            className="block overflow-hidden rounded-lg border border-gray-200 transition hover:shadow-md"
          >
            {useCase.coverImage && (
              <img
                src={useCase.coverImage.url}
                alt=""
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="mb-1 font-medium">{useCase.title}</h2>
              <p className="line-clamp-2 text-sm text-gray-600">{useCase.summary}</p>
            </div>
          </Link>
        ))}
      </div>

      {data && <Pagination page={data.page} onPageChange={setPage} />}
    </div>
  )
}
