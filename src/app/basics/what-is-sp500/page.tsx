import type { Metadata } from 'next'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import { LazySectorChart } from '@/components/basics/LazySectorChart'

export const metadata: Metadata = {
  title: 'S&P500이란?',
  description: '미국을 대표하는 500개 대형 기업으로 구성된 S&P500 지수의 정의, 역사, 구성 조건, Top 10 종목을 알아보세요.',
  openGraph: {
    title: 'S&P500이란?',
    description: '미국을 대표하는 500개 대형 기업으로 구성된 S&P500 지수.',
  },
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

import top10Data from '@/data/sp500-top10.json'
import sectorData from '@/data/sector-allocation.json'
import { TopStock, SectorAllocation } from '@/types'

const stocks = top10Data.stocks as TopStock[]
const sectors = sectorData.sectors as SectorAllocation[]

// 섹터 한글 매핑
const sectorKrMap: Record<string, string> = {
  'Information Technology': '정보기술',
  'Consumer Discretionary': '임의소비재',
  'Communication Services': '커뮤니케이션 서비스',
  'Financials': '금융',
  'Health Care': '헬스케어',
}

// S&P500 구성 조건
const inclusionCriteria = [
  { title: '시가총액', description: '180억 달러 이상 (2024년 기준)' },
  { title: '유동성', description: '연간 거래량이 시가총액 대비 최소 100% 이상' },
  { title: '기업 유형', description: '미국 기업, 보통주만 포함' },
  { title: '재무 건전성', description: '최근 4분기 연속 순이익 흑자' },
  { title: '상장 기간', description: '최소 12개월 이상 상장' },
  { title: '유동 주식 비율', description: '발행 주식의 50% 이상이 유동 주식' },
]

export default function WhatIsSP500Page() {
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
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4">
              <h3 className="mb-2 font-semibold">주요 연혁</h3>
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
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
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

        {/* Top 10 구성 종목 */}
        <SectionCard
          title="Top 10 구성 종목"
          description="S&P500 지수에서 가장 큰 비중을 차지하는 상위 10개 기업입니다."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">순위</TableHead>
                  <TableHead>티커</TableHead>
                  <TableHead>기업명</TableHead>
                  <TableHead>섹터</TableHead>
                  <TableHead className="text-right">비중</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock.ticker}>
                    <TableCell className="font-medium">{stock.rank}</TableCell>
                    <TableCell className="font-mono font-semibold">{stock.ticker}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {sectorKrMap[stock.sector] || stock.sector}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{stock.weight}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            * 상위 10개 종목이 전체 지수의 약 {stocks.reduce((sum, s) => sum + s.weight, 0).toFixed(1)}%를 차지합니다.
            데이터는 정기적으로 변동될 수 있습니다.
          </p>
        </SectionCard>

        {/* 섹터별 비중 차트 */}
        <SectionCard
          title="섹터별 비중"
          description="S&P500은 11개 섹터로 구성되어 있으며, 정보기술 섹터가 가장 큰 비중을 차지합니다."
        >
          <LazySectorChart data={sectors} />
          <div className="mt-6 grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
            {sectors.slice(0, 6).map((sector) => (
              <div key={sector.sector} className="flex justify-between rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-2">
                <span>{sector.sectorKr}</span>
                <span className="font-medium">{sector.allocation}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
