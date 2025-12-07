"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HistoricalChartSection } from "@/components/home/HistoricalChartSection";
import { QuickNavigation } from "@/components/home/QuickNavigation";
import { DataStatus } from "@/components/common/DataStatus";
import {
  TimeRangeSelector,
  type TimeRange,
} from "@/components/common/TimeRangeSelector";
import {
  BookOpen,
  BarChart3,
  Compass,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import { useUSEtfs, useHistoricalReturns } from "@/hooks";

// 무엇을 알아볼까요? 섹션 데이터
const sections = [
  {
    value: "basics",
    title: "S&P500 기초 지식",
    href: "/basics",
    icon: BookOpen,
    description: "S&P500 지수와 ETF의 기초를 배워보세요.",
    items: [
      { label: "S&P500이란?", href: "/basics/what-is-sp500" },
      { label: "ETF 기초", href: "/basics/etf-basics" },
      { label: "왜 투자하나?", href: "/basics/why-invest" },
    ],
  },
  {
    value: "compare",
    title: "ETF 비교 분석",
    href: "/compare",
    icon: BarChart3,
    description: "주요 ETF를 비교하고 나에게 맞는 상품을 찾아보세요.",
    items: [
      { label: "미국 ETF", href: "/compare/us-etf" },
      { label: "한국 ETF", href: "/compare/kr-etf" },
    ],
  },
  {
    value: "guide",
    title: "투자 가이드",
    href: "/guide",
    icon: Compass,
    description: "계좌 개설부터 첫 매수까지 단계별로 안내합니다.",
    items: [
      { label: "계좌 개설", href: "/guide/account" },
      { label: "첫 매수", href: "/guide/first-buy" },
      { label: "투자 전략", href: "/guide/strategy" },
      { label: "세금 안내", href: "/guide/tax" },
    ],
  },
];

export default function HomePage() {
  // 기간 선택 상태 (기본값: 10년)
  const [timeRange, setTimeRange] = useState<TimeRange>("10y");

  // 커스텀 훅으로 데이터 가져오기
  const { etfs, isLive: isEtfLive, lastUpdated: etfLastUpdated } = useUSEtfs();
  const {
    returns,
    summary,
    isLive: isReturnsLive,
    lastUpdated: returnsLastUpdated,
  } = useHistoricalReturns(timeRange);

  // 계산된 값들
  const { latestReturn, quickCompareEtfs } = useMemo(() => {
    const latestReturn =
      returns.length > 0 ? returns[returns.length - 1] : null;
    const quickCompareEtfs = etfs.filter((etf) =>
      ["SPY", "VOO", "IVV"].includes(etf.ticker)
    );

    return { latestReturn, quickCompareEtfs };
  }, [etfs, returns]);

  return (
    <div className="flex flex-col">
      {/* Section 1: 히어로 섹션 */}
      <section className="py-12 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              주식 초보자를 위한 완벽 가이드
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              S&P500 ETF 투자,
              <br />
              <span className="text-accent-orange">쉽게 시작하세요</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
              미국 500대 기업에 한 번에 투자하는 방법.
              <br className="hidden md:block" />
              ETF 비교부터 첫 매수까지, 초보자도 쉽게 따라할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation 바 */}
      <QuickNavigation />

      {/* Section 2: 무엇을 알아볼까요? (카드 그리드) */}
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="mb-8 text-center md:mb-10">
            <h2 className="text-2xl font-bold md:text-3xl">
              무엇을 알아볼까요?
            </h2>
            <p className="mt-2 text-muted-foreground">
              S&P500 ETF 투자에 필요한 모든 정보를 한 곳에서
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card
                  key={section.value}
                  className="group hover:shadow-lg hover:border-accent-orange/50 hover:scale-[1.02] transition-all duration-200"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-orange text-accent-orange-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <Link
                          href={section.href}
                          className="hover:text-accent-orange transition-colors"
                        >
                          <CardTitle className="text-lg">
                            {section.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="text-sm">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                    <CardAction>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-accent-orange hover:text-accent-orange"
                      >
                        <Link href={section.href}>
                          시작하기
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-2 rounded-md px-3 py-3 min-h-[44px] text-sm hover:bg-muted hover:text-accent-orange active:bg-muted/80 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: S&P500 장기 수익률 */}
      {latestReturn && (
        <section className="py-12 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
          <div className="container">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      S&P500 장기 수익률
                    </CardTitle>
                    <CardDescription>
                      지난 {summary.totalYears}년간 S&P500의 연간 및 누적 수익률
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <TimeRangeSelector
                      value={timeRange}
                      onChange={setTimeRange}
                    />
                    <DataStatus
                      isLive={isReturnsLive}
                      lastUpdated={returnsLastUpdated}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* 차트 */}
                <div className="mb-6">
                  <HistoricalChartSection data={returns} />
                </div>
                {/* 4개 통계 카드 (why-invest 스타일) */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      최근 연간 수익률
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        latestReturn.return >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {latestReturn.return >= 0 ? "+" : ""}
                      {latestReturn.return}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {latestReturn.year}년
                    </p>
                  </div>
                  <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                    <p className="text-sm text-muted-foreground">누적 수익률</p>
                    <p className="text-2xl font-bold text-accent-orange">
                      +{latestReturn.cumulativeReturn.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {returns[0]?.year}년 이후
                    </p>
                  </div>
                  <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      평균 연간 수익률
                    </p>
                    <p className="text-2xl font-bold">
                      +{summary.avgAnnualReturn}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {summary.totalYears}년 평균
                    </p>
                  </div>
                  <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      수익 발생 연도
                    </p>
                    <p className="text-2xl font-bold">
                      {summary.positiveYears}/{summary.totalYears}년
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(
                        (summary.positiveYears / summary.totalYears) *
                        100
                      ).toFixed(0)}
                      % 확률
                    </p>
                  </div>
                </div>
                {/* 최고/최저 연도 표시 */}
                {summary.bestYear && summary.worstYear && (
                  <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
                    <span className="text-green-600">
                      최고: {summary.bestYear.year}년 (+
                      {summary.bestYear.return}%)
                    </span>
                    <span className="text-red-600">
                      최저: {summary.worstYear.year}년 (
                      {summary.worstYear.return}%)
                    </span>
                  </div>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  * 과거 수익률이 미래 수익률을 보장하지 않습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Section 4: 빠른 비교표 */}
      <section className="py-10 md:py-12 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        <div className="container">
          <div className="mb-6 md:mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold md:text-2xl">주요 ETF 비교</h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                가장 인기 있는 S&P500 ETF 3종 비교
              </p>
            </div>
            <DataStatus
              isLive={isEtfLive}
              lastUpdated={etfLastUpdated}
              className="hidden md:flex"
            />
          </div>

          {/* 데스크톱: 테이블 */}
          <Card className="hidden md:block">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>티커</TableHead>
                    <TableHead>운용사</TableHead>
                    <TableHead className="text-right">보수율</TableHead>
                    <TableHead className="text-right">5년 수익률</TableHead>
                    <TableHead>추천 대상</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quickCompareEtfs.map((etf) => (
                    <TableRow key={etf.ticker}>
                      <TableCell className="font-bold">{etf.ticker}</TableCell>
                      <TableCell>{etf.provider}</TableCell>
                      <TableCell className="text-right">
                        {etf.expenseRatio.toFixed(4)}%
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        +{etf.return5Y}%
                      </TableCell>
                      <TableCell className="text-muted-foreground">
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

          {/* 모바일: 카드 레이아웃 */}
          <div className="space-y-4 md:hidden">
            <DataStatus
              isLive={isEtfLive}
              lastUpdated={etfLastUpdated}
              className="mb-4"
            />
            {quickCompareEtfs.map((etf) => (
              <Card key={etf.ticker}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{etf.ticker}</CardTitle>
                    <Badge variant="outline" className="text-green-600">
                      +{etf.return5Y}%
                    </Badge>
                  </div>
                  <CardDescription>{etf.provider}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">보수율: </span>
                    <span className="font-medium">
                      {etf.expenseRatio.toFixed(4)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">5년 수익률: </span>
                    <span className="font-medium text-green-600">
                      +{etf.return5Y}%
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">추천 대상: </span>
                    <span className="font-medium">{etf.targetAudience}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-center pt-2">
              <Button asChild variant="link">
                <Link href="/compare/us-etf">
                  전체 비교 보기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
