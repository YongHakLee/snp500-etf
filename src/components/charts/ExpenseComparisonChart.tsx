'use client'

import { useState, useEffect } from 'react'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from 'recharts'

// 차트 데이터 타입 정의
export interface ExpenseChartData {
  ticker: string
  name: string
  expenseRatio: number
  actualExpenseRatio?: number
  type: 'US' | 'KR'
}

interface ExpenseComparisonChartProps {
  data: ExpenseChartData[]
}

// 운용사별 브랜드 색상 (한국 ETF용)
const providerColors: Record<string, { primary: string; secondary: string }> = {
  'TIGER': { primary: '#FF6B00', secondary: '#FFB380' },    // 미래에셋 오렌지
  'KODEX': { primary: '#0066CC', secondary: '#66A3E0' },    // 삼성 파랑
  'ACE': { primary: '#DC143C', secondary: '#F08080' },      // 한투 빨강
  'SOL': { primary: '#00A651', secondary: '#66D399' },      // 신한 녹색
  'RISE': { primary: '#DAA520', secondary: '#F5DEB3' },     // KB 골드
  'KINDEX': { primary: '#7B68EE', secondary: '#B8B0F0' },   // 한화 보라
}

// 티커에서 브랜드 추출 (예: "TIGER" from "TIGER 미국S&P500")
const getBrandFromTicker = (ticker: string): string => {
  // ticker는 이미 "TIGER", "KODEX" 등 브랜드 이름
  // TIGER(H)의 경우 "TIGER"로 변환
  return ticker.replace('(H)', '').trim()
}

// 브랜드별 색상 반환
const getColorByBrand = (ticker: string, isPrimary: boolean): string => {
  const brand = getBrandFromTicker(ticker)
  const colors = providerColors[brand]
  if (colors) {
    return isPrimary ? colors.primary : colors.secondary
  }
  // 기본 색상 (미등록 브랜드)
  return isPrimary ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))'
}

// 차트 설정 - 총보수/실부담비용 구분
const chartConfig = {
  expenseRatio: {
    label: '총보수',
    color: 'hsl(var(--chart-1))',
  },
  actualExpenseRatio: {
    label: '실부담비용',
    color: 'hsl(var(--chart-2))',
  },
}

export function ExpenseComparisonChart({ data }: ExpenseComparisonChartProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 실부담비용 데이터가 있는지 확인
  const hasActualExpense = data.some(d => d.actualExpenseRatio !== undefined)

  // 모바일: 수평 바 (layout="vertical"), 데스크톱: 수직 바 (layout="horizontal")
  const layout = isMobile ? 'vertical' : 'horizontal'

  // 값 포맷터 함수
  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === null) return ''
    return value < 0.1 ? `${value.toFixed(4)}%` : `${value.toFixed(3)}%`
  }

  return (
    <div role="img" aria-label="ETF 보수율 및 실부담비용 비교 차트: 한국 S&P500 ETF의 총보수와 실부담비용을 운용사별로 비교합니다.">
      <ChartContainer config={chartConfig} className="h-[400px] w-full md:h-[450px]">
        <BarChart
          data={data}
          layout={layout}
          margin={isMobile
            ? { top: 10, right: 80, left: 70, bottom: 10 }
            : { top: 30, right: 30, left: 20, bottom: 80 }
          }
          barGap={2}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={!isMobile} horizontal={isMobile} />
          {isMobile ? (
            <>
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 'auto']}
              />
              <YAxis
                type="category"
                dataKey="ticker"
                tickLine={false}
                axisLine={false}
                width={65}
                tick={{ fontSize: 12, fontWeight: 500 }}
              />
            </>
          ) : (
            <>
              <XAxis
                type="category"
                dataKey="ticker"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 'auto']}
              />
            </>
          )}
          <ChartTooltip
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            content={
              <ChartTooltipContent
                formatter={(value, name, props) => {
                  const item = props.payload as ExpenseChartData
                  const label = name === 'expenseRatio' ? '총보수' : '실부담비용'
                  return (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{item.name}</span>
                      <span>{label}: {Number(value).toFixed(4)}%</span>
                      {item.actualExpenseRatio && name === 'expenseRatio' && (
                        <span className="text-xs text-muted-foreground">
                          (실부담비용: {item.actualExpenseRatio.toFixed(3)}%)
                        </span>
                      )}
                    </div>
                  )
                }}
              />
            }
          />
          <ChartLegend
            content={<ChartLegendContent />}
            verticalAlign={isMobile ? "top" : "bottom"}
            wrapperStyle={isMobile ? { paddingBottom: 10 } : { paddingTop: 20 }}
          />

          {/* 총보수 Bar */}
          <Bar
            dataKey="expenseRatio"
            name="총보수"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          >
            {data.map((entry, index) => (
              <Cell
                key={`expense-${entry.ticker}-${index}`}
                fill={getColorByBrand(entry.ticker, true)}
                className="transition-opacity hover:opacity-80"
              />
            ))}
            <LabelList
              dataKey="expenseRatio"
              position={isMobile ? "right" : "top"}
              offset={8}
              className="fill-foreground"
              fontSize={10}
              formatter={formatValue}
            />
          </Bar>

          {/* 실부담비용 Bar (데이터가 있는 경우에만) */}
          {hasActualExpense && (
            <Bar
              dataKey="actualExpenseRatio"
              name="실부담비용"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`actual-${entry.ticker}-${index}`}
                  fill={getColorByBrand(entry.ticker, false)}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
              <LabelList
                dataKey="actualExpenseRatio"
                position={isMobile ? "right" : "top"}
                offset={8}
                className="fill-foreground"
                fontSize={10}
                formatter={formatValue}
              />
            </Bar>
          )}
        </BarChart>
      </ChartContainer>

      {/* 색상 범례 (운용사별) */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
        {data.map((item, index) => {
          const brand = getBrandFromTicker(item.ticker)
          const colors = providerColors[brand]
          if (!colors) return null
          return (
            <div key={`legend-${item.ticker}-${index}`} className="flex items-center gap-1.5">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-muted-foreground">{item.ticker}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
