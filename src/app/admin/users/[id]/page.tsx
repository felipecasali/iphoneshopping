'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Mail, Phone, Calendar, Ban, CheckCircle, Shield,
  FileText, ShoppingBag, ClipboardList, Loader2, AlertTriangle
} from 'lucide-react'

interface UserDetail {
  id: string
  name: string
  email: string
  phone: string | null
  cpf: string | null
  role: string
  status: string
  avatar: string | null
  createdAt: string
  _count: {
    listings: number
    technicalReports: number
    evaluations: number
    messages: number
    ratings: number
  }
  listings: Array<{
    id: string
    condition: string
    price: number
    createdAt: string
    device: {
      model: string
      color: string
    }
  }>
  technicalReports: Array<{
    id: string
    reportType: string
    createdAt: string
    device: {
      model: string
    }
  }>
}

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string

  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])

  async function fetchUser() {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`)
      
      if (response.status === 403) {
        router.push('/')
        return
      }

      if (!response.ok) {
        throw new Error('Erro ao carregar usuário')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(action: string, role?: string) {
    const actionText = {
      ban: 'banir este usuário',
      activate: 'ativar este usuário',
      changeRole: `promover este usuário a ${role}`
    }[action]

    if (!confirm(`Tem certeza que deseja ${actionText}?`)) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, role })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao executar ação')
      }

      await fetchUser()
      alert('Ação executada com sucesso!')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando usuário...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg mb-2">Erro ao carregar usuário</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/admin/users"
            className="text-primary-600 hover:text-primary-700"
          >
            ← Voltar para lista de usuários
          </Link>
        </div>
      </div>
    )
  }

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
      status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {status === 'ACTIVE' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
      {status === 'ACTIVE' ? 'Ativo' : 'Banido'}
    </span>
  )

  const RoleBadge = ({ role }: { role: string }) => {
    const colors: any = {
      ADMIN: 'bg-purple-100 text-purple-700',
      MODERATOR: 'bg-cyan-100 text-cyan-700',
      USER: 'bg-gray-100 text-gray-700'
    }
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${colors[role]}`}>
        {role === 'ADMIN' && <Shield className="h-4 w-4" />}
        {role}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para lista de usuários
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-2xl">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {user.status === 'ACTIVE' ? (
                <button
                  onClick={() => handleAction('ban')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <Ban className="h-4 w-4" />
                  Banir Usuário
                </button>
              ) : (
                <button
                  onClick={() => handleAction('activate')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  Ativar Usuário
                </button>
              )}
              {user.role !== 'ADMIN' && (
                <button
                  onClick={() => handleAction('changeRole', 'ADMIN')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <Shield className="h-4 w-4" />
                  Promover a Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Cadastrado em</p>
                    <p className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anúncios Recentes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Anúncios Recentes</h2>
                <span className="text-sm text-gray-500">{user._count.listings} total</span>
              </div>
              {user.listings.length > 0 ? (
                <div className="space-y-3">
                  {user.listings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {listing.device.model} {listing.device.color}
                        </p>
                        <p className="text-sm text-gray-500">{listing.condition}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-primary-600">
                        R$ {listing.price.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhum anúncio criado</p>
              )}
            </div>

            {/* Laudos Técnicos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Laudos Técnicos</h2>
                <span className="text-sm text-gray-500">{user._count.technicalReports} total</span>
              </div>
              {user.technicalReports.length > 0 ? (
                <div className="space-y-3">
                  {user.technicalReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="font-medium text-gray-900">{report.device.model}</p>
                          <p className="text-sm text-gray-500">{report.reportType}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhum laudo criado</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-cyan-600" />
                    <span className="text-gray-600">Anúncios</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user._count.listings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-gray-600">Laudos</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user._count.technicalReports}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-600">Avaliações</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user._count.evaluations}</span>
                </div>
              </div>
            </div>

            {/* ID do Usuário */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">ID do Usuário</h2>
              <p className="text-sm text-gray-500 font-mono break-all">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
