import Link from 'next/link'
import { Navigation } from './Navigation'
import { MobileNav } from './MobileNav'
import { ThemeToggle } from '@/components/common/ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">S&P500 ETF</span>
          </Link>
        </div>

        <Navigation className="hidden md:flex" />

        <ThemeToggle />
      </div>
    </header>
  )
}
