'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type { HistoricalReturn } from '@/types'

// Lazy load the chart component
const HistoricalReturnChart = dynamic(
  () => import('@/components/charts/HistoricalReturnChart').then(mod => ({ default: mod.HistoricalReturnChart })),
  {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false
  }
)

interface Props {
  data: HistoricalReturn[]
}

export function HistoricalChartSection({ data }: Props) {
  return (
    <div className="h-[200px]">
      <HistoricalReturnChart data={data} />
    </div>
  )
}
