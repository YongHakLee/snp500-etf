'use client'

import useSWR from 'swr'
import top10Data from '@/data/sp500-top10.json'
import { getApiUrl } from '@/lib/swr-config'
import type { TopStock } from '@/types'

const fallbackStocks = top10Data.stocks as TopStock[]

interface Top10ApiResponse {
  stocks: TopStock[]
  lastUpdated?: string
  isLive?: boolean
}

interface UseSP500Top10Return {
  stocks: TopStock[]
  isLive: boolean
  isLoading: boolean
  error: Error | undefined
  lastUpdated?: string
}

/**
 * S&P500 Top 10 종목 데이터를 가져오는 커스텀 훅
 * API 실패 시 정적 JSON 데이터로 폴백
 */
export function useSP500Top10(): UseSP500Top10Return {
  const apiUrl = getApiUrl('/api/v1/market/top10')

  const { data, error, isLoading } = useSWR<Top10ApiResponse>(
    apiUrl ? 'market-top10' : null,
    () => fetch(apiUrl!).then((res) => {
      if (!res.ok) throw new Error('API request failed')
      return res.json()
    }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000 * 60, // 1시간
      errorRetryCount: 2,
    }
  )

  const hasValidResponse = data && Array.isArray(data.stocks) && data.stocks.length > 0

  return {
    stocks: hasValidResponse ? data.stocks : fallbackStocks,
    isLive: Boolean(hasValidResponse && data.isLive),
    isLoading,
    error,
    lastUpdated: hasValidResponse ? data.lastUpdated : undefined,
  }
}
