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
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { USEtf, KREtf } from '@/types'

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
      return <span>{(value * 100).toFixed(2)}%</span>
    },
  },
  {
    accessorKey: 'aum',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`AUM 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        AUM
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
  },
  {
    accessorKey: 'return5Y',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`5년 수익률 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        5년 수익률
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('return5Y') as number
      return <span>{value.toFixed(2)}%</span>
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
      return <span>{(value * 100).toFixed(2)}%</span>
    },
  },
  {
    accessorKey: 'aum',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
        aria-label={`AUM 정렬 (현재: ${column.getIsSorted() === 'asc' ? '오름차순' : column.getIsSorted() === 'desc' ? '내림차순' : '정렬 안됨'})`}
      >
        AUM(억원)
        <ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('aum') as number
      return <span>{value.toLocaleString()}</span>
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
  {
    accessorKey: 'totalReturn',
    header: 'TR',
    cell: ({ row }) => {
      const tr = row.getValue('totalReturn') as boolean
      return tr ? (
        <span className="flex items-center" role="img" aria-label="배당 재투자(TR) 적용">
          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
          <span className="sr-only">배당 재투자 적용</span>
        </span>
      ) : (
        <span className="flex items-center" role="img" aria-label="배당 재투자(TR) 미적용">
          <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">배당 재투자 미적용</span>
        </span>
      )
    },
  },
  {
    accessorKey: 'features',
    header: '특징',
    cell: ({ row }) => {
      const features = row.getValue('features') as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
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
