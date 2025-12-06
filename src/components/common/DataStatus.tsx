'use client'

interface DataStatusProps {
  isLive: boolean
  lastUpdated?: string
  className?: string
  showSource?: boolean
  staticDataDate?: string  // 정적 데이터 기준일 (예: "2025년 12월 금융투자협회 공시")
}

/**
 * 데이터 상태 표시 컴포넌트
 * API 연동 데이터인지 정적 데이터인지 표시
 */
export function DataStatus({ isLive, lastUpdated, className = '', showSource = false, staticDataDate }: DataStatusProps) {
  // staticDataDate가 있으면 상세 표시 모드
  if (staticDataDate) {
    return (
      <div className={`flex flex-col gap-1 text-sm ${className}`}>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isLive ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          <span className="text-muted-foreground">
            가격: {isLive ? '실시간' : '정적 데이터'}
          </span>
          {lastUpdated && isLive && (
            <span className="text-muted-foreground text-xs">
              ({new Date(lastUpdated).toLocaleString('ko-KR')})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">
            보수율/순자산: {staticDataDate}
          </span>
        </div>
      </div>
    )
  }

  // 기본 표시 모드
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span
        className={`h-2 w-2 rounded-full ${
          isLive ? 'bg-green-500' : 'bg-yellow-500'
        }`}
      />
      <span className="text-muted-foreground">
        {isLive ? '최신 데이터' : '정적 데이터'}
      </span>
      {lastUpdated && (
        <span className="text-muted-foreground text-xs">
          (마지막 업데이트: {new Date(lastUpdated).toLocaleString('ko-KR')})
        </span>
      )}
      {showSource && isLive && (
        <span className="text-muted-foreground text-xs">
          · 출처: FinanceDataReader
        </span>
      )}
    </div>
  )
}
