import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '증권 계좌 개설 가이드',
  description: '비대면 계좌 개설 방법, 증권사 선택 가이드, ISA/IRP 절세 계좌 설명을 확인하세요.',
  openGraph: {
    title: '증권 계좌 개설 가이드',
    description: '비대면 계좌 개설과 절세 계좌 안내.',
  },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
