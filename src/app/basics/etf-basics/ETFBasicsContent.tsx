'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { SectionCard } from '@/components/common/SectionCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Lightbulb,
  Package,
  Scale,
  Settings,
  ArrowRightLeft,
  Users,
  TrendingUp,
  HelpCircle,
} from 'lucide-react'
import glossaryData from '@/data/glossary.json'
import { GlossaryTerm } from '@/types'

// 비용 비교 차트 Lazy Loading
const LazyExpenseFeeChart = dynamic(
  () => import('@/components/charts/ExpenseFeeChart').then((mod) => ({ default: mod.ExpenseFeeChart })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[250px] items-center justify-center md:h-[300px]">
        <div className="text-muted-foreground">차트 로딩 중...</div>
      </div>
    ),
  }
)

const allTerms = glossaryData.terms as GlossaryTerm[]

// ETF 기초에서 다룰 핵심 용어들
const coreTerms = ['NAV', 'iNAV', '괴리율', '추적오차']
const filteredTerms = allTerms.filter((term) => coreTerms.includes(term.term))

// ETF vs 개별주 vs 펀드 비교 데이터
const comparisonData = [
  {
    category: '분산 투자',
    etf: { value: true, note: '수백 개 종목에 자동 분산' },
    stock: { value: false, note: '개별 종목에 집중' },
    fund: { value: true, note: '펀드매니저가 분산 운용' },
  },
  {
    category: '거래 방식',
    etf: { value: 'neutral', note: '주식처럼 실시간 거래' },
    stock: { value: 'neutral', note: '실시간 거래' },
    fund: { value: 'neutral', note: '1일 1회 기준가 거래' },
  },
  {
    category: '운용 보수',
    etf: { value: true, note: '매우 낮음 (0.03~0.2%)' },
    stock: { value: true, note: '없음' },
    fund: { value: false, note: '상대적으로 높음 (1~2%)' },
  },
  {
    category: '투자 최소금액',
    etf: { value: true, note: '1주 단위 (수만원)' },
    stock: { value: true, note: '1주 단위' },
    fund: { value: false, note: '보통 10만원 이상' },
  },
  {
    category: '투명성',
    etf: { value: true, note: '구성 종목 실시간 공개' },
    stock: { value: true, note: '회사 정보 공개' },
    fund: { value: false, note: '정기 보고서로만 확인' },
  },
  {
    category: '매매 수수료',
    etf: { value: 'neutral', note: '증권사 수수료 적용' },
    stock: { value: 'neutral', note: '증권사 수수료 적용' },
    fund: { value: false, note: '판매수수료 별도' },
  },
]

// 도시락 비유 기반 ETF 작동 원리
const etfAnalogy = [
  {
    icon: Package,
    title: '여러 음식이 담긴 도시락',
    description: 'ETF는 여러 종목(음식)이 담긴 도시락 하나를 사는 것과 같습니다. S&P500 ETF를 사면 애플, 마이크로소프트 등 500개 기업에 한 번에 투자됩니다.',
    highlight: 'S&P500 ETF 1주 = 500개 기업 분산투자',
  },
  {
    icon: Scale,
    title: '도시락 가격 = 재료값',
    description: 'ETF 가격은 그 안에 담긴 주식들의 가치(NAV)와 거의 같습니다. 재료값이 10만원이면 도시락도 10만원 근처에서 거래됩니다.',
    highlight: 'ETF 가격 ≒ 보유 주식 가치(NAV)',
  },
  {
    icon: Settings,
    title: '도시락 회사가 자동 관리',
    description: 'ETF 운용사가 지수 구성 변경에 맞춰 종목을 자동으로 조정합니다. 투자자는 아무것도 하지 않아도 됩니다.',
    highlight: '리밸런싱 자동화 + 저렴한 비용',
  },
]

// 심화: ETF 작동 원리 (기존 내용)
const etfMechanism = [
  {
    icon: Users,
    title: '지정참가회사 (AP)',
    description: 'Authorized Participant. ETF의 설정과 환매를 담당하는 대형 금융기관으로, 시장의 유동성을 공급하고 ETF 가격이 NAV에서 크게 벗어나지 않도록 합니다.',
  },
  {
    icon: ArrowRightLeft,
    title: '차익거래',
    description: 'ETF 가격이 NAV보다 높으면 AP가 ETF를 발행(설정)하여 팔고, 낮으면 ETF를 매수하여 환매합니다. 이 과정에서 가격 괴리가 해소됩니다.',
  },
  {
    icon: TrendingUp,
    title: '추적 방식',
    description: 'S&P500 ETF는 대부분 완전복제 방식을 사용합니다. 지수에 포함된 모든 종목을 동일한 비중으로 보유하여 지수 수익률을 그대로 따라갑니다.',
  },
]

function ComparisonIcon({ value }: { value: boolean | string }) {
  if (value === true) {
    return <CheckCircle2 className="h-5 w-5 text-green-500" />
  } else if (value === false) {
    return <XCircle className="h-5 w-5 text-red-500" />
  }
  return <MinusCircle className="h-5 w-5 text-yellow-500" />
}

// Tooltip 래핑된 용어 컴포넌트
function TermWithTooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const termData = allTerms.find((t) => t.term === term)
  if (!termData) return <>{children}</>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted decoration-muted-foreground cursor-help">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-medium">{termData.term} ({termData.korean})</p>
        <p className="text-xs mt-1">{termData.definition}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// 모바일용 비교 카드 컴포넌트
