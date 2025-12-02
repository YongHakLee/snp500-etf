import type { Metadata } from 'next'
import { KRETFContent } from './KRETFContent'

export const metadata: Metadata = {
  title: '한국 S&P500 ETF 비교 - TIGER vs KODEX vs ACE',
  description: 'TIGER, KODEX, ACE 등 한국 상장 S&P500 ETF를 보수율, 환헤지, 배당재투자 기준으로 비교합니다.',
  openGraph: {
    title: '한국 S&P500 ETF 비교',
    description: 'TIGER vs KODEX vs ACE - 국내 상장 ETF 비교.',
  },
}

export default function KRETFPage() {
  return <KRETFContent />
}
