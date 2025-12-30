'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FileText, Camera, Shield, CheckCircle, XCircle, ChevronRight, ChevronLeft, Sparkles, Crown, Zap } from 'lucide-react'

// Tipos de laudos com preços
const LAUDO_TYPES = [
  {
    id: 'BASIC',
    name: 'Laudo Básico',
    price: 0,
    description: 'Ideal para vendas pessoais',
    features: [
      'Informações básicas do aparelho',
      '5 fotos obrigatórias',
      'Verificação de IMEI',
      'Condição externa',
      'Validade de 30 dias',
      'Marca d\'água no PDF'
    ],
    icon: FileText,
    color: 'gray'
  },
  {
    id: 'STANDARD',
    name: 'Laudo Profissional',
    price: 29.90,
    description: 'Para vendedores que querem destaque',
    features: [
      'Tudo do Básico +',
      '15 fotos profissionais',
      'Saúde detalhada da bateria',
      'Testes funcionais completos',
      'Certificado digital',
      'Validade de 90 dias',
      'Sem marca d\'água'
    ],
    icon: Sparkles,
    color: 'blue',
    popular: true
  },
  {
    id: 'PREMIUM',
    name: 'Laudo Premium',
    price: 49.90,
    description: 'Máxima credibilidade profissional',
    features: [
      'Tudo do Profissional +',
      'Fotos ilimitadas',
      'Análise técnica detalhada',
      'Histórico de reparos',
      'Garantia de autenticidade',
      'Verificação iCloud',
      'Validade de 180 dias',
      'Prioridade no suporte',
      'Selo Premium exclusivo'
    ],
    icon: Crown,
    color: 'purple',
    recommended: true
  }
]

interface Evaluation {
  id: string
  deviceType: string
  deviceModel: string
  storage: number
  color: string
  estimatedValue: number
  condition: string
  createdAt: string
}

function CriarLaudoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')

  const evaluationId = searchParams.get('evaluationId')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/laudo/criar')
    }
  }, [status, router])

  useEffect(() => {
    if (evaluationId && session) {
      fetchEvaluation()
    }
  }, [evaluationId, session])

  const fetchEvaluation = async () => {
    try {
      const res = await fetch(`/api/evaluate?id=${evaluationId}`)
      const data = await res.json()
      if (data.evaluation) {
        setEvaluation(data.evaluation)
      }
    } catch (error) {
      console.error('Erro ao carregar avaliação:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!evaluationId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Avaliação Necessária</h1>
            <p className="text-gray-600 mb-6">
              Para criar um laudo técnico, você precisa primeiro avaliar seu aparelho.
            </p>
            <Link
              href="/avaliar"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Avaliar Aparelho Agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const totalSteps = selectedType === 'BASIC' ? 4 : selectedType === 'STANDARD' ? 5 : 6

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Criar Laudo Técnico</h1>
                <p className="text-sm text-gray-600">
                  {evaluation.deviceModel} {evaluation.storage}GB - {evaluation.color}
                </p>
              </div>
            </div>
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Voltar
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        {selectedType && (
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    step >= num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {num}
                  </div>
                  {num < totalSteps && (
                    <div className={`h-1 w-16 mx-2 ${
                      step > num ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Etapa {step} de {totalSteps}
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Escolha do Tipo de Laudo */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Escolha o Tipo de Laudo
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Selecione o nível de detalhamento e credibilidade que você precisa para seu laudo técnico
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {LAUDO_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                      selectedType === type.id
                        ? 'border-primary-600 scale-105'
                        : 'border-gray-200 hover:border-primary-300'
                    } ${type.recommended ? 'ring-4 ring-purple-200' : ''}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    {type.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                          Mais Popular
                        </span>
                      </div>
                    )}
                    {type.recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                          <Crown className="w-4 h-4 mr-1" />
                          Recomendado
                        </span>
                      </div>
                    )}

                    <div className="p-8">
                      <div className={`inline-flex p-3 rounded-lg mb-4 ${
                        type.color === 'gray' ? 'bg-gray-100' :
                        type.color === 'blue' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <Icon className={`h-8 w-8 ${
                          type.color === 'gray' ? 'text-gray-600' :
                          type.color === 'blue' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {type.name}
                      </h3>
                      
                      <div className="mb-4">
                        {type.price === 0 ? (
                          <span className="text-3xl font-bold text-green-600">Gratuito</span>
                        ) : (
                          <div>
                            <span className="text-3xl font-bold text-gray-900">
                              R$ {type.price.toFixed(2)}
                            </span>
                            <span className="text-gray-500 ml-2">por laudo</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mb-6">
                        {type.description}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                              type.color === 'gray' ? 'text-gray-500' :
                              type.color === 'blue' ? 'text-blue-600' :
                              'text-purple-600'
                            }`} />
                            <span className={`text-sm ${
                              feature.includes('+') ? 'font-semibold text-gray-900' : 'text-gray-600'
                            }`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full py-3 rounded-lg font-bold transition-colors ${
                          selectedType === type.id
                            ? 'bg-primary-600 text-white'
                            : type.color === 'gray'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : type.color === 'blue'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        {selectedType === type.id ? 'Selecionado' : 'Selecionar'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {selectedType && (
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold flex items-center"
                >
                  Continuar
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Próximos steps serão implementados */}
        {step > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Zap className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Em Desenvolvimento
            </h2>
            <p className="text-gray-600 mb-8">
              As próximas etapas do wizard estão sendo implementadas.<br />
              Step atual: {step} de {totalSteps}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Voltar
              </button>
              {step < totalSteps && (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center"
                >
                  Próximo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CriarLaudoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <CriarLaudoContent />
    </Suspense>
  )
}
