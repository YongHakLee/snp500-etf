import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { HistoricalChartSection } from '@/components/home/HistoricalChartSection'
import { BookOpen, BarChart3, Compass, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

import usEtfData from '@/data/us-etf.json'
import historicalData from '@/data/historical-returns.json'

import type { USEtf, HistoricalReturn } from '@/types'

// 타입 단언
const etfs = usEtfData.etfs as USEtf[]
const returns = historicalData.returns as HistoricalReturn[]

// 최신 수익률 데이터 (안전한 배열 접근)
const latestReturn = returns.length > 0 ? returns[returns.length - 1] : null
const previousReturn = returns.length > 1 ? returns[returns.length - 2] : null

// 빠른 비교표용 ETF (SPY, VOO, IVV)
const quickCompareEtfs = etfs.filter(etf => ['SPY', 'VOO', 'IVV'].includes(etf.ticker))

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Section 1: 히어로 섹션 */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              주식 초보자를 위한 완벽 가이드
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              S&P500 ETF 투자,
              <br />
              <span className="text-primary">쉽게 시작하세요</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              미국 500대 기업에 한 번에 투자하는 방법.
              <br className="hidden md:block" />
              ETF 비교부터 첫 매수까지, 초보자도 쉽게 따라할 수 있습니다.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/guide">
                  시작하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/compare">ETF 비교하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: S&P500 현황 카드 */}
      {latestReturn && (
        <section className="py-12 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
          <div className="container">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">S&P500 수익률 현황</CardTitle>
                <CardDescription>
                  {latestReturn.year}년 기준 | 최근 11년 데이터
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 수익률 요약 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {latestReturn.return >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        연간 수익률
                      </div>
                      <div className={`mt-1 text-2xl font-bold ${latestReturn.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {latestReturn.return >= 0 ? '+' : ''}{latestReturn.return}%
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {latestReturn.year}년
                      </div>
                    </div>
                    <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        누적 수익률
                      </div>
                      <div className="mt-1 text-2xl font-bold text-blue-600">
                        +{latestReturn.cumulativeReturn}%
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        11년간 (2014~{latestReturn.year})
                      </div>
                    </div>
                  </div>
                  {/* 미니 차트 - Lazy Loading */}
                  <HistoricalChartSection data={returns} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Section 3: 주요 섹션 미리보기 */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">무엇을 알아볼까요?</h2>
            <p className="mt-2 text-muted-foreground">
              S&P500 ETF 투자에 필요한 모든 정보를 한 곳에서
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* 기초 지식 카드 */}
            <Link href="/basics" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    S&P500 기초 지식
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    S&P500 지수와 ETF의 기초를 배워보세요.
                    왜 많은 투자자들이 선택하는지 알아봅니다.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* ETF 비교 카드 */}
            <Link href="/compare" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    ETF 비교 분석
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    SPY, VOO, IVV 등 주요 ETF를 비교합니다.
                    나에게 맞는 ETF를 찾아보세요.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 투자 가이드 카드 */}
            <Link href="/guide" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Compass className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    투자 가이드
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    계좌 개설부터 첫 매수, 세금까지.
                    단계별로 따라하는 투자 가이드입니다.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: 빠른 비교표 */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">주요 ETF 비교</h2>
            <p className="mt-2 text-muted-foreground">
              가장 인기 있는 S&P500 ETF 3종 비교
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>티커</TableHead>
                    <TableHead>운용사</TableHead>
                    <TableHead className="text-right">보수율</TableHead>
                    <TableHead className="text-right">5년 수익률</TableHead>
                    <TableHead className="hidden md:table-cell">추천 대상</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quickCompareEtfs.map((etf) => (
                    <TableRow key={etf.ticker}>
                      <TableCell className="font-bold">{etf.ticker}</TableCell>
                      <TableCell>{etf.provider}</TableCell>
                      <TableCell className="text-right">
                        {etf.expenseRatio.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        +{etf.return5Y}%
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {etf.targetAudience}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button asChild variant="link">
                  <Link href="/compare/us-etf">
                    전체 비교 보기
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 5: 시작하기 CTA */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              지금 바로 시작하세요
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              투자 초보자도 쉽게 따라할 수 있는 단계별 가이드.
              <br />
              첫 ETF 매수까지 차근차근 안내해 드립니다.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/guide/first-buy">
                  첫 매수 가이드 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/basics">기초부터 알아보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
