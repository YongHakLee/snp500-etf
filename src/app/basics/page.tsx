import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/common/PageHeader'

export const metadata: Metadata = {
  title: 'S&P500 기초 지식',
  description: 'S&P500 지수와 ETF에 대한 기초 지식을 배워보세요. 초보자도 쉽게 이해할 수 있는 완벽 가이드.',
  openGraph: {
    title: 'S&P500 기초 지식',
    description: 'S&P500 지수와 ETF에 대한 기초 지식을 배워보세요.',
  },
}
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { BookOpen, BarChart3, TrendingUp, ArrowRight } from 'lucide-react'

const basicsPages = [
  {
    title: 'S&P500이란?',
    description: 'S&P500 지수의 정의, 역사, 구성 조건과 Top 10 종목을 알아보세요.',
    href: '/basics/what-is-sp500',
    icon: BookOpen,
  },
  {
    title: 'ETF 기초',
    description: 'ETF의 정의, 작동 원리, 주요 용어를 이해하고 개별주/펀드와 비교해보세요.',
    href: '/basics/etf-basics',
    icon: BarChart3,
  },
  {
    title: '왜 투자하나?',
    description: 'S&P500의 장기 수익률, 분산 투자 효과, 복리의 힘을 확인해보세요.',
    href: '/basics/why-invest',
    icon: TrendingUp,
  },
]

export default function BasicsPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="S&P500 기초 지식"
        description="주식투자를 처음 시작하는 분들을 위한 S&P500과 ETF의 기초 지식을 알아보세요."
        breadcrumbs={[{ label: '기초 지식', href: '/basics' }]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {basicsPages.map((page) => {
          const Icon = page.icon
          return (
            <Link key={page.href} href={page.href} className="group">
              <Card className="h-full transition-colors hover:border-accent-orange">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-orange/10">
                    <Icon className="h-6 w-6 text-accent-orange" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {page.title}
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-accent-orange">자세히 보기</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
