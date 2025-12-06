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
  return5Y: number // 5년 연평균 수익률 (CAGR)
  return5YCumulative?: number // 5년 누적 수익률
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
  actualExpenseRatio?: number // 실부담비용 (총보수+기타비용+매매중개비용)
  aum: number
  currency: 'KRW'
  hedged: boolean
  totalReturn: boolean
  dividendFrequency: string
  // 유연한 기간 수익률 (FDR 실시간 계산)
  returnCAGR?: number // 연평균 수익률 (CAGR)
  returnCumulative?: number // 누적 수익률
  returnYears?: number // 수익률 계산 기간 (년, 예: 4.3)
  returnPeriodLabel?: string // 기간 라벨 ('상장 이후' 또는 '5년')
  // 하위 호환성 유지
  return5Y?: number // 연평균 수익률 (CAGR) - 하위 호환용
  return5YCumulative?: number // 누적 수익률 - 하위 호환용
  // 실시간 데이터 필드 (API 응답 시 포함)
  price?: number
  change?: number
  changePercent?: number
  lastUpdated?: string
  isLive?: boolean
  isLiveReturn?: boolean // 수익률 실시간 여부
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
  example?: string
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

/**
 * 보수율 및 순자산 비교 차트 데이터 타입 (미국 ETF)
 * 듀얼 바 차트용
 */
export interface ExpenseAumChartData {
  ticker: string
  name: string
  expenseRatio: number       // 퍼센트 값 (예: 0.03)
  aumBillions: number        // 십억 달러 단위 (예: 1400)
  aumDisplay: string         // 원본 표시 문자열 (예: "1.4T")
  isOptimal: boolean         // 최적 선택 여부 (VOO = true)
}

/**
 * 실부담비용 및 순자산 비교 차트 데이터 타입 (한국 ETF)
 * 카드 그리드 + Progress Bar 차트용
 */
export interface KRExpenseAumChartData {
  ticker: string             // 종목코드 (예: "360750")
  name: string               // ETF 이름 (예: "TIGER 미국S&P500")
  actualExpenseRatio: number // 실부담비용 (예: 0.121) - 투자자에게 중요한 실제 비용
  aumBillions: number        // 억원 단위 AUM (예: 99000)
  aumDisplay: string         // 한국어 표시 문자열 (예: "9.9조원")
  isOptimal: boolean         // 최적 선택 여부 (TIGER = true)
}
