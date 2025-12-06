'use client'

import * as React from 'react'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Check, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { USEtf, KREtf } from '@/types'

/**
 * AUM 문자열을 숫자로 파싱 (정렬용)
 * "562B" → 562, "98B" → 98, "1.5T" → 1500
 */
function parseAum(aum: string): number {
  const match = aum.match(/^([\d.]+)([BTM]?)$/)
  if (!match) return 0

  const value = parseFloat(match[1])
  const unit = match[2]

  switch (unit) {
    case 'T': return value * 1000  // Trillion → Billion
    case 'B': return value
    case 'M': return value / 1000  // Million → Billion
    default: return value
  }
}

/**
 * AUM을 한국어 형식으로 변환 ($ 기호 포함)
 * "562B" → "$5,620억"
 * "1.4T" → "$1조 4,000억"
 */
function formatAumToKorean(aum: string): string {
  const billions = parseAum(aum)
  // 1B = 10억 달러
  const 억 = billions * 10

  if (억 >= 10000) {
    // 1조 이상
    const 조 = Math.floor(억 / 10000)
    const 나머지억 = Math.round(억 % 10000)
    if (나머지억 > 0) {
      return `$${조}조 ${나머지억.toLocaleString()}억`
    }
    return `$${조}조`
  }

  return `$${Math.round(억).toLocaleString()}억`
}

// 미국 ETF 테이블 컬럼 정의
const usEtfColumns: ColumnDef<USEtf>[] = [
  {
    accessorKey: 'ticker',
    header: '티커',
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue('ticker')}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: '이름',
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'provider',
    header: '운용사',
  },
  {
    accessorKey: 'expenseRatio',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`보수율 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        보수율
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('expenseRatio') as number
      return <span>{value.toFixed(4)}%</span>
    },
  },
  {
    accessorKey: 'aum',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`순자산 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        순자산
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('aum') as string
      return <span>{formatAumToKorean(value)}</span>
    },
    sortingFn: (rowA, rowB) => {
      const a = parseAum(rowA.getValue('aum') as string)
      const b = parseAum(rowB.getValue('aum') as string)
      return a - b
    },
  },
  {
    accessorKey: 'return5Y',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`5년 연평균 수익률 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        5년 연평균 수익률
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('return5Y') as number
      return <span>{value.toFixed(2)}%</span>
    },
  },
  {
    accessorKey: 'return5YCumulative',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`5년 누적 수익률 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        5년 누적 수익률
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('return5YCumulative') as number | null
      return value != null ? <span>{value.toFixed(1)}%</span> : <span>-</span>
    },
  },
  {
    accessorKey: 'targetAudience',
    header: '대상 투자자',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue('targetAudience')}
      </span>
    ),
  },
]

/**
 * 한국 ETF 순자산 포맷터 (원화 기호 사용)
 * 99000억 → "₩9.9조"
 * 5500억 → "₩5,500억"
 */
function formatKRAumToKorean(aumBillion: number): string {
  if (aumBillion >= 10000) {
    return `₩${(aumBillion / 10000).toFixed(1)}조`
  }
  return `₩${aumBillion.toLocaleString()}억`
}

// 한국 ETF 테이블 컬럼 정의
const krEtfColumns: ColumnDef<KREtf>[] = [
  {
    accessorKey: 'ticker',
    header: '티커',
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue('ticker')}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: '이름',
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'provider',
    header: '운용사',
  },
  {
    accessorKey: 'expenseRatio',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`보수율 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        보수율
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('expenseRatio') as number
      return <span>{value.toFixed(4)}%</span>
    },
  },
  {
    accessorKey: 'aum',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`순자산 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        순자산
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('aum') as number
      return <span>{formatKRAumToKorean(value)}</span>
    },
  },
  {
    accessorKey: 'returnCAGR',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`연평균 수익률 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        연평균 수익률
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const etf = row.original as KREtf
      const cagr = etf.returnCAGR ?? etf.return5Y
      const years = etf.returnYears
      if (cagr == null) return <span>-</span>
      return (
        <span title={years ? `${years}년 기준 연평균 수익률` : undefined}>
          {cagr.toFixed(2)}%
          {years && <span className="text-muted-foreground text-xs ml-1">({years}년)</span>}
        </span>
      )
    },
  },
  {
    accessorKey: 'returnCumulative',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`누적 수익률 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        누적 수익률
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const etf = row.original as KREtf
      const cumulative = etf.returnCumulative ?? etf.return5YCumulative
      const periodLabel = etf.returnPeriodLabel
      if (cumulative == null) return <span>-</span>
      return (
        <span title={periodLabel ? `${periodLabel} 누적 수익률` : undefined}>
          {cumulative.toFixed(1)}%
          {periodLabel && <span className="text-muted-foreground text-xs ml-1">({periodLabel})</span>}
        </span>
      )
    },
  },
  {
    accessorKey: 'hedged',
    header: '환헤지',
    cell: ({ row }) => {
      const hedged = row.getValue('hedged') as boolean
      return hedged ? (
        <span className="flex items-center" role="img" aria-label="환헤지 적용">
          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
          <span className="sr-only">환헤지 적용</span>
        </span>
      ) : (
        <span className="flex items-center" role="img" aria-label="환헤지 미적용">
          <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">환헤지 미적용</span>
        </span>
      )
    },
  },
]

// Props 타입 정의
interface USEtfTableProps {
  data: USEtf[]
  type: 'us'
  highlightTickers?: string[]
}

interface KREtfTableProps {
  data: KREtf[]
  type: 'kr'
  highlightTickers?: string[]
}

type ETFComparisonTableProps = USEtfTableProps | KREtfTableProps

export function ETFComparisonTable({
  data,
  type,
  highlightTickers = [],
}: ETFComparisonTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  // 타입에 따라 컬럼 선택
  const columns = type === 'us'
    ? (usEtfColumns as ColumnDef<USEtf | KREtf>[])
    : (krEtfColumns as ColumnDef<USEtf | KREtf>[])

  const table = useReactTable({
    data: data as (USEtf | KREtf)[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const ticker = (row.original as USEtf | KREtf).ticker
              const isHighlighted = highlightTickers.includes(ticker)

              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    isHighlighted && 'bg-yellow-50 dark:bg-yellow-900/20'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
