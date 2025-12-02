'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export type TimeRange = '5y' | '10y' | 'all'

interface TimeRangeSelectorProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
  className?: string
}

/**
 * 기간 선택 컴포넌트
 * 5년, 10년, 전체 기간 중 선택 가능
 */
export function TimeRangeSelector({ value, onChange, className }: TimeRangeSelectorProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as TimeRange)}
      className={cn('w-auto', className)}
    >
      <TabsList className="h-8">
        <TabsTrigger value="5y" className="text-xs px-3">
          5년
        </TabsTrigger>
        <TabsTrigger value="10y" className="text-xs px-3">
          10년
        </TabsTrigger>
        <TabsTrigger value="all" className="text-xs px-3">
          전체
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

/**
 * TimeRange를 start_year로 변환
 */
export function getStartYearFromTimeRange(timeRange: TimeRange): number {
  const currentYear = new Date().getFullYear()
  switch (timeRange) {
    case '5y':
      return currentYear - 5
    case '10y':
      return currentYear - 10
    case 'all':
      return 1995
  }
}
