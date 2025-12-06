/**
 * 섹터별 대표 종목 훅
 * FDR 기반 S&P 500 실시간 데이터 조회
 */

import useSWR from 'swr'
import { swrFetcher } from '@/lib/api'
import type { SectorRepresentative, SectorRepresentativesResponse } from '@/types'

// 정적 폴백 데이터 (API 실패 시 사용) - 11개 섹터 전체
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
    sector: 'Industrials',
    sectorKr: '산업재',
    color: '#6366F1',
    totalCount: 78,
    stocks: [
      { symbol: 'CAT', name: 'Caterpillar Inc.', industry: 'Construction Machinery' },
      { symbol: 'RTX', name: 'RTX Corporation', industry: 'Aerospace & Defense' },
      { symbol: 'HON', name: 'Honeywell International Inc.', industry: 'Industrial Conglomerates' },
      { symbol: 'UNP', name: 'Union Pacific Corporation', industry: 'Railroads' },
      { symbol: 'DE', name: 'Deere & Company', industry: 'Farm & Heavy Machinery' },
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
  {
    sector: 'Consumer Discretionary',
    sectorKr: '임의소비재',
    color: '#F59E0B',
    totalCount: 53,
    stocks: [
      { symbol: 'AMZN', name: 'Amazon.com Inc.', industry: 'Internet Retail' },
      { symbol: 'TSLA', name: 'Tesla Inc.', industry: 'Auto Manufacturers' },
      { symbol: 'HD', name: 'The Home Depot Inc.', industry: 'Home Improvement Retail' },
      { symbol: 'MCD', name: "McDonald's Corporation", industry: 'Restaurants' },
      { symbol: 'NKE', name: 'Nike Inc.', industry: 'Footwear & Accessories' },
    ],
  },
  {
    sector: 'Consumer Staples',
    sectorKr: '필수소비재',
    color: '#14B8A6',
    totalCount: 38,
    stocks: [
      { symbol: 'PG', name: 'Procter & Gamble Co.', industry: 'Household Products' },
      { symbol: 'KO', name: 'The Coca-Cola Company', industry: 'Beverages' },
      { symbol: 'PEP', name: 'PepsiCo Inc.', industry: 'Beverages' },
      { symbol: 'COST', name: 'Costco Wholesale Corporation', industry: 'Discount Stores' },
      { symbol: 'WMT', name: 'Walmart Inc.', industry: 'Discount Stores' },
    ],
  },
  {
    sector: 'Real Estate',
    sectorKr: '부동산',
    color: '#EF4444',
    totalCount: 31,
    stocks: [
      { symbol: 'PLD', name: 'Prologis Inc.', industry: 'REIT - Industrial' },
      { symbol: 'AMT', name: 'American Tower Corporation', industry: 'REIT - Specialty' },
      { symbol: 'EQIX', name: 'Equinix Inc.', industry: 'REIT - Specialty' },
      { symbol: 'SPG', name: 'Simon Property Group Inc.', industry: 'REIT - Retail' },
      { symbol: 'O', name: 'Realty Income Corporation', industry: 'REIT - Retail' },
    ],
  },
  {
    sector: 'Utilities',
    sectorKr: '유틸리티',
    color: '#A855F7',
    totalCount: 31,
    stocks: [
      { symbol: 'NEE', name: 'NextEra Energy Inc.', industry: 'Utilities - Regulated Electric' },
      { symbol: 'DUK', name: 'Duke Energy Corporation', industry: 'Utilities - Regulated Electric' },
      { symbol: 'SO', name: 'The Southern Company', industry: 'Utilities - Regulated Electric' },
      { symbol: 'D', name: 'Dominion Energy Inc.', industry: 'Utilities - Regulated Electric' },
      { symbol: 'AEP', name: 'American Electric Power Company', industry: 'Utilities - Regulated Electric' },
    ],
  },
  {
    sector: 'Materials',
    sectorKr: '소재',
    color: '#06B6D4',
    totalCount: 26,
    stocks: [
      { symbol: 'LIN', name: 'Linde plc', industry: 'Specialty Chemicals' },
      { symbol: 'APD', name: 'Air Products and Chemicals Inc.', industry: 'Specialty Chemicals' },
      { symbol: 'SHW', name: 'The Sherwin-Williams Company', industry: 'Specialty Chemicals' },
      { symbol: 'ECL', name: 'Ecolab Inc.', industry: 'Specialty Chemicals' },
      { symbol: 'FCX', name: 'Freeport-McMoRan Inc.', industry: 'Copper' },
    ],
  },
  {
    sector: 'Communication Services',
    sectorKr: '커뮤니케이션 서비스',
    color: '#8B5CF6',
    totalCount: 23,
    stocks: [
      { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', industry: 'Internet Content & Information' },
      { symbol: 'META', name: 'Meta Platforms Inc.', industry: 'Internet Content & Information' },
      { symbol: 'NFLX', name: 'Netflix Inc.', industry: 'Entertainment' },
      { symbol: 'DIS', name: 'The Walt Disney Company', industry: 'Entertainment' },
      { symbol: 'T', name: 'AT&T Inc.', industry: 'Telecom Services' },
    ],
  },
  {
    sector: 'Energy',
    sectorKr: '에너지',
    color: '#F97316',
    totalCount: 23,
    stocks: [
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', industry: 'Oil & Gas Integrated' },
      { symbol: 'CVX', name: 'Chevron Corporation', industry: 'Oil & Gas Integrated' },
      { symbol: 'COP', name: 'ConocoPhillips', industry: 'Oil & Gas E&P' },
      { symbol: 'SLB', name: 'Schlumberger Limited', industry: 'Oil & Gas Equipment & Services' },
      { symbol: 'EOG', name: 'EOG Resources Inc.', industry: 'Oil & Gas E&P' },
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
