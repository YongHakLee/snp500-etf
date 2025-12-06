'use client'

import { useState, useEffect } from 'react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, LabelList } from 'recharts'
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      <ChartContainer config={chartConfig} className="h-[250px] w-full md:h-[300px]">
        <BarChart
          data={feeComparisonData}
          layout={isMobile ? 'vertical' : 'horizontal'}
          margin={isMobile
            ? { top: 5, right: 60, left: 60, bottom: 5 }
            : { top: 20, right: 30, left: 20, bottom: 40 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" vertical={!isMobile} horizontal={isMobile} />
          {isMobile ? (
            <>
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <YAxis
                type="category"
                dataKey="type"
                tickLine={false}
                axisLine={false}
                width={50}
                tick={{ fontSize: 12 }}
              />
            </>
          ) : (
            <>
              <XAxis
                type="category"
                dataKey="type"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                height={50}
              />
              <YAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
            </>
          )}
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
          <Bar dataKey="tenYearCost" radius={[4, 4, 0, 0]}>
            {feeComparisonData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            {!isMobile && (
              <LabelList
                dataKey="tenYearCost"
                position="top"
                formatter={formatCurrency}
                className="text-xs fill-muted-foreground"
              />
            )}
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* 상세 정보 카드 */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {feeComparisonData.map((item, index) => (
          <Card key={index} className="border-2" style={{ borderColor: item.color }}>
            <CardContent className="p-3 space-y-1">
              <div className="font-medium text-sm">{item.type.replace('\n', ' ')}</div>
              <div className="text-xs text-muted-foreground">보수율: {item.expenseRatio}%</div>
              <div className="text-xs text-muted-foreground">연간: {formatCurrency(item.annualFee)}</div>
              <div className="text-sm font-semibold text-primary">
                10년: {formatCurrency(item.tenYearCost)}
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
