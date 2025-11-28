import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import { Disclaimer } from '@/components/common/Disclaimer'
import { ETFComparisonTable } from '@/components/etf/ETFComparisonTable'
import { LazyExpenseChart } from '@/components/compare/LazyExpenseChart'
import { LazyExpenseCalculator } from '@/components/compare/LazyExpenseCalculator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ExpenseChartData } from '@/components/charts/ExpenseComparisonChart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Shield, RefreshCw, Info, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import krEtfData from '@/data/kr-etf.json'
import { KREtf } from '@/types'

export const metadata: Metadata = {
  title: '한국 S&P500 ETF 비교 - TIGER vs KODEX vs ACE',
  description: 'TIGER, KODEX, ACE 등 한국 상장 S&P500 ETF를 보수율, 환헤지, 배당재투자 기준으로 비교합니다.',
  openGraph: {
    title: '한국 S&P500 ETF 비교',
    description: 'TIGER vs KODEX vs ACE - 국내 상장 ETF 비교.',
  },
}

const etfs = krEtfData.etfs as KREtf[]

// 차트용 데이터 변환
const chartData: ExpenseChartData[] = etfs.map((etf) => ({
  ticker: etf.name.split(' ')[0], // TIGER, KODEX 등
  name: etf.name,
  expenseRatio: etf.expenseRatio, // 이미 퍼센트 단위
  type: 'KR',
}))

// 세금 비교 데이터
const taxComparison = [
  {
    category: '양도소득세',
    overseas: '250만원 초과 시 22%',
    domestic: '비과세 (국내 상장 ETF)',
    isa: '200만원 비과세, 초과분 9.9%',
    pension: '연금 수령 시 저율 과세',
  },
  {
    category: '배당소득세',
    overseas: '15% 원천징수 (미국)',
    domestic: '15.4% (배당소득세)',
    isa: '비과세 (한도 내)',
    pension: '비과세 (연금 수령 시 과세)',
  },
  {
    category: '종합소득 합산',
    overseas: '금융소득 2천만원 초과 시',
    domestic: '금융소득 2천만원 초과 시',
    isa: '분리과세',
    pension: '분리과세',
  },
]

