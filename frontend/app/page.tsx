'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loginFake } = useAuthStore()

  useEffect(() => {
    // Garante usuário fictício e redireciona para dashboard
    if (!isAuthenticated()) {
      loginFake()
    }
    router.push('/dashboard')
  }, [isAuthenticated, loginFake, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Redirecionando...</div>
    </div>
  )
}

