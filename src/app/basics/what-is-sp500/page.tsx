import type { Metadata } from 'next'
import WhatIsSP500Content from './WhatIsSP500Content'

export const metadata: Metadata = {
  title: 'S&P500이란?',
  description: '미국을 대표하는 500개 대형 기업으로 구성된 S&P500 지수의 정의, 역사, 구성 조건, Top 10 종목을 알아보세요.',
  openGraph: {
    title: 'S&P500이란?',
    description: '미국을 대표하는 500개 대형 기업으로 구성된 S&P500 지수.',
  },
}

export default function WhatIsSP500Page() {
  return <WhatIsSP500Content />
}
