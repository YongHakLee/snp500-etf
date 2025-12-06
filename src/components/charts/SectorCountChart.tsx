'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList } from 'recharts'
import type { SectorCount } from '@/types'

// 섹터별 chartConfig 생성
const createChartConfig = (data: SectorCount[]): ChartConfig => {
  const config: ChartConfig = {
    count: {
      label: '종목 수',
    },
  }

  data.forEach((item) => {
    config[item.sector] = {
      label: item.sectorKr,
      color: item.color,
    }
    config[item.sectorKr] = {
      label: item.sectorKr,
      color: item.color,
    }
  })

  return config
}

interface SectorCountChartProps {
  data: SectorCount[]
  totalStocks?: number
}

export function SectorCountChart({ data, totalStocks }: SectorCountChartProps) {
  // 종목 수 내림차순 정렬
  const sortedData = [...data].sort((a, b) => b.count - a.count)
  const chartConfig = createChartConfig(sortedData)

  return (
    <div role="img" aria-label="S&P500 섹터별 종목 수 분포: 11개 섹터의 종목 수를 수평 막대 차트로 표시합니다.">
      <ChartContainer config={chartConfig} className="w-full h-[400px] md:h-[450px]">
        <BarChart
          accessibilityLayer
          data={sortedData}
          layout="vertical"
          margin={{ left: 0, right: 70 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="sectorKr"
            type="category"
            tickLine={false}
            axisLine={false}
            width={90}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, name, props) => {
                  const item = props.payload as SectorCount
                  return (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{item.sectorKr}</span>
                      <span className="text-xs text-muted-foreground">{item.sector}</span>
                      <span>종목 수: {Number(value)}개 ({item.percentage}%)</span>
                    </div>
                  )
                }}
              />
            }
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              formatter={(value: number) => {
                const item = sortedData.find(d => d.count === value)
                return item ? `${value} (${item.percentage}%)` : value
              }}
              className="fill-foreground text-xs"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      {totalStocks && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          총 {totalStocks}개 종목
        </p>
      )}
    </div>
  )
}
