// ETF 타입 정의

/**
 * 미국 ETF 타입
 * 데이터 소스: src/data/us-etf.json
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
}

/**
 * 한국 ETF 타입
 * 데이터 소스: src/data/kr-etf.json
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
}

/**
 * 역사적 수익률 데이터 타입
 * 데이터 소스: src/data/historical-returns.json
 */
export interface HistoricalReturn {
  year: number
  return: number
  cumulativeReturn: number
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
