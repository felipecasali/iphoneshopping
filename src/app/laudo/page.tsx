'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FileText, Plus, Clock, CheckCircle, ChevronRight, Smartphone } from 'lucide-react'

interface Evaluation {
  id: string
  deviceType: string
  deviceModel: string
  storage: number
  color: string
  estimatedValue: number
  condition: string
  createdAt: string
  hasReport: boolean
}

export default function LaudosPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/laudo')
    } else if (status === 'authenticated') {
      fetchEvaluations()
    }
  }, [status, router])

  const fetchEvaluations = async () => {
    try {
      const res = await fetch('/api/evaluate/list')
      const data = await res.json()
      if (data.evaluations) {
        setEvaluations(data.evaluations)
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Laudos Técnicos</h1>
                <p className="text-sm text-gray-600">Crie laudos profissionais a partir de suas avaliações</p>
              </div>
            </div>
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Voltar
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">
              Transforme Avaliações em Laudos Profissionais
            </h2>
            <p className="text-lg text-primary-100 mb-6">
              Selecione uma avaliação existente e adicione fotos, documentação e testes detalhados 
              para gerar um laudo técnico profissional com certificado digital.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Assinatura Digital</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Exportação em PDF</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Validade Estendida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avaliações Disponíveis */}
        {evaluations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma Avaliação Encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Para criar um laudo técnico, você precisa primeiro avaliar um aparelho.
            </p>
            <Link
              href="/avaliar"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="mr-2 h-5 w-5" />
              Avaliar Aparelho
            </Link>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Selecione uma Avaliação
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">
                          {evaluation.deviceModel}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {evaluation.storage}GB • {evaluation.color}
                        </p>
                      </div>
                      {evaluation.hasReport && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          Com Laudo
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Valor Estimado:</span>
                        <span className="font-bold text-primary-600">
                          R$ {evaluation.estimatedValue.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Condição:</span>
                        <span className="font-medium text-gray-900">
                          {evaluation.condition}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <Link
                      href={`/laudo/criar?evaluationId=${evaluation.id}`}
                      className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      {evaluation.hasReport ? 'Ver Laudo' : 'Criar Laudo'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA para Nova Avaliação */}
        {evaluations.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8 text-center border-2 border-dashed border-gray-300">
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Avaliar Novo Aparelho
            </h3>
            <p className="text-gray-600 mb-4">
              Avalie outro dispositivo para criar mais laudos técnicos
            </p>
            <Link
              href="/avaliar"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nova Avaliação
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
