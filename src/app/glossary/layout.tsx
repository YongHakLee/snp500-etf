import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ETF 용어 사전',
  description: 'ETF 투자에 필요한 용어들을 정리했습니다. ETF, NAV, iNAV, 괴리율, TR 등 주요 투자 용어 설명.',
  openGraph: {
    title: 'ETF 용어 사전',
    description: 'ETF 투자 용어 A to Z - 초보자를 위한 용어 사전.',
  },
}

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
