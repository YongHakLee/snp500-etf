import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yonghaklee.github.io/snp500-etf'

  const routes = [
    // 메인
    '',
    // 기초 지식
    '/basics',
    '/basics/what-is-sp500',
    '/basics/etf-basics',
    '/basics/why-invest',
    // ETF 비교
    '/compare',
    '/compare/us-etf',
    '/compare/kr-etf',
    // 투자 가이드
    '/guide',
    '/guide/account',
    '/guide/first-buy',
    '/guide/strategy',
    '/guide/tax',
    // FAQ & 용어
    '/faq',
    '/glossary',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.split('/').length === 2 ? 0.8 : 0.6,
  }))
}
