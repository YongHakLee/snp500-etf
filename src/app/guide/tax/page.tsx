import type { Metadata } from 'next'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, Calculator, PiggyBank, Shield, Lightbulb, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ETF 세금 안내',
  description: '해외 직접투자 vs 국내 상장 ETF 세금 비교, 양도소득세 계산, ISA/연금 절세 전략을 확인하세요.',
  openGraph: {
    title: 'ETF 세금 안내',
    description: 'ETF 투자 세금과 절세 전략 안내.',
  },
}

// 세금 비교 테이블 데이터
const taxComparison = [
  {
    category: '투자 대상',
    overseas: '미국 상장 ETF (SPY, VOO 등)',
    domestic: '국내 상장 ETF (TIGER, KODEX 등)',
  },
  {
    category: '배당소득세',
    overseas: '15% (미국 원천징수)',
    domestic: '15.4% (국내 원천징수)',
  },
  {
    category: '양도소득세',
    overseas: '22% (지방세 포함)',
    domestic: '15.4% (배당소득세로 분류)',
  },
  {
    category: '기본공제',
    overseas: '연 250만원',
    domestic: '없음',
  },
  {
    category: '손익통산',
    overseas: '해외주식 간 가능',
    domestic: '불가',
  },
  {
    category: '세금 신고',
    overseas: '5월 종합소득세 신고',
    domestic: '자동 원천징수 (신고 불필요)',
  },
]

// 양도소득세 계산 예시
const taxCalculation = {
  purchasePrice: 10000000, // 1천만원 매수
  salePrice: 15000000, // 1천5백만원 매도
  profit: 5000000, // 500만원 이익
  deduction: 2500000, // 250만원 공제
  taxableIncome: 2500000, // 250만원 과세대상
  taxRate: 22,
  tax: 550000, // 55만원 세금
}

// 절세 전략
const taxSavingStrategies = [
  {
    title: 'ISA 계좌 활용',
    icon: Shield,
    description: 'ISA 계좌 내 투자 수익은 200만원(서민형 400만원)까지 비과세됩니다.',
    benefit: '비과세 + 손익통산',
    tip: '3년 이상 유지 시 세금 혜택 극대화',
  },
  {
    title: '연금저축/IRP 활용',
    icon: PiggyBank,
    description: '연금 수령 시 3.3~5.5%의 저율로 과세됩니다.',
    benefit: '세액공제 + 과세이연',
    tip: '연금저축 400만원 + IRP 300만원 납입',
  },
  {
    title: '250만원 공제 활용',
    icon: Calculator,
    description: '해외 ETF 양도차익은 연 250만원까지 비과세입니다.',
    benefit: '기본공제',
    tip: '매년 250만원 이내로 차익 실현',
  },
  {
    title: '손익통산',
    icon: Lightbulb,
    description: '손실 종목 매도로 이익과 상계하여 세금을 줄일 수 있습니다.',
    benefit: '세금 절감',
    tip: '연말에 손익 점검 후 조정',
  },
]

