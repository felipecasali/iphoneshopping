'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, FileText, ClipboardList, TrendingUp, 
  Activity, Calendar, AlertCircle, BarChart3, Target
} from 'lucide-react'

interface Stats {
  overview: {
    totalUsers: number
    totalEvaluations: number
    totalReports: number
    totalListings: number
  }
  thisMonth: {
    newUsers: number
    newEvaluations: number
    newReports: number
    newListings: number
  }
  growth: {
    users: string
    evaluations: string
    reports: string
    listings: string
  }
  conversion: {
    evaluations: number
    reports: number
    listings: number
    evaluationToReport: string
    reportToListing: string
    evaluationToListing: string
  }
  recentActivity: {
    users: any[]
    evaluations: any[]
    reports: any[]
    listings: any[]
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats')
        
        if (response.status === 403) {
          router.push('/')
          return
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar estatísticas')
        }

        const data = await response.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">Erro ao Carregar Dashboard</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-4 w-4" />
            {parseFloat(change) >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-sm text-gray-600 mt-1">Visão geral do iPhoneShopping</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/admin/users"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                <Users className="h-4 w-4" />
                Usuários
              </a>
              <a
                href="/admin/listings"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <ClipboardList className="h-4 w-4" />
                Anúncios
              </a>
              <a
                href="/admin/reports"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <FileText className="h-4 w-4" />
                Laudos
              </a>
              <div className="flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-lg">
                <Activity className="h-5 w-5" />
                <span className="font-semibold">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principais */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métricas Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              title="Usuários Total"
              value={stats.overview.totalUsers}
              change={stats.growth.users}
              color="#3B82F6"
            />
            <StatCard
              icon={ClipboardList}
              title="Avaliações"
              value={stats.overview.totalEvaluations}
              change={stats.growth.evaluations}
              color="#10B981"
            />
            <StatCard
              icon={FileText}
              title="Laudos Técnicos"
              value={stats.overview.totalReports}
              change={stats.growth.reports}
              color="#F59E0B"
            />
            <StatCard
              icon={Target}
              title="Anúncios"
              value={stats.overview.totalListings}
              change={stats.growth.listings}
              color="#8B5CF6"
            />
          </div>
        </div>

        {/* Crescimento Este Mês */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Últimos 30 Dias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm mb-2">Novos Usuários</p>
              <p className="text-4xl font-bold">{stats.thisMonth.newUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm mb-2">Novas Avaliações</p>
              <p className="text-4xl font-bold">{stats.thisMonth.newEvaluations}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-orange-100 text-sm mb-2">Novos Laudos</p>
              <p className="text-4xl font-bold">{stats.thisMonth.newReports}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm mb-2">Novos Anúncios</p>
              <p className="text-4xl font-bold">{stats.thisMonth.newListings}</p>
            </div>
          </div>
        </div>

        {/* Funil de Conversão */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Funil de Conversão
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-green-600">{stats.conversion.evaluationToReport}%</span>
                </div>
                <p className="text-sm text-gray-600">Avaliação → Laudo</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-orange-600">{stats.conversion.reportToListing}%</span>
                </div>
                <p className="text-sm text-gray-600">Laudo → Anúncio</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary-600">{stats.conversion.evaluationToListing}%</span>
                </div>
                <p className="text-sm text-gray-600">Avaliação → Anúncio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usuários Recentes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Usuários Recentes
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.users.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Laudos Recentes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Laudos Recentes
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.reports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{report.reportNumber}</p>
                    <p className="text-sm text-gray-600">{report.deviceModel}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
