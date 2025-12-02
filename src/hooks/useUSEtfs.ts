'use client'

import useSWR from 'swr'
import usEtfData from '@/data/us-etf.json'
import { getApiUrl } from '@/lib/swr-config'
import type { USEtf } from '@/types'

const fallbackData = usEtfData.etfs as USEtf[]

interface UseUSEtfsReturn {
  etfs: USEtf[]
  isLive: boolean
  isLoading: boolean
  error: Error | undefined
  lastUpdated?: string
}

/**
 * 미국 ETF 데이터를 가져오는 커스텀 훅
 * API 실패 시 정적 JSON 데이터로 폴백
 */
export function useUSEtfs(): UseUSEtfsReturn {
  const apiUrl = getApiUrl('/api/v1/etf/us')

  const { data, error, isLoading } = useSWR<USEtf[]>(
    apiUrl, // API URL이 없으면 null이 되어 요청 스킵
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 2,
    }
  )

  // API 응답은 배열 형태 (List[USETFSchema])
  // API 성공 시 data 배열 사용, 실패 시 fallbackData 사용
  const etfs = (Array.isArray(data) && data.length > 0) ? data : fallbackData

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
