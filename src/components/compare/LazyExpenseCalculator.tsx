'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load the calculator component
const ExpenseCalculator = dynamic(
  () => import('@/components/etf/ExpenseCalculator').then(mod => ({ default: mod.ExpenseCalculator })),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    ),
    ssr: false
  }
)

export function LazyExpenseCalculator() {
  return <ExpenseCalculator />
}
