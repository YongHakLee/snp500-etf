'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import { HistoricalReturnChart } from '@/components/charts/HistoricalReturnChart'
import { DataStatus } from '@/components/common/DataStatus'
import { TimeRangeSelector, type TimeRange } from '@/components/common/TimeRangeSelector'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TrendingUp, PieChart, Calculator, Quote } from 'lucide-react'

import { useHistoricalReturns } from '@/hooks'

// 분산 투자 효과 데이터
const diversificationBenefits = [
  {
    icon: PieChart,
    title: '500개 기업에 자동 분산',
    description: 'S&P500 ETF 1주만 사도 미국 500대 기업에 자동으로 분산 투자됩니다. 개별 기업의 위험이 크게 줄어듭니다.',
  },
  {
    icon: TrendingUp,
    title: '섹터별 균형 잡힌 투자',
    description: '정보기술, 금융, 헬스케어 등 11개 섹터에 분산되어 특정 산업의 위험에도 안정적입니다.',
  },
  {
    icon: Calculator,
    title: '자동 리밸런싱',
    description: '지수 운영사가 정기적으로 구성 종목을 조정하므로 별도의 관리가 필요 없습니다.',
  },
]

// 복리 시뮬레이션 데이터 (연 평균 10% 가정)
const compoundSimulation = [
  { years: 10, single: 1000, compound: 2594 },
  { years: 20, single: 2000, compound: 6727 },
  { years: 30, single: 3000, compound: 17449 },
]

// 투자 명언/격언
const investmentQuotes = [
  {
    quote: '시장의 평균을 이기려 하지 말고, 시장의 평균이 되어라.',
    author: '존 보글 (Vanguard 창업자)',
  },
  {
    quote: '주식 시장에서 돈을 버는 가장 좋은 방법은 S&P500 인덱스 펀드를 사서 절대 팔지 않는 것이다.',
    author: '워렌 버핏',
  },
  {
    quote: '복리는 세계 8대 불가사의다. 이해하는 자는 얻고, 이해하지 못하는 자는 지불한다.',
    author: '알베르트 아인슈타인',
  },
]

