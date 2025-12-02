/**
 * 섹터별 종목 수 분포 훅
 * FDR 기반 S&P 500 실시간 데이터 조회
 */

import useSWR from 'swr'
import { swrFetcher } from '@/lib/api'
import type { SectorCount, SectorCountsResponse } from '@/types'

// 정적 폴백 데이터 (API 실패 시 사용)
const FALLBACK_SECTORS: SectorCount[] = [
  { sector: 'Information Technology', sectorKr: '정보기술', count: 65, percentage: 12.9, color: '#3B82F6' },
  { sector: 'Financials', sectorKr: '금융', count: 71, percentage: 14.1, color: '#10B981' },
  { sector: 'Health Care', sectorKr: '헬스케어', count: 64, percentage: 12.7, color: '#EC4899' },
  { sector: 'Industrials', sectorKr: '산업재', count: 78, percentage: 15.5, color: '#6366F1' },
  { sector: 'Consumer Discretionary', sectorKr: '임의소비재', count: 53, percentage: 10.5, color: '#F59E0B' },
  { sector: 'Consumer Staples', sectorKr: '필수소비재', count: 38, percentage: 7.5, color: '#14B8A6' },
  { sector: 'Communication Services', sectorKr: '커뮤니케이션 서비스', count: 23, percentage: 4.6, color: '#8B5CF6' },
  { sector: 'Energy', sectorKr: '에너지', count: 23, percentage: 4.6, color: '#F97316' },
  { sector: 'Utilities', sectorKr: '유틸리티', count: 31, percentage: 6.2, color: '#A855F7' },
  { sector: 'Real Estate', sectorKr: '부동산', count: 31, percentage: 6.2, color: '#EF4444' },
  { sector: 'Materials', sectorKr: '소재', count: 26, percentage: 5.2, color: '#06B6D4' },
]

export function useSectorCounts() {
  const { data, error, isLoading } = useSWR<SectorCountsResponse>(
    '/api/v1/market/sector-counts',
    swrFetcher,
    {
      dedupingInterval: 86400000, // 24시간 중복 요청 방지
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  return {
    sectors: data?.sectors ?? FALLBACK_SECTORS,
    totalStocks: data?.totalStocks ?? 503,
    lastUpdated: data?.lastUpdated,
    isLive: data?.isLive ?? false,
    isLoading,
    error,
  }
}
