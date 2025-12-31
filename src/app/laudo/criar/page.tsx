'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Camera, Shield, CheckCircle, XCircle, ChevronRight, ChevronLeft, Sparkles, Crown, Zap, Upload, X, Battery, Smartphone, AlertCircle, CreditCard } from 'lucide-react'

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
  batteryHealth?: number
  screenCondition?: string
  bodyCondition?: string
  icloudFree: boolean
  hasWaterDamage: boolean
  hasBox: boolean
  hasCharger: boolean
  hasCable: boolean
  hasInvoice: boolean
}

interface PhotoUpload {
  file: File
  preview: string
  category: string
}

interface ReportData {
  imei: string
  serialNumber: string
  batteryHealth: number
  screenCondition: string
  bodyCondition: string
  cameraCondition: string
  functionalTests: {
    touchWorking: boolean
    faceIdWorking: boolean
    wifiWorking: boolean
    bluetoothWorking: boolean
    speakersWorking: boolean
    microphoneWorking: boolean
    vibrationWorking: boolean
    buttonsWorking: boolean
  }
  additionalNotes: string
  icloudFree: boolean
  carrierUnlocked: boolean
  hasWaterDamage: boolean
  hasRepairs: boolean
  repairDetails: string
  hasBox: boolean
  hasCharger: boolean
  hasCable: boolean
  hasEarphones: boolean
  hasInvoice: boolean
}

function CriarLaudoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [photos, setPhotos] = useState<PhotoUpload[]>([])
  const [reportData, setReportData] = useState<ReportData>({
    imei: '',
    serialNumber: '',
    batteryHealth: 100,
    screenCondition: 'PERFEITO',
    bodyCondition: 'PERFEITO',
    cameraCondition: 'PERFEITO',
    functionalTests: {
      touchWorking: true,
      faceIdWorking: true,
      wifiWorking: true,
      bluetoothWorking: true,
      speakersWorking: true,
      microphoneWorking: true,
      vibrationWorking: true,
      buttonsWorking: true
    },
    additionalNotes: '',
    icloudFree: false,
    carrierUnlocked: false,
    hasWaterDamage: false,
    hasRepairs: false,
    repairDetails: '',
    hasBox: false,
    hasCharger: false,
    hasCable: false,
    hasEarphones: false,
    hasInvoice: false
  })

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
        
        // Pré-preencher campos do reportData com dados da avaliação
        setReportData(prev => ({
          ...prev,
          batteryHealth: data.evaluation.batteryHealth || prev.batteryHealth,
          screenCondition: data.evaluation.screenCondition || prev.screenCondition,
          bodyCondition: data.evaluation.bodyCondition || prev.bodyCondition,
          icloudFree: data.evaluation.icloudFree ?? prev.icloudFree,
          hasWaterDamage: data.evaluation.hasWaterDamage ?? prev.hasWaterDamage,
          hasBox: data.evaluation.hasBox ?? prev.hasBox,
          hasCharger: data.evaluation.hasCharger ?? prev.hasCharger,
          hasCable: data.evaluation.hasCable ?? prev.hasCable,
          hasInvoice: data.evaluation.hasInvoice ?? prev.hasInvoice,
          hasEarphones: false, // Não existe na avaliação, mantém valor padrão
        }))
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

  const handlePhotoUpload = (category: string, files: FileList) => {
    const selectedTypeData = LAUDO_TYPES.find(t => t.id === selectedType)
    const maxPhotos = selectedType === 'BASIC' ? 5 : selectedType === 'STANDARD' ? 15 : 999

    const currentCategoryPhotos = photos.filter(p => p.category === category).length
    const newFilesArray = Array.from(files)
    
    if (photos.length + newFilesArray.length > maxPhotos) {
      alert(`Limite de ${maxPhotos} fotos atingido para o plano ${selectedTypeData?.name}`)
      return
    }

    const newPhotos = newFilesArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      category
    }))

    setPhotos(prev => [...prev, ...newPhotos])
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const newPhotos = [...prev]
      URL.revokeObjectURL(newPhotos[index].preview)
      newPhotos.splice(index, 1)
      return newPhotos
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Validar fotos mínimas
      const requiredPhotos = ['frontal', 'traseira', 'lateral']
      const missingCategories = requiredPhotos.filter(cat => 
        !photos.some(p => p.category === cat)
      )

      if (missingCategories.length > 0) {
        alert(`Adicione fotos para: ${missingCategories.join(', ')}`)
        setLoading(false)
        return
      }

      // Upload de fotos para Cloudinary
      const uploadedPhotos: Record<string, string[]> = {}
      
      for (const photo of photos) {
        const formData = new FormData()
        formData.append('file', photo.file)
        formData.append('upload_preset', 'iphoneshopping_preset')
        formData.append('folder', 'laudos')

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dizpzljoy/image/upload',
          { method: 'POST', body: formData }
        )
        
        const data = await response.json()
        
        if (!uploadedPhotos[photo.category]) {
          uploadedPhotos[photo.category] = []
        }
        uploadedPhotos[photo.category].push(data.secure_url)
      }

      // Criar laudo no banco
      const reportPayload = {
        evaluationId: evaluationId,
        reportType: selectedType,
        deviceType: evaluation?.deviceType,
        deviceModel: evaluation?.deviceModel,
        storage: evaluation?.storage,
        color: evaluation?.color,
        ...reportData,
        batteryHealthPercent: reportData.batteryHealth, // Mapear batteryHealth para batteryHealthPercent
        frontPhoto: uploadedPhotos.frontal?.[0] || '',
        backPhoto: uploadedPhotos.traseira?.[0] || '',
        sidesPhotos: JSON.stringify(uploadedPhotos.lateral || []),
        screenOnPhoto: uploadedPhotos.tela_ligada?.[0] || uploadedPhotos.frontal?.[0] || '',
        screenOffPhoto: uploadedPhotos.tela_desligada?.[0] || uploadedPhotos.frontal?.[0] || '',
        batteryHealthPhoto: uploadedPhotos.bateria?.[0] || '',
        imeiPhoto: uploadedPhotos.imei?.[0] || '',
        invoicePhoto: uploadedPhotos.nota_fiscal?.[0] || null,
        boxPhoto: uploadedPhotos.caixa?.[0] || null,
        accessoriesPhotos: JSON.stringify(uploadedPhotos.acessorios || [])
      }

      const response = await fetch('/api/technical-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Laudo criado com sucesso!')
        router.push(`/laudo/${result.reportId}`)
      } else {
        alert('Erro ao criar laudo: ' + result.error)
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao criar laudo técnico')
    } finally {
      setLoading(false)
    }
  }

  const getPhotoCategories = () => {
    const basic = [
      { id: 'frontal', label: 'Foto Frontal', required: true },
      { id: 'traseira', label: 'Foto Traseira', required: true },
      { id: 'lateral', label: 'Fotos das Laterais', required: true },
      { id: 'tela_ligada', label: 'Tela Ligada', required: true },
      { id: 'bateria', label: 'Saúde da Bateria', required: true }
    ]

    const standard = [
      ...basic,
      { id: 'tela_desligada', label: 'Tela Desligada', required: false },
      { id: 'imei', label: 'IMEI/Serial', required: true },
      { id: 'caixa', label: 'Caixa Original', required: false },
      { id: 'acessorios', label: 'Acessórios', required: false }
    ]

    const premium = [
      ...standard,
      { id: 'nota_fiscal', label: 'Nota Fiscal', required: false },
      { id: 'detalhes', label: 'Detalhes Extras', required: false }
    ]

    if (selectedType === 'BASIC') return basic
    if (selectedType === 'STANDARD') return standard
    return premium
  }

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
            {/* Banner promocional */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">🎉 Promoção de Lançamento!</h3>
              </div>
              <p className="text-green-50">
                Todos os laudos estão <strong>GRATUITOS</strong> temporariamente! Aproveite para testar todas as funcionalidades premium enquanto desenvolvemos o sistema de pagamento.
              </p>
            </div>

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
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-3xl font-bold text-green-600">
                                GRÁTIS
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                Promocional
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="line-through">R$ {type.price.toFixed(2)}</span>
                              <span className="ml-2">• Lançamento</span>
                            </div>
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

        {/* Step 2: Upload de Fotos */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Camera className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Documentação Fotográfica
              </h2>
              <p className="text-gray-600">
                {selectedType === 'BASIC' && 'Adicione até 5 fotos essenciais'}
                {selectedType === 'STANDARD' && 'Adicione até 15 fotos profissionais'}
                {selectedType === 'PREMIUM' && 'Adicione quantas fotos forem necessárias'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {getPhotoCategories().map((category) => (
                <div key={category.id} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">{category.label}</h3>
                    {category.required && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Obrigatória
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 cursor-pointer transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Clique para adicionar fotos</p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => e.target.files && handlePhotoUpload(category.id, e.target.files)}
                        />
                      </div>
                    </label>

                    {/* Preview das fotos */}
                    <div className="grid grid-cols-3 gap-2">
                      {photos
                        .filter(p => p.category === category.id)
                        .map((photo, idx) => (
                          <div key={idx} className="relative group">
                            <Image
                              src={photo.preview}
                              alt={category.label}
                              width={100}
                              height={100}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removePhoto(photos.indexOf(photo))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={photos.filter(p => p.category === 'frontal').length === 0}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Informações Técnicas */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Smartphone className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Informações Técnicas
              </h2>
              <p className="text-gray-600">
                Preencha os detalhes técnicos do aparelho
              </p>
            </div>

            {/* Banner informativo sobre dados pré-preenchidos */}
            {evaluation && (evaluation.batteryHealth || evaluation.screenCondition || evaluation.bodyCondition) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Dados da sua avaliação carregados</p>
                    <p className="mt-1">Alguns campos foram pré-preenchidos com as informações da sua avaliação. Você pode revisar e ajustar conforme necessário.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* IMEI e Serial */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IMEI * <span className="text-xs text-gray-500">(Digite *#06#)</span>
                  </label>
                  <input
                    type="text"
                    value={reportData.imei}
                    onChange={(e) => setReportData({ ...reportData, imei: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="000000000000000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Série
                  </label>
                  <input
                    type="text"
                    value={reportData.serialNumber}
                    onChange={(e) => setReportData({ ...reportData, serialNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="XXXXXXXXXXXX"
                  />
                </div>
              </div>

              {/* Bateria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saúde da Bateria * <span className="text-xs text-gray-500">(Ajustes → Bateria → Saúde)</span>
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reportData.batteryHealth}
                    onChange={(e) => setReportData({ ...reportData, batteryHealth: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <Battery className={`h-6 w-6 ${
                      reportData.batteryHealth >= 80 ? 'text-green-600' :
                      reportData.batteryHealth >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                    <span className="text-2xl font-bold text-gray-900">{reportData.batteryHealth}%</span>
                  </div>
                </div>
              </div>

              {/* Condições */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condição da Tela *
                  </label>
                  <select
                    value={reportData.screenCondition}
                    onChange={(e) => setReportData({ ...reportData, screenCondition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="PERFEITO">Perfeito</option>
                    <option value="ARRANHOES_LEVES">Arranhões Leves</option>
                    <option value="ARRANHOES_VISIVEIS">Arranhões Visíveis</option>
                    <option value="TRINCADO">Trincado</option>
                    <option value="QUEBRADO">Quebrado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condição da Carcaça *
                  </label>
                  <select
                    value={reportData.bodyCondition}
                    onChange={(e) => setReportData({ ...reportData, bodyCondition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="PERFEITO">Perfeito</option>
                    <option value="MARCAS_USO">Marcas de Uso</option>
                    <option value="ARRANHOES">Arranhões</option>
                    <option value="AMASSADOS">Amassados</option>
                    <option value="DANIFICADO">Danificado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condição das Câmeras *
                  </label>
                  <select
                    value={reportData.cameraCondition}
                    onChange={(e) => setReportData({ ...reportData, cameraCondition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="PERFEITO">Perfeito</option>
                    <option value="FUNCIONAL">Funcional</option>
                    <option value="COM_DEFEITO">Com Defeito</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportData.icloudFree}
                    onChange={(e) => setReportData({ ...reportData, icloudFree: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <span className="text-gray-700">✅ iCloud Livre (Sem Bloqueio)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportData.carrierUnlocked}
                    onChange={(e) => setReportData({ ...reportData, carrierUnlocked: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <span className="text-gray-700">📱 Desbloqueado (Qualquer Operadora)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportData.hasWaterDamage}
                    onChange={(e) => setReportData({ ...reportData, hasWaterDamage: e.target.checked })}
                    className="w-5 h-5 text-red-600 rounded"
                  />
                  <span className="text-gray-700">💧 Teve Contato com Líquido</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportData.hasRepairs}
                    onChange={(e) => setReportData({ ...reportData, hasRepairs: e.target.checked })}
                    className="w-5 h-5 text-yellow-600 rounded"
                  />
                  <span className="text-gray-700">🔧 Teve Reparos</span>
                </label>
              </div>

              {reportData.hasRepairs && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detalhes dos Reparos
                  </label>
                  <textarea
                    value={reportData.repairDetails}
                    onChange={(e) => setReportData({ ...reportData, repairDetails: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Descreva os reparos realizados..."
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Voltar
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!reportData.imei || reportData.batteryHealth === 0}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Testes Funcionais */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Testes Funcionais
              </h2>
              <p className="text-gray-600">
                Marque todos os recursos que estão funcionando perfeitamente
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries({
                  touchWorking: '👆 Touch Screen',
                  faceIdWorking: '🔐 Face ID / Touch ID',
                  wifiWorking: '📶 Wi-Fi',
                  bluetoothWorking: '🔵 Bluetooth',
                  speakersWorking: '🔊 Alto-Falantes',
                  microphoneWorking: '🎤 Microfone',
                  vibrationWorking: '📳 Vibração',
                  buttonsWorking: '🔘 Botões Físicos'
                }).map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      reportData.functionalTests[key as keyof typeof reportData.functionalTests]
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{label}</span>
                    <input
                      type="checkbox"
                      checked={reportData.functionalTests[key as keyof typeof reportData.functionalTests]}
                      onChange={(e) => setReportData({
                        ...reportData,
                        functionalTests: {
                          ...reportData.functionalTests,
                          [key]: e.target.checked
                        }
                      })}
                      className="w-6 h-6 text-green-600 rounded"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Importante:</p>
                    <p>Testes funcionais incorretos podem invalidar o laudo. Seja honesto na avaliação.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Voltar
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center"
              >
                Próximo
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Acessórios e Revisão */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Acessórios e Revisão Final
              </h2>
              <p className="text-gray-600">
                Marque os acessórios inclusos e revise todas as informações
              </p>
            </div>

            {/* Banner informativo sobre acessórios pré-preenchidos */}
            {evaluation && (evaluation.hasBox || evaluation.hasCharger || evaluation.hasCable || evaluation.hasInvoice) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Acessórios da avaliação carregados</p>
                    <p className="mt-1">Os acessórios que você informou na avaliação foram marcados automaticamente. Revise e ajuste se necessário.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Acessórios Inclusos</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportData.hasBox}
                      onChange={(e) => setReportData({ ...reportData, hasBox: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span>📦 Caixa Original</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportData.hasCharger}
                      onChange={(e) => setReportData({ ...reportData, hasCharger: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span>🔌 Carregador</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportData.hasCable}
                      onChange={(e) => setReportData({ ...reportData, hasCable: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span>🔋 Cabo</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportData.hasEarphones}
                      onChange={(e) => setReportData({ ...reportData, hasEarphones: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span>🎧 Fones de Ouvido</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportData.hasInvoice}
                      onChange={(e) => setReportData({ ...reportData, hasInvoice: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span>🧾 Nota Fiscal</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações Adicionais (Opcional)
                </label>
                <textarea
                  value={reportData.additionalNotes}
                  onChange={(e) => setReportData({ ...reportData, additionalNotes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Adicione qualquer informação adicional relevante..."
                />
              </div>

              {/* Resumo */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Resumo do Laudo</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo de Laudo:</span>
                    <span className="ml-2 font-medium">{LAUDO_TYPES.find(t => t.id === selectedType)?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fotos Adicionadas:</span>
                    <span className="ml-2 font-medium">{photos.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">IMEI:</span>
                    <span className="ml-2 font-medium">{reportData.imei || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Bateria:</span>
                    <span className="ml-2 font-medium">{reportData.batteryHealth}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">iCloud:</span>
                    <span className="ml-2 font-medium">{reportData.icloudFree ? '✅ Livre' : '❌ Bloqueado'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Operadora:</span>
                    <span className="ml-2 font-medium">{reportData.carrierUnlocked ? '✅ Desbloqueado' : '🔒 Bloqueado'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Voltar
              </button>
              <button
                onClick={() => selectedType === 'BASIC' ? handleSubmit() : setStep(6)}
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : selectedType === 'BASIC' ? '✅ Finalizar Laudo Gratuito' : 'Ir para Pagamento'}
                {!loading && <ChevronRight className="ml-2 h-5 w-5" />}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Pagamento (apenas para STANDARD e PREMIUM) */}
        {step === 6 && selectedType !== 'BASIC' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Finalizar Laudo
              </h2>
              <p className="text-gray-600">
                Confirme a geração do seu laudo profissional
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  {selectedType === 'STANDARD' ? (
                    <Sparkles className="h-10 w-10 text-blue-600" />
                  ) : (
                    <Crown className="h-10 w-10 text-purple-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {LAUDO_TYPES.find(t => t.id === selectedType)?.name}
                </h3>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  GRÁTIS
                </div>
                <div className="text-lg text-gray-500 line-through mb-4">
                  R$ {LAUDO_TYPES.find(t => t.id === selectedType)?.price.toFixed(2)}
                </div>
                <p className="text-gray-600">
                  Promoção de Lançamento • Laudo válido por {selectedType === 'STANDARD' ? '90' : '180'} dias
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium">🎉 Sistema de Pagamento em Desenvolvimento</p>
                    <p className="mt-1">Todos os laudos estão temporáriamente GRATUITOS enquanto desenvolvemos a integração de pagamento. Aproveite para testar todas as funcionalidades premium!</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-b py-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-4">O que está incluso:</h4>
                <ul className="space-y-2">
                  {LAUDO_TYPES.find(t => t.id === selectedType)?.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processando...' : '🎉 Gerar Laudo Gratuito'}
              </button>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(5)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Voltar
              </button>
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
