'use client'

import useSWR from 'swr'
import krEtfData from '@/data/kr-etf.json'
import { getApiUrl } from '@/lib/swr-config'
import type { KREtf } from '@/types'

const fallbackData = krEtfData.etfs as KREtf[]

// 정적 데이터에서 actualExpenseRatio 맵 생성 (API 데이터 보충용)
const actualExpenseRatioMap = new Map(
  fallbackData.map(etf => [etf.ticker, etf.actualExpenseRatio])
)

interface UseKREtfsReturn {
  etfs: KREtf[]
  isLive: boolean
  isLoading: boolean
  error: Error | undefined
  lastUpdated?: string
}

/**
 * 한국 ETF 데이터를 가져오는 커스텀 훅
 * API 실패 시 정적 JSON 데이터로 폴백
 */
export function useKREtfs(): UseKREtfsReturn {
  const apiUrl = getApiUrl('/api/v1/etf/kr')

  const { data, error, isLoading } = useSWR<KREtf[]>(
    apiUrl, // API URL이 없으면 null이 되어 요청 스킵
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 2,
    }
  )

  // API 응답은 배열 형태 (List[KRETFSchema])
  // API 성공 시 data 배열 사용, 실패 시 fallbackData 사용
  // API 데이터에 actualExpenseRatio가 없으면 정적 데이터에서 보충
  const rawEtfs = (Array.isArray(data) && data.length > 0) ? data : fallbackData
  const etfs = rawEtfs.map(etf => ({
    ...etf,
    actualExpenseRatio: etf.actualExpenseRatio ?? actualExpenseRatioMap.get(etf.ticker),
  }))

  // isLive 판단: 첫 번째 ETF의 isLive 필드 확인 (API 응답에 포함됨)
  const isLive = Boolean(
    Array.isArray(data) &&
    data.length > 0 &&
    data[0]?.isLive === true &&
    !error
  )

  // lastUpdated: 첫 번째 ETF의 lastUpdated 필드 사용
  const lastUpdated = Array.isArray(data) && data.length > 0
    ? data[0]?.lastUpdated
    : undefined

  return {
    etfs,
    isLive,
    isLoading,
    error,
    lastUpdated,
  }
}
