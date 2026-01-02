'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, Search, CheckCircle, XCircle, Trash2, Eye,
  ChevronLeft, ChevronRight, AlertCircle, Loader2, Award, Clock
} from 'lucide-react'
import Link from 'next/link'

interface Report {
  id: string
  reportNumber: string
  deviceType: string
  deviceModel: string
  storage: number
  color: string
  reportType: string
  status: string
  isValidated: boolean
  invalidationReason: string | null
  validatedAt: string | null
  batteryHealthPercent: number
  estimatedPrice: number | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
}

export default function AdminReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [reportTypeFilter, setReportTypeFilter] = useState('')
  const [validationFilter, setValidationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [invalidationModal, setInvalidationModal] = useState<{ show: boolean; reportId: string }>({
    show: false,
    reportId: ''
  })
  const [invalidationReason, setInvalidationReason] = useState('')

  useEffect(() => {
    fetchReports()
  }, [page, reportTypeFilter, validationFilter, statusFilter])

  async function fetchReports() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (search) params.append('search', search)
      if (reportTypeFilter) params.append('reportType', reportTypeFilter)
      if (validationFilter) params.append('isValidated', validationFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/reports?${params}`)
      
      if (response.status === 403) {
        router.push('/')
        return
      }

      if (!response.ok) {
        throw new Error('Erro ao carregar laudos')
      }

      const data = await response.json()
      setReports(data.reports)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(reportId: string, action: string, reason?: string) {
    const confirmMessages: any = {
      validate: 'validar este laudo',
      invalidate: 'invalidar este laudo',
      delete: 'EXCLUIR permanentemente este laudo'
    }

    if (action !== 'invalidate' && !confirm(`Tem certeza que deseja ${confirmMessages[action]}?`)) {
      return
    }

    try {
      setActionLoading(reportId)
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao executar ação')
      }

      await fetchReports()
      alert('Ação executada com sucesso!')
      
      if (action === 'invalidate') {
        setInvalidationModal({ show: false, reportId: '' })
        setInvalidationReason('')
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
    fetchReports()
  }

  function openInvalidationModal(reportId: string) {
    setInvalidationModal({ show: true, reportId })
  }

  function closeInvalidationModal() {
    setInvalidationModal({ show: false, reportId: '' })
    setInvalidationReason('')
  }

  function handleInvalidate() {
    if (!invalidationReason.trim()) {
      alert('Por favor, informe o motivo da invalidação')
      return
    }
    handleAction(invalidationModal.reportId, 'invalidate', invalidationReason)
  }

  const ValidationBadge = ({ isValidated }: { isValidated: boolean }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
      isValidated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {isValidated ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {isValidated ? 'Válido' : 'Inválido'}
    </span>
  )

  const ReportTypeBadge = ({ type }: { type: string }) => {
    const config: any = {
      BASIC: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Básico' },
      STANDARD: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Padrão' },
      PREMIUM: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Premium' }
    }
    const c = config[type] || config.BASIC
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    )
  }

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando laudos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de Invalidação */}
      {invalidationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Invalidar Laudo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Informe o motivo da invalidação. O usuário será notificado.
            </p>
            <textarea
              value={invalidationReason}
              onChange={(e) => setInvalidationReason(e.target.value)}
              placeholder="Ex: Fotos de baixa qualidade, informações inconsistentes, dados incompletos..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={closeInvalidationModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleInvalidate}
                disabled={actionLoading === invalidationModal.reportId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === invalidationModal.reportId ? 'Invalidando...' : 'Invalidar'}
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
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Laudos Técnicos</h1>
              <p className="text-sm text-gray-600 mt-1">{pagination.total} laudos no sistema</p>
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
                placeholder="Buscar por modelo, número do laudo ou usuário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={reportTypeFilter}
              onChange={(e) => { setReportTypeFilter(e.target.value); setPage(1) }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os Tipos</option>
              <option value="BASIC">Básico</option>
              <option value="STANDARD">Padrão</option>
              <option value="PREMIUM">Premium</option>
            </select>

            <select
              value={validationFilter}
              onChange={(e) => { setValidationFilter(e.target.value); setPage(1) }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os Status</option>
              <option value="true">Válidos</option>
              <option value="false">Inválidos</option>
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
                    Laudo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bateria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.reportNumber}
                        </div>
                        {report.estimatedPrice && (
                          <div className="text-sm text-green-600 font-semibold">
                            R$ {report.estimatedPrice.toLocaleString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.deviceModel}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.storage}GB • {report.color}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {report.deviceType}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {report.user.avatar ? (
                          <img className="h-8 w-8 rounded-full" src={report.user.avatar} alt="" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 text-xs font-semibold">
                              {report.user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="text-sm text-gray-900">{report.user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ReportTypeBadge type={report.reportType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Award className={`h-4 w-4 ${
                          report.batteryHealthPercent >= 80 ? 'text-green-500' : 
                          report.batteryHealthPercent >= 60 ? 'text-yellow-500' : 
                          'text-red-500'
                        }`} />
                        <span className="text-sm font-semibold">{report.batteryHealthPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ValidationBadge isValidated={report.isValidated} />
                      {report.invalidationReason && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs">
                          {report.invalidationReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {!report.isValidated ? (
                          <button
                            onClick={() => handleAction(report.id, 'validate')}
                            disabled={actionLoading === report.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Validar"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openInvalidationModal(report.id)}
                            disabled={actionLoading === report.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Invalidar"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleAction(report.id, 'delete')}
                          disabled={actionLoading === report.id}
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
