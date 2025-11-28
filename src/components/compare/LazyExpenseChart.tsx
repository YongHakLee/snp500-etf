'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type { ExpenseChartData } from '@/components/charts/ExpenseComparisonChart'

// Lazy load the chart component
const ExpenseComparisonChart = dynamic(
  () => import('@/components/charts/ExpenseComparisonChart').then(mod => ({ default: mod.ExpenseComparisonChart })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false
  }
)

interface Props {
  data: ExpenseChartData[]
}

export function LazyExpenseChart({ data }: Props) {
  return <ExpenseComparisonChart data={data} />
}
