import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerLinks = [
  {
    title: '기초 지식',
    links: [
      { label: 'S&P500이란?', href: '/basics/what-is-sp500' },
      { label: 'ETF 기초', href: '/basics/etf-basics' },
      { label: '왜 투자하나?', href: '/basics/why-invest' },
    ],
  },
  {
    title: 'ETF 비교',
    links: [
      { label: '미국 ETF', href: '/compare/us-etf' },
      { label: '한국 ETF', href: '/compare/kr-etf' },
    ],
  },
  {
    title: '투자 가이드',
    links: [
      { label: '계좌 개설', href: '/guide/account' },
      { label: '첫 매수', href: '/guide/first-buy' },
      { label: '투자 전략', href: '/guide/strategy' },
      { label: '세금 안내', href: '/guide/tax' },
    ],
  },
  {
    title: '기타',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: '용어 사전', href: '/glossary' },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-neutral-50 dark:bg-neutral-900 mb-16 md:mb-0">
      <div className="container py-8 md:py-12">
        {/* 상단: 사이트 정보 + 링크 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* 사이트 정보 */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-bold text-lg">
              S&P500 ETF
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              주식초보자를 위한 S&P500 ETF 투자 가이드
            </p>
          </div>

          {/* 링크 그룹 */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-sm">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* 투자 면책조항 */}
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            본 사이트의 정보는 투자 권유가 아니며, 투자 결정과 그에 따른 책임은 투자자 본인에게 있습니다.
            제공되는 정보는 참고용으로만 활용하시기 바랍니다.
          </p>
        </div>

        <Separator className="my-8" />

        {/* 저작권 표시 */}
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} S&P500 ETF Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
