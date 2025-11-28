'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import usEtfData from '@/data/us-etf.json'
import krEtfData from '@/data/kr-etf.json'

// 통합 ETF 타입 (계산기용)
interface CalculatorEtf {
  ticker: string
  name: string
  expenseRatio: number
  type: 'US' | 'KR'
}

// ETF 데이터 통합
const allEtfs: CalculatorEtf[] = [
  ...usEtfData.etfs.map((etf) => ({
    ticker: etf.ticker,
    name: etf.name,
    expenseRatio: etf.expenseRatio,
    type: 'US' as const,
  })),
  ...krEtfData.etfs.map((etf) => ({
    ticker: etf.ticker,
    name: etf.name,
    expenseRatio: etf.expenseRatio,
    type: 'KR' as const,
  })),
]

// 차트 색상 설정
const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function ExpenseCalculator() {
  // 상태 관리
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000000)
  const [selectedEtfs, setSelectedEtfs] = useState<string[]>(['VOO', 'SPY'])
  const [years, setYears] = useState<number>(10)
  const [expectedReturn, setExpectedReturn] = useState<number>(10) // 예상 연간 수익률 (%)

  // 투자 금액 입력 처리
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '')
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 0) {
      setInvestmentAmount(numValue)
    } else if (value === '') {
      setInvestmentAmount(0)
    }
  }

  // ETF 선택 토글
  const handleEtfToggle = (ticker: string, checked: boolean) => {
    if (checked) {
      if (selectedEtfs.length < 4) {
        setSelectedEtfs([...selectedEtfs, ticker])
      }
    } else {
      if (selectedEtfs.length > 1) {
        setSelectedEtfs(selectedEtfs.filter((t) => t !== ticker))
      }
    }
  }

  // 선택된 ETF 데이터
  const selectedEtfData = useMemo(() => {
    return allEtfs.filter((etf) => selectedEtfs.includes(etf.ticker))
  }, [selectedEtfs])

  // 차트 설정 동적 생성
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    selectedEtfData.forEach((etf, index) => {
      config[etf.ticker] = {
        label: `${etf.ticker} (${(etf.expenseRatio * 100).toFixed(2)}%)`,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }
    })
    return config
  }, [selectedEtfData])

  // 연도별 계산 데이터 생성
  const chartData = useMemo(() => {
    const data = []
    const returnRate = expectedReturn / 100 // 예상 수익률을 소수로 변환

    for (let year = 0; year <= years; year++) {
      const yearData: Record<string, number | string> = { year: year === 0 ? '시작' : `${year}년` }

      selectedEtfData.forEach((etf) => {
        // 복리 효과 포함 계산: 투자금액 × (1 + 수익률 - 보수율)^N
        const netReturn = returnRate - etf.expenseRatio / 100
        const finalValue = investmentAmount * Math.pow(1 + netReturn, year)
        yearData[etf.ticker] = Math.round(finalValue)
      })

      data.push(yearData)
    }

    return data
  }, [investmentAmount, selectedEtfData, years, expectedReturn])

  // 비용 요약 계산
  const costSummary = useMemo(() => {
    return selectedEtfData.map((etf) => {
      const annualCost = investmentAmount * (etf.expenseRatio / 100)
      const totalCost = annualCost * years
      const returnRate = expectedReturn / 100
      const netReturn = returnRate - etf.expenseRatio / 100
      const finalValue = investmentAmount * Math.pow(1 + netReturn, years)
      const profit = finalValue - investmentAmount

      return {
        ticker: etf.ticker,
        name: etf.name,
        expenseRatio: etf.expenseRatio,
        annualCost,
        totalCost,
        finalValue,
        profit,
      }
    })
  }, [investmentAmount, selectedEtfData, years, expectedReturn])

  return (
    <Card>
      <CardHeader>
        <CardTitle>ETF 비용 계산기</CardTitle>
        <CardDescription>
          투자 금액과 기간을 입력하여 ETF별 예상 비용과 수익을 비교해보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 투자 금액 입력 */}
        <div className="space-y-2">
          <label htmlFor="investment-amount" className="text-sm font-medium">투자 금액</label>
          <div className="flex items-center gap-2">
            <Input
              id="investment-amount"
              type="text"
              value={investmentAmount.toLocaleString()}
              onChange={handleAmountChange}
              className="max-w-[200px]"
              aria-describedby="investment-amount-unit"
            />
            <span id="investment-amount-unit" className="text-sm text-muted-foreground">원</span>
          </div>
        </div>

        {/* 예상 연간 수익률 입력 */}
        <div className="space-y-2">
          <label id="expected-return-label" className="text-sm font-medium">
            예상 연간 수익률: <span className="text-primary">{expectedReturn}%</span>
          </label>
          <Slider
            value={[expectedReturn]}
            onValueChange={(value) => setExpectedReturn(value[0])}
            min={0}
            max={20}
            step={0.5}
            className="max-w-[300px]"
            aria-labelledby="expected-return-label"
          />
          <p className="text-xs text-muted-foreground">
            S&P500 역사적 평균 수익률: 약 10%
          </p>
        </div>

        {/* 투자 기간 설정 */}
        <div className="space-y-2">
          <label id="years-label" className="text-sm font-medium">
            투자 기간: <span className="text-primary">{years}년</span>
          </label>
          <Slider
            value={[years]}
            onValueChange={(value) => setYears(value[0])}
            min={1}
            max={30}
            step={1}
            className="max-w-[300px]"
            aria-labelledby="years-label"
          />
        </div>

        {/* ETF 선택 */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            ETF 선택 (최소 1개, 최대 4개)
          </label>

          {/* 미국 ETF */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">미국 ETF</p>
            <div className="flex flex-wrap gap-4">
              {allEtfs
                .filter((etf) => etf.type === 'US')
                .map((etf) => (
                  <div key={etf.ticker} className="flex items-center space-x-2">
                    <Checkbox
                      id={`etf-${etf.ticker}`}
                      checked={selectedEtfs.includes(etf.ticker)}
                      onCheckedChange={(checked) =>
                        handleEtfToggle(etf.ticker, checked as boolean)
                      }
                      disabled={
                        !selectedEtfs.includes(etf.ticker) &&
                        selectedEtfs.length >= 4
                      }
                    />
                    <label
                      htmlFor={`etf-${etf.ticker}`}
                      className="text-sm cursor-pointer"
                    >
                      {etf.ticker}{' '}
                      <span className="text-muted-foreground">
                        ({(etf.expenseRatio * 100).toFixed(2)}%)
                      </span>
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* 한국 ETF */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">한국 ETF</p>
            <div className="flex flex-wrap gap-4">
              {allEtfs
                .filter((etf) => etf.type === 'KR')
                .map((etf) => (
                  <div key={etf.ticker} className="flex items-center space-x-2">
                    <Checkbox
                      id={`etf-${etf.ticker}`}
                      checked={selectedEtfs.includes(etf.ticker)}
                      onCheckedChange={(checked) =>
                        handleEtfToggle(etf.ticker, checked as boolean)
                      }
                      disabled={
                        !selectedEtfs.includes(etf.ticker) &&
                        selectedEtfs.length >= 4
                      }
                    />
                    <label
                      htmlFor={`etf-${etf.ticker}`}
                      className="text-sm cursor-pointer"
                    >
                      {etf.name.split(' ')[0]}{' '}
                      <span className="text-muted-foreground">
                        ({(etf.expenseRatio * 100).toFixed(4)}%)
                      </span>
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 결과 차트 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">예상 자산 추이</label>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  v >= 100000000
                    ? `${(v / 100000000).toFixed(1)}억`
                    : v >= 10000
                    ? `${(v / 10000).toFixed(0)}만`
                    : v.toLocaleString()
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      typeof value === 'number'
                        ? `${value.toLocaleString()}원`
                        : value
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {selectedEtfData.map((etf, index) => (
                <Line
                  key={etf.ticker}
                  type="monotone"
                  dataKey={etf.ticker}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>

        {/* 비용 요약 테이블 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">비용 및 수익 요약</label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">ETF</th>
                  <th className="text-right py-2 px-2">보수율</th>
                  <th className="text-right py-2 px-2">연간 비용</th>
                  <th className="text-right py-2 px-2">{years}년 총 비용</th>
                  <th className="text-right py-2 px-2">예상 최종 금액</th>
                  <th className="text-right py-2 px-2">예상 수익</th>
                </tr>
              </thead>
              <tbody>
                {costSummary.map((item) => (
                  <tr key={item.ticker} className="border-b">
                    <td className="py-2 px-2 font-medium">{item.ticker}</td>
                    <td className="text-right py-2 px-2">
                      {(item.expenseRatio * 100).toFixed(4)}%
                    </td>
                    <td className="text-right py-2 px-2">
                      {Math.round(item.annualCost).toLocaleString()}원
                    </td>
                    <td className="text-right py-2 px-2">
                      {Math.round(item.totalCost).toLocaleString()}원
                    </td>
                    <td className="text-right py-2 px-2 font-medium">
                      {Math.round(item.finalValue).toLocaleString()}원
                    </td>
                    <td
                      className={`text-right py-2 px-2 font-medium ${
                        item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.profit >= 0 ? '+' : ''}
                      {Math.round(item.profit).toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 비용 차이 비교 */}
        {costSummary.length >= 2 && (
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <p className="text-sm font-medium mb-2">보수율 차이로 인한 비용 차이</p>
            <p className="text-xs text-muted-foreground">
              {costSummary[0].ticker} vs {costSummary[1].ticker}: {years}년 후{' '}
              <span className="font-medium text-foreground">
                {Math.abs(
                  Math.round(costSummary[0].finalValue - costSummary[1].finalValue)
                ).toLocaleString()}
                원
              </span>{' '}
              차이
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
