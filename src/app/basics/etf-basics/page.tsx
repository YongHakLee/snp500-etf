import type { Metadata } from 'next'
import { PageHeader } from '@/components/common/PageHeader'
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
import { CheckCircle2, XCircle, MinusCircle, ArrowRightLeft, Users, TrendingUp } from 'lucide-react'
import glossaryData from '@/data/glossary.json'
import { GlossaryTerm } from '@/types'

export const metadata: Metadata = {
  title: 'ETF 기초',
  description: 'ETF의 정의와 작동 원리, 개별주/펀드와의 차이점, NAV, iNAV, 괴리율 등 주요 용어를 설명합니다.',
  openGraph: {
    title: 'ETF 기초',
    description: 'ETF의 정의와 작동 원리를 알아보세요.',
  },
}

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

// ETF 작동 원리
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

export default function ETFBasicsPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="ETF 기초"
        description="ETF(상장지수펀드)의 정의, 작동 원리, 주요 용어를 이해하고 다른 투자 상품과 비교해보세요."
        breadcrumbs={[
          { label: '기초 지식', href: '/basics' },
          { label: 'ETF 기초', href: '/basics/etf-basics' },
        ]}
      />

      <div className="space-y-8">
        {/* ETF 정의 */}
        <SectionCard title="ETF란 무엇인가요?">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              <strong className="text-foreground">ETF(Exchange Traded Fund, 상장지수펀드)</strong>는
              특정 지수의 수익률을 추종하도록 설계된 펀드로, 주식처럼 거래소에서 실시간으로 매매할 수 있습니다.
            </p>
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
          <div className="overflow-x-auto">
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
        </SectionCard>

        {/* ETF 작동 원리 */}
        <SectionCard
          title="ETF 작동 원리"
          description="ETF가 어떻게 운영되고 가격이 형성되는지 알아보세요."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {etfMechanism.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-lg border p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">ETF 가격 형성 원리</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ETF 가격은 시장에서의 수요와 공급에 따라 결정되지만, AP의 차익거래 활동 덕분에
              NAV(순자산가치)와 크게 벗어나지 않습니다. 이것이 ETF가 효율적으로 지수를 추종할 수 있는 이유입니다.
            </p>
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
                <CardContent>
                  <CardDescription className="text-sm">
                    {term.definition}
                  </CardDescription>
                  {term.related.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
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
            * 더 많은 용어는 <a href="/glossary" className="text-primary hover:underline">용어 사전</a>에서 확인하세요.
          </p>
        </SectionCard>
      </div>
    </div>
  )
}
