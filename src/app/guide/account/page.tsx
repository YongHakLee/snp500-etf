import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Info, Landmark, PiggyBank } from "lucide-react";

// 증권사 소개 데이터
const brokers = [
  {
    name: "미래에셋증권",
    description: "글로벌 네트워크와 다양한 금융상품을 갖춘 대형 증권사",
    features: ["글로벌 네트워크", "다양한 상품", "연금/퇴직연금 강점"],
  },
  {
    name: "키움증권",
    description: "개인 투자자 거래량 1위, 영웅문 HTS/MTS로 유명",
    features: ["영웅문 HTS/MTS", "해외주식 강점", "활발한 거래"],
  },
  {
    name: "삼성증권",
    description: "안정적인 시스템과 프리미엄 자산관리 서비스",
    features: ["안정적인 시스템", "POP HTS", "프리미엄 서비스"],
  },
  {
    name: "토스증권",
    description: "간편한 UI와 소수점 거래로 주식 초보자에게 적합",
    features: ["간편한 UI", "소수점 거래", "초보자 친화적"],
  },
  {
    name: "NH투자증권",
    description: "높은 재무 안정성과 다양한 이벤트 제공",
    features: ["QV/나무 앱", "다양한 이벤트", "높은 안정성"],
  },
];

// 비대면 계좌 개설 단계
const openingSteps = [
  {
    step: 1,
    title: "증권사 앱 설치",
    description:
      "원하는 증권사의 모바일 앱을 설치합니다. (예: 키움증권 영웅문S, 토스증권 등)",
  },
  {
    step: 2,
    title: "본인 인증",
    description:
      "휴대폰 본인인증 또는 공동인증서를 통해 본인 확인을 진행합니다.",
  },
  {
    step: 3,
    title: "신분증 촬영",
    description: "주민등록증 또는 운전면허증을 촬영하여 제출합니다.",
  },
  {
    step: 4,
    title: "계좌 정보 입력",
    description: "연결할 은행 계좌 정보와 비밀번호를 설정합니다.",
  },
  {
    step: 5,
    title: "개설 완료",
    description: "심사 후 계좌 개설이 완료됩니다. (보통 당일~1영업일 소요)",
  },
];

// ISA/IRP 계좌 정보
const taxAdvantageAccounts = [
  {
    type: "ISA",
    name: "ISA 계좌",
    description: "개인종합자산관리계좌 - 중단기 절세 투자",
    icon: Landmark,
    iconColor: "text-green-600 dark:text-green-400",
    benefits: [
      "비과세 200만원 (서민형 400만원)",
      "손익통산 가능",
      "다양한 금융상품 통합 관리",
    ],
    conditions: [
      { text: "연 2,000만원 납입 한도", highlight: false },
      { text: "만 19세 이상", highlight: false },
    ],
    importantCondition: "3년 의무 가입 기간",
    suitable: "중단기(3~5년) 투자자",
    disclaimer:
      "ISA에서는 TIGER, KODEX 등 국내 상장 S&P500 ETF만 매수 가능합니다.",
  },
  {
    type: "IRP",
    name: "IRP 계좌",
    description: "개인형 퇴직연금 - 장기 노후 대비",
    icon: PiggyBank,
    iconColor: "text-blue-600 dark:text-blue-400",
    benefits: [
      "연금저축+IRP 합산 연 900만원까지 세액공제 (13.2%~16.5%)",
      "연금 수령 시 저율과세 (3.3~5.5%)",
      "퇴직금 수령 계좌로 활용",
    ],
    conditions: [
      { text: "중도 인출 제한", highlight: false },
      { text: "근로/사업소득자", highlight: false },
    ],
    importantCondition: "55세 이후 연금 수령 필수",
    suitable: "장기(10년 이상) 투자자, 노후 대비",
    disclaimer: "연금계좌에서도 국내 상장 S&P500 ETF로 투자해야 합니다.",
  },
];

// 체크리스트 항목
const checklistItems = [
  "신분증 준비 (주민등록증 또는 운전면허증)",
  "연결할 본인 명의 은행 계좌 준비",
  "본인 명의 휴대폰 준비 (본인인증용)",
  "증권사 선택 완료",
  "계좌 유형 결정 (일반/ISA/IRP)",
];

export default function AccountPage() {
  return (
    <div className="container py-10">
      <PageHeader
        title="계좌 개설"
        description="S&P500 ETF 투자를 위한 첫 번째 단계, 증권 계좌 개설 방법을 안내합니다."
        breadcrumbs={[
          { label: "투자 가이드", href: "/guide" },
          { label: "계좌 개설", href: "/guide/account" },
        ]}
      />

      <div className="space-y-8">
        {/* 주요 증권사 소개 */}
        <SectionCard
          title="주요 증권사 소개"
          description="국내 대표 증권사들을 소개합니다. 각 증권사의 특징을 비교하여 자신에게 맞는 곳을 선택하세요."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {brokers.map((broker) => (
              <Card key={broker.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{broker.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {broker.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {broker.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            * 수수료는 이벤트에 따라 다를 수 있으니 각 증권사 홈페이지를
            확인하세요.
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-orange text-sm font-bold text-accent-orange-foreground">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
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
              일반 계좌와 달리 세금 혜택이 주어지는 특별한 계좌입니다. 투자
              목적과 기간에 맞는 계좌를 선택하세요.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            {taxAdvantageAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <Card key={account.type}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className={`h-5 w-5 ${account.iconColor}`} />
                      {account.name}
                    </CardTitle>
                    <CardDescription>{account.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* 주요 혜택 */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium">주요 혜택</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {account.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 가입 조건 */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                        가입 조건
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {account.conditions.map((condition) => (
                          <li key={condition.text}>• {condition.text}</li>
                        ))}
                        <li className="font-medium text-accent-orange">
                          • {account.importantCondition}
                        </li>
                      </ul>
                    </div>

                    {/* 추천 및 면책조항 */}
                    <div className="border-t pt-3">
                      <p className="text-sm">
                        <span className="font-medium">추천:</span>{" "}
                        <span className="text-muted-foreground">
                          {account.suitable}
                        </span>
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {account.disclaimer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
