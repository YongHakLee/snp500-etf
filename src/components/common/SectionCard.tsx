import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  headerRight?: React.ReactNode
}

export function SectionCard({
  title,
  description,
  children,
  className,
  headerRight,
}: SectionCardProps) {
  return (
    <Card className={cn(className)}>
      {(title || description || headerRight) && (
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}
