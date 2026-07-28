import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="text-center">
      <h1 className="mb-4 text-3xl font-semibold">Eazine</h1>
      <p className="mb-10 text-gray-600">서비스 사용사례, 견적문의, 상시채용 지원을 안내합니다.</p>
      <div className="flex justify-center gap-4">
        <Link to="/use-cases" className="rounded bg-blue-700 px-5 py-2.5 text-white">
          사용사례 보기
        </Link>
        <Link to="/quotations/new" className="rounded border border-gray-300 px-5 py-2.5">
          견적문의 하기
        </Link>
      </div>
    </div>
  )
}
