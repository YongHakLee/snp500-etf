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
import type { SectorCount } from '@/types'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

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
  })

  return config
}

interface SectorCountChartProps {
  data: SectorCount[]
  totalStocks?: number
}

export function SectorCountChart({ data, totalStocks }: SectorCountChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const chartConfig = createChartConfig(data)

  return (
    <div role="img" aria-label="S&P500 섹터별 종목 수 분포: 11개 섹터의 종목 수를 도넛 차트로 표시합니다.">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px] w-full md:h-[400px]">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
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
                fill={entry.color}
              />
            ))}
          </Pie>
          <ChartTooltip
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
          <ChartLegend
            content={<ChartLegendContent nameKey="sectorKr" />}
            className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
      {totalStocks && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          총 {totalStocks}개 종목
        </p>
      )}
    </div>
  )
}
