import type { Metadata } from 'next'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrendingUp, Calendar, PieChart, RefreshCw, CheckCircle2, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ETF 투자 전략',
  description: '적립식(DCA) 투자, 거치식 vs 적립식 비교, 자산 배분 전략, 리밸런싱 방법을 알아보세요.',
  openGraph: {
    title: 'ETF 투자 전략',
    description: '적립식 투자와 자산 배분 전략 안내.',
  },
}

// DCA 정보
const dcaBenefits = [
  {
    title: '시장 타이밍 부담 감소',
    description: '언제 투자해야 할지 고민할 필요 없이 정해진 날짜에 자동으로 투자합니다.',
  },
  {
    title: '평균 매수 단가 효과',
    description: '주가가 높을 때는 적게, 낮을 때는 많이 사서 평균 매수 단가를 낮출 수 있습니다.',
  },
  {
    title: '투자 습관 형성',
    description: '정기적인 투자 습관을 통해 장기적으로 자산을 축적할 수 있습니다.',
  },
  {
    title: '심리적 안정감',
    description: '일시적인 시장 변동에 흔들리지 않고 꾸준히 투자할 수 있습니다.',
  },
]

// 거치식 vs 적립식 비교
const investmentComparison = [
  {
    category: '투자 방식',
    lumpSum: '목돈을 한 번에 투자',
    dca: '정기적으로 분할 투자',
  },
  {
    category: '적합한 상황',
    lumpSum: '목돈 보유 시, 장기 투자 확신',
    dca: '정기 수입, 투자 초보자',
  },
  {
    category: '장점',
    lumpSum: '상승장에서 높은 수익',
    dca: '시점 분산, 심리적 안정',
  },
  {
    category: '단점',
    lumpSum: '높은 진입 시점 리스크',
    dca: '상승장에서 기회비용',
  },
  {
    category: '추천 대상',
    lumpSum: '경험 많은 투자자',
    dca: '초보자, 직장인',
  },
]

// 50-30-20 배분 전략
const budgetAllocation = [
  {
    category: '필수 지출',
    percentage: 50,
    color: 'bg-red-500',
    examples: '주거비, 식비, 교통비, 공과금, 보험료',
  },
  {
    category: '선택 지출',
    percentage: 30,
    color: 'bg-yellow-500',
    examples: '여가, 쇼핑, 외식, 취미, 자기계발',
  },
  {
    category: '저축/투자',
    percentage: 20,
    color: 'bg-green-500',
    examples: 'ETF 투자, 비상금, 연금, 목돈 마련',
  },
]

// 리밸런싱
const rebalancingTiming = [
  '목표 비율에서 5~10% 이상 벗어났을 때',
  '연 1~2회 정기적으로 (예: 1월, 7월)',
  '대규모 시장 변동 후 (급등/급락)',
  '생애 주기 변화 시 (결혼, 은퇴 등)',
]

