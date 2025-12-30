'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Smartphone, MapPin, Calendar, CheckCircle, ArrowLeft, MessageCircle, Share2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ProductSchema, BreadcrumbSchema } from '@/components/StructuredData'
import Head from 'next/head'

interface Listing {
  id: string
  price: number
  location: string
  images: string[]
  createdAt: string
  condition: string
  negotiable: boolean
  acceptsTrade: boolean
  description: string
  hasBox: boolean
  hasCharger: boolean
  icloudFree: boolean
  batteryHealth?: number
  device: {
    model: string
    storage: number
    type: string
  }
  user: {
    id: string
    name: string
    avatar?: string
  }
}

export default function AnuncioDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchListing()
  }, [params.id])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Anúncio não encontrado')
      }

      const data = await response.json()
      setListing(data.listing)
    } catch (err) {
      console.error('Erro:', err)
      alert('Anúncio não encontrado')
      router.push('/anuncios')
    } finally {
      setLoading(false)
    }
  }

  const handleContact = async () => {
    if (!session) {
      router.push('/login?redirect=/anuncios/' + params.id)
      return
    }

    try {
      // Enviar primeira mensagem para criar/encontrar conversa
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing?.id,
          receiverId: listing?.user.id,
          content: `Olá! Tenho interesse no seu ${listing?.device.model} de ${listing?.device.storage}GB.`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirecionar para a conversa
        router.push(`/dashboard/mensagens/${data.conversationId}`)
      } else {
        alert(data.error || 'Erro ao iniciar conversa')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao iniciar conversa')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando anúncio...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return null
  }

  const images = typeof listing.images === 'string' 
    ? JSON.parse(listing.images) 
    : listing.images

  const isOwner = session?.user?.email && listing.user.id === session.user.id
  
  const pageTitle = `${listing.device.model} ${listing.device.storage}GB - R$ ${listing.price.toLocaleString('pt-BR')}`
  const pageDescription = listing.description 
    ? listing.description.substring(0, 160) 
    : `${listing.device.model} de ${listing.device.storage}GB em ${listing.condition}. ${listing.location}.`

  return (
    <>
      <Head>
        <title>{pageTitle} | iPhoneShopping</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={images && images[0] || '/og-image.jpg'} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={images && images[0] || '/og-image.jpg'} />
      </Head>
      
      {/* Structured Data */}
      <ProductSchema
        name={`${listing.device.model} ${listing.device.storage}GB`}
        description={pageDescription}
        image={images && images[0]}
        brand="Apple"
        model={listing.device.model}
        price={listing.price}
        condition={listing.condition === 'Excelente' ? 'RefurbishedCondition' : 'UsedCondition'}
        seller={{ name: listing.user.name }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Início', url: 'https://www.iphoneshopping.com.br' },
          { name: 'Anúncios', url: 'https://www.iphoneshopping.com.br/anuncios' },
          { name: pageTitle, url: `https://www.iphoneshopping.com.br/anuncios/${listing.id}` }
        ]}
      />
      
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
          href="/anuncios"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para anúncios
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                {images && images.length > 0 ? (
                  <Image
                    src={images[selectedImage]}
                    alt={listing.device.model}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Smartphone className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images && images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-primary-600'
                          : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Foto ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Descrição</h2>
              {listing.description ? (
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              ) : (
                <p className="text-gray-500 italic">Sem descrição adicional</p>
              )}
            </div>

            {/* Device Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Detalhes do Aparelho</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Modelo</p>
                  <p className="font-medium">{listing.device.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Armazenamento</p>
                  <p className="font-medium">{listing.device.storage}GB</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Condição</p>
                  <p className="font-medium">{listing.condition}</p>
                </div>
                {listing.batteryHealth && (
                  <div>
                    <p className="text-sm text-gray-600">Bateria</p>
                    <p className="font-medium">{listing.batteryHealth}%</p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                {listing.hasBox && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Com caixa original</span>
                  </div>
                )}
                {listing.hasCharger && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Com carregador</span>
                  </div>
                )}
                {listing.icloudFree && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>iCloud desbloqueado</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 space-y-6">
              {/* Price */}
              <div>
                <p className="text-3xl font-bold text-primary-600">
                  R$ {listing.price.toLocaleString('pt-BR')}
                </p>
                {listing.negotiable && (
                  <p className="text-sm text-green-600 mt-1">Preço negociável</p>
                )}
                {listing.acceptsTrade && (
                  <p className="text-sm text-blue-600">Aceita trocas</p>
                )}
              </div>

              {/* Location */}
              <div className="flex items-start text-gray-700">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{listing.location}</span>
              </div>

              {/* Date */}
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Publicado em {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {!isOwner ? (
                  <>
                    <button
                      onClick={handleContact}
                      className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Entrar em Contato
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center">
                      <Share2 className="h-5 w-5 mr-2" />
                      Compartilhar
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/dashboard/anuncios/${listing.id}/editar`}
                    className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition block text-center"
                  >
                    Editar Anúncio
                  </Link>
                )}
              </div>

              {/* Seller Info */}
              <div className="pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Anunciante</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold mr-3">
                    {listing.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{listing.user.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
