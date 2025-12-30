'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Camera, CheckCircle, AlertCircle, FileText, Shield, Upload, X } from 'lucide-react'
import { DEVICES } from '@/lib/device-pricing'

interface PhotoSection {
  id: string
  label: string
  description: string
  required: boolean
  photos: File[]
  previews: string[]
}

export default function CriarLaudoPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [reportData, setReportData] = useState({
    deviceType: '',
    deviceModel: '',
    storage: 0,
    color: '',
    imei: '',
    serialNumber: '',
    batteryHealthPercent: 100,
    screenCondition: '',
    bodyCondition: '',
    cameraCondition: '',
    screenConditionNotes: '',
    bodyConditionNotes: '',
    cameraConditionNotes: '',
    touchWorking: true,
    faceIdWorking: true,
    biometricsWorking: true,
    wifiWorking: true,
    bluetoothWorking: true,
    speakersWorking: true,
    microphoneWorking: true,
    vibrationWorking: true,
    buttonsWorking: true,
    icloudFree: false,
    carrierUnlocked: false,
    hasWaterDamage: false,
    hasRepairs: false,
    repairDetails: '',
    hasBox: false,
    hasCharger: false,
    hasCable: false,
    hasEarphones: false,
    hasInvoice: false,
    hasWarranty: false,
  })

  // Filtrar dispositivos por tipo
  const iPhones = DEVICES.filter(d => d.type === 'IPHONE')
  const iPads = DEVICES.filter(d => d.type === 'IPAD')
  const selectedDevice = DEVICES.find(d => d.model === reportData.deviceModel && d.type === reportData.deviceType)

  const [photoSections, setPhotoSections] = useState<PhotoSection[]>([
    {
      id: 'front',
      label: 'Foto Frontal',
      description: 'Tela ligada, mostrando a interface',
      required: true,
      photos: [],
      previews: []
    },
    {
      id: 'back',
      label: 'Foto Traseira',
      description: 'Vista completa da parte de trás',
      required: true,
      photos: [],
      previews: []
    },
    {
      id: 'sides',
      label: 'Fotos das Laterais',
      description: 'Ambos os lados do aparelho (mínimo 2 fotos)',
      required: true,
      photos: [],
      previews: []
    },
    {
      id: 'screenOn',
      label: 'Tela Ligada',
      description: 'Mostrando área de trabalho sem defeitos',
      required: true,
      photos: [],
      previews: []
    },
    {
      id: 'batteryHealth',
      label: 'Saúde da Bateria',
      description: 'Screenshot das configurações mostrando saúde da bateria',
      required: true,
      photos: [],
      previews: []
    },
    {
      id: 'imeiScreen',
      label: 'Tela do IMEI',
      description: 'Screenshot mostrando IMEI nas configurações',
      required: false,
      photos: [],
      previews: []
    },
    {
      id: 'invoice',
      label: 'Nota Fiscal',
      description: 'Foto da nota fiscal original (se disponível)',
      required: false,
      photos: [],
      previews: []
    },
    {
      id: 'box',
      label: 'Caixa Original',
      description: 'Foto da caixa do produto (se disponível)',
      required: false,
      photos: [],
      previews: []
    },
    {
      id: 'accessories',
      label: 'Acessórios',
      description: 'Fotos de cabos, carregadores, fones inclusos',
      required: false,
      photos: [],
      previews: []
    }
  ])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  }

  if (!session) {
    router.push('/login?redirect=/laudo/criar')
    return null
  }

  const handlePhotoUpload = (sectionId: string, files: FileList) => {
    const section = photoSections.find(s => s.id === sectionId)
    if (!section) return

    const newFiles = Array.from(files)
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))

    setPhotoSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          photos: [...s.photos, ...newFiles],
          previews: [...s.previews, ...newPreviews]
        }
      }
      return s
    }))
  }

  const removePhoto = (sectionId: string, index: number) => {
    setPhotoSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        const newPhotos = s.photos.filter((_, i) => i !== index)
        const newPreviews = s.previews.filter((_, i) => i !== index)
        return { ...s, photos: newPhotos, previews: newPreviews }
      }
      return s
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Validar fotos obrigatórias
      const missingRequired = photoSections
        .filter(s => s.required && s.photos.length === 0)
        .map(s => s.label)

      if (missingRequired.length > 0) {
        alert(`Por favor, adicione fotos para: ${missingRequired.join(', ')}`)
        setLoading(false)
        return
      }

      // Upload das fotos para Cloudinary
      const uploadedUrls: Record<string, string | string[]> = {}
      
      for (const section of photoSections) {
        if (section.photos.length === 0) continue

        const urls: string[] = []
        for (const photo of section.photos) {
          const formData = new FormData()
          formData.append('file', photo)
          formData.append('upload_preset', 'iphoneshopping_preset')
          formData.append('folder', 'laudos')

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/dizpzljoy/image/upload`,
            { method: 'POST', body: formData }
          )
          const data = await response.json()
          urls.push(data.secure_url)
        }

        uploadedUrls[section.id] = section.id === 'sides' || section.id === 'accessories' 
          ? urls 
          : urls[0]
      }

      // Criar laudo no banco
      const response = await fetch('/api/technical-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportData,
          frontPhoto: uploadedUrls.front,
          backPhoto: uploadedUrls.back,
          sidesPhotos: JSON.stringify(uploadedUrls.sides || []),
          screenOnPhoto: uploadedUrls.screenOn,
          screenOffPhoto: uploadedUrls.screenOn, // Usando mesma foto temporariamente
          batteryHealthPhoto: uploadedUrls.batteryHealth,
          imeiPhoto: uploadedUrls.imeiScreen,
          invoicePhoto: uploadedUrls.invoice,
          boxPhoto: uploadedUrls.box,
          accessoriesPhotos: JSON.stringify(uploadedUrls.accessories || [])
        })
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Laudo Técnico Completo</h1>
                <p className="text-sm text-gray-600">Documentação profissional do seu aparelho</p>
              </div>
            </div>
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Voltar
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Informações' },
              { num: 2, label: 'Fotos' },
              { num: 3, label: 'Estado' },
              { num: 4, label: 'Funcionalidades' },
              { num: 5, label: 'Revisão' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= s.num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= s.num ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {s.label}
                </span>
                {idx < 4 && <div className="w-full h-1 mx-4 bg-gray-200"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Device Info */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Informações do Aparelho</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Aparelho *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setReportData({...reportData, deviceType: 'IPHONE', deviceModel: '', storage: 0, color: ''})}
                    className={`p-6 border-2 rounded-lg text-left transition ${
                      reportData.deviceType === 'IPHONE'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">📱</div>
                    <h3 className="text-xl font-semibold mb-1">iPhone</h3>
                    <p className="text-gray-600 text-sm">Smartphones da Apple</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportData({...reportData, deviceType: 'IPAD', deviceModel: '', storage: 0, color: ''})}
                    className={`p-6 border-2 rounded-lg text-left transition ${
                      reportData.deviceType === 'IPAD'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">📲</div>
                    <h3 className="text-xl font-semibold mb-1">iPad</h3>
                    <p className="text-gray-600 text-sm">Tablets da Apple</p>
                  </button>
                </div>
              </div>

              {reportData.deviceType && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo *
                    </label>
                    <select
                      value={reportData.deviceModel}
                      onChange={(e) => setReportData({...reportData, deviceModel: e.target.value, storage: 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    >
                      <option value="">Selecione o modelo...</option>
                      {(reportData.deviceType === 'IPHONE' ? iPhones : iPads).map(device => (
                        <option key={device.model} value={device.model}>
                          {device.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  {reportData.deviceModel && selectedDevice && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Armazenamento *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {selectedDevice.storage.map(storage => (
                            <button
                              key={storage}
                              type="button"
                              onClick={() => setReportData({...reportData, storage})}
                              className={`px-4 py-3 border-2 rounded-lg font-semibold transition ${
                                reportData.storage === storage
                                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                                  : 'border-gray-200 hover:border-primary-300'
                              }`}
                            >
                              {storage} GB
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cor *
                        </label>
                        <select
                          value={reportData.color}
                          onChange={(e) => setReportData({...reportData, color: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        >
                          <option value="">Selecione a cor...</option>
                          {selectedDevice.colors.map(color => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IMEI *
                  </label>
                  <input
                    type="text"
                    value={reportData.imei}
                    onChange={(e) => setReportData({...reportData, imei: e.target.value})}
                    placeholder="Ex: 123456789012345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Série *
                  </label>
                  <input
                    type="text"
                    value={reportData.serialNumber}
                    onChange={(e) => setReportData({...reportData, serialNumber: e.target.value})}
                    placeholder="Ex: ABCD1234EFGH"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!reportData.deviceType || !reportData.deviceModel || !reportData.storage || !reportData.color || !reportData.imei || !reportData.serialNumber}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo: Adicionar Fotos
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-2">Documentação Fotográfica</h2>
            <p className="text-gray-600 mb-6">
              📸 Fotos nítidas e bem iluminadas garantem um laudo mais preciso e confiável
            </p>
            </p>

            <div className="space-y-8">
              {photoSections.map(section => (
                <div key={section.id} className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {section.label}
                        {section.required && <span className="text-red-500 ml-1">*</span>}
                      </h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                    <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center text-sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Adicionar
                      <input
                        type="file"
                        accept="image/*"
                        multiple={section.id === 'sides' || section.id === 'accessories'}
                        onChange={(e) => e.target.files && handlePhotoUpload(section.id, e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {section.previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {section.previews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <Image
                            src={preview}
                            alt={`${section.label} ${idx + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(section.id, idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Próximo: Estado →
              </button>
            </div>
          </div>
        )}

        {/* Continua nos próximos steps... */}
      </div>
    </div>
  )
}
