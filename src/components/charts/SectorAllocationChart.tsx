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

// 11개 섹터별 색상 정의 (Hex 색상 - SVG 호환)
const SECTOR_COLORS: Record<string, string> = {
  'Information Technology': '#3B82F6',  // Blue
  'Financials': '#10B981',              // Emerald
  'Health Care': '#EC4899',             // Pink
  'Consumer Discretionary': '#F59E0B',  // Amber
  'Communication Services': '#8B5CF6',  // Violet
  'Industrials': '#6366F1',             // Indigo
  'Consumer Staples': '#14B8A6',        // Teal
  'Energy': '#F97316',                  // Orange
  'Utilities': '#A855F7',               // Purple
  'Real Estate': '#EF4444',             // Red
  'Materials': '#06B6D4',               // Cyan
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
      color: SECTOR_COLORS[item.sector] || '#94A3B8',  // Slate fallback
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
              fill={SECTOR_COLORS[entry.sector] || '#94A3B8'}
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
