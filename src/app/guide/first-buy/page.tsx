import type { Metadata } from 'next'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Search, CheckCircle2, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: '첫 ETF 매수 가이드',
  description: 'ETF 검색 방법, 시장가/지정가 주문, 매수 단계별 가이드와 주의사항을 알아보세요.',
  openGraph: {
    title: '첫 ETF 매수 가이드',
    description: 'ETF 검색부터 매수까지 단계별 가이드.',
  },
}

// ETF 검색 방법
const searchMethods = [
  {
    title: '티커(종목코드)로 검색',
    description: '미국 ETF는 영문 티커(SPY, VOO 등), 한국 ETF는 6자리 숫자 코드로 검색합니다.',
    examples: ['SPY (미국)', 'VOO (미국)', '360750 (TIGER 미국S&P500)', '379800 (KODEX 미국S&P500TR)'],
  },
  {
    title: '종목명으로 검색',
    description: '키워드를 입력하여 원하는 ETF를 찾을 수 있습니다.',
    examples: ['S&P500', 'TIGER 미국', 'KODEX 미국', 'Vanguard S&P'],
  },
]

// 주문 유형
const orderTypes = [
  {
    type: '시장가 주문',
    description: '현재 시장에서 형성된 가격으로 즉시 체결되는 주문 방식입니다.',
    pros: ['빠른 체결 보장', '주문 즉시 거래 완료', '초보자에게 적합'],
    cons: ['예상과 다른 가격에 체결될 수 있음', '변동성 큰 시간대에 불리할 수 있음'],
    recommended: true,
  },
  {
    type: '지정가 주문',
    description: '원하는 가격을 직접 지정하여 해당 가격 이하(매수)/이상(매도)일 때만 체결됩니다.',
    pros: ['원하는 가격에 거래 가능', '가격 통제 가능'],
    cons: ['체결되지 않을 수 있음', '시장 상황 판단 필요'],
    recommended: false,
  },
]

// 매수 단계 (Accordion)
const buySteps = [
  {
    id: 'step-1',
    title: 'Step 1: 증권사 앱에서 ETF 검색',
    content: `
      1. 증권사 앱 실행 후 로그인합니다.
      2. 검색창에서 원하는 ETF를 검색합니다.
      3. 검색 결과에서 정확한 종목을 선택합니다.

      💡 팁: 미국 ETF는 '해외주식' 메뉴에서, 한국 ETF는 '국내주식' 메뉴에서 검색하세요.
    `,
  },
  {
    id: 'step-2',
    title: 'Step 2: 종목 정보 확인',
    content: `
      1. 현재가와 등락률을 확인합니다.
      2. 거래량을 확인합니다 (거래량이 많을수록 좋습니다).
      3. 보수율(운용비용)을 확인합니다.

      💡 팁: ETF 상세 정보에서 추적 지수와 운용사 정보도 확인하세요.
    `,
  },
  {
    id: 'step-3',
    title: 'Step 3: 주문 화면 진입',
    content: `
      1. '매수' 또는 '사기' 버튼을 클릭합니다.
      2. 주문 유형을 선택합니다 (초보자는 시장가 추천).
      3. 매수할 수량을 입력합니다.

      💡 팁: 처음에는 소액으로 1~2주만 구매해보며 과정을 익히세요.
    `,
  },
  {
    id: 'step-4',
    title: 'Step 4: 주문 확인 및 체결',
    content: `
      1. 주문 내용(종목, 수량, 가격)을 최종 확인합니다.
      2. 비밀번호 또는 생체인증을 진행합니다.
      3. '주문' 버튼을 클릭하여 주문을 제출합니다.
      4. 체결 완료 알림을 확인합니다.

      💡 팁: 주문 내역에서 체결 여부를 확인할 수 있습니다.
    `,
  },
]

// 주의사항
const warnings = [
  '미국 ETF는 미국 시장 거래 시간(한국 시간 23:30~06:00, 서머타임 시 22:30~05:00)에만 거래 가능합니다.',
  '첫 매수는 소액으로 시작하여 거래 과정에 익숙해지세요.',
  '해외 ETF 매수 시 환전이 필요할 수 있습니다. 증권사마다 자동환전/수동환전 설정이 다릅니다.',
  '주문 전 예수금(투자 가능 금액)이 충분한지 확인하세요.',
  '장 시작 직후나 마감 직전에는 변동성이 클 수 있어 주의가 필요합니다.',
]

export default function FirstBuyPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="첫 매수"
        description="ETF를 처음 매수하는 분들을 위한 단계별 가이드입니다."
        breadcrumbs={[
          { label: '투자 가이드', href: '/guide' },
          { label: '첫 매수', href: '/guide/first-buy' },
        ]}
      />

      <div className="space-y-8">
        {/* ETF 검색 방법 */}
        <SectionCard
          title="ETF 검색 방법"
          description="원하는 ETF를 찾는 두 가지 방법을 알아보세요."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {searchMethods.map((method) => (
              <Card key={method.title}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  <div>
                    <p className="mb-2 text-sm font-medium">검색 예시:</p>
                    <div className="flex flex-wrap gap-2">
                      {method.examples.map((example) => (
                        <Badge key={example} variant="outline" className="font-mono">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionCard>

        {/* 주문 유형 */}
        <SectionCard
          title="주문 유형"
          description="시장가와 지정가, 두 가지 주문 방식의 차이를 이해하세요."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {orderTypes.map((order) => (
              <Card
                key={order.type}
                className={order.recommended ? 'border-primary' : ''}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{order.type}</CardTitle>
                    {order.recommended && (
                      <Badge variant="default">초보자 추천</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{order.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-sm font-medium text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      장점
                    </p>
                    <ul className="space-y-1">
                      {order.pros.map((pro) => (
                        <li key={pro} className="text-sm text-muted-foreground">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-sm font-medium text-red-600">
                      <XCircle className="h-4 w-4" />
                      단점
                    </p>
                    <ul className="space-y-1">
                      {order.cons.map((con) => (
                        <li key={con} className="text-sm text-muted-foreground">
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionCard>

        {/* 매수 단계별 가이드 */}
        <SectionCard
          title="매수 단계별 가이드"
          description="처음 ETF를 매수하는 과정을 단계별로 알아보세요."
        >
          <Accordion type="single" collapsible className="w-full">
            {buySteps.map((step) => (
              <AccordionItem key={step.id} value={step.id}>
                <AccordionTrigger className="text-left">
                  {step.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="whitespace-pre-line rounded-lg bg-muted/50 p-4 text-sm">
                    {step.content.trim()}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionCard>

        {/* 주의사항 Alert */}
        <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:border-yellow-500/30 dark:bg-yellow-950 dark:text-yellow-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>매수 전 주의사항</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-2">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm">
                  • {warning}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
