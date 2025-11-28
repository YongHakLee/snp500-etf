'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionCard } from '@/components/common/SectionCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Info, Building2, Shield, PiggyBank } from 'lucide-react'

// 증권사 비교 데이터
const brokers = [
  {
    name: '키움증권',
    fee: '국내 0.015%, 해외 0.25%',
    features: ['낮은 수수료', '영웅문 HTS/MTS', '해외주식 강점'],
  },
  {
    name: '미래에셋증권',
    fee: '국내 0.014%, 해외 0.25%',
    features: ['다양한 상품', '글로벌 네트워크', '연금 강점'],
  },
  {
    name: '삼성증권',
    fee: '국내 0.015%, 해외 0.25%',
    features: ['안정적인 시스템', 'POP HTS', '프리미엄 서비스'],
  },
  {
    name: '토스증권',
    fee: '국내 무료, 해외 무료',
    features: ['수수료 무료', '간편한 UI', '소수점 거래'],
  },
  {
    name: 'NH투자증권',
    fee: '국내 0.015%, 해외 0.25%',
    features: ['QV/나무 앱', '다양한 이벤트', '농협 연계'],
  },
]

// 비대면 계좌 개설 단계
const openingSteps = [
  {
    step: 1,
    title: '증권사 앱 설치',
    description: '원하는 증권사의 모바일 앱을 설치합니다. (예: 키움증권 영웅문S, 토스증권 등)',
  },
  {
    step: 2,
    title: '본인 인증',
    description: '휴대폰 본인인증 또는 공동인증서를 통해 본인 확인을 진행합니다.',
  },
  {
    step: 3,
    title: '신분증 촬영',
    description: '주민등록증 또는 운전면허증을 촬영하여 제출합니다.',
  },
  {
    step: 4,
    title: '계좌 정보 입력',
    description: '연결할 은행 계좌 정보와 비밀번호를 설정합니다.',
  },
  {
    step: 5,
    title: '개설 완료',
    description: '심사 후 계좌 개설이 완료됩니다. (보통 당일~1영업일 소요)',
  },
]

// ISA/IRP 계좌 정보
const taxAdvantageAccounts = [
  {
    type: 'ISA',
    name: '개인종합자산관리계좌',
    icon: Shield,
    benefits: [
      '비과세 200만원 (서민형 400만원)',
      '손익통산 가능',
      '다양한 금융상품 통합 관리',
    ],
    conditions: ['3년 의무 가입 기간', '연 2,000만원 납입 한도', '만 19세 이상'],
    suitable: '중단기(3~5년) 투자자',
  },
  {
    type: 'IRP',
    name: '개인형 퇴직연금',
    icon: PiggyBank,
    benefits: [
      '세액공제 최대 700만원 (연 900만원 납입 시)',
      '연금 수령 시 저율과세 (3.3~5.5%)',
      '퇴직금 수령 계좌로 활용',
    ],
    conditions: ['55세 이후 연금 수령', '중도 인출 제한', '근로/사업소득자'],
    suitable: '장기(10년 이상) 투자자, 노후 대비',
  },
]

// 체크리스트 항목
const checklistItems = [
  { id: 'id-card', label: '신분증 준비 (주민등록증 또는 운전면허증)' },
  { id: 'bank-account', label: '연결할 본인 명의 은행 계좌 준비' },
  { id: 'phone', label: '본인 명의 휴대폰 준비 (본인인증용)' },
  { id: 'broker-select', label: '증권사 선택 완료' },
  { id: 'account-type', label: '계좌 유형 결정 (일반/ISA/IRP)' },
]

export default function AccountPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const handleCheck = (itemId: string) => {
    setCheckedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <div className="container py-10">
      <PageHeader
        title="계좌 개설"
        description="S&P500 ETF 투자를 위한 첫 번째 단계, 증권 계좌 개설 방법을 안내합니다."
        breadcrumbs={[
          { label: '투자 가이드', href: '/guide' },
          { label: '계좌 개설', href: '/guide/account' },
        ]}
      />

      <div className="space-y-8">
        {/* 증권사 선택 가이드 */}
        <SectionCard
          title="증권사 선택 가이드"
          description="각 증권사별 수수료와 특징을 비교하여 자신에게 맞는 증권사를 선택하세요."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">증권사</TableHead>
                  <TableHead className="min-w-[180px]">수수료</TableHead>
                  <TableHead>특징</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokers.map((broker) => (
                  <TableRow key={broker.name}>
                    <TableCell className="font-medium">{broker.name}</TableCell>
                    <TableCell className="text-sm">{broker.fee}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {broker.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            * 수수료는 변동될 수 있으며, 이벤트에 따라 추가 할인이 적용될 수 있습니다.
          </p>
        </SectionCard>

        {/* 비대면 계좌 개설 단계 */}
        <SectionCard
          title="비대면 계좌 개설 단계"
          description="스마트폰만 있으면 집에서 간편하게 계좌를 개설할 수 있습니다."
        >
          <div className="space-y-4">
            {openingSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 절세 계좌 (ISA/IRP) */}
        <SectionCard
          title="절세 계좌 (ISA/IRP)"
          description="세금 혜택을 받을 수 있는 계좌를 활용하면 투자 수익을 극대화할 수 있습니다."
        >
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>절세 계좌란?</AlertTitle>
            <AlertDescription>
              일반 계좌와 달리 세금 혜택이 주어지는 특별한 계좌입니다.
              투자 목적과 기간에 맞는 계좌를 선택하세요.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2">
            {taxAdvantageAccounts.map((account) => {
              const Icon = account.icon
              return (
                <Card key={account.type}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Badge variant="outline">{account.type}</Badge>
                        <CardTitle className="mt-1 text-lg">{account.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-primary">주요 혜택</h3>
                      <ul className="space-y-1">
                        {account.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">가입 조건</h3>
                      <ul className="space-y-1">
                        {account.conditions.map((condition) => (
                          <li key={condition} className="text-sm text-muted-foreground">
                            • {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                      <p className="text-sm">
                        <strong>추천:</strong> {account.suitable}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </SectionCard>

        {/* 계좌 개설 체크리스트 */}
        <SectionCard
          title="계좌 개설 체크리스트"
          description="계좌 개설 전 아래 항목을 확인하세요."
        >
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <Checkbox
                  id={item.id}
                  checked={checkedItems.includes(item.id)}
                  onCheckedChange={() => handleCheck(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className={`cursor-pointer text-sm ${
                    checkedItems.includes(item.id)
                      ? 'text-muted-foreground line-through'
                      : ''
                  }`}
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {checkedItems.length}/{checklistItems.length}개 항목 완료
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
