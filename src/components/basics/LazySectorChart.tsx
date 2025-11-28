'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type { SectorAllocation } from '@/types'

// Lazy load the chart component
const SectorAllocationChart = dynamic(
  () => import('@/components/charts/SectorAllocationChart').then(mod => ({ default: mod.SectorAllocationChart })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false
  }
)

interface Props {
  data: SectorAllocation[]
}

export function LazySectorChart({ data }: Props) {
  return <SectorAllocationChart data={data} />
}
