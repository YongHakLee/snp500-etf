'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

// 메뉴 데이터 구조 정의
const menuItems = [
  {
    title: '기초 지식',
    href: '/basics',
    children: [
      {
        title: 'S&P500이란?',
        href: '/basics/what-is-sp500',
        description: 'S&P500 지수의 정의와 구성 종목에 대해 알아봅니다.',
      },
      {
        title: 'ETF 기초',
        href: '/basics/etf-basics',
        description: 'ETF의 개념과 작동 원리를 이해합니다.',
      },
      {
        title: '왜 투자하나?',
        href: '/basics/why-invest',
        description: 'S&P500 투자의 장점과 역사적 수익률을 살펴봅니다.',
      },
    ],
  },
  {
    title: 'ETF 비교',
    href: '/compare',
    children: [
      {
        title: '미국 ETF',
        href: '/compare/us-etf',
        description: 'SPY, VOO, IVV 등 미국 상장 ETF를 비교합니다.',
      },
      {
        title: '한국 ETF',
        href: '/compare/kr-etf',
        description: 'TIGER, KODEX 등 국내 상장 ETF를 비교합니다.',
      },
    ],
  },
  {
    title: '투자 가이드',
    href: '/guide',
    children: [
      {
        title: '계좌 개설',
        href: '/guide/account',
        description: '증권 계좌 개설 방법을 안내합니다.',
      },
      {
        title: '첫 매수',
        href: '/guide/first-buy',
        description: 'ETF 첫 매수 방법을 단계별로 설명합니다.',
      },
      {
        title: '투자 전략',
        href: '/guide/strategy',
        description: '적립식 투자와 분산 투자 전략을 알아봅니다.',
      },
      {
        title: '세금 안내',
        href: '/guide/tax',
        description: 'ETF 투자 관련 세금 정보를 제공합니다.',
      },
    ],
  },
]

const singleLinks = [
  { title: 'FAQ', href: '/faq' },
  { title: '용어 사전', href: '/glossary' },
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  return (
    <NavigationMenu className={cn(className)}>
      <NavigationMenuList>
        {/* 드롭다운 메뉴 항목 */}
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[calc(100vw-2rem)] max-w-[400px] gap-3 p-4 md:max-w-[500px] md:grid-cols-2 lg:max-w-[600px]">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={child.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {child.title}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {child.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        {/* 단일 링크 항목 */}
        {singleLinks.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              <Link href={link.href} className={navigationMenuTriggerStyle()}>
                {link.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
