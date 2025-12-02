'use client'

import { SWRConfig } from 'swr'
import { swrConfig } from '@/lib/swr-config'

interface SWRProviderProps {
  children: React.ReactNode
}

/**
 * SWR Provider 컴포넌트
 * 전역 SWR 설정을 제공합니다.
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>
}
