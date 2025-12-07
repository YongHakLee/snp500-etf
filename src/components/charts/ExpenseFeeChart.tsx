'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

// 비용 비교 데이터 (10년 투자 시 1,000만원 기준)
const feeComparisonData = [
  {
    type: '개별주',
    expenseRatio: 0,
    annualFee: 0,
    tenYearCost: 0,
    color: 'var(--chart-3)',
  },
  {
    type: 'ETF',
    expenseRatio: 0.05,
    annualFee: 5000,
    tenYearCost: 50000,
    color: 'var(--chart-1)',
  },
  {
    type: '펀드',
    expenseRatio: 1.5,
    annualFee: 150000,
    tenYearCost: 1500000,
    color: 'var(--chart-4)',
  },
]

const chartConfig = {
  tenYearCost: {
    label: '10년 총 비용',
  },
}

export function ExpenseFeeChart() {
  const formatCurrency = (value: number) => {
    if (value === 0) return '0원'
    if (value >= 1000000) return `${(value / 10000).toFixed(0)}만원`
    if (value >= 10000) return `${(value / 10000).toFixed(1)}만원`
    return `${value.toLocaleString()}원`
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground text-center">
        1,000만원 투자 시 10년간 비용 비교 (단순 계산)
      </div>
      <ChartContainer config={chartConfig} className="h-[180px] w-full md:h-[240px]">
        <BarChart
          accessibilityLayer
          data={feeComparisonData}
          layout="vertical"
          margin={{ left: 0, right: 60 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis
            dataKey="type"
            type="category"
            tickLine={false}
            axisLine={false}
            width={50}
            tick={{ fontSize: 13, fontWeight: 500 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name, props) => {
                  const item = props.payload
                  return (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{item.type.replace('\n', ' ')}</span>
                      <span>보수율: {item.expenseRatio}%</span>
                      <span>연간 비용: {formatCurrency(item.annualFee)}</span>
                      <span className="font-semibold text-primary">
                        10년 총 비용: {formatCurrency(item.tenYearCost)}
                      </span>
                    </div>
                  )
                }}
              />
            }
          />
          <Bar dataKey="tenYearCost" radius={[0, 4, 4, 0]}>
            {feeComparisonData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="tenYearCost"
              position="right"
              offset={8}
              formatter={formatCurrency}
              className="fill-foreground text-xs md:text-sm"
            />
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* 비용 정보 카드 - 모든 화면에서 3열 */}
      <div className="grid grid-cols-3 gap-2 mt-4 md:gap-3">
        {feeComparisonData.map((item, index) => (
          <Card key={index} className="border-2 overflow-hidden" style={{ borderColor: item.color }}>
            <CardContent className="p-2 md:p-4 space-y-0.5 md:space-y-1.5">
              {/* 유형명 - 컬러 강조 */}
              <div
                className="font-bold text-sm md:text-base text-center"
                style={{ color: item.color }}
              >
                {item.type.replace('\n', ' ')}
              </div>

              {/* 10년 비용 - 가장 중요한 정보 */}
              <div className="text-base md:text-lg font-bold text-primary text-center">
                {formatCurrency(item.tenYearCost)}
              </div>

              {/* 세부 정보 - 보조 */}
              <div className="text-[10px] md:text-xs text-muted-foreground text-center space-y-0.5 pt-1 border-t border-dashed">
                <div>보수율: {item.expenseRatio}%</div>
                <div>연간: {formatCurrency(item.annualFee)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        * 펀드 보수율 1.5%는 일반적인 액티브 펀드 기준입니다
      </div>
    </div>
  )
}
