'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type { KRExpenseAumChartData } from '@/types'

// Lazy load the chart component
const KRExpenseAumComparisonChart = dynamic(
  () => import('@/components/charts/KRExpenseAumComparisonChart').then(mod => ({ default: mod.KRExpenseAumComparisonChart })),
  {
    loading: () => (
      <div className="space-y-4">
        {/* 범례 스켈레톤 */}
        <div className="flex justify-center gap-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-36" />
        </div>
        {/* 카드 그리드 스켈레톤 (2x2 또는 1x4) */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
          ))}
        </div>
        {/* 하단 설명 스켈레톤 */}
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    ),
    ssr: false
  }
)

interface Props {
  data: KRExpenseAumChartData[]
}

export function LazyKRExpenseAumChart({ data }: Props) {
  return <KRExpenseAumComparisonChart data={data} />
}
