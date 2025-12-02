/**
 * 섹터별 대표 종목 훅
 * FDR 기반 S&P 500 실시간 데이터 조회
 */

import useSWR from 'swr'
import { swrFetcher } from '@/lib/api'
import type { SectorRepresentative, SectorRepresentativesResponse } from '@/types'

// 정적 폴백 데이터 (API 실패 시 사용)
const FALLBACK_SECTORS: SectorRepresentative[] = [
  {
    sector: 'Information Technology',
    sectorKr: '정보기술',
    color: '#3B82F6',
    totalCount: 65,
    stocks: [
      { symbol: 'AAPL', name: 'Apple Inc.', industry: 'Consumer Electronics' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', industry: 'Software' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', industry: 'Semiconductors' },
      { symbol: 'AVGO', name: 'Broadcom Inc.', industry: 'Semiconductors' },
      { symbol: 'ORCL', name: 'Oracle Corporation', industry: 'Software' },
    ],
  },
  {
    sector: 'Financials',
    sectorKr: '금융',
    color: '#10B981',
    totalCount: 71,
    stocks: [
      { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', industry: 'Insurance' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', industry: 'Banks' },
      { symbol: 'V', name: 'Visa Inc.', industry: 'Credit Services' },
      { symbol: 'MA', name: 'Mastercard Incorporated', industry: 'Credit Services' },
      { symbol: 'BAC', name: 'Bank of America Corporation', industry: 'Banks' },
    ],
  },
  {
    sector: 'Health Care',
    sectorKr: '헬스케어',
    color: '#EC4899',
    totalCount: 64,
    stocks: [
      { symbol: 'LLY', name: 'Eli Lilly and Company', industry: 'Drug Manufacturers' },
      { symbol: 'UNH', name: 'UnitedHealth Group Incorporated', industry: 'Healthcare Plans' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', industry: 'Drug Manufacturers' },
      { symbol: 'ABBV', name: 'AbbVie Inc.', industry: 'Drug Manufacturers' },
      { symbol: 'MRK', name: 'Merck & Co., Inc.', industry: 'Drug Manufacturers' },
    ],
  },
]

export function useSectorRepresentatives(stocksPerSector: number = 5) {
  const { data, error, isLoading } = useSWR<SectorRepresentativesResponse>(
    `/api/v1/market/sector-representatives?stocks_per_sector=${stocksPerSector}`,
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
    lastUpdated: data?.lastUpdated,
    isLive: data?.isLive ?? false,
    isLoading,
    error,
  }
}
