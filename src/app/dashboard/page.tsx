'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Package, 
  MessageSquare, 
  User, 
  Settings,
  LogOut,
  TrendingUp,
  Eye,
  Plus,
  FileText,
  Award
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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
              <Image 
                src="/logo.png" 
                alt="iPhoneShopping Logo" 
                width={32} 
                height={32} 
                className="h-6 w-6 sm:h-8 sm:w-8"
                priority
              />
              <span className="text-lg sm:text-2xl font-bold text-gray-900">iPhoneShopping</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                href="/avaliar"
                className="bg-primary-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-primary-700 text-sm sm:text-base flex items-center gap-1"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Vender</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-600 hover:text-gray-900 p-1.5 sm:p-2"
                title="Sair"
              >
                <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Olá, {session.user.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Bem-vindo ao seu painel de controle</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-primary-100 p-2 sm:p-3 rounded-lg">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-primary-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.activeListings}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Anúncios Ativos</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalListings}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total de Anúncios</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-cyan-100 p-2 sm:p-3 rounded-lg">
                <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-cyan-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalViews}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Visualizações</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Não lidas</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalMessages}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Mensagens</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Menu</h2>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-primary-50 text-primary-700 text-sm sm:text-base"
                >
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Visão Geral</span>
                </Link>
                <Link
                  href="/dashboard/anuncios"
                  className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-50 text-gray-700 text-sm sm:text-base"
                >
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Meus Anúncios</span>
                </Link>
                <Link
                  href="/dashboard/mensagens"
                  className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-50 text-gray-700 text-sm sm:text-base"
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Mensagens</span>
                </Link>
                <Link
                  href="/laudo/criar"
                  className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-50 text-gray-700 border-l-4 border-transparent hover:border-primary-500 text-sm sm:text-base"
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Criar Laudo</span>
                  <span className="ml-auto text-xs bg-primary-100 text-primary-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Novo</span>
                </Link>
                <Link
                  href="/dashboard/perfil"
                  className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-50 text-gray-700 text-sm sm:text-base"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Meu Perfil</span>
                </Link>
                <Link
                  href="/dashboard/configuracoes"
                  className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-50 text-gray-700 text-sm sm:text-base"
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Configurações</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Link
                  href="/laudo/criar"
                  className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-primary-400 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition relative group"
                >
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                    <span className="text-xs bg-primary-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Novo!</span>
                  </div>
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 mb-2 group-hover:scale-110 transition" />
                  <span className="font-medium text-sm sm:text-base text-center">Laudo Técnico</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">Certifique seu aparelho</span>
                </Link>
                <Link
                  href="/avaliar"
                  className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
                >
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 mb-2" />
                  <span className="font-medium text-sm sm:text-base text-center">Criar Anúncio</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">Venda grátis</span>
                </Link>
                <Link
                  href="/anuncios"
                  className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
                >
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 mb-2" />
                  <span className="font-medium text-sm sm:text-base text-center">Ver Anúncios</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">Navegue ofertas</span>
                </Link>
                <Link
                  href="/avaliar"
                  className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
                >
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 mb-2" />
                  <span className="font-medium text-sm sm:text-base text-center">Avaliar Aparelho</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">Descubra o valor</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Atividade Recente</h2>
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm sm:text-base">Nenhuma atividade recente</p>
                <p className="text-xs sm:text-sm mt-1">Comece criando seu primeiro anúncio!</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold text-primary-900 mb-2 text-sm sm:text-base">💡 Dica</h3>
              <p className="text-xs sm:text-sm text-primary-800">
                Anúncios com fotos de boa qualidade e descrições detalhadas recebem até 3x mais visualizações!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
