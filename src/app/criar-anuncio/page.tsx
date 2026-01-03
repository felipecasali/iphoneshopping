'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'
import { ESTADOS_BRASIL, PRINCIPAIS_CIDADES } from '@/lib/locations'

export default function CriarAnuncioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [evaluationData, setEvaluationData] = useState<any>(null)
  const [formData, setFormData] = useState({
    description: '',
    state: '',
    city: '',
    acceptsTrade: false,
    negotiable: true,
    images: [] as string[],
  })
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [showOtherCity, setShowOtherCity] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/criar-anuncio')
      return
    }

    // Recupera os dados da avaliação
    const savedData = localStorage.getItem('evaluationData')
    if (savedData) {
      setEvaluationData(JSON.parse(savedData))
    } else {
      // Se não houver dados de avaliação, redireciona para avaliar
      router.push('/avaliar')
    }
  }, [status, router])

  // Atualizar cidades quando estado mudar
  useEffect(() => {
    if (formData.state) {
      setAvailableCities(PRINCIPAIS_CIDADES[formData.state] || [])
      setFormData(prev => ({ ...prev, city: '' }))
    } else {
      setAvailableCities([])
    }
  }, [formData.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.state) {
      setError('Por favor, selecione o estado')
      setLoading(false)
      return
    }

    if (!formData.city) {
      setError('Por favor, selecione a cidade')
      setLoading(false)
      return
    }

    if (formData.images.length === 0) {
      setError('Adicione pelo menos uma foto do aparelho')
      setLoading(false)
      return
    }

    try {
      // Preparar dados para envio
      const listingData = {
        deviceModel: evaluationData.model,
        deviceType: evaluationData.type,
        storage: parseInt(evaluationData.storage), // Garantir que é número
        condition: evaluationData.condition,
        hasBox: evaluationData.hasBox || false,
        hasCharger: evaluationData.hasCharger || false,
        icloudFree: evaluationData.icloudFree || false,
        batteryHealth: evaluationData.batteryHealth ? parseInt(evaluationData.batteryHealth) : undefined,
        screenCondition: evaluationData.screenCondition || undefined,
        bodyCondition: evaluationData.bodyCondition || undefined,
        hasWaterDamage: evaluationData.hasWaterDamage || false,
        price: parseFloat(evaluationData.estimatedPrice),
        acceptsTrade: formData.acceptsTrade,
        negotiable: formData.negotiable,
        description: formData.description || undefined,
        images: formData.images,
        location: `${formData.city}, ${formData.state}`,
      }

      console.log('Enviando dados:', listingData)

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro da API:', errorData)
        
        // Se houver detalhes do Zod, mostrar o primeiro erro
        if (errorData.details && errorData.details.length > 0) {
          const firstError = errorData.details[0]
          throw new Error(`${firstError.path.join('.')}: ${firstError.message}`)
        }
        
        throw new Error(errorData.error || 'Erro ao criar anúncio')
      }

      const data = await response.json()
      console.log('Anúncio criado:', data)

      // Limpa os dados salvos
      localStorage.removeItem('evaluationData')
      
      // Redireciona para a página de sucesso com opções de compartilhamento
      router.push(`/anuncios/${data.id}/sucesso`)
    } catch (err) {
      console.error('Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar anúncio. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || !evaluationData) {
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
      <header className="bg-white shadow-sm">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Anúncio</h1>
          <p className="text-gray-600">Complete as informações para publicar seu anúncio</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Resumo da Avaliação */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Resumo do Aparelho</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Modelo</div>
                  <div className="font-medium">{evaluationData.model}</div>
                </div>
                <div>
                  <div className="text-gray-600">Armazenamento</div>
                  <div className="font-medium">{evaluationData.storage}GB</div>
                </div>
                <div>
                  <div className="text-gray-600">Cor</div>
                  <div className="font-medium">{evaluationData.color}</div>
                </div>
                <div>
                  <div className="text-gray-600">Condição</div>
                  <div className="font-medium">{evaluationData.condition}</div>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="text-gray-600 text-xs mb-1">Valor Sugerido</div>
                  <div className="text-2xl font-bold text-primary-600">
                    R$ {evaluationData.estimatedPrice?.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-4">Fotos do Aparelho</h3>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(newUrl) => {
                    console.log('🔄 onImagesChange chamado com nova URL:', newUrl)
                    setFormData(prev => {
                      console.log('📋 prev.images:', prev.images)
                      const updatedImages = [...prev.images, newUrl]
                      console.log('📋 novo array de imagens:', updatedImages)
                      return { ...prev, images: updatedImages }
                    })
                  }}
                  onRemoveImage={(index) => {
                    setFormData(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index)
                    }))
                  }}
                  maxImages={5}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-4">Detalhes do Anúncio</h3>
                
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição (opcional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Adicione informações extras sobre o aparelho, como modo de uso, motivo da venda, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="">Selecione...</option>
                        {ESTADOS_BRASIL.map((estado) => (
                          <option key={estado.uf} value={estado.uf}>
                            {estado.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <select
                        value={showOtherCity ? 'OUTRA' : formData.city}
                        onChange={(e) => {
                          if (e.target.value === 'OUTRA') {
                            setShowOtherCity(true)
                            setFormData({ ...formData, city: '' })
                          } else {
                            setShowOtherCity(false)
                            setFormData({ ...formData, city: e.target.value })
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        disabled={!formData.state}
                      >
                        <option value="">
                          {formData.state ? 'Selecione...' : 'Selecione o estado primeiro'}
                        </option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                        <option value="OUTRA">Outra cidade</option>
                      </select>
                    </div>
                  </div>

                  {showOtherCity && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Digite sua cidade *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Nome da cidade"
                        required
                      />
                    </div>
                  )}

                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <p className="text-sm text-cyan-900">
                      <strong>🔒 Sua privacidade é importante!</strong><br />
                      Mostramos apenas a cidade/estado no anúncio. Nunca compartilhe seu endereço completo ou CEP publicamente.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.negotiable}
                        onChange={(e) => setFormData({ ...formData, negotiable: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium">Aceito negociações</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.acceptsTrade}
                        onChange={(e) => setFormData({ ...formData, acceptsTrade: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium">Aceito trocas</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/avaliar"
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
                >
                  Voltar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {loading ? 'Publicando...' : 'Publicar Anúncio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
