'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SectorRepresentative } from '@/types'

interface SectorRepresentativeCardsProps {
  data: SectorRepresentative[]
}

export function SectorRepresentativeCards({ data }: SectorRepresentativeCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((sector) => (
        <Card key={sector.sector} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: sector.color }}
              />
              <CardTitle className="text-base font-semibold">
                {sector.sectorKr}
              </CardTitle>
              <Badge variant="secondary" className="ml-auto text-xs">
                {sector.totalCount}개 종목
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{sector.sector}</p>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1.5">
              {sector.stocks.map((stock) => (
                <li key={stock.symbol} className="flex items-start gap-2 text-sm">
                  <span className="font-mono font-medium text-primary min-w-[50px]">
                    {stock.symbol}
                  </span>
                  <span className="text-muted-foreground truncate flex-1" title={stock.name}>
                    {stock.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
