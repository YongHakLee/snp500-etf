import type { Metadata } from 'next'
import { PageHeader } from '@/components/common/PageHeader'
import { ETFBasicsContent } from './ETFBasicsContent'

export const metadata: Metadata = {
  title: 'ETF 기초',
  description: 'ETF의 정의와 작동 원리, 개별주/펀드와의 차이점, NAV, iNAV, 괴리율 등 주요 용어를 설명합니다.',
  openGraph: {
    title: 'ETF 기초',
    description: 'ETF의 정의와 작동 원리를 알아보세요.',
  },
}

export default function ETFBasicsPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="ETF 기초"
        description="ETF(상장지수펀드)의 정의, 작동 원리, 주요 용어를 이해하고 다른 투자 상품과 비교해보세요."
        breadcrumbs={[
          { label: '기초 지식', href: '/basics' },
          { label: 'ETF 기초', href: '/basics/etf-basics' },
        ]}
      />

      <ETFBasicsContent />
    </div>
  )
}
