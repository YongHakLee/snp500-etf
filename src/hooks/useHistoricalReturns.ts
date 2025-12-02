'use client'

import useSWR from 'swr'
import historicalData from '@/data/historical-returns.json'
import { getApiUrl } from '@/lib/swr-config'
import type { HistoricalReturn, HistoricalSummary, HistoricalReturnsResponse } from '@/types'
import type { TimeRange } from '@/components/common/TimeRangeSelector'
import { getStartYearFromTimeRange } from '@/components/common/TimeRangeSelector'

const fallbackReturns = historicalData.returns as HistoricalReturn[]

/**
 * TimeRange에 맞게 데이터 필터링 및 누적 수익률 재계산
 */
function filterReturnsByTimeRange(returns: HistoricalReturn[], startYear: number): HistoricalReturn[] {
  const filtered = returns.filter((r) => r.year >= startYear)

  // 누적 수익률 재계산
  let cumulative = 0
  return filtered.map((r) => {
    cumulative = (1 + cumulative / 100) * (1 + r.return / 100) * 100 - 100
    return {
      ...r,
      cumulativeReturn: Math.round(cumulative * 100) / 100,
      isPositive: r.return > 0,
    }
  })
}

/**
 * 정적 데이터에서 summary 계산
 */
function calculateFallbackSummary(returns: HistoricalReturn[]): HistoricalSummary {
  if (!returns.length) {
    return {
      totalYears: 0,
      positiveYears: 0,
      negativeYears: 0,
      bestYear: null,
      worstYear: null,
      avgAnnualReturn: 0,
    }
  }

  const returnsOnly = returns.map((r) => r.return)
  const positiveYears = returnsOnly.filter((r) => r > 0).length
  const negativeYears = returnsOnly.filter((r) => r < 0).length

  const maxReturn = Math.max(...returnsOnly)
  const minReturn = Math.min(...returnsOnly)
  const bestIdx = returnsOnly.indexOf(maxReturn)
  const worstIdx = returnsOnly.indexOf(minReturn)

  return {
    totalYears: returns.length,
    positiveYears,
    negativeYears,
    bestYear: {
      year: returns[bestIdx].year,
      return: returns[bestIdx].return,
    },
    worstYear: {
      year: returns[worstIdx].year,
      return: returns[worstIdx].return,
    },
    avgAnnualReturn: Math.round(
      (returnsOnly.reduce((a, b) => a + b, 0) / returnsOnly.length) * 100
    ) / 100,
  }
}

interface UseHistoricalReturnsReturn {
  returns: HistoricalReturn[]
  summary: HistoricalSummary
  isLive: boolean
  isLoading: boolean
  error: Error | undefined
  lastUpdated?: string
}

/**
 * 역사적 수익률 데이터를 가져오는 커스텀 훅
 * API 실패 시 정적 JSON 데이터로 폴백
 *
 * @param timeRange - 기간 선택 ('5y' | '10y' | 'all'), 기본값 '10y'
 *
 * Phase 7: 새로운 API 응답 형식 지원 (data, summary, lastUpdated, isLive)
 * Phase 8: timeRange 파라미터 지원
 */
export function useHistoricalReturns(timeRange: TimeRange = '10y'): UseHistoricalReturnsReturn {
  const startYear = getStartYearFromTimeRange(timeRange)
  const apiUrl = getApiUrl(`/api/v1/market/historical?start_year=${startYear}`)

  const { data, error, isLoading } = useSWR<HistoricalReturnsResponse>(
    apiUrl ? `historical-${timeRange}` : null, // SWR 키에 timeRange 포함
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

  // 새로운 API 응답 형식 처리
  // API가 { data: [...], summary: {...}, isLive: boolean, lastUpdated: string } 형태 반환
  const hasValidResponse = data && Array.isArray(data.data) && data.data.length > 0

  // 수익률 데이터 (API 성공 시 API 데이터, 실패 시 필터링된 폴백 데이터)
  const returns = hasValidResponse
    ? data.data.map(r => ({
        ...r,
        isPositive: r.return > 0,
      }))
    : filterReturnsByTimeRange(fallbackReturns, startYear)

  // 요약 통계
  const summary = hasValidResponse && data.summary
    ? data.summary
    : calculateFallbackSummary(returns)

  // 실시간 데이터 여부
  const isLive = Boolean(hasValidResponse && data.isLive)

  // 마지막 업데이트 시간
  const lastUpdated = hasValidResponse ? data.lastUpdated : undefined

  return {
    returns,
    summary,
    isLive,
    isLoading,
    error,
    lastUpdated,
  }
}
