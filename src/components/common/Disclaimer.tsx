import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface DisclaimerProps {
  variant?: 'default' | 'compact'
  className?: string
}

const DEFAULT_DISCLAIMER_TEXT =
  '본 사이트의 정보는 투자 권유가 아니며, 투자 결정과 그에 따른 책임은 투자자 본인에게 있습니다. 제공되는 정보는 참고용으로만 활용하시기 바랍니다.'

export function Disclaimer({ variant = 'default', className }: DisclaimerProps) {
  if (variant === 'compact') {
    return (
      <p className={cn('text-xs text-muted-foreground', className)}>
        {DEFAULT_DISCLAIMER_TEXT}
      </p>
    )
  }

  return (
    <Alert className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>투자 유의사항</AlertTitle>
      <AlertDescription>
        {DEFAULT_DISCLAIMER_TEXT}
      </AlertDescription>
    </Alert>
  )
}
