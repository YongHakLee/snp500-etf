import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자주 묻는 질문 (FAQ)',
  description: 'S&P500 ETF 투자에 대해 자주 묻는 질문들을 모았습니다. 기초, 투자, 세금 관련 질문과 답변.',
  openGraph: {
    title: '자주 묻는 질문 (FAQ)',
    description: 'S&P500 ETF 투자 FAQ - 궁금증을 해결하세요.',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
