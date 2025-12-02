/**
 * API 클라이언트
 * FastAPI 백엔드와 통신하며, 실패 시 정적 데이터로 폴백
 */

import type { USEtf, KREtf, HistoricalReturn, TopStock, SectorAllocation } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
  data: T
  isLive: boolean
  lastUpdated?: string
  error?: string
}

/**
 * S&P500 지수 데이터 타입
 */
export interface SP500IndexData {
  value: number
  change: number
  changePercent: number
  lastUpdated: string
}

/**
 * 타임아웃이 있는 fetch 함수
 */
async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * 폴백 데이터와 함께 API 호출
 * API 실패 시 정적 데이터 반환
 */
export async function fetchWithFallback<T>(
  endpoint: string,
  fallbackData: T,
  timeout = 5000
): Promise<ApiResponse<T>> {
  // API URL이 설정되지 않은 경우 정적 데이터 반환
  if (!API_BASE) {
    return {
      data: fallbackData,
      isLive: false,
    }
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE}${endpoint}`, timeout)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    return {
      data: json.data || json,
      isLive: true,
      lastUpdated: json.lastUpdated || new Date().toISOString(),
    }
  } catch (error) {
    // 에러 발생 시 정적 데이터로 폴백 (조용히 처리)
    console.warn(`API fetch failed for ${endpoint}, using fallback data:`, error)

    return {
      data: fallbackData,
      isLive: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 미국 ETF 목록 조회
 */
export async function fetchUSEtfs(
  fallbackData: USEtf[]
): Promise<ApiResponse<USEtf[]>> {
  return fetchWithFallback<USEtf[]>('/api/v1/etf/us', fallbackData)
}

/**
 * 한국 ETF 목록 조회
 */
export async function fetchKREtfs(
  fallbackData: KREtf[]
): Promise<ApiResponse<KREtf[]>> {
  return fetchWithFallback<KREtf[]>('/api/v1/etf/kr', fallbackData)
}

/**
 * S&P500 지수 조회
 */
export async function fetchSP500Index(): Promise<ApiResponse<SP500IndexData | null>> {
  const defaultData: SP500IndexData = {
    value: 0,
    change: 0,
    changePercent: 0,
    lastUpdated: '',
  }

  return fetchWithFallback<SP500IndexData | null>('/api/v1/market/sp500', null)
}

/**
 * 역사적 수익률 조회
 */
export async function fetchHistoricalReturns(
  fallbackData: HistoricalReturn[]
): Promise<ApiResponse<HistoricalReturn[]>> {
  return fetchWithFallback<HistoricalReturn[]>(
    '/api/v1/market/historical',
    fallbackData
  )
}

/**
 * SWR용 fetcher 함수
 * API URL이 없으면 null 반환하여 SWR이 요청을 스킵하도록 함
 */
export const swrFetcher = async (url: string) => {
  if (!API_BASE) {
    throw new Error('API URL not configured')
  }

  const response = await fetchWithTimeout(`${API_BASE}${url}`, 5000)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Top 10 종목 응답 타입
 */
export interface Top10Response {
  stocks: TopStock[]
  lastUpdated?: string
}

/**
 * 섹터 배분 응답 타입
 */
export interface SectorAllocationResponse {
  sectors: SectorAllocation[]
  lastUpdated?: string
}

/**
 * S&P500 Top 10 종목 조회
 */
export async function fetchTop10Stocks(
  fallbackData: TopStock[]
): Promise<ApiResponse<TopStock[]>> {
  return fetchWithFallback<TopStock[]>('/api/v1/market/top10', fallbackData)
}

/**
 * S&P500 섹터 배분 조회
 */
export async function fetchSectorAllocation(
  fallbackData: SectorAllocation[]
): Promise<ApiResponse<SectorAllocation[]>> {
  return fetchWithFallback<SectorAllocation[]>('/api/v1/market/sectors', fallbackData)
}
