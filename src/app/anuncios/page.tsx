'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Smartphone, MapPin, Search, Filter, SlidersHorizontal } from 'lucide-react'

interface Listing {
  id: string
  price: number
  location: string
  images: string[]
  createdAt: string
  condition: string
  negotiable: boolean
  acceptsTrade: boolean
  device: {
    model: string
    storage: number
    type: string
  }
  user: {
    name: string
  }
}

export default function AnunciosPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [typeFilter])

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.append('type', typeFilter)
      
      const response = await fetch(`/api/listings?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar anúncios')
      }

      const data = await response.json()
      setListings(data.listings || [])
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter((listing) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      listing.device.model.toLowerCase().includes(search) ||
      listing.location.toLowerCase().includes(search)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Smartphone className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/avaliar"
                className="hidden sm:inline-flex bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-medium"
              >
                Anunciar Grátis
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                Entrar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por modelo ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Dispositivo
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Todos</option>
                    <option value="IPHONE">iPhone</option>
                    <option value="IPAD">iPad</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {loading ? (
              'Carregando anúncios...'
            ) : (
              <>
                <span className="font-semibold">{filteredListings.length}</span> anúncios encontrados
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando anúncios...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum anúncio encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : 'Seja o primeiro a anunciar!'}
            </p>
            <Link
              href="/avaliar"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Criar Anúncio
            </Link>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => {
              const images = typeof listing.images === 'string' 
                ? JSON.parse(listing.images) 
                : listing.images

              return (
                <Link
                  key={listing.id}
                  href={`/anuncios/${listing.id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group"
                >
                  {/* Image */}
                  <div className="relative h-56 bg-gray-200">
                    {images && images.length > 0 ? (
                      <Image
                        src={images[0]}
                        alt={listing.device.model}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Smartphone className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {listing.negotiable && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Negociável
                        </span>
                      )}
                      {listing.acceptsTrade && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Aceita troca
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {listing.device.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {listing.device.storage}GB • {listing.condition}
                    </p>
                    <p className="text-2xl font-bold text-primary-600 mb-3">
                      R$ {listing.price.toLocaleString('pt-BR')}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">{listing.location}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
