'use client'

import useSWR from 'swr'
import { getApiUrl } from '@/lib/swr-config'
import type { SP500IndexData } from '@/lib/api'

// API 응답 타입 정의
interface SP500ApiResponse {
  ticker: string
  price: number
  change: number
  changePercent: number
  previousClose: number
  lastUpdated: string
  isLive: boolean
}

interface UseSP500IndexReturn {
  index: SP500IndexData | null
  isLive: boolean
  isLoading: boolean
  error: Error | undefined
}

/**
 * S&P500 지수 데이터를 가져오는 커스텀 훅
 * API 실패 시 null 반환
 */
export function useSP500Index(): UseSP500IndexReturn {
  const apiUrl = getApiUrl('/api/v1/market/sp500')

  const { data, error, isLoading } = useSWR<SP500ApiResponse>(
    apiUrl, // API URL이 없으면 null이 되어 요청 스킵
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 2,
      refreshInterval: 60000 * 15, // 15분마다 자동 갱신
    }
  )

  // API 응답 필드 매핑: price -> value
  const index = data ? {
    value: data.price,
    change: data.change,
    changePercent: data.changePercent,
    lastUpdated: data.lastUpdated,
  } : null

  const isLive = Boolean(data?.isLive === true && !error)

  return {
    index,
    isLive,
    isLoading,
    error,
  }
}
