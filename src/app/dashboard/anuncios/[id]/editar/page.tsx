'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Smartphone, ArrowLeft } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import { ESTADOS_BRASIL, PRINCIPAIS_CIDADES } from '@/lib/locations'

interface Listing {
  id: string
  price: number
  location: string
  images: string[]
  status: string
  description: string
  acceptsTrade: boolean
  negotiable: boolean
  device: {
    model: string
    storage: number
    type: string
  }
}

export default function EditarAnuncioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [formData, setFormData] = useState({
    price: 0,
    description: '',
    state: '',
    city: '',
    acceptsTrade: false,
    negotiable: true,
    images: [] as string[],
    status: 'ACTIVE',
  })
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [showOtherCity, setShowOtherCity] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/dashboard/anuncios')
      return
    }

    if (status === 'authenticated') {
      fetchListing()
    }
  }, [status, router])

  // Atualizar cidades quando estado mudar
  useEffect(() => {
    if (formData.state) {
      setAvailableCities(PRINCIPAIS_CIDADES[formData.state] || [])
    } else {
      setAvailableCities([])
    }
  }, [formData.state])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar anúncio')
      }

      const data = await response.json()
      setListing(data.listing)
      
      // Extrair cidade e estado da location
      const locationParts = data.listing.location.split(', ')
      const city = locationParts[0] || ''
      const state = locationParts[1] || ''
      
      // Verificar se é uma cidade customizada (não está na lista de principais cidades)
      const citiesForState = PRINCIPAIS_CIDADES[state] || []
      const isOtherCity = city && !citiesForState.includes(city)
      if (isOtherCity) {
        setShowOtherCity(true)
      }
      
      // Preencher formulário com dados existentes
      setFormData({
        price: data.listing.price,
        description: data.listing.description || '',
        state: state,
        city: city,
        acceptsTrade: data.listing.acceptsTrade,
        negotiable: data.listing.negotiable,
        images: data.listing.images || [],
        status: data.listing.status,
      })
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao carregar anúncio')
    } finally {
      setLoadingData(false)
    }
  }

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
      const response = await fetch(`/api/listings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: parseFloat(formData.price.toString()),
          description: formData.description || undefined,
          location: `${formData.city}, ${formData.state}`,
          acceptsTrade: formData.acceptsTrade,
          negotiable: formData.negotiable,
          images: formData.images,
          status: formData.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar anúncio')
      }

      alert('Anúncio atualizado com sucesso!')
      router.push('/dashboard/anuncios')
    } catch (err) {
      console.error('Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar anúncio. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session || !listing) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Smartphone className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
          </Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard/anuncios"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Meus Anúncios
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Anúncio</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumo do Aparelho */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold mb-4 text-gray-900">Informações do Aparelho</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Modelo</div>
                  <div className="font-medium">{listing.device.model}</div>
                </div>
                <div>
                  <div className="text-gray-600">Armazenamento</div>
                  <div className="font-medium">{listing.device.storage}GB</div>
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
                  onImagesChange={(urls) => setFormData({ ...formData, images: urls })}
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
                      Preço *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-gray-500">R$</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição (opcional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Adicione informações extras sobre o aparelho..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>🔒 Sua privacidade é importante!</strong><br />
                      Mostramos apenas a cidade/estado no anúncio.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="ACTIVE">Ativo</option>
                      <option value="INACTIVE">Inativo</option>
                      <option value="RESERVED">Reservado</option>
                      <option value="SOLD">Vendido</option>
                    </select>
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
                  href="/dashboard/anuncios"
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
