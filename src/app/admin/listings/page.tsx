'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBag, Search, CheckCircle, XCircle, Star, Trash2,
  ChevronLeft, ChevronRight, Eye, AlertCircle, Loader2, StarOff
} from 'lucide-react'
import Link from 'next/link'

interface Listing {
  id: string
  condition: string
  price: number
  status: string
  moderationStatus: string
  rejectionReason: string | null
  featured: boolean
  views: number
  location: string
  createdAt: string
  moderatedAt: string | null
  device: {
    model: string
    color: string
    storage: string
  }
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  _count: {
    conversations: number
  }
}

export default function AdminListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [moderationFilter, setModerationFilter] = useState('PENDING')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectionModal, setRejectionModal] = useState<{ show: boolean; listingId: string }>({
    show: false,
    listingId: ''
  })
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchListings()
  }, [page, moderationFilter, statusFilter])

  async function fetchListings() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (search) params.append('search', search)
      if (moderationFilter) params.append('moderationStatus', moderationFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/listings?${params}`)
      
      if (response.status === 403) {
        router.push('/')
        return
      }

      if (!response.ok) {
        throw new Error('Erro ao carregar anúncios')
      }

      const data = await response.json()
      setListings(data.listings)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(listingId: string, action: string, reason?: string) {
    const confirmMessages: any = {
      approve: 'aprovar este anúncio',
      reject: 'rejeitar este anúncio',
      feature: 'destacar este anúncio',
      unfeature: 'remover destaque deste anúncio',
      delete: 'EXCLUIR permanentemente este anúncio'
    }

    if (action !== 'reject' && !confirm(`Tem certeza que deseja ${confirmMessages[action]}?`)) {
      return
    }

    try {
      setActionLoading(listingId)
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao executar ação')
      }

      await fetchListings()
      alert('Ação executada com sucesso!')
      
      if (action === 'reject') {
        setRejectionModal({ show: false, listingId: '' })
        setRejectionReason('')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    fetchListings()
  }

  function openRejectionModal(listingId: string) {
    setRejectionModal({ show: true, listingId })
  }

  function closeRejectionModal() {
    setRejectionModal({ show: false, listingId: '' })
    setRejectionReason('')
  }

  function handleReject() {
    if (!rejectionReason.trim()) {
      alert('Por favor, informe o motivo da rejeição')
      return
    }
    handleAction(rejectionModal.listingId, 'reject', rejectionReason)
  }

  const ModerationBadge = ({ status }: { status: string }) => {
    const config: any = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendente' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aprovado' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeitado' }
    }
    const c = config[status] || config.PENDING
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    )
  }

  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando anúncios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de Rejeição */}
      {rejectionModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rejeitar Anúncio</h3>
            <p className="text-sm text-gray-600 mb-4">
              Informe o motivo da rejeição. O usuário receberá esta informação.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Imagens de má qualidade, descrição incompleta, preço fora do padrão..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={closeRejectionModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectionModal.listingId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === rejectionModal.listingId ? 'Rejeitando...' : 'Rejeitar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard" className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block">
                ← Voltar ao Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Moderação de Anúncios</h1>
              <p className="text-sm text-gray-600 mt-1">{pagination.total} anúncios no sistema</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por modelo, usuário ou localização..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={moderationFilter}
              onChange={(e) => { setModerationFilter(e.target.value); setPage(1) }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os Status</option>
              <option value="PENDING">Pendente</option>
              <option value="APPROVED">Aprovado</option>
              <option value="REJECTED">Rejeitado</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Status de Venda</option>
              <option value="ACTIVE">Ativo</option>
              <option value="SOLD">Vendido</option>
              <option value="INACTIVE">Inativo</option>
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moderação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destaque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {listing.device.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {listing.device.color} • {listing.device.storage}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {listing.condition} • {listing.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {listing.user.avatar ? (
                          <img className="h-8 w-8 rounded-full" src={listing.user.avatar} alt="" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 text-xs font-semibold">
                              {listing.user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="text-sm text-gray-900">{listing.user.name}</div>
                          <div className="text-xs text-gray-500">{listing._count.conversations} conversas</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        R$ {listing.price.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500">{listing.views} visualizações</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ModerationBadge status={listing.moderationStatus} />
                      {listing.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs">
                          {listing.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {listing.featured ? (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5 text-gray-300" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {listing.moderationStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAction(listing.id, 'approve')}
                              disabled={actionLoading === listing.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Aprovar"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openRejectionModal(listing.id)}
                              disabled={actionLoading === listing.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Rejeitar"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        {listing.featured ? (
                          <button
                            onClick={() => handleAction(listing.id, 'unfeature')}
                            disabled={actionLoading === listing.id}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            title="Remover destaque"
                          >
                            <StarOff className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(listing.id, 'feature')}
                            disabled={actionLoading === listing.id}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                            title="Destacar"
                          >
                            <Star className="h-5 w-5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleAction(listing.id, 'delete')}
                          disabled={actionLoading === listing.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(page - 1) * pagination.limit + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(page * pagination.limit, pagination.total)}
                  </span>{' '}
                  de <span className="font-medium">{pagination.total}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Página {page} de {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