export default function TaxPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="세금 안내"
        description="ETF 투자 시 알아야 할 세금 정보와 절세 전략을 안내합니다."
        breadcrumbs={[
          { label: '투자 가이드', href: '/guide' },
          { label: '세금 안내', href: '/guide/tax' },
        ]}
      />

      {/* 주의사항 Alert */}
      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>세금 안내 유의사항</AlertTitle>
        <AlertDescription>
          본 페이지의 세금 정보는 일반적인 안내 목적으로 작성되었습니다.
          세법은 변경될 수 있으며, 개인 상황에 따라 다를 수 있으므로
          정확한 세금 상담은 세무사에게 문의하시기 바랍니다.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        {/* 세금 비교: 해외 vs 국내 */}
        <SectionCard
          title="세금 비교: 해외 vs 국내 ETF"
          description="미국 직접투자와 국내 상장 ETF의 세금 차이를 비교해 보세요."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">구분</TableHead>
                  <TableHead>해외 직접투자 (미국 ETF)</TableHead>
                  <TableHead>국내 상장 ETF (한국)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxComparison.map((row) => (
                  <TableRow key={row.category}>
                    <TableCell className="font-medium">{row.category}</TableCell>
                    <TableCell>{row.overseas}</TableCell>
                    <TableCell>{row.domestic}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <h3 className="mb-2 font-medium text-blue-900 dark:text-blue-100">해외 ETF 추천 상황</h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>• 연간 양도차익 250만원 이하 예상</li>
                <li>• 장기 투자로 복리 효과 극대화</li>
                <li>• 직접 운용 선호</li>
              </ul>
            </div>
            <div className="rounded-lg bg-accent-orange-muted p-4 border border-accent-orange/20">
              <h3 className="mb-2 font-medium text-accent-orange">국내 ETF 추천 상황</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 세금 신고 부담 최소화</li>
                <li>• ISA/연금 계좌 활용</li>
                <li>• 환율 변동 위험 회피 (환헤지)</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* 양도소득세 계산 예시 */}
        <SectionCard
          title="양도소득세 계산 예시"
          description="해외 ETF 매도 시 양도소득세 계산 과정을 알아보세요."
        >
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 flex items-center gap-2 font-medium">
              <Calculator className="h-5 w-5 text-primary" />
              미국 ETF 양도소득세 계산 예시
            </h3>

            <div className="space-y-4">
              {/* 계산 과정 */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
                  <p className="text-sm text-muted-foreground">매수 금액</p>
                  <p className="text-xl font-bold">{taxCalculation.purchasePrice.toLocaleString()}원</p>
                </div>
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
                  <p className="text-sm text-muted-foreground">매도 금액</p>
                  <p className="text-xl font-bold">{taxCalculation.salePrice.toLocaleString()}원</p>
                </div>
              </div>

              {/* 계산 단계 */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">양도차익</span>
                  <span className="font-medium">{taxCalculation.profit.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">기본공제 (연 250만원)</span>
                  <span className="font-medium text-green-600">-{taxCalculation.deduction.toLocaleString()}원</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">과세 대상 금액</span>
                    <span className="font-medium">{taxCalculation.taxableIncome.toLocaleString()}원</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">세율 (지방세 포함)</span>
                  <span className="font-medium">{taxCalculation.taxRate}%</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">납부 세금</span>
                    <span className="text-xl font-bold text-primary">{taxCalculation.tax.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* 계산식 */}
              <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4">
                <p className="text-sm font-medium">계산식</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  (매도금액 - 매수금액 - 기본공제) × 22% = 납부 세금
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  ({taxCalculation.salePrice.toLocaleString()} - {taxCalculation.purchasePrice.toLocaleString()} - {taxCalculation.deduction.toLocaleString()}) × 0.22 = {taxCalculation.tax.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          <Alert className="mt-6">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>250만원 공제 활용 팁</AlertTitle>
            <AlertDescription>
              연간 양도차익이 250만원 이하라면 세금이 없습니다.
              매년 12월에 수익 상황을 점검하고, 250만원 이내로 차익을 실현하면
              장기적으로 세금을 최소화할 수 있습니다.
            </AlertDescription>
          </Alert>
        </SectionCard>

        {/* 절세 전략 */}
        <SectionCard
          title="절세 전략"
          description="합법적으로 세금을 줄일 수 있는 방법들을 알아보세요."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {taxSavingStrategies.map((strategy) => {
              const Icon = strategy.icon
              return (
                <Card key={strategy.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{strategy.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {strategy.benefit}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    <div className="flex items-start gap-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <p className="text-sm">
                        <strong>팁:</strong> {strategy.tip}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </SectionCard>

        {/* 세금 신고 안내 */}
        <SectionCard
          title="세금 신고 안내"
          description="해외 ETF 양도소득 신고 방법을 알아보세요."
        >
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 font-medium">해외 ETF 양도소득세 신고 절차</h3>
              <div className="space-y-3">
                {[
                  { step: 1, title: '신고 기간', content: '매년 5월 1일 ~ 5월 31일 (종합소득세 신고 기간)' },
                  { step: 2, title: '신고 방법', content: '홈택스 또는 세무서 방문 신고' },
                  { step: 3, title: '필요 서류', content: '증권사 해외주식 양도소득 내역서 (증권사 앱에서 발급)' },
                  { step: 4, title: '납부 기한', content: '5월 31일까지 (분납 가능)' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-accent-orange-muted p-4 border border-accent-orange/20">
              <h3 className="mb-2 flex items-center gap-2 font-medium text-accent-orange">
                <CheckCircle2 className="h-4 w-4" />
                국내 상장 ETF는 신고 불필요
              </h3>
              <p className="text-sm text-muted-foreground">
                국내 상장 S&P500 ETF(TIGER, KODEX 등)는 배당소득세가 자동으로 원천징수되어
                별도의 세금 신고가 필요하지 않습니다.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
