'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { HistoricalReturn } from '@/types'

const chartConfig = {
  return: {
    label: '연간 수익률',
    color: 'var(--chart-1)',
  },
  cumulativeReturn: {
    label: '누적 수익률',
    color: 'var(--chart-2)',
  },
}

interface Props {
  data: HistoricalReturn[]
}

export function HistoricalReturnChart({ data }: Props) {
  return (
    <div role="img" aria-label="S&P500 역사적 수익률 차트: 연간 수익률과 누적 수익률을 선 그래프로 표시합니다.">
      <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px]">
        <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="year" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="return" stroke="var(--color-return)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="cumulativeReturn" stroke="var(--color-cumulativeReturn)" strokeWidth={2} dot={false} />
      </LineChart>
      </ChartContainer>
    </div>
  )
}
