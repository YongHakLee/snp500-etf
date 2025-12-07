'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, BarChart3, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  {
    href: '/',
    label: '홈',
    icon: Home,
  },
  {
    href: '/basics',
    label: '기초',
    icon: BookOpen,
  },
  {
    href: '/compare',
    label: '비교',
    icon: BarChart3,
  },
  {
    href: '/guide',
    label: '가이드',
    icon: Compass,
  },
]

export function BottomTabBar() {
  const pathname = usePathname()

  // 현재 경로가 탭 경로와 일치하는지 확인 (하위 경로도 포함)
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === ''
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid h-16 grid-cols-4 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.href)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'text-primary')} />
              <span className={cn('font-medium', active && 'text-primary')}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
