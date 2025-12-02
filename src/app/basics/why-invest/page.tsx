import type { Metadata } from 'next'
import WhyInvestContent from './WhyInvestContent'

export const metadata: Metadata = {
  title: '왜 S&P500에 투자하나?',
  description: 'S&P500의 장기 수익률 데이터, 분산 투자 효과, 복리의 힘을 통해 투자해야 하는 이유를 알아보세요.',
  openGraph: {
    title: '왜 S&P500에 투자하나?',
    description: 'S&P500의 장기 수익률과 분산 투자 효과.',
  },
}

export default function WhyInvestPage() {
  return <WhyInvestContent />
}
