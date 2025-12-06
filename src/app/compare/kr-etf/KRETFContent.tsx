"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Disclaimer } from "@/components/common/Disclaimer";
import { DataStatus } from "@/components/common/DataStatus";
import { ETFComparisonTable } from "@/components/etf/ETFComparisonTable";
import { LazyKRExpenseAumChart } from "@/components/compare/LazyKRExpenseAumChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { KRExpenseAumChartData } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  RefreshCw,
  Info,
  Check,
  X,
  Landmark,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useKREtfs } from "@/hooks";

// 세금 비교 데이터 (4열: 구분, 해외 직접투자, ISA, 연금)
const taxComparison = [
  {
    category: "양도소득세",
    overseas: "250만원 초과 시 22%",
    isa: "200만원 비과세, 초과분 9.9%",
    pension: "연금 수령 시 저율 과세",
  },
  {
    category: "배당소득세",
    overseas: "15% 원천징수 (미국)",
    isa: "비과세 (한도 내)",
    pension: "비과세 (연금 수령 시 과세)",
  },
  {
    category: "종합소득 합산",
    overseas: "금융소득 2천만원 초과 시",
    isa: "분리과세",
    pension: "분리과세",
  },
];

// 순자산 억원 → 원화 기호 조원 표시 변환
const formatAumToKorean = (aumBillion: number): string => {
  if (aumBillion >= 10000) {
    return `₩${(aumBillion / 10000).toFixed(1)}조`;
  }
  return `₩${aumBillion.toLocaleString()}억`;
};

// 상위 4개 ETF 티커 (AUM 기준: TIGER > KODEX > RISE > ACE)
const TOP_4_TICKERS = ["360750", "379800", "379780", "360200"];

