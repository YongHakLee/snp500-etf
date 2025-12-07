"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Disclaimer } from "@/components/common/Disclaimer";
import { DataStatus } from "@/components/common/DataStatus";
import { ETFComparisonTable } from "@/components/etf/ETFComparisonTable";
import { LazyExpenseAumChart } from "@/components/compare/LazyExpenseAumChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUSEtfs } from "@/hooks";
import type { ExpenseAumChartData } from "@/types";

// 추천 시나리오 데이터
const recommendations = [
  {
    title: "장기 투자자",
    icon: TrendingUp,
    recommended: "VOO 또는 SPYM",
    description:
      "10년 이상 장기 투자를 계획한다면 보수율이 낮은 VOO(0.03%)나 SPYM(0.02%)가 적합합니다. 보수율 차이가 장기간 복리로 큰 차이를 만들어냅니다.",
    color: "bg-accent-orange-muted border-accent-orange/30",
  },
  {
    title: "액티브 트레이더",
    icon: Zap,
    recommended: "SPY",
    description:
      "단기 매매나 옵션 거래를 한다면 유동성이 가장 높은 SPY가 적합합니다. 스프레드가 가장 좁고 거래량이 압도적입니다.",
    color:
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  },
];

// ETF 소개 데이터
const etfIntroductions = [
  {
    ticker: "SPY",
    provider: "State Street",
    tagline: "최초의 S&P500 ETF, 옵션/단기 매매에 최적",
    badges: [{ label: "최고 유동성", variant: "default" as const }],
    highlight: false,
  },
  {
    ticker: "VOO",
    provider: "Vanguard",
    tagline: "장기 투자자 1순위, 초저비용",
    badges: [{ label: "추천", variant: "default" as const }],
    highlight: true,
  },
  {
    ticker: "IVV",
    provider: "BlackRock",
    tagline: "기관 투자자 선호, VOO와 동일한 보수율",
    badges: [{ label: "기관 선호", variant: "secondary" as const }],
    highlight: false,
  },
  {
    ticker: "SPYM",
    provider: "State Street",
    tagline: "가장 낮은 보수율, 적립식 투자에 적합",
    badges: [{ label: "최저 보수율", variant: "outline" as const }],
    highlight: false,
  },
];

// AUM 문자열을 십억 달러 단위로 변환
function parseAumToBillions(aum: string): number {
  const value = parseFloat(aum);
  if (aum.includes("T")) return value * 1000; // 1.4T → 1400
  if (aum.includes("B")) return value; // 672.7B → 672.7
  if (aum.includes("M")) return value / 1000; // 100M → 0.1
  return value;
}

/**
 * AUM을 한국어 형식으로 변환 ($ 기호 포함)
 * "672.7B" → "$6,727억"
 * "1.4T" → "$1조 4,000억"
 */
function formatAumToKorean(aum: string): string {
  const billions = parseAumToBillions(aum);
  // 1B = 10억 달러
  const 억 = billions * 10;

  if (억 >= 10000) {
    // 1조 이상
    const 조 = Math.floor(억 / 10000);
    const 나머지억 = Math.round(억 % 10000);
    if (나머지억 > 0) {
      return `$${조}조 ${나머지억.toLocaleString()}억`;
    }
    return `$${조}조`;
  }

  return `$${Math.round(억).toLocaleString()}억`;
}