export default function KRETFPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="한국 ETF 비교"
        description="TIGER, KODEX, ACE 등 한국 상장 S&P500 ETF를 환헤지 여부, TR 상품, 세금 측면에서 비교합니다."
        breadcrumbs={[
          { label: 'ETF 비교', href: '/compare' },
          { label: '한국 ETF', href: '/compare/kr-etf' },
        ]}
      />

      {/* 탭 네비게이션 */}
      <div className="mb-8 flex border-b">
        <Link
          href="/compare/us-etf"
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
          )}
        >
          미국 ETF
        </Link>
        <Link
          href="/compare/kr-etf"
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            'border-primary text-primary'
          )}
        >
          한국 ETF
        </Link>
      </div>

      <div className="space-y-8">
        {/* ETF 비교 테이블 */}
        <SectionCard
          title="한국 상장 S&P500 ETF 비교"
          description="한국 증시에 상장된 S&P500 추종 ETF입니다. 환헤지(H), TR(배당재투자) 여부를 확인하세요."
        >
          <ETFComparisonTable
            data={etfs}
            type="kr"
            highlightTickers={['379800']}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            * KODEX 미국S&P500TR(379800)은 최저 보수율과 배당 재투자(TR) 기능을 제공합니다.
          </p>
        </SectionCard>

        {/* 보수율 비교 차트 */}
        <SectionCard
          title="보수율 비교"
          description="한국 상장 S&P500 ETF의 연간 보수율을 비교합니다."
        >
          <LazyExpenseChart data={chartData} />
          <div className="mt-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
            <h3 className="text-sm font-medium">한국 ETF 보수율 특징</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              한국 상장 ETF는 미국 ETF보다 보수율이 높지만, 세금 혜택(ISA, 연금계좌)을 활용하면
              실질 수익률에서 유리할 수 있습니다. KODEX 시리즈가 가장 낮은 보수율(0.0099%)을 제공합니다.
            </p>
          </div>
        </SectionCard>

        {/* 환헤지 vs 환오픈 비교 */}
        <SectionCard
          title="환헤지 vs 환오픈"
          description="환율 변동 위험을 어떻게 관리할지 선택할 수 있습니다."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">환헤지 (H)</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                환율 변동 위험을 줄여주는 상품입니다. 원/달러 환율이 하락할 것으로 예상될 때 유리합니다.
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  환율 하락 시 손실 방어
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  환헤지 비용 발생 (연 1~2%)
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  환율 상승 시 수익 기회 상실
                </p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                예시: TIGER 미국S&P500TR(H) - 449170
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">환오픈 (비헤지)</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                환율 변동에 그대로 노출됩니다. 장기적으로 원화 약세가 예상될 때 유리합니다.
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  환율 상승 시 추가 수익
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  환헤지 비용 없음
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  환율 하락 시 손실 발생
                </p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                예시: TIGER 미국S&P500 - 360750
              </p>
            </div>
          </div>
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              장기 투자자라면 환오픈이 일반적으로 유리합니다. 환헤지 비용이 장기간 누적되면
              수익률에 큰 영향을 미칩니다. 단, 환율이 고점이라고 판단될 때는 환헤지를 고려해볼 수 있습니다.
            </AlertDescription>
          </Alert>
        </SectionCard>

        {/* TR(배당재투자) 상품 설명 */}
        <SectionCard
          title="TR(Total Return) 상품이란?"
          description="배당금을 자동으로 재투자하는 상품입니다."
        >
          <div className="space-y-4">
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
              <h3 className="font-medium">TR 상품의 특징</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  배당금이 자동으로 재투자되어 복리 효과 극대화
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  배당소득세 과세 시점이 매도 시로 이연
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  연금계좌/ISA에서 투자 시 세금 혜택 극대화
                </li>
                <li className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  분기/월 배당을 현금으로 받고 싶다면 비TR 상품 선택
                </li>
              </ul>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">TR</Badge>
                  <h3 className="font-medium">배당 재투자형</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  KODEX 미국S&P500TR, TIGER 미국S&P500TR(H)
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  장기 복리 투자, 연금계좌 투자에 적합
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">일반</Badge>
                  <h3 className="font-medium">배당 지급형</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  TIGER 미국S&P500, KODEX 미국S&P500, ACE 미국S&P500
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  분기 배당 수령, 현금 흐름이 필요한 경우 적합
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 세금 비교 섹션 */}
        <SectionCard
          title="투자 계좌별 세금 비교"
          description="해외 직접투자와 국내 ETF 투자의 세금을 비교합니다. 계좌 유형에 따라 세금 혜택이 다릅니다."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">구분</TableHead>
                  <TableHead>해외 직접투자</TableHead>
                  <TableHead>국내 ETF (일반계좌)</TableHead>
                  <TableHead>ISA 계좌</TableHead>
                  <TableHead>연금계좌</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxComparison.map((row) => (
                  <TableRow key={row.category}>
                    <TableCell className="font-medium">{row.category}</TableCell>
                    <TableCell className="text-sm">{row.overseas}</TableCell>
                    <TableCell className="text-sm">{row.domestic}</TableCell>
                    <TableCell className="text-sm text-green-600 dark:text-green-400">{row.isa}</TableCell>
                    <TableCell className="text-sm text-blue-600 dark:text-blue-400">{row.pension}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>ISA 계좌 추천</AlertTitle>
              <AlertDescription>
                연간 2,000만원까지 납입 가능하며, 200만원(서민형 400만원)까지 비과세,
                초과분은 9.9% 분리과세됩니다. 3년 이상 유지 필수.
              </AlertDescription>
            </Alert>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>연금계좌 추천</AlertTitle>
              <AlertDescription>
                IRP, 연금저축펀드에서 투자 시 세액공제 혜택(최대 148.5만원)과
                연금 수령 시 저율 과세(3.3~5.5%) 혜택을 받을 수 있습니다.
              </AlertDescription>
            </Alert>
          </div>
        </SectionCard>

        {/* 비용 계산기 - Lazy Loading */}
        <SectionCard>
          <LazyExpenseCalculator />
        </SectionCard>

        {/* 주의사항 */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>한국 ETF 투자 시 고려사항</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>• <strong>보수율</strong>: 미국 ETF보다 높지만 세금 혜택으로 상쇄 가능</p>
            <p>• <strong>환율</strong>: 환오픈 상품은 원/달러 환율에 영향받음</p>
            <p>• <strong>거래 시간</strong>: 한국 증시 개장 시간(09:00~15:30)에 거래</p>
            <p>• <strong>최소 투자금</strong>: 1주 단위로 매수 가능, 주당 1~2만원 수준</p>
          </AlertDescription>
        </Alert>

        {/* 면책조항 */}
        <Disclaimer />
      </div>
    </div>
  )
}
