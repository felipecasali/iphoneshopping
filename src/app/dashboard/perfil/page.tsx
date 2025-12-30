'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Smartphone, MessageSquare, User, Mail } from 'lucide-react'

export default function PerfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Smartphone className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
          </Link>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-8">
            <div className="bg-primary-100 rounded-full p-6">
              <User className="h-16 w-16 text-primary-600" />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{session.user.name}</h2>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Informações da Conta</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Nome</div>
                  <div className="font-medium">{session.user.name}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{session.user.email}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Anúncios</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Vendas</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Avaliações</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
