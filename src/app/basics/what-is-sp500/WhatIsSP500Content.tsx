'use client'

import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import { DataStatus } from '@/components/common/DataStatus'
import { SectorCountChart } from '@/components/charts/SectorCountChart'
import { SectorRepresentativeCards } from '@/components/sp500/SectorRepresentativeCards'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'
import { useSectorCounts, useSectorRepresentatives } from '@/hooks'
import { Skeleton } from '@/components/ui/skeleton'

// S&P500 구성 조건 (2025년 7월 기준)
const inclusionCriteria = [
  { title: '시가총액', description: '227억 달러 이상 (2025년 7월 기준)' },
  { title: '유동성', description: '연간 거래량이 시가총액 대비 최소 100% 이상' },
  { title: '기업 유형', description: '미국 기업, 보통주만 포함' },
  { title: '재무 건전성', description: '최근 4분기 연속 순이익 흑자' },
  { title: '상장 기간', description: '최소 12개월 이상 상장' },
  { title: '유동 주식 비율', description: '발행 주식의 50% 이상이 유동 주식' },
]

export default function WhatIsSP500Content() {
  const {
    sectors: sectorCounts,
    totalStocks,
    isLive: isSectorCountLive,
    isLoading: isSectorCountLoading
  } = useSectorCounts()

  const {
    sectors: sectorReps,
    isLive: isSectorRepLive,
    isLoading: isSectorRepLoading
  } = useSectorRepresentatives(5)

  return (
    <div className="container py-10">
      <PageHeader
        title="S&P500이란?"
        description="미국을 대표하는 500개 대형 기업으로 구성된 주가지수, S&P500에 대해 알아보세요."
        breadcrumbs={[
          { label: '기초 지식', href: '/basics' },
          { label: 'S&P500이란?', href: '/basics/what-is-sp500' },
        ]}
      />

      <div className="space-y-8">
        {/* S&P500 정의 및 역사 */}
        <SectionCard title="S&P500 정의 및 역사">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              <strong className="text-foreground">S&P500(Standard & Poor&apos;s 500)</strong>은 미국의 신용평가사
              Standard & Poor&apos;s가 선정한 미국 증시에 상장된 시가총액 상위 500개 대형 기업의
              주가를 시가총액 가중 방식으로 산출한 주가지수입니다.
            </p>
            <div className="rounded-lg bg-accent-orange-muted border border-accent-orange/20 p-4">
              <h3 className="mb-2 font-semibold text-accent-orange">주요 연혁</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong className="text-foreground">1923년:</strong> Standard Statistics Company가 233개 종목으로 첫 지수 발표</li>
                <li><strong className="text-foreground">1957년:</strong> 500개 종목으로 확대되어 현재의 S&P500 탄생</li>
                <li><strong className="text-foreground">현재:</strong> 미국 주식시장 전체 시가총액의 약 80%를 대표</li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              S&P500은 미국 경제의 전반적인 건강 상태를 나타내는 핵심 지표로,
              전 세계 투자자들이 가장 많이 참고하는 벤치마크 지수입니다.
            </p>
          </div>
        </SectionCard>

        {/* 구성 조건 */}
        <SectionCard
          title="S&P500 구성 조건"
          description="S&P500에 포함되기 위해서는 다음 조건들을 충족해야 합니다."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inclusionCriteria.map((criteria) => (
              <div
                key={criteria.title}
                className="flex items-start gap-3 rounded-lg border p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-orange" />
                <div>
                  <h3 className="font-medium">{criteria.title}</h3>
                  <p className="text-sm text-muted-foreground">{criteria.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            * S&P 다우존스 인덱스 위원회가 분기별로 구성 종목을 검토하며,
            조건을 충족하지 못하는 기업은 제외되고 새로운 기업이 편입됩니다.
          </p>
        </SectionCard>

        {/* 섹터별 종목 수 분포 */}
        <SectionCard
          title="섹터별 종목 수 분포"
          description="S&P500은 11개 섹터로 구성되어 있습니다. 각 섹터에 포함된 종목 수를 확인하세요."
        >
          <div className="mb-2">
            <DataStatus isLive={isSectorCountLive} />
          </div>
          {isSectorCountLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <SectorCountChart data={sectorCounts} totalStocks={totalStocks} />
          )}
          <div className="mt-6 grid gap-2 text-sm grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sectorCounts.map((sector) => (
              <div key={sector.sector} className="flex justify-between items-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span>{sector.sectorKr}</span>
                </div>
                <Badge variant="secondary">{sector.count}개 ({sector.percentage}%)</Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 섹터별 대표 종목 */}
        <SectionCard
          title="섹터별 대표 종목"
          description="각 섹터를 대표하는 주요 기업들을 확인하세요. FinanceDataReader를 통해 실시간 구성 종목 데이터를 제공합니다."
        >
          <div className="mb-4">
            <DataStatus isLive={isSectorRepLive} />
          </div>
          {isSectorRepLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : (
            <SectorRepresentativeCards data={sectorReps} />
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            * 각 카드에는 해당 섹터의 대표 종목 5개가 표시됩니다.
            전체 종목 수는 카드 상단의 배지에서 확인할 수 있습니다.
          </p>
        </SectionCard>
      </div>
    </div>
  )
}