export function USETFContent() {
  const { etfs, isLive, lastUpdated } = useUSEtfs();

  // 보수율 + 순자산 듀얼 차트용 데이터 변환
  const expenseAumChartData: ExpenseAumChartData[] = useMemo(() => {
    return etfs.map((etf) => ({
      ticker: etf.ticker,
      name: etf.name,
      expenseRatio: etf.expenseRatio, // 이미 퍼센트 값 (0.03 = 0.03%)
      aumBillions: parseAumToBillions(etf.aum),
      aumDisplay: formatAumToKorean(etf.aum),
      isOptimal: etf.ticker === "VOO", // VOO = 최적 선택
    }));
  }, [etfs]);

  return (
    <div className="container py-10">
      <PageHeader
        title="미국 ETF"
        description="SPY, VOO, IVV, SPYM 등 미국 상장 S&P500 ETF를 보수율, 거래량, 수익률 기준으로 비교합니다."
        breadcrumbs={[
          { label: "ETF 비교", href: "/compare" },
          { label: "미국 ETF", href: "/compare/us-etf" },
        ]}
      />

      {/* 탭 네비게이션 */}
      <div className="mb-8 flex border-b">
        <Link
          href="/compare/us-etf"
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            "border-accent-orange text-accent-orange"
          )}
        >
          미국 ETF
        </Link>
        <Link
          href="/compare/kr-etf"
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
          )}
        >
          한국 ETF
        </Link>
      </div>

      <div className="space-y-8">
        {/* S&P500 ETF 알아보기 */}
        <SectionCard
          title="S&P500 ETF 알아보기"
          description="미국에 상장된 대표적인 S&P500 추종 ETF 4종을 소개합니다."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {etfIntroductions.map((etf) => (
              <div
                key={etf.ticker}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  etf.highlight && "border-accent-orange/50 bg-accent-orange-muted"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{etf.ticker}</h3>
                    <p className="text-xs text-muted-foreground">
                      {etf.provider}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {etf.badges.map((badge, idx) => (
                      <Badge
                        key={idx}
                        variant={badge.variant}
                        className="text-xs"
                      >
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {etf.tagline}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ETF 비교 테이블 */}
        <SectionCard
          title="미국 S&P500 ETF 비교"
          description="미국에 상장된 주요 S&P500 추종 ETF입니다. 헤더를 클릭하여 정렬할 수 있습니다."
        >
          <div className="mb-4 flex justify-end">
            <DataStatus isLive={isLive} lastUpdated={lastUpdated} />
          </div>
          <ETFComparisonTable
            data={etfs}
            type="us"
            highlightTickers={["VOO"]}
          />
          <div className="mt-4 text-sm text-muted-foreground space-y-1 border-t pt-4">
            <p>
              * <strong>보수율</strong>: ETF 운용사에 지불하는 연간 수수료율.
              낮을수록 장기 투자에 유리
            </p>
            <p>
              * <strong>순자산 (AUM)</strong>: 펀드에 투자된 총 자산 규모.
              클수록 유동성이 좋고 안정적
            </p>
            <p>
              * <strong>5년 연평균 수익률 (CAGR)</strong>: 연평균 복리 수익률로,
              투자 성과를 연 단위로 비교할 때 사용
            </p>
            <p>
              * <strong>5년 누적 수익률</strong>: 5년간 총 수익률로, 실제 투자
              시 얻을 수 있는 총 수익을 의미
            </p>
            <p>
              * <strong>대상 투자자</strong>: 해당 ETF가 적합한 투자자 유형
            </p>
          </div>
        </SectionCard>

        {/* 보수율 및 순자산 비교 차트 */}
        <SectionCard
          title="보수율 및 순자산 비교"
          description="ETF별 연간 보수율과 순자산 규모를 시각적으로 비교합니다. 낮은 보수율과 큰 순자산 규모가 장기투자에 유리합니다."
        >
          <LazyExpenseAumChart data={expenseAumChartData} />

          {/* 추천 안내 박스 */}
          <div className="mt-6 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
              <div>
                <h3 className="font-semibold text-orange-700 dark:text-orange-300">
                  장기투자에 최적인 ETF 선택 기준
                </h3>
                <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                  <strong>낮은 보수율 + 큰 순자산 규모</strong>가 이상적입니다.
                  <strong className="ml-1">VOO</strong>는 0.03%의 낮은 보수율과
                  1.4조 달러의 압도적인 순자산으로 장기 투자자에게 최적입니다.
                </p>
                <p className="mt-2 text-xs text-orange-500 dark:text-orange-500">
                  * 1억원을 10년간 투자할 경우, SPY(0.0945%) 대비 VOO(0.03%)로
                  약 65만원 이상의 비용을 절감할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 추천 시나리오 */}
        <SectionCard
          title="투자 유형별 추천"
          description="투자 목적에 따라 적합한 ETF가 다릅니다."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <div
                  key={rec.title}
                  className={cn("rounded-lg border p-4", rec.color)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="font-medium">{rec.title}</h3>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-accent-orange">
                    추천: {rec.recommended}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* 주의사항 */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>미국 ETF 투자 시 고려사항</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              • <strong>환율 영향</strong>: 달러로 거래되므로 환율 변동에
              노출됩니다.
            </p>
            <p>
              • <strong>세금</strong>: 양도소득 연간 250만원 초과분에 22%
              과세됩니다.
            </p>
            <p>
              • <strong>배당세</strong>: 미국 배당소득세 15%가 원천징수됩니다.
            </p>
            <p>
              • <strong>거래 시간</strong>: 한국 시간 기준 밤 11:30 ~ 새벽 6:00
              (서머타임 시 변동)
            </p>
          </AlertDescription>
        </Alert>

        {/* 면책조항 */}
        <Disclaimer />
      </div>
    </div>
  );
}
