'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import glossaryData from '@/data/glossary.json'
import { GlossaryTerm } from '@/types'

const terms = glossaryData.terms as GlossaryTerm[]

// 한글 초성 추출 함수
function getKoreanInitial(char: string): string {
  const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
  const code = char.charCodeAt(0) - 44032
  if (code < 0 || code > 11171) return char
  return INITIALS[Math.floor(code / 588)]
}

// 한글인지 확인
function isKorean(char: string): boolean {
  const code = char.charCodeAt(0)
  return code >= 44032 && code <= 55203
}

// 용어 ID 생성
function getTermId(term: string): string {
  return `term-${term.toLowerCase().replace(/\s+/g, '-')}`
}

// 섹션 ID 생성
function getSectionId(initial: string): string {
  return `section-${initial}`
}

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // 검색 필터링
  const filteredTerms = useMemo(() => {
    if (!searchQuery) return terms
    const query = searchQuery.toLowerCase()
    return terms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.korean.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // 영어/한글 분리 및 정렬
  const { englishTerms, koreanTerms } = useMemo(() => {
    const english: GlossaryTerm[] = []
    const korean: GlossaryTerm[] = []

    filteredTerms.forEach((term) => {
      const firstChar = term.term.charAt(0)
      if (isKorean(firstChar)) {
        korean.push(term)
      } else {
        english.push(term)
      }
    })

    // 알파벳순 정렬
    english.sort((a, b) => a.term.localeCompare(b.term, 'en'))
    // 가나다순 정렬
    korean.sort((a, b) => a.term.localeCompare(b.term, 'ko'))

    return { englishTerms: english, koreanTerms: korean }
  }, [filteredTerms])

  // 그룹화된 영어 용어
  const groupedEnglishTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {}
    englishTerms.forEach((term) => {
      const initial = term.term.charAt(0).toUpperCase()
      if (!groups[initial]) {
        groups[initial] = []
      }
      groups[initial].push(term)
    })
    return groups
  }, [englishTerms])

  // 그룹화된 한글 용어
  const groupedKoreanTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {}
    koreanTerms.forEach((term) => {
      const initial = getKoreanInitial(term.term.charAt(0))
      if (!groups[initial]) {
        groups[initial] = []
      }
      groups[initial].push(term)
    })
    return groups
  }, [koreanTerms])

  // 인덱스 목록 생성
  const englishIndices = useMemo(() => Object.keys(groupedEnglishTerms).sort(), [groupedEnglishTerms])
  const koreanIndices = useMemo(() => {
    const order = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
    return Object.keys(groupedKoreanTerms).sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }, [groupedKoreanTerms])

  // 인덱스 클릭 시 스크롤
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // 관련 용어 클릭 시 스크롤
  const scrollToTerm = useCallback((termName: string) => {
    // 용어가 존재하는지 확인
    const targetTerm = terms.find((t) => t.term === termName || t.korean === termName)
    if (targetTerm) {
      const termId = getTermId(targetTerm.term)
      const element = document.getElementById(termId)
      if (element) {
        // 검색어 초기화하여 모든 용어 표시
        setSearchQuery('')
        // 약간의 딜레이 후 스크롤 (검색어 초기화 후 렌더링 대기)
        setTimeout(() => {
          const el = document.getElementById(termId)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // 하이라이트 효과
            el.classList.add('ring-2', 'ring-primary')
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-primary')
            }, 2000)
          }
        }, 100)
      }
    }
  }, [])

  // 용어 카드 렌더링
  const renderTermCard = (term: GlossaryTerm) => (
    <div
      key={term.term}
      id={getTermId(term.term)}
      className="rounded-lg border bg-card p-4 transition-all duration-300"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-semibold">{term.term}</h3>
          {term.term !== term.korean && (
            <span className="text-sm text-muted-foreground">({term.korean})</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{term.definition}</p>
        {term.related.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">관련 용어:</span>
            {term.related.map((relatedTerm) => {
              const exists = terms.some((t) => t.term === relatedTerm || t.korean === relatedTerm)
              return (
                <Badge
                  key={relatedTerm}
                  variant={exists ? 'secondary' : 'outline'}
                  className={exists ? 'cursor-pointer hover:bg-secondary/80' : 'opacity-50'}
                  onClick={() => exists && scrollToTerm(relatedTerm)}
                >
                  {relatedTerm}
                </Badge>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="container py-10">
      <PageHeader
        title="용어 사전"
        description="ETF 투자에 필요한 용어들을 정리했습니다."
        breadcrumbs={[{ label: '용어 사전', href: '/glossary' }]}
      />

      <div className="space-y-6">
        {/* 검색 입력창 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="용어를 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 인덱스 네비게이션 */}
        {!searchQuery && (englishIndices.length > 0 || koreanIndices.length > 0) && (
          <SectionCard>
            <div className="flex flex-wrap items-center gap-2">
              {/* 영어 인덱스 */}
              {englishIndices.length > 0 && (
                <>
                  <span className="text-sm font-medium text-muted-foreground">영어:</span>
                  {englishIndices.map((index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(getSectionId(index))}
                      className="flex h-8 w-8 items-center justify-center rounded-md border bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {index}
                    </button>
                  ))}
                </>
              )}

              {/* 구분선 */}
              {englishIndices.length > 0 && koreanIndices.length > 0 && (
                <Separator orientation="vertical" className="h-8 mx-2" />
              )}

              {/* 한글 인덱스 */}
              {koreanIndices.length > 0 && (
                <>
                  <span className="text-sm font-medium text-muted-foreground">한글:</span>
                  {koreanIndices.map((index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(getSectionId(index))}
                      className="flex h-8 w-8 items-center justify-center rounded-md border bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {index}
                    </button>
                  ))}
                </>
              )}
            </div>
          </SectionCard>
        )}

        {/* 검색 결과 없음 */}
        {filteredTerms.length === 0 && (
          <SectionCard>
            <div className="py-8 text-center text-muted-foreground">
              <p>검색 결과가 없습니다.</p>
              <p className="mt-2 text-sm">다른 키워드로 검색해 보세요.</p>
            </div>
          </SectionCard>
        )}

        {/* 용어 목록 */}
        {filteredTerms.length > 0 && (
          <ScrollArea className="h-[600px] rounded-lg border">
            <div className="p-4 space-y-8">
              {/* 영어 용어 섹션 */}
              {englishIndices.map((index) => (
                <section key={index} id={getSectionId(index)}>
                  <h2 className="sticky top-0 z-10 mb-4 bg-background py-2 text-xl font-bold border-b">
                    {index}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {groupedEnglishTerms[index].map(renderTermCard)}
                  </div>
                </section>
              ))}

              {/* 영어와 한글 사이 구분선 */}
              {englishIndices.length > 0 && koreanIndices.length > 0 && (
                <Separator className="my-8" />
              )}

              {/* 한글 용어 섹션 */}
              {koreanIndices.map((index) => (
                <section key={index} id={getSectionId(index)}>
                  <h2 className="sticky top-0 z-10 mb-4 bg-background py-2 text-xl font-bold border-b">
                    {index}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {groupedKoreanTerms[index].map(renderTermCard)}
                  </div>
                </section>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* 안내 메시지 */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-4 text-sm text-muted-foreground">
          <p>
            ETF 투자에 대해 더 궁금한 점이 있으신가요?{' '}
            <span className="font-medium text-foreground">FAQ</span>에서 자주 묻는 질문을
            확인하거나,{' '}
            <span className="font-medium text-foreground">투자 가이드</span>에서 더 자세한
            정보를 확인하실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
