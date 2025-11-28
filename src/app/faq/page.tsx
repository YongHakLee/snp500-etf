'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import faqData from '@/data/faq.json'
import { FAQItem } from '@/types'

const faqs = faqData.faqs as FAQItem[]

const categoryLabels: Record<FAQItem['category'], string> = {
  basics: '기초',
  investing: '투자',
  tax: '세금',
  general: '기타',
}

const categoryColors: Record<FAQItem['category'], string> = {
  basics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  investing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  tax: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  general: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const faqCounts = useMemo(() => {
    const counts: Record<string, number> = { all: faqs.length }
    faqs.forEach((faq) => {
      counts[faq.category] = (counts[faq.category] || 0) + 1
    })
    return counts
  }, [])

  return (
    <div className="container py-10">
      <PageHeader
        title="자주 묻는 질문"
        description="S&P500 ETF 투자에 대해 자주 묻는 질문들을 모았습니다."
        breadcrumbs={[{ label: 'FAQ', href: '/faq' }]}
      />

      <div className="space-y-6">
        {/* 검색 입력창 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="질문을 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 카테고리 탭 */}
        <Tabs
          defaultValue="all"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              전체 ({faqCounts.all})
            </TabsTrigger>
            <TabsTrigger value="basics">
              기초 ({faqCounts.basics || 0})
            </TabsTrigger>
            <TabsTrigger value="investing">
              투자 ({faqCounts.investing || 0})
            </TabsTrigger>
            <TabsTrigger value="tax">
              세금 ({faqCounts.tax || 0})
            </TabsTrigger>
            <TabsTrigger value="general">
              기타 ({faqCounts.general || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <SectionCard>
              {filteredFaqs.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>검색 결과가 없습니다.</p>
                  <p className="mt-2 text-sm">다른 키워드로 검색해 보세요.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={categoryColors[faq.category]}
                          >
                            {categoryLabels[faq.category]}
                          </Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p className="pl-16">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </SectionCard>
          </TabsContent>
        </Tabs>

        {/* 추가 안내 */}
        <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
          <p>
            찾으시는 답변이 없으신가요?{' '}
            <span className="font-medium text-foreground">
              용어 사전
            </span>
            에서 ETF 관련 용어를 확인하거나,{' '}
            <span className="font-medium text-foreground">
              투자 가이드
            </span>
            에서 더 자세한 정보를 확인하실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
