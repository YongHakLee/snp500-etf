'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// 메뉴 데이터 구조 (Navigation.tsx와 동일)
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

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]">
          <Menu className="h-6 w-6" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(300px,85vw)] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>메뉴</SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {/* 드롭다운 메뉴 항목 (아코디언) */}
            {menuItems.map((item) => (
              <AccordionItem key={item.href} value={item.href}>
                <AccordionTrigger className="min-h-[44px] text-base">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={handleLinkClick}
                          className="block min-h-[44px] rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <span className="font-medium">{child.title}</span>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {child.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* 단일 링크 항목 */}
          <div className="mt-4 space-y-1 border-t pt-4">
            {singleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="block min-h-[44px] rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
