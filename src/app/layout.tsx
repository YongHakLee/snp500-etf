import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SWRProvider } from '@/components/providers/SWRProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { SITE_CONFIG } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  title: {
    default: '주식초보자를 위한 S&P500 ETF 가이드',
    template: '%s | S&P500 ETF 가이드'
  },
  description: 'S&P500 ETF 투자 방법, 비교 분석, 세금 정보를 한눈에. 초보자도 쉽게 이해할 수 있는 완벽 가이드.',
  keywords: ['S&P500', 'ETF', '주식투자', 'VOO', 'SPY', 'TIGER', '미국주식', '적립식투자', '장기투자'],
  authors: [{ name: 'S&P500 ETF 가이드' }],
  openGraph: {
    title: 'S&P500 ETF 완벽 가이드',
    description: '초보자를 위한 S&P500 ETF 투자 가이드',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'S&P500 ETF 가이드',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'S&P500 ETF 가이드',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S&P500 ETF 완벽 가이드',
    description: '초보자를 위한 S&P500 ETF 투자 가이드',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <SWRProvider>
            {/* Skip to main content 링크 - 키보드 접근성 */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              본문으로 건너뛰기
            </a>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer />
              <BottomTabBar />
            </div>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
