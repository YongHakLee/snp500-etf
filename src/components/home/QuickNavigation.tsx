import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, BarChart3, Compass } from 'lucide-react'

const quickLinks = [
  {
    href: '/basics',
    icon: BookOpen,
    title: '기초 지식',
    description: 'S&P500과 ETF 배우기',
  },
  {
    href: '/compare',
    icon: BarChart3,
    title: 'ETF 비교',
    description: '나에게 맞는 ETF 찾기',
  },
  {
    href: '/guide',
    icon: Compass,
    title: '투자 가이드',
    description: '첫 매수까지 단계별 안내',
  },
]

export function QuickNavigation() {
  return (
    <section className="py-6 border-b bg-muted/30">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Button
                key={link.href}
                variant="outline"
                size="lg"
                asChild
                className="h-auto py-3 px-4 md:px-6"
              >
                <Link href={link.href} className="flex items-center gap-2 md:gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <span className="font-semibold">{link.title}</span>
                    <span className="hidden md:inline text-muted-foreground ml-2 text-sm font-normal">
                      {link.description}
                    </span>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
