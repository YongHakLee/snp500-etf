'use client'

interface DataStatusProps {
  isLive: boolean
  lastUpdated?: string
  className?: string
}

/**
 * 데이터 상태 표시 컴포넌트
 * 실시간 데이터인지 정적 데이터인지 표시
 */
export function DataStatus({ isLive, lastUpdated, className = '' }: DataStatusProps) {
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span
        className={`h-2 w-2 rounded-full ${
          isLive ? 'bg-green-500' : 'bg-yellow-500'
        }`}
      />
      <span className="text-muted-foreground">
        {isLive ? '실시간' : '정적 데이터'}
      </span>
      {lastUpdated && (
        <span className="text-muted-foreground text-xs">
          ({new Date(lastUpdated).toLocaleString('ko-KR')})
        </span>
      )}
    </div>
  )
}
