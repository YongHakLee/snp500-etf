'use client'

import { useState } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { PieChart, Pie, Cell, Sector } from 'recharts'
import { SectorAllocation } from '@/types'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

// 11개 섹터별 색상 정의
const SECTOR_COLORS: Record<string, string> = {
  'Information Technology': 'hsl(var(--chart-1))',
  'Financials': 'hsl(var(--chart-2))',
  'Health Care': 'hsl(var(--chart-3))',
  'Consumer Discretionary': 'hsl(var(--chart-4))',
  'Communication Services': 'hsl(var(--chart-5))',
  'Industrials': 'hsl(221, 83%, 53%)',
  'Consumer Staples': 'hsl(142, 71%, 45%)',
  'Energy': 'hsl(25, 95%, 53%)',
  'Utilities': 'hsl(262, 83%, 58%)',
  'Real Estate': 'hsl(339, 90%, 51%)',
  'Materials': 'hsl(173, 80%, 40%)',
}

// 섹터별 chartConfig 생성
const createChartConfig = (data: SectorAllocation[]): ChartConfig => {
  const config: ChartConfig = {
    allocation: {
      label: '비중',
    },
  }

  data.forEach((item) => {
    config[item.sector] = {
      label: item.sectorKr,
      color: SECTOR_COLORS[item.sector] || 'hsl(var(--chart-1))',
    }
  })

  return config
}

// 활성 섹터 렌더링 함수
const renderActiveShape = (props: PieSectorDataItem) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={(outerRadius as number) + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="hsl(var(--foreground))"
        strokeWidth={2}
      />
    </g>
  )
}

interface SectorAllocationChartProps {
  data: SectorAllocation[]
}

export function SectorAllocationChart({ data }: SectorAllocationChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const chartConfig = createChartConfig(data)

  return (
    <div role="img" aria-label="S&P500 섹터별 비중 차트: 11개 섹터의 비중을 도넛 차트로 표시합니다. 정보기술이 가장 큰 비중을 차지합니다.">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px] w-full md:h-[400px]">
        <PieChart>
        <Pie
          data={data}
          dataKey="allocation"
          nameKey="sectorKr"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(undefined)}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={SECTOR_COLORS[entry.sector] || 'hsl(var(--chart-1))'}
            />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, props) => {
                const item = props.payload as SectorAllocation
                return (
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{item.sectorKr}</span>
                    <span className="text-xs text-muted-foreground">{item.sector}</span>
                    <span>비중: {Number(value).toFixed(1)}%</span>
                  </div>
                )
              }}
            />
          }
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="sectorKr" />}
          className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
