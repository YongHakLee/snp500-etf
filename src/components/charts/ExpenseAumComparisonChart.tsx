'use client'

import { useMemo } from 'react'
import type { ExpenseAumChartData } from '@/types'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ExpenseAumComparisonChartProps {
  data: ExpenseAumChartData[]
}

// 통일된 색상 상수
const EXPENSE_COLOR = 'hsl(142, 71%, 45%)' // 녹색 (보수율)
const AUM_COLOR = 'hsl(217, 91%, 60%)' // 파란색 (순자산)

export function ExpenseAumComparisonChart({ data }: ExpenseAumComparisonChartProps) {
  // 퍼센트 계산을 위한 최대값
  const maxExpense = useMemo(() => Math.max(...data.map(d => d.expenseRatio)), [data])
  const maxAum = useMemo(() => Math.max(...data.map(d => d.aumBillions)), [data])

  return (
    <div
      role="img"
      aria-label="ETF 보수율 및 순자산 비교: 미국 S&P500 ETF의 연간 보수율과 순자산 규모를 비교합니다."
    >
      {/* 범례 설명 */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: EXPENSE_COLOR }} />
          <span>보수율 (낮을수록 좋음)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: AUM_COLOR }} />
          <span>순자산 (클수록 안정적)</span>
        </div>
      </div>

      {/* ETF 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {data.map((item, index) => {
          // 보수율: 최대값 대비 퍼센트 (바가 길수록 보수율이 높음)
          const expensePercent = (item.expenseRatio / maxExpense) * 100
          // 순자산: 최대값 대비 퍼센트 (바가 길수록 순자산이 큼)
          const aumPercent = (item.aumBillions / maxAum) * 100

          return (
            <Card
              key={index}
              className={cn(
                "transition-all hover:shadow-md",
                item.isOptimal && "ring-2 ring-green-500 shadow-md"
              )}
            >
              <CardContent className="p-4 space-y-3">
                {/* 헤더: 티커 + 추천 뱃지 */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{item.ticker}</span>
                  {item.isOptimal && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      추천
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">{item.name}</div>

                {/* 보수율 바 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: EXPENSE_COLOR }} />
                      <span className="text-muted-foreground">보수율</span>
                    </span>
                    <span className="font-mono font-semibold">{item.expenseRatio.toFixed(4)}%</span>
                  </div>
                  <Progress
                    value={expensePercent}
                    className="h-2 bg-muted [&>div]:transition-all"
                    style={{
                      ['--progress-color' as string]: EXPENSE_COLOR
                    }}
                  />
                </div>

                {/* 순자산 바 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: AUM_COLOR }} />
                      <span className="text-muted-foreground">순자산</span>
                    </span>
                    <span className="font-mono font-semibold">{item.aumDisplay}</span>
                  </div>
                  <Progress
                    value={aumPercent}
                    className="h-2 bg-muted [&>div]:transition-all"
                    style={{
                      ['--progress-color' as string]: AUM_COLOR
                    }}
                  />
                </div>

                {/* 추천 ETF 추가 설명 */}
                {item.isOptimal && (
                  <p className="text-[10px] text-green-600 dark:text-green-400 pt-1 border-t border-dashed">
                    낮은 보수율 + 큰 규모 = 장기투자 최적
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 차트 하단 설명 */}
      <div className="mt-4 grid gap-3 text-xs text-muted-foreground md:grid-cols-2">
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: EXPENSE_COLOR }} />
            보수율 (Expense Ratio)
          </div>
          <p className="mt-1">
            ETF 운용사에 매년 지불하는 수수료입니다.
            0.03% 수준이면 매우 저렴하며, 장기 투자 시 복리 효과로 큰 차이를 만듭니다.
          </p>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: AUM_COLOR }} />
            순자산 (AUM)
          </div>
          <p className="mt-1">
            펀드에 투자된 총 자산 규모입니다.
            규모가 클수록 유동성이 좋고, 운용 효율성이 높아 안정적입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
