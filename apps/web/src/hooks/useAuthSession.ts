'use client'

import { useSession as useNextAuthSession } from 'next-auth/react'

/**
 * Clean authentication hook using NextAuth
 */
export function useAuthSession() {
  const { data: nextAuthSession, status: nextAuthStatus } = useNextAuthSession()

  return {
    data: nextAuthSession,
    status: nextAuthStatus
  }
}