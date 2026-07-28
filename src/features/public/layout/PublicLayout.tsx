import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { label: '서비스 사용사례', to: '/use-cases' },
  { label: '견적문의', to: '/quotations/new' },
  { label: '채용', to: '/recruitments/new' },
]

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="text-lg font-semibold">
            Eazine
          </NavLink>
          <ul className="flex list-none gap-6 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'font-medium text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Eazine
      </footer>
    </div>
  )
}
