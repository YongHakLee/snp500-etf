import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/common/PageHeader'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { DollarSign, Building2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ETF 비교',
  description: '미국 및 한국 상장 S&P500 ETF를 한눈에 비교하세요. SPY, VOO, IVV, TIGER, KODEX 등.',
  openGraph: {
    title: 'S&P500 ETF 비교',
    description: '미국 및 한국 상장 S&P500 ETF 비교.',
  },
}

const comparePages = [
  {
    title: '미국 ETF 비교',
    description: 'SPY, VOO, IVV, SPLG 등 미국 상장 S&P500 ETF를 보수율, 거래량, 수익률 기준으로 비교합니다.',
    href: '/compare/us-etf',
    icon: DollarSign,
    features: ['낮은 보수율', '높은 유동성', '달러 자산'],
  },
  {
    title: '한국 ETF 비교',
    description: 'TIGER, KODEX, ACE 등 한국 상장 S&P500 ETF를 환헤지 여부, TR 상품, 세금 측면에서 비교합니다.',
    href: '/compare/kr-etf',
    icon: Building2,
    features: ['원화 거래', '세금 혜택', '환헤지 선택'],
  },
]

export default function ComparePage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="ETF 비교"
        description="다양한 S&P500 ETF를 비교하여 나에게 맞는 상품을 찾아보세요. 미국 직접 투자와 한국 상장 ETF 중 어떤 것이 적합한지 확인할 수 있습니다."
        breadcrumbs={[{ label: 'ETF 비교', href: '/compare' }]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {comparePages.map((page) => {
          const Icon = page.icon
          return (
            <Link key={page.href} href={page.href} className="group">
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {page.title}
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {page.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 block text-sm text-primary">자세히 보기</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* 간단한 비교 안내 */}
      <div className="mt-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">어떤 ETF를 선택해야 할까요?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-primary">미국 ETF 추천 대상</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 장기 투자 (10년 이상) 계획인 분</li>
              <li>• 최저 보수율을 원하는 분</li>
              <li>• 달러 자산 보유를 원하는 분</li>
              <li>• 해외 주식 거래에 익숙한 분</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-primary">한국 ETF 추천 대상</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• 연금계좌/ISA로 절세 혜택을 받고 싶은 분</li>
              <li>• 원화로 간편하게 거래하고 싶은 분</li>
              <li>• 환율 변동 위험을 줄이고 싶은 분</li>
              <li>• 소액으로 시작하는 초보 투자자</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
