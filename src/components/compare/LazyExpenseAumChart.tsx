'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type { ExpenseAumChartData } from '@/types'

// Lazy load the chart component
const ExpenseAumComparisonChart = dynamic(
  () => import('@/components/charts/ExpenseAumComparisonChart').then(mod => ({ default: mod.ExpenseAumComparisonChart })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="flex justify-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-[350px] w-full md:h-[400px]" />
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
  data: ExpenseAumChartData[]
}

export function LazyExpenseAumChart({ data }: Props) {
  return <ExpenseAumComparisonChart data={data} />
}
