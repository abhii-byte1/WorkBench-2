'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, ShieldCheck, Users } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/roles', label: 'Roles', icon: ShieldCheck },
  { href: '/users', label: 'Users', icon: Users },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] md:w-60">
      <div className="flex h-14 items-center gap-2.5 border-b border-[var(--color-border)] px-4">
        <Shield className="size-5 shrink-0 text-[var(--color-accent)]" />
        <span className="hidden text-base font-semibold tracking-tight text-[var(--color-text-1)] md:block">
          Workbench
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-l-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                  : 'border-l-2 border-transparent text-[var(--color-text-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-1)]'
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="hidden md:block">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[var(--color-border)] px-4 py-3">
        <p className="hidden text-xs text-[var(--color-text-2)] md:block">
          © Workbench
        </p>
        <p className="block text-center text-[10px] text-[var(--color-text-2)] md:hidden">
          ©
        </p>
      </div>
    </aside>
  )
}