export default function StrategyPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="투자 전략"
        description="장기적으로 수익을 극대화하기 위한 투자 전략을 알아보세요."
        breadcrumbs={[
          { label: '투자 가이드', href: '/guide' },
          { label: '투자 전략', href: '/guide/strategy' },
        ]}
      />

      <div className="space-y-8">
        {/* 적립식 투자 (DCA) */}
        <SectionCard
          title="적립식 투자 (DCA)"
          description="Dollar Cost Averaging - 일정 금액을 정기적으로 투자하는 전략입니다."
        >
          <div className="mb-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">적립식 투자 예시</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              매월 1일, 30만원씩 TIGER 미국S&P500 ETF에 투자합니다.
              주가가 높을 때도, 낮을 때도 같은 금액을 투자하여 평균 매수 단가를 낮춥니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {dcaBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-3 rounded-lg border p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <h3 className="font-medium">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-6">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>자동이체 설정 팁</AlertTitle>
            <AlertDescription>
              대부분의 증권사에서 자동 적립 기능을 제공합니다.
              월급날 다음 날로 자동이체를 설정하면 투자를 잊지 않고 꾸준히 할 수 있습니다.
            </AlertDescription>
          </Alert>
        </SectionCard>

        {/* 거치식 vs 적립식 비교 */}
        <SectionCard
          title="거치식 vs 적립식 비교"
          description="두 투자 방식의 장단점을 비교해 보세요."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">거치식 (Lump Sum)</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">목돈을 한 번에 투자</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-accent-orange">장점</p>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• 장기적으로 수익률 높을 가능성</li>
                      <li>• 단순한 관리</li>
                      <li>• 투자 기간 극대화</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600">단점</p>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• 높은 진입 시점 리스크</li>
                      <li>• 심리적 부담 큼</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                    <p className="text-sm">
                      <strong>추천:</strong> 목돈 보유자, 장기 투자 확신이 있는 경우
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">적립식 (DCA)</CardTitle>
                  </div>
                  <Badge variant="default">초보자 추천</Badge>
                </div>
                <p className="text-sm text-muted-foreground">정기적으로 분할 투자</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-accent-orange">장점</p>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• 시점 분산 효과</li>
                      <li>• 심리적 안정감</li>
                      <li>• 투자 습관 형성</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600">단점</p>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• 상승장에서 기회비용</li>
                      <li>• 정기적 관리 필요</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                    <p className="text-sm">
                      <strong>추천:</strong> 초보자, 직장인, 정기 수입이 있는 경우
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SectionCard>

        {/* 50-30-20 배분 전략 */}
        <SectionCard
          title="50-30-20 배분 전략"
          description="월 수입을 합리적으로 배분하는 방법입니다."
        >
          <div className="mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              월 수입을 필수 지출, 선택 지출, 저축/투자로 나누어 관리하세요.
            </span>
          </div>

          {/* 시각화 바 */}
          <div className="mb-6 flex h-8 w-full overflow-hidden rounded-lg">
            {budgetAllocation.map((item) => (
              <div
                key={item.category}
                className={`${item.color} flex items-center justify-center text-xs font-medium text-white`}
                style={{ width: `${item.percentage}%` }}
              >
                {item.percentage}%
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {budgetAllocation.map((item) => (
              <Card key={item.category}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <CardTitle className="text-base">{item.category}</CardTitle>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.examples}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
            <h3 className="mb-2 font-medium">예시: 월 수입 300만원</h3>
            <div className="grid gap-2 text-sm md:grid-cols-3">
              <div>필수 지출: <strong>150만원</strong></div>
              <div>선택 지출: <strong>90만원</strong></div>
              <div>저축/투자: <strong>60만원</strong></div>
            </div>
          </div>
        </SectionCard>

        {/* 리밸런싱 */}
        <SectionCard
          title="리밸런싱"
          description="자산 배분 비율을 원래 목표대로 조정하는 것입니다."
        >
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
            <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-medium">리밸런싱이란?</h3>
              <p className="text-sm text-muted-foreground">
                시간이 지나면 자산별 수익률 차이로 처음 설정한 비율이 달라집니다.
                예를 들어, 주식 70% : 채권 30%로 시작했는데, 주식이 많이 올라
                80% : 20%가 되었다면, 주식 일부를 팔고 채권을 사서 원래 비율로 돌려놓는 것입니다.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-medium">리밸런싱 시점</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {rebalancingTiming.map((timing, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </div>
                  <span className="text-sm">{timing}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-medium">리밸런싱 예시</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>자산</TableHead>
                  <TableHead>목표 비율</TableHead>
                  <TableHead>현재 비율</TableHead>
                  <TableHead>조정</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>S&P500 ETF</TableCell>
                  <TableCell>70%</TableCell>
                  <TableCell className="text-red-600">80%</TableCell>
                  <TableCell className="text-red-600">-10% 매도</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>채권 ETF</TableCell>
                  <TableCell>30%</TableCell>
                  <TableCell className="text-green-600">20%</TableCell>
                  <TableCell className="text-green-600">+10% 매수</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
