'use client'

import useSWR from 'swr'
import sectorData from '@/data/sector-allocation.json'
import { getApiUrl } from '@/lib/swr-config'
import type { SectorAllocation } from '@/types'

const fallbackSectors = sectorData.sectors as SectorAllocation[]

interface SectorApiResponse {
  sectors: SectorAllocation[]
  lastUpdated?: string
  isLive?: boolean
}

interface UseSectorAllocationReturn {
  sectors: SectorAllocation[]
  isLive: boolean
  isLoading: boolean
  error: Error | undefined
  lastUpdated?: string
}

/**
 * S&P500 섹터별 비중 데이터를 가져오는 커스텀 훅
 * API 실패 시 정적 JSON 데이터로 폴백
 */
export function useSectorAllocation(): UseSectorAllocationReturn {
  const apiUrl = getApiUrl('/api/v1/market/sectors')

  const { data, error, isLoading } = useSWR<SectorApiResponse>(
    apiUrl ? 'market-sectors' : null,
    () => fetch(apiUrl!).then((res) => {
      if (!res.ok) throw new Error('API request failed')
      return res.json()
    }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000 * 60 * 24, // 24시간 (섹터 비중은 자주 변하지 않음)
      errorRetryCount: 2,
    }
  )

  const hasValidResponse = data && Array.isArray(data.sectors) && data.sectors.length > 0

  return {
    sectors: hasValidResponse ? data.sectors : fallbackSectors,
    isLive: Boolean(hasValidResponse && data.isLive),
    isLoading,
    error,
    lastUpdated: hasValidResponse ? data.lastUpdated : undefined,
  }
}
