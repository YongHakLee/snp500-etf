'use client'

import { useState, useEffect } from 'react'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'

// 차트 데이터 타입 정의
export interface ExpenseChartData {
  ticker: string
  name: string
  expenseRatio: number
  type: 'US' | 'KR'
}

interface ExpenseComparisonChartProps {
  data: ExpenseChartData[]
}

// 차트 설정 - 미국/한국 ETF 색상 구분
const chartConfig = {
  expenseRatio: {
    label: '보수율',
  },
  US: {
    label: '미국 ETF',
    color: 'hsl(var(--chart-1))',
  },
  KR: {
    label: '한국 ETF',
    color: 'hsl(var(--chart-2))',
  },
}

// 타입별 색상 반환
const getColorByType = (type: 'US' | 'KR'): string => {
  return type === 'US' ? 'var(--color-US)' : 'var(--color-KR)'
}

export function ExpenseComparisonChart({ data }: ExpenseComparisonChartProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 초기 화면 크기 체크
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 모바일: 수평 바 (layout="vertical"), 데스크톱: 수직 바 (layout="horizontal")
  const layout = isMobile ? 'vertical' : 'horizontal'

  return (
    <div role="img" aria-label="ETF 보수율 비교 차트: 미국 및 한국 S&P500 ETF의 연간 보수율을 막대 그래프로 비교합니다.">
      <ChartContainer config={chartConfig} className="h-[300px] w-full md:h-[400px]">
        <BarChart
        data={data}
        layout={layout}
        margin={isMobile ? { top: 5, right: 30, left: 80, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={!isMobile} horizontal={isMobile} />
        {isMobile ? (
          <>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="ticker"
              tickLine={false}
              axisLine={false}
              width={70}
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
              height={60}
            />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
          </>
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, props) => {
                const item = props.payload as ExpenseChartData
                return (
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{item.name}</span>
                    <span>보수율: {Number(value).toFixed(4)}%</span>
                    <span className="text-xs text-muted-foreground">
                      {item.type === 'US' ? '미국 ETF' : '한국 ETF'}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="expenseRatio" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColorByType(entry.type)}
            />
          ))}
        </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
