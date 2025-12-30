'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Smartphone, Package, Plus, Eye, Edit, Trash2 } from 'lucide-react'

interface Listing {
  id: string
  price: number
  location: string
  images: string[]
  status: string
  views: number
  createdAt: string
  negotiable: boolean
  acceptsTrade: boolean
  device: {
    model: string
    storage: number
    type: string
  }
}

export default function MeusAnunciosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.email) {
      fetchListings()
    }
  }, [status, session, router])

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/user/listings')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar anúncios')
      }

      const data = await response.json()
      setListings(data.listings || [])
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao carregar anúncios')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
      return
    }

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir anúncio')
      }

      // Atualizar lista
      setListings(listings.filter(l => l.id !== id))
      alert('Anúncio excluído com sucesso!')
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao excluir anúncio. Tente novamente.')
    }
  }

  if (status === 'loading' || loading) {
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
            <Smartphone className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
          </Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Anúncios</h1>
            <p className="text-gray-600 mt-1">Gerencie seus produtos à venda</p>
          </div>
          <Link
            href="/avaliar"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Anúncio
          </Link>
        </div>

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum anúncio ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece avaliando seu iPhone ou iPad e crie seu primeiro anúncio
            </p>
            <Link
              href="/avaliar"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Anúncio
            </Link>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const images = typeof listing.images === 'string' 
                ? JSON.parse(listing.images) 
                : listing.images

              return (
                <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    {images && images.length > 0 ? (
                      <Image
                        src={images[0]}
                        alt={listing.device.model}
                        fill
                        className="object-cover"
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
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        listing.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {listing.status === 'ACTIVE' ? 'Ativo' : listing.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {listing.device.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {listing.device.storage}GB
                    </p>
                    <p className="text-2xl font-bold text-primary-600 mb-3">
                      R$ {listing.price.toLocaleString('pt-BR')}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{listing.views} visualizações</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/anuncios/${listing.id}/editar`}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