export function KRETFContent() {
  const { etfs, isLive, lastUpdated } = useKREtfs();

  // 차트용 데이터 변환 (상위 4개 ETF만)
  const krExpenseAumChartData: KRExpenseAumChartData[] = useMemo(() => {
    return etfs
      .filter((etf) => TOP_4_TICKERS.includes(etf.ticker))
      .sort((a, b) => b.aum - a.aum) // AUM 내림차순
      .map((etf) => ({
        ticker: etf.ticker,
        name: etf.name,
        actualExpenseRatio: etf.actualExpenseRatio ?? 0,
        aumBillions: etf.aum,
        aumDisplay: formatAumToKorean(etf.aum),
        isOptimal: etf.ticker === "360750", // TIGER
      }));
  }, [etfs]);

  return (
    <div className="container py-10">
      <PageHeader
        title="한국 ETF"
        description="TIGER, KODEX, ACE 등 한국 상장 S&P500 ETF를 규모, 보수율, 배당, 환헤지 측면에서 비교합니다."
        breadcrumbs={[
          { label: "ETF 비교", href: "/compare" },
          { label: "한국 ETF", href: "/compare/kr-etf" },
        ]}
      />

      {/* 탭 네비게이션 */}
      <div className="mb-8 flex border-b">
        <Link
          href="/compare/us-etf"
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
          )}
        >
          미국 ETF
        </Link>
        <Link
          href="/compare/kr-etf"
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            "border-primary text-primary"
          )}
        >
          한국 ETF
        </Link>
      </div>

      <div className="space-y-8">
        {/* ETF 비교 테이블 */}
        <SectionCard
          title="한국 상장 S&P500 ETF 비교"
          description="한국 증시에 상장된 S&P500 추종 ETF입니다. 순자산 규모, 보수율, 환헤지 여부를 확인하세요."
        >
          <div className="mb-4 flex justify-end">
            <DataStatus
              isLive={isLive}
              lastUpdated={lastUpdated}
              staticDataDate="2025년 12월 금융투자협회 공시"
            />
          </div>
          <ETFComparisonTable
            data={etfs}
            type="kr"
            highlightTickers={["360750"]}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            * TIGER 미국S&P500(360750)은 국내 최대 규모(약 10조원)로 유동성이
            풍부하며, 아시아 최대 S&P500 ETF입니다.
          </p>
        </SectionCard>

        {/* 실부담비용 및 순자산 비교 차트 */}
        <SectionCard
          title="실부담비용 및 순자산 비교"
          description="주요 한국 상장 S&P500 ETF의 실부담비용과 순자산을 비교합니다. (2025년 12월 금융투자협회 공시 기준)"
        >
          <LazyKRExpenseAumChart data={krExpenseAumChartData} />
        </SectionCard>

        {/* 주요 ETF 상세 비교 */}
        <SectionCard
          title="주요 ETF 상세 비교"
          description="국내 대표 S&P500 ETF의 핵심 지표를 비교합니다."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">항목</TableHead>
                  <TableHead>TIGER 미국S&P500</TableHead>
                  <TableHead>KODEX 미국S&P500</TableHead>
                  <TableHead>ACE 미국S&P500</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">순자산</TableCell>
                  <TableCell className="text-green-600 dark:text-green-400 font-bold">
                    ₩9.9조 (1위)
                  </TableCell>
                  <TableCell>₩5.5조</TableCell>
                  <TableCell>₩2조</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">총보수</TableCell>
                  <TableCell>0.0068%</TableCell>
                  <TableCell className="text-green-600 dark:text-green-400">
                    0.0062% (최저)
                  </TableCell>
                  <TableCell>0.0068%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">실부담비용</TableCell>
                  <TableCell className="text-green-600 dark:text-green-400">
                    0.121% (최저)
                  </TableCell>
                  <TableCell>0.162%</TableCell>
                  <TableCell>0.174%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">거래량</TableCell>
                  <TableCell className="text-green-600 dark:text-green-400 font-bold">
                    최대 (유동성 우수)
                  </TableCell>
                  <TableCell>양호</TableCell>
                  <TableCell>보통</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium flex items-center gap-2">
              TIGER 미국S&P500이 인기 있는 이유
            </h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• 국내 최초 미국 S&P500 현물형 ETF (한국판 VOO)</li>
              <li>• 아시아에서 가장 큰 S&P500 ETF로 압도적 유동성</li>
              <li>• 개인 투자자 누적 순매수 5조원 돌파 (국내 1위)</li>
              <li>• 총보수보다 실부담비용이 낮아 장기투자에 유리</li>
            </ul>
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
                환율 변동 위험을 줄여주는 상품입니다. 원/달러 환율이 하락할
                것으로 예상될 때 유리합니다.
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
                예시: TIGER 미국S&P500(H) - 448290
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">환오픈 (비헤지)</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                환율 변동에 그대로 노출됩니다. 장기적으로 원화 약세가 예상될 때
                유리합니다.
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
              장기 투자자라면 환오픈이 일반적으로 유리합니다. 환헤지 비용이
              장기간 누적되면 수익률에 큰 영향을 미칩니다. 단, 환율이 고점이라고
              판단될 때는 환헤지를 고려해볼 수 있습니다.
            </AlertDescription>
          </Alert>
        </SectionCard>

        {/* 세금 비교 섹션 */}
        <SectionCard
          title="투자 계좌별 세금 비교"
          description="해외 직접투자와 절세 계좌(ISA, 연금)의 세금을 비교합니다."
        >
          {/* 간소화된 4열 테이블 */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">구분</TableHead>
                  <TableHead>해외 직접투자</TableHead>
                  <TableHead className="bg-blue-50/50 dark:bg-blue-900/20">
                    <div className="flex flex-col">
                      <span>ISA 계좌</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        (국내 ETF)
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="bg-blue-50/50 dark:bg-blue-900/20">
                    <div className="flex flex-col">
                      <span>연금계좌</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        (국내 ETF)
                      </span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxComparison.map((row) => (
                  <TableRow key={row.category}>
                    <TableCell className="font-medium">
                      {row.category}
                    </TableCell>
                    <TableCell className="text-sm">{row.overseas}</TableCell>
                    <TableCell className="text-sm text-green-600 dark:text-green-400 bg-blue-50/30 dark:bg-blue-900/10">
                      {row.isa}
                    </TableCell>
                    <TableCell className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/10">
                      {row.pension}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ISA/연금계좌 안내 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* ISA 계좌 카드 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Landmark className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ISA 계좌
                </CardTitle>
                <CardDescription>
                  국내 상장 S&P500 ETF로 절세 투자
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 연간 2,000만원까지 납입 가능</li>
                  <li>• 200만원(서민형 400만원)까지 비과세</li>
                  <li>• 초과분은 9.9% 분리과세</li>
                  <li className="text-orange-600 dark:text-orange-400 font-medium">
                    • 3년 이상 유지 필수
                  </li>
                </ul>
                <p className="mt-4 text-xs text-muted-foreground border-t pt-3">
                  ISA에서는 TIGER, KODEX 등 국내 상장 S&P500 ETF만 매수
                  가능합니다.
                </p>
              </CardContent>
            </Card>

            {/* 연금계좌 카드 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  연금계좌
                </CardTitle>
                <CardDescription>
                  세액공제와 저율 과세로 장기 투자
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• IRP, 연금저축펀드에서 투자 가능</li>
                  <li>• 세액공제 혜택 (최대 148.5만원)</li>
                  <li>• 연금 수령 시 저율 과세 (3.3~5.5%)</li>
                  <li className="text-orange-600 dark:text-orange-400 font-medium">
                    • 55세 이후 연금으로 수령해야 혜택 유지
                  </li>
                </ul>
                <p className="mt-4 text-xs text-muted-foreground border-t pt-3">
                  연금계좌에서도 국내 상장 S&P500 ETF로 투자해야 합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </SectionCard>

        {/* 주의사항 */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>한국 ETF 투자 시 고려사항</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              • <strong>절세 전략</strong>: ISA/연금계좌에서 투자하면 세금 혜택
            </p>
            <p>
              • <strong>환율</strong>: 환오픈 상품은 원/달러 환율에 영향받음
            </p>
            <p>
              • <strong>거래 시간</strong>: 한국 증시 개장 시간(09:00~15:30)에
              거래
            </p>
            <p>
              • <strong>최소 투자금</strong>: 1주 단위로 매수 가능, 주당 1~2만원
              수준
            </p>
          </AlertDescription>
        </Alert>

        {/* 면책조항 */}
        <Disclaimer />
      </div>
    </div>
  );
}
