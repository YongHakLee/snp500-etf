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
import { Badge } from '@/components/ui/badge'
import { CreditCard, ShoppingCart, Target, Calculator, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '투자 가이드',
  description: '계좌 개설부터 첫 매수, 투자 전략, 세금까지. S&P500 ETF 투자의 모든 것을 단계별로 안내합니다.',
  openGraph: {
    title: 'S&P500 ETF 투자 가이드',
    description: '계좌 개설부터 세금까지 단계별 안내.',
  },
}

const guideSteps = [
  {
    step: 1,
    title: '계좌 개설',
    description: '증권사 선택부터 비대면 계좌 개설, 절세 계좌(ISA/IRP)까지 안내합니다.',
    href: '/guide/account',
    icon: CreditCard,
  },
  {
    step: 2,
    title: '첫 매수',
    description: 'ETF 검색 방법, 주문 유형(시장가/지정가), 매수 단계별 가이드를 제공합니다.',
    href: '/guide/first-buy',
    icon: ShoppingCart,
  },
  {
    step: 3,
    title: '투자 전략',
    description: '적립식 투자(DCA), 자산 배분(50-30-20), 리밸런싱 전략을 배워보세요.',
    href: '/guide/strategy',
    icon: Target,
  },
  {
    step: 4,
    title: '세금 안내',
    description: '해외 ETF vs 국내 ETF 세금 비교, 양도소득세, 절세 전략을 알아보세요.',
    href: '/guide/tax',
    icon: Calculator,
  },
]

export default function GuidePage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="투자 가이드"
        description="S&P500 ETF 투자를 처음 시작하는 분들을 위한 단계별 가이드입니다. 계좌 개설부터 세금까지, 투자에 필요한 모든 정보를 안내해 드립니다."
        breadcrumbs={[{ label: '투자 가이드', href: '/guide' }]}
      />

      {/* 소개 섹션 */}
      <div className="mb-8 rounded-lg bg-muted/50 p-6">
        <h2 className="mb-2 text-lg font-semibold">4단계로 시작하는 S&P500 ETF 투자</h2>
        <p className="text-muted-foreground">
          주식투자가 처음이신가요? 걱정하지 마세요. 아래 4단계를 차근차근 따라오시면
          누구나 쉽게 S&P500 ETF 투자를 시작할 수 있습니다.
        </p>
      </div>

      {/* 가이드 카드 그리드 */}
      <div className="grid gap-6 md:grid-cols-2">
        {guideSteps.map((guide) => {
          const Icon = guide.icon
          return (
            <Link key={guide.href} href={guide.href} className="group">
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Step {guide.step}
                        </Badge>
                      </div>
                      <CardTitle className="mt-1 flex items-center justify-between">
                        {guide.title}
                        <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-primary">자세히 보기</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* 안내 메시지 */}
      <div className="mt-8 rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm text-muted-foreground">
          각 단계는 순서대로 진행하시는 것을 권장하지만,
          필요한 부분만 선택적으로 확인하셔도 됩니다.
        </p>
      </div>
    </div>
  )
}
