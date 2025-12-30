'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Smartphone, 
  Package, 
  MessageSquare, 
  User, 
  Settings,
  LogOut,
  TrendingUp,
  Eye,
  Plus
} from 'lucide-react'

interface Stats {
  totalListings: number
  activeListings: number
  totalViews: number
  totalMessages: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalMessages: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])

  const fetchStats = async () => {
    try {
      const [listingsRes, messagesRes] = await Promise.all([
        fetch('/api/user/listings'),
        fetch('/api/messages')
      ])

      const listingsData = await listingsRes.json()
      const messagesData = await messagesRes.json()

      if (listingsData.success) {
        const listings = listingsData.listings || []
        const activeListings = listings.filter((l: any) => l.status === 'ACTIVE' || l.status === 'Disponível')
        const totalViews = listings.reduce((sum: number, l: any) => sum + (l.views || 0), 0)

        setStats({
          totalListings: listings.length,
          activeListings: activeListings.length,
          totalViews,
          totalMessages: messagesData.unreadCount || 0
        })
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

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
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Smartphone className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/avaliar"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                <Plus className="inline w-5 h-5 mr-1" />
                Vender
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {session.user.name}! 👋
          </h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.activeListings}
            </div>
            <div className="text-sm text-gray-600">Anúncios Ativos</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalListings}
            </div>
            <div className="text-sm text-gray-600">Total de Anúncios</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalViews}
            </div>
            <div className="text-sm text-gray-600">Visualizações</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Não lidas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalMessages}
            </div>
            <div className="text-sm text-gray-600">Mensagens</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-700"
                >
                  <Package className="h-5 w-5" />
                  <span>Visão Geral</span>
                </Link>
                <Link
                  href="/dashboard/anuncios"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <Package className="h-5 w-5" />
                  <span>Meus Anúncios</span>
                </Link>
                <Link
                  href="/dashboard/mensagens"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Mensagens</span>
                </Link>
                <Link
                  href="/dashboard/perfil"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <User className="h-5 w-5" />
                  <span>Meu Perfil</span>
                </Link>
                <Link
                  href="/dashboard/configuracoes"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/avaliar"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
                >
                  <Plus className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="font-medium">Criar Anúncio</span>
                </Link>
                <Link
                  href="/anuncios"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
                >
                  <Eye className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="font-medium">Ver Anúncios</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhuma atividade recente</p>
                <p className="text-sm mt-1">Comece criando seu primeiro anúncio!</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h3 className="font-semibold text-primary-900 mb-2">💡 Dica</h3>
              <p className="text-sm text-primary-800">
                Anúncios com fotos de boa qualidade e descrições detalhadas recebem até 3x mais visualizações!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
