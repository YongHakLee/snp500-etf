/**
 * SWR 전역 설정
 */

import type { SWRConfiguration } from 'swr'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

/**
 * SWR 전역 fetcher 함수
 */
export const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = new Error('API 요청에 실패했습니다.')
    throw error
  }

  return response.json()
}

/**
 * SWR 전역 설정
 */
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false, // 포커스 시 재검증 비활성화
  revalidateOnReconnect: true, // 재연결 시 재검증
  dedupingInterval: 60000, // 1분 동안 중복 요청 방지
  errorRetryCount: 3, // 에러 발생 시 3번 재시도
  errorRetryInterval: 5000, // 5초 간격으로 재시도
  shouldRetryOnError: true, // 에러 시 재시도
}

/**
 * API URL이 설정되었는지 확인
 */
export const isApiConfigured = (): boolean => {
  return Boolean(API_BASE)
}

/**
 * 전체 API URL 생성
 */
export const getApiUrl = (endpoint: string): string | null => {
  if (!API_BASE) return null
  return `${API_BASE}${endpoint}`
}
