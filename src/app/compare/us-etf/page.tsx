import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import { Disclaimer } from '@/components/common/Disclaimer'
import { ETFComparisonTable } from '@/components/etf/ETFComparisonTable'
import { LazyExpenseChart } from '@/components/compare/LazyExpenseChart'
import { LazyExpenseCalculator } from '@/components/compare/LazyExpenseCalculator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TrendingUp, Zap, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import usEtfData from '@/data/us-etf.json'
import { USEtf } from '@/types'
import type { ExpenseChartData } from '@/components/charts/ExpenseComparisonChart'

export const metadata: Metadata = {
  title: '미국 S&P500 ETF 비교 - SPY vs VOO vs IVV',
  description: 'SPY, VOO, IVV, SPLG 등 미국 상장 S&P500 ETF를 보수율, 거래량, 수익률 기준으로 비교합니다.',
  openGraph: {
    title: '미국 S&P500 ETF 비교',
    description: 'SPY vs VOO vs IVV - 어떤 ETF가 나에게 맞을까?',
  },
}

const etfs = usEtfData.etfs as USEtf[]

// 차트용 데이터 변환
const chartData: ExpenseChartData[] = etfs.map((etf) => ({
  ticker: etf.ticker,
  name: etf.name,
  expenseRatio: etf.expenseRatio * 100, // 퍼센트로 변환
  type: 'US',
}))

// 추천 시나리오 데이터
const recommendations = [
  {
    title: '장기 투자자',
    icon: TrendingUp,
    recommended: 'VOO 또는 SPLG',
    description: '10년 이상 장기 투자를 계획한다면 보수율이 낮은 VOO(0.03%)나 SPLG(0.02%)가 적합합니다. 보수율 차이가 장기간 복리로 큰 차이를 만들어냅니다.',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  },
  {
    title: '액티브 트레이더',
    icon: Zap,
    recommended: 'SPY',
    description: '단기 매매나 옵션 거래를 한다면 유동성이 가장 높은 SPY가 적합합니다. 스프레드가 가장 좁고 거래량이 압도적입니다.',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  },
]

export default function USETFPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="미국 ETF 비교"
        description="SPY, VOO, IVV, SPLG 등 미국 상장 S&P500 ETF를 보수율, 거래량, 수익률 기준으로 비교합니다."
        breadcrumbs={[
          { label: 'ETF 비교', href: '/compare' },
          { label: '미국 ETF', href: '/compare/us-etf' },
        ]}
      />

      {/* 탭 네비게이션 */}
      <div className="mb-8 flex border-b">
        <Link
          href="/compare/us-etf"
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            'border-primary text-primary'
          )}
        >
          미국 ETF
        </Link>
        <Link
          href="/compare/kr-etf"
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
          )}
        >
          한국 ETF
        </Link>
      </div>

      <div className="space-y-8">
        {/* ETF 비교 테이블 */}
        <SectionCard
          title="미국 S&P500 ETF 비교"
          description="미국에 상장된 주요 S&P500 추종 ETF입니다. 헤더를 클릭하여 정렬할 수 있습니다."
        >
          <ETFComparisonTable
            data={etfs}
            type="us"
            highlightTickers={['VOO']}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            * VOO는 낮은 보수율로 장기 투자자에게 가장 추천되는 ETF입니다.
          </p>
        </SectionCard>

        {/* 보수율 비교 차트 */}
        <SectionCard
          title="보수율 비교"
          description="ETF별 연간 보수율(Expense Ratio)을 시각적으로 비교합니다. 보수율은 매년 운용 자산에서 차감됩니다."
        >
          <LazyExpenseChart data={chartData} />
          <div className="mt-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
            <h3 className="text-sm font-medium">보수율이 중요한 이유</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              1억원을 10년간 투자할 경우, 0.03% vs 0.0945% 보수율 차이로 약 65만원 이상의 비용 차이가 발생합니다.
              장기 투자할수록 복리 효과로 이 차이는 더욱 커집니다.
            </p>
          </div>
        </SectionCard>

        {/* 추천 시나리오 */}
        <SectionCard
          title="투자 유형별 추천"
          description="투자 목적에 따라 적합한 ETF가 다릅니다."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => {
              const Icon = rec.icon
              return (
                <div
                  key={rec.title}
                  className={cn('rounded-lg border p-4', rec.color)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="font-medium">{rec.title}</h3>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    추천: {rec.recommended}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                </div>
              )
            })}
          </div>
        </SectionCard>

        {/* ETF 상세 정보 */}
        <SectionCard
          title="ETF 상세 비교"
          description="각 ETF의 특징을 상세히 비교해보세요."
        >
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">SPY - SPDR S&P 500 ETF Trust</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                1993년 출시된 최초의 S&P500 ETF로, 가장 긴 역사와 높은 유동성을 자랑합니다.
                일일 거래량이 6,000만 주 이상으로 옵션 거래와 단기 매매에 적합합니다.
                다만 보수율(0.0945%)이 다른 ETF보다 높습니다.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">VOO - Vanguard S&P 500 ETF</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Vanguard가 운용하는 대표적인 저비용 ETF입니다. 0.03%의 낮은 보수율로
                장기 투자자들에게 가장 인기 있습니다. 배당금 자동 재투자 기능을 제공합니다.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">IVV - iShares Core S&P 500 ETF</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                BlackRock이 운용하는 iShares 시리즈의 대표 ETF입니다.
                VOO와 동일한 0.03% 보수율을 제공하며, 기관 투자자들에게 인기가 높습니다.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">SPLG - SPDR Portfolio S&P 500 ETF</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                State Street가 운용하는 저비용 버전 S&P500 ETF입니다.
                0.02%로 가장 낮은 보수율을 제공하며, 주당 가격이 저렴하여 소액 투자자에게 적합합니다.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* 비용 계산기 - Lazy Loading */}
        <SectionCard>
          <LazyExpenseCalculator />
        </SectionCard>

        {/* 주의사항 */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>미국 ETF 투자 시 고려사항</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>• <strong>환율 영향</strong>: 달러로 거래되므로 환율 변동에 노출됩니다.</p>
            <p>• <strong>세금</strong>: 양도소득 연간 250만원 초과분에 22% 과세됩니다.</p>
            <p>• <strong>배당세</strong>: 미국 배당소득세 15%가 원천징수됩니다.</p>
            <p>• <strong>거래 시간</strong>: 한국 시간 기준 밤 11:30 ~ 새벽 6:00 (서머타임 시 변동)</p>
          </AlertDescription>
        </Alert>

        {/* 면책조항 */}
        <Disclaimer />
      </div>
    </div>
  )
}
