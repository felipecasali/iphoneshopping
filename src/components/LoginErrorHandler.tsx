'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface LoginErrorHandlerProps {
  onError: (message: string) => void
}

export default function LoginErrorHandler({ onError }: LoginErrorHandlerProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'OAuthAccountNotLinked') {
      onError('Esta conta já existe com email/senha. Faça login com suas credenciais ou use outro email do Google.')
    } else if (errorParam) {
      onError('Erro ao fazer login. Tente novamente.')
    }
  }, [searchParams, onError])

  return null
}
