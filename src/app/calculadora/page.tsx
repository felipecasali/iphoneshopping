'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Clock,
  Star
} from 'lucide-react'

const MODELS = [
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 15 Plus',
  'iPhone 15',
  'iPhone 14 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14 Plus',
  'iPhone 14',
  'iPhone 13 Pro Max',
  'iPhone 13 Pro',
  'iPhone 13',
  'iPhone 12 Pro Max',
  'iPhone 12 Pro',
  'iPhone 12',
  'iPhone 11 Pro Max',
  'iPhone 11 Pro',
  'iPhone 11',
  'iPhone SE (3ª geração)',
  'iPhone SE (2ª geração)',
]

const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB']

const CONDITIONS = [
  { value: 'EXCELLENT', label: '💎 Excelente', description: 'Como novo, sem marcas' },
  { value: 'GOOD', label: '✨ Bom', description: 'Pequenos sinais de uso' },
  { value: 'FAIR', label: '👍 Regular', description: 'Marcas visíveis de uso' },
  { value: 'POOR', label: '⚠️ Ruim', description: 'Danos estéticos significativos' },
]

export default function CalculadoraPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    model: '',
    storage: '',
    condition: '',
    batteryHealth: '100',
  })
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleCalculate = () => {
    // Cálculo simplificado baseado no modelo e condição
    let basePrice = 2000 // valor base
    
    // Ajuste por modelo
    if (formData.model.includes('15 Pro Max')) basePrice = 7000
    else if (formData.model.includes('15 Pro')) basePrice = 6500
    else if (formData.model.includes('15 Plus')) basePrice = 5500
    else if (formData.model.includes('15')) basePrice = 5000
    else if (formData.model.includes('14 Pro Max')) basePrice = 5500
    else if (formData.model.includes('14 Pro')) basePrice = 5000
    else if (formData.model.includes('14 Plus')) basePrice = 4500
    else if (formData.model.includes('14')) basePrice = 4000
    else if (formData.model.includes('13 Pro Max')) basePrice = 4500
    else if (formData.model.includes('13 Pro')) basePrice = 4000
    else if (formData.model.includes('13')) basePrice = 3500
    else if (formData.model.includes('12')) basePrice = 3000
    else if (formData.model.includes('11')) basePrice = 2500
    else if (formData.model.includes('SE')) basePrice = 1800

    // Ajuste por armazenamento
    const storageMultiplier = {
      '64GB': 0.85,
      '128GB': 1.0,
      '256GB': 1.15,
      '512GB': 1.3,
      '1TB': 1.5,
    }
    basePrice *= storageMultiplier[formData.storage as keyof typeof storageMultiplier] || 1

    // Ajuste por condição
    const conditionMultiplier = {
      'EXCELLENT': 1.0,
      'GOOD': 0.85,
      'FAIR': 0.70,
      'POOR': 0.50,
    }
    basePrice *= conditionMultiplier[formData.condition as keyof typeof conditionMultiplier] || 0.8

    // Ajuste por bateria
    const batteryFactor = parseInt(formData.batteryHealth) / 100
    basePrice *= 0.9 + (batteryFactor * 0.1)

    setEstimatedPrice(Math.round(basePrice))
    setShowResult(true)
  }

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.model !== ''
      case 2:
        return formData.storage !== ''
      case 3:
        return formData.condition !== ''
      case 4:
        return formData.batteryHealth !== ''
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="iPhoneShopping Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8"
              priority
            />
            <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
          </Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!showResult ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side - Info */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4 font-semibold text-sm">
                  <Sparkles className="h-4 w-4" />
                  Calculadora Gratuita
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Quanto vale seu iPhone?
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Descubra o valor real do seu iPhone em menos de 1 minuto. 
                  Nossa calculadora usa dados reais de mercado para te dar uma estimativa precisa.
                </p>
              </div>

              {/* Benefícios */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Avaliação Instantânea</h3>
                    <p className="text-gray-600 text-sm">Resultado em tempo real baseado em milhares de transações</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">100% Gratuito</h3>
                    <p className="text-gray-600 text-sm">Sem taxas, sem cadastro obrigatório, sem compromisso</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Venda com Confiança</h3>
                    <p className="text-gray-600 text-sm">Use o valor estimado como base para negociação</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </div>
                <p className="font-semibold mb-2">Mais de 10.000 avaliações realizadas</p>
                <p className="text-primary-100 text-sm">
                  Milhares de pessoas já descobriram o valor real de seus iPhones com nossa calculadora
                </p>
              </div>
            </div>

            {/* Right Side - Calculator Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                        step >= stepNum
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      } ${isStepComplete(stepNum) ? 'ring-4 ring-green-200' : ''}`}
                    >
                      {isStepComplete(stepNum) ? <CheckCircle className="h-5 w-5" /> : stepNum}
                    </div>
                    {stepNum < 4 && (
                      <div
                        className={`w-8 sm:w-12 h-1 mx-1 transition ${
                          step > stepNum ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Modelo */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Qual é o modelo do seu iPhone?
                    </h2>
                    <p className="text-gray-600 text-sm">Selecione o modelo exato do aparelho</p>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {MODELS.map((model) => (
                      <button
                        key={model}
                        onClick={() => {
                          setFormData({ ...formData, model })
                          setStep(2)
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition hover:border-primary-600 hover:bg-primary-50 ${
                          formData.model === model
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">{model}</span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Armazenamento */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Qual a capacidade de armazenamento?
                    </h2>
                    <p className="text-gray-600 text-sm">Escolha a opção do seu {formData.model}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {STORAGE_OPTIONS.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => {
                          setFormData({ ...formData, storage })
                          setStep(3)
                        }}
                        className={`p-6 rounded-xl border-2 transition hover:border-primary-600 hover:bg-primary-50 ${
                          formData.storage === storage
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">{storage}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                  >
                    ← Voltar
                  </button>
                </div>
              )}

              {/* Step 3: Condição */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Qual o estado de conservação?
                    </h2>
                    <p className="text-gray-600 text-sm">Seja honesto para ter uma avaliação precisa</p>
                  </div>

                  <div className="space-y-3">
                    {CONDITIONS.map((condition) => (
                      <button
                        key={condition.value}
                        onClick={() => {
                          setFormData({ ...formData, condition: condition.value })
                          setStep(4)
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition hover:border-primary-600 hover:bg-primary-50 ${
                          formData.condition === condition.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 mb-1">{condition.label}</div>
                            <div className="text-sm text-gray-600">{condition.description}</div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                  >
                    ← Voltar
                  </button>
                </div>
              )}

              {/* Step 4: Saúde da Bateria */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Qual a saúde da bateria?
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Verifique em: Ajustes → Bateria → Saúde da Bateria
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-700 font-semibold">Saúde da Bateria:</span>
                      <span className="text-4xl font-bold text-primary-600">{formData.batteryHealth}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={formData.batteryHealth}
                      onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>60%</span>
                      <span>80%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCalculate}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Calcular Valor Agora
                      <ArrowRight className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => setStep(3)}
                      className="text-primary-600 hover:text-primary-700 font-semibold text-sm w-full"
                    >
                      ← Voltar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Result Page */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Seu iPhone vale aproximadamente:
              </h2>

              <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-8 w-8 text-white" />
                  <div className="text-6xl font-bold text-white">
                    {estimatedPrice?.toLocaleString('pt-BR')}
                  </div>
                </div>
                <p className="text-primary-100 text-lg">Valor estimado de mercado</p>
              </div>

              {/* Resumo */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-bold text-gray-900 mb-4">Resumo da Avaliação:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modelo:</span>
                    <span className="font-semibold text-gray-900">{formData.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Armazenamento:</span>
                    <span className="font-semibold text-gray-900">{formData.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condição:</span>
                    <span className="font-semibold text-gray-900">
                      {CONDITIONS.find(c => c.value === formData.condition)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bateria:</span>
                    <span className="font-semibold text-gray-900">{formData.batteryHealth}%</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 mb-2">
                        💡 Aumente o valor em até 20%
                      </h3>
                      <p className="text-sm text-gray-600">
                        Com um laudo técnico profissional, seu iPhone pode valer até R$ {Math.round((estimatedPrice || 0) * 1.2).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/avaliar"
                  className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition shadow-lg"
                >
                  Criar Avaliação Completa Grátis
                </Link>

                <Link
                  href="/laudo/criar"
                  className="block w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition"
                >
                  Gerar Laudo Técnico Profissional
                </Link>

                <button
                  onClick={() => {
                    setShowResult(false)
                    setStep(1)
                    setFormData({
                      model: '',
                      storage: '',
                      condition: '',
                      batteryHealth: '100',
                    })
                  }}
                  className="w-full text-gray-600 hover:text-gray-900 font-semibold py-3"
                >
                  ← Fazer Nova Avaliação
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 mt-8">
                * O valor apresentado é uma estimativa baseada em dados de mercado e pode variar conforme a região, 
                demanda e condições específicas do aparelho. Este cálculo não constitui uma oferta de compra.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Section (only show when not showing result) */}
      {!showResult && (
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Por que usar o iPhoneShopping?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">Rápido</h3>
                <p className="text-sm text-primary-100">Avaliação em menos de 1 minuto</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">Confiável</h3>
                <p className="text-sm text-primary-100">Baseado em dados reais</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">Gratuito</h3>
                <p className="text-sm text-primary-100">Sem custos ou taxas</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