export default function WhyInvestContent() {
  // 기간 선택 상태 (기본값: 10년)
  const [timeRange, setTimeRange] = useState<TimeRange>('10y')

  // 커스텀 훅으로 실시간 데이터 가져오기
  const { returns, summary, isLive, isLoading, lastUpdated } = useHistoricalReturns(timeRange)

  // 최신 수익률 데이터
  const latestReturn = returns.length > 0 ? returns[returns.length - 1] : null
  const firstYear = returns.length > 0 ? returns[0].year : null

  return (
    <div className="container py-10">
      <PageHeader
        title="왜 S&P500에 투자할까요?"
        description="장기 수익률, 분산 투자 효과, 복리의 힘을 통해 S&P500 투자의 장점을 알아보세요."
        breadcrumbs={[
          { label: '기초 지식', href: '/basics' },
          { label: '왜 투자하나?', href: '/basics/why-invest' },
        ]}
      />

      <div className="space-y-8">
        {/* S&P500 장기 수익률 */}
        <SectionCard
          title="S&P500 장기 수익률"
          description="S&P500의 연간 및 누적 수익률을 확인해보세요."
          headerRight={
            <div className="flex items-center gap-3">
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              <DataStatus isLive={isLive} lastUpdated={lastUpdated} />
            </div>
          }
        >
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <>
              <HistoricalReturnChart data={returns} />
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                  <p className="text-sm text-muted-foreground">최근 연간 수익률</p>
                  <p className={`text-2xl font-bold ${latestReturn && latestReturn.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {latestReturn ? `${latestReturn.return >= 0 ? '+' : ''}${latestReturn.return}%` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">{latestReturn?.year}년</p>
                </div>
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                  <p className="text-sm text-muted-foreground">누적 수익률</p>
                  <p className="text-2xl font-bold text-primary">
                    {latestReturn ? `+${latestReturn.cumulativeReturn.toFixed(1)}%` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">{firstYear}년 이후</p>
                </div>
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                  <p className="text-sm text-muted-foreground">평균 연간 수익률</p>
                  <p className="text-2xl font-bold">+{summary.avgAnnualReturn}%</p>
                  <p className="text-xs text-muted-foreground">{summary.totalYears}년 평균</p>
                </div>
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                  <p className="text-sm text-muted-foreground">수익 발생 연도</p>
                  <p className="text-2xl font-bold">{summary.positiveYears}/{summary.totalYears}년</p>
                  <p className="text-xs text-muted-foreground">
                    {summary.totalYears > 0 ? `${((summary.positiveYears / summary.totalYears) * 100).toFixed(0)}% 확률` : '-'}
                  </p>
                </div>
              </div>
              {/* 최고/최저 연도 표시 */}
              {summary.bestYear && summary.worstYear && (
                <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
                  <span className="text-green-600">
                    최고: {summary.bestYear.year}년 (+{summary.bestYear.return}%)
                  </span>
                  <span className="text-red-600">
                    최저: {summary.worstYear.year}년 ({summary.worstYear.return}%)
                  </span>
                </div>
              )}
            </>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            * 과거 수익률이 미래 수익률을 보장하지 않습니다. 투자에는 원금 손실의 위험이 있습니다.
          </p>
        </SectionCard>

        {/* 분산 투자 효과 */}
        <SectionCard
          title="분산 투자 효과"
          description="S&P500 ETF는 단 1주로도 미국 경제 전체에 투자하는 효과를 누릴 수 있습니다."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {diversificationBenefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div key={benefit.title} className="rounded-lg border p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
            <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">달걀을 한 바구니에 담지 마라</h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              개별 주식에 투자하면 해당 기업의 실적에 따라 큰 손실을 볼 수 있습니다.
              하지만 S&P500 ETF는 500개 기업에 분산되어 있어, 한두 기업이 어려움을 겪어도
              전체 포트폴리오에 미치는 영향이 제한적입니다.
            </p>
          </div>
        </SectionCard>

        {/* 복리의 힘 */}
        <SectionCard
          title="복리의 힘"
          description="시간이 지날수록 복리 효과는 기하급수적으로 커집니다."
        >
          <div className="mb-6">
            <p className="text-muted-foreground">
              매년 10%의 수익률을 가정했을 때, 1,000만원을 투자하면 시간에 따라 어떻게 성장하는지 확인해보세요.
              복리는 &quot;이자에 이자가 붙는&quot; 효과로, 장기 투자할수록 그 효과가 극대화됩니다.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {compoundSimulation.map((sim) => (
              <Card key={sim.years}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{sim.years}년 후</CardTitle>
                  <CardDescription>1,000만원 투자 시</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">단리 (원금만)</span>
                      <span className="font-medium">{sim.single.toLocaleString()}만원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary">복리 효과</span>
                      <span className="font-bold text-primary">{sim.compound.toLocaleString()}만원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">차이</span>
                      <span className="font-medium text-green-600">+{(sim.compound - sim.single).toLocaleString()}만원</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            * 연 평균 10% 수익률 가정. 실제 수익률은 시장 상황에 따라 변동됩니다.
          </p>
        </SectionCard>

        {/* 투자 명언/격언 */}
        <SectionCard
          title="투자 명언"
          description="세계적인 투자자들이 말하는 장기 투자의 지혜를 들어보세요."
        >
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {investmentQuotes.map((item, index) => (
              <div key={index} className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-6">
                <Quote className="mb-3 h-8 w-8 text-primary/40" />
                <blockquote className="mb-4 text-lg italic">
                  &quot;{item.quote}&quot;
                </blockquote>
                <p className="text-sm font-medium text-muted-foreground">- {item.author}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* CTA 섹션 */}
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 text-center">
          <h3 className="mb-2 text-xl font-bold">투자를 시작할 준비가 되셨나요?</h3>
          <p className="mb-4 text-muted-foreground">
            ETF 비교와 실제 투자 방법을 알아보세요.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/compare"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              ETF 비교하기
            </a>
            <a
              href="/guide"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent"
            >
              투자 가이드 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
