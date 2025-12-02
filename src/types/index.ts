// ETF 타입 정의

/**
 * 미국 ETF 타입
 * 데이터 소스: src/data/us-etf.json
 * API 응답 시 실시간 데이터 필드 추가
 */
export interface USEtf {
  ticker: string
  name: string
  provider: string
  expenseRatio: number
  aum: string
  avgVolume: string
  dividendReinvest: boolean
  targetAudience: string
  return5Y: number
  inceptionDate: string
  // 실시간 데이터 필드 (API 응답 시 포함)
  price?: number
  change?: number
  changePercent?: number
  lastUpdated?: string
  isLive?: boolean
}

/**
 * 한국 ETF 타입
 * 데이터 소스: src/data/kr-etf.json
 * API 응답 시 실시간 데이터 필드 추가
 */
export interface KREtf {
  ticker: string
  name: string
  provider: string
  expenseRatio: number
  aum: number
  currency: 'KRW'
  hedged: boolean
  totalReturn: boolean
  dividendFrequency: string
  features: string[]
  // 실시간 데이터 필드 (API 응답 시 포함)
  price?: number
  change?: number
  changePercent?: number
  lastUpdated?: string
  isLive?: boolean
}

/**
 * 역사적 수익률 데이터 타입
 * 데이터 소스: src/data/historical-returns.json
 */
export interface HistoricalReturn {
  year: number
  return: number
  cumulativeReturn: number
  isPositive?: boolean
}

/**
 * 연도별 수익률 요약 타입
 */
export interface YearReturn {
  year: number
  return: number
}

/**
 * 역사적 수익률 요약 통계 타입
 */
export interface HistoricalSummary {
  totalYears: number
  positiveYears: number
  negativeYears: number
  bestYear: YearReturn | null
  worstYear: YearReturn | null
  avgAnnualReturn: number
}

/**
 * 역사적 수익률 API 응답 타입
 */
export interface HistoricalReturnsResponse {
  data: HistoricalReturn[]
  summary: HistoricalSummary
  lastUpdated?: string
  isLive: boolean
}

/**
 * 용어 사전 타입
 * 데이터 소스: src/data/glossary.json
 */
export interface GlossaryTerm {
  term: string
  korean: string
  definition: string
  related: string[]
}

/**
 * S&P500 Top 종목 타입
 * 데이터 소스: src/data/sp500-top10.json
 */
export interface TopStock {
  rank: number
  ticker: string
  name: string
  weight: number
  sector: string
}

/**
 * 섹터 배분 타입
 * 데이터 소스: src/data/sector-allocation.json
 */
export interface SectorAllocation {
  sector: string
  sectorKr: string
  allocation: number
}

/**
 * FAQ 항목 타입
 * 데이터 소스: src/data/faq.json
 */
export interface FAQItem {
  id: string
  category: 'basics' | 'investing' | 'tax' | 'general'
  question: string
  answer: string
}

/**
 * 섹터별 종목 수 타입
 * API 소스: /api/v1/market/sector-counts
 */
export interface SectorCount {
  sector: string
  sectorKr: string
  count: number
  percentage: number
  color: string
}

/**
 * 섹터별 종목 수 API 응답 타입
 */
export interface SectorCountsResponse {
  sectors: SectorCount[]
  totalStocks: number
  lastUpdated: string
  isLive: boolean
}

/**
 * 섹터 내 개별 종목 타입
 */
export interface SectorStock {
  symbol: string
  name: string
  industry: string
}

/**
 * 섹터별 대표 종목 타입
 * API 소스: /api/v1/market/sector-representatives
 */
export interface SectorRepresentative {
  sector: string
  sectorKr: string
  color: string
  totalCount: number
  stocks: SectorStock[]
}

/**
 * 섹터별 대표 종목 API 응답 타입
 */
export interface SectorRepresentativesResponse {
  sectors: SectorRepresentative[]
  lastUpdated: string
  isLive: boolean
}