function MobileComparisonCards() {
  const products = [
    { name: 'ETF', data: comparisonData.map(row => ({ category: row.category, ...row.etf })) },
    { name: '개별주', data: comparisonData.map(row => ({ category: row.category, ...row.stock })) },
    { name: '펀드', data: comparisonData.map(row => ({ category: row.category, ...row.fund })) },
  ]

  return (
    <div className="space-y-4 md:hidden">
      {products.map((product) => (
        <Card key={product.name}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {product.data.map((item) => (
              <div key={item.category} className="flex items-start gap-2">
                <ComparisonIcon value={item.value} />
                <div>
                  <span className="font-medium text-sm">{item.category}</span>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ETFBasicsContent() {
  return (
    <div className="space-y-8">
      {/* ETF 정의 */}
      <SectionCard title="ETF란 무엇인가요?">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            <strong className="text-foreground">ETF(Exchange Traded Fund, 상장지수펀드)</strong>는
            특정 지수의 수익률을 추종하도록 설계된 펀드로, 주식처럼 거래소에서 실시간으로 매매할 수 있습니다.
          </p>

          <Alert className="bg-primary/5 border-primary/20">
            <Lightbulb className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">초보자 팁</AlertTitle>
            <AlertDescription>
              ETF는 &quot;주식처럼 사고파는 펀드&quot;입니다. 개별 주식 고르는 게 어렵다면,
              ETF로 시장 전체에 투자해보세요!
            </AlertDescription>
          </Alert>

          <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
            <h3 className="mb-2 font-semibold">ETF의 핵심 특징</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">지수 추종:</strong> S&P500, KOSPI200 등 특정 지수의 수익률을 그대로 따라갑니다.
              </li>
              <li>
                <strong className="text-foreground">거래소 상장:</strong> 주식처럼 증권거래소에서 실시간으로 사고팔 수 있습니다.
              </li>
              <li>
                <strong className="text-foreground">낮은 비용:</strong> 액티브 펀드 대비 운용 보수가 매우 저렴합니다.
              </li>
              <li>
                <strong className="text-foreground">분산 투자:</strong> 하나의 ETF로 수백 개 종목에 자동으로 분산 투자됩니다.
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* ETF vs 개별주 vs 펀드 비교 */}
      <SectionCard
        title="ETF vs 개별주 vs 펀드"
        description="ETF와 다른 투자 상품들의 특성을 비교해보세요."
      >
        {/* 데스크톱: 테이블 */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">비교 항목</TableHead>
                <TableHead className="text-center">ETF</TableHead>
                <TableHead className="text-center">개별주</TableHead>
                <TableHead className="text-center">펀드</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row) => (
                <TableRow key={row.category}>
                  <TableCell className="font-medium">{row.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                      <ComparisonIcon value={row.etf.value} />
                      <span className="text-xs text-muted-foreground">{row.etf.note}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                      <ComparisonIcon value={row.stock.value} />
                      <span className="text-xs text-muted-foreground">{row.stock.note}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                      <ComparisonIcon value={row.fund.value} />
                      <span className="text-xs text-muted-foreground">{row.fund.note}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 모바일: 카드 */}
        <MobileComparisonCards />

        {/* 비용 비교 차트 */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            비용 차이가 얼마나 될까요?
          </h3>
          <LazyExpenseFeeChart />
        </div>
      </SectionCard>

      {/* ETF 작동 원리 (도시락 비유) */}
      <SectionCard title="ETF는 어떻게 작동하나요?">
        <div className="space-y-6">
          <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">쉽게 이해하기</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              ETF를 &quot;주식 도시락&quot;이라고 생각해보세요! 여러 음식(종목)이 담긴 도시락 하나를 사는 것과 같습니다.
            </AlertDescription>
          </Alert>

          {/* 3가지 핵심 개념 - 비유 기반 */}
          <div className="grid gap-6 md:grid-cols-3">
            {etfAnalogy.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-lg border bg-card p-5">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="rounded bg-primary/5 px-3 py-2 text-sm font-medium text-primary">
                    {item.highlight}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 심화 내용 - Accordion */}
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="advanced" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <HelpCircle className="h-4 w-4" />
                  더 알아보기 (심화)
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    ETF의 가격이 실제 자산 가치(<TermWithTooltip term="NAV">NAV</TermWithTooltip>)와
                    비슷하게 유지되는 이유는 <TermWithTooltip term="AP">지정참가회사(AP)</TermWithTooltip>의
                    차익거래 활동 덕분입니다.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {etfMechanism.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.title} className="rounded-lg border p-4 bg-muted/30">
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <h4 className="mb-1 font-medium text-sm">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SectionCard>

      {/* 주요 용어 설명 */}
      <SectionCard
        title="주요 용어 설명"
        description="ETF 투자 시 알아야 할 핵심 용어들입니다."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTerms.map((term) => (
            <Card key={term.term}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {term.term}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({term.korean})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-sm">
                  {term.definition}
                </CardDescription>
                {term.example && (
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="font-medium text-primary">예시: </span>
                    <span className="text-muted-foreground">{term.example}</span>
                  </div>
                )}
                {term.related.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-xs text-muted-foreground">관련 용어:</span>
                    {term.related.map((related) => (
                      <Badge key={related} variant="outline" className="text-xs">
                        {related}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          * 더 많은 용어는 <Link href="/glossary" className="text-primary hover:underline">용어 사전</Link>에서 확인하세요.
        </p>
      </SectionCard>

    </div>
  )
}
