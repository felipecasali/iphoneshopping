'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircle, 
  Share2, 
  Copy, 
  MessageCircle,
  Instagram,
  Eye,
  FileText
} from 'lucide-react'

interface Listing {
  id: string
  price: number
  location: string
  images: string[]
  device: {
    model: string
    storage: number
  }
}

export default function AnuncioCriadoSucessoPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchListing()
    }
  }, [params.id])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar anúncio')
      }

      const data = await response.json()
      setListing(data.listing)
    } catch (err) {
      console.error('Erro:', err)
      router.push('/dashboard/anuncios')
    } finally {
      setLoading(false)
    }
  }

  const listingUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/anuncios/${params.id}` 
    : ''

  const listingTitle = listing 
    ? `${listing.device.model} ${listing.device.storage}GB - R$ ${listing.price.toLocaleString('pt-BR')}`
    : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
      alert('Erro ao copiar link')
    }
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Confira meu anúncio no iPhoneShopping! 📱\n\n${listingTitle}\n\n${listingUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleInstagramShare = () => {
    // Instagram não tem compartilhamento direto de links via Web
    // Copia o link e instrui o usuário
    handleCopyLink()
    alert('Link copiado! Cole no Instagram Stories ou Direct.')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Anúncio - iPhoneShopping',
          text: listingTitle,
          url: listingUrl,
        })
      } catch (err) {
        // Usuário cancelou ou erro
        console.log('Compartilhamento cancelado', err)
      }
    } else {
      handleCopyLink()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Anúncio Publicado com Sucesso!
          </h1>
          <p className="text-lg text-gray-600">
            Seu anúncio já está disponível para milhares de compradores
          </p>
        </div>

        {/* Listing Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Seu Anúncio</h2>
          <div className="flex gap-4">
            {images && images.length > 0 && (
              <div className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={images[0]}
                  alt={listing.device.model}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {listing.device.model}
              </h3>
              <p className="text-gray-600 mb-2">
                {listing.device.storage}GB • {listing.location}
              </p>
              <p className="text-2xl font-bold text-primary-600">
                R$ {listing.price.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhe seu anúncio
          </h2>
          <p className="text-gray-600 mb-6">
            Divulgue nas suas redes sociais para alcançar mais compradores!
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              <MessageCircle className="h-5 w-5" />
              Compartilhar no WhatsApp
            </button>

            {/* Instagram */}
            <button
              onClick={handleInstagramShare}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Instagram className="h-5 w-5" />
              Compartilhar no Instagram
            </button>

            {/* Native Share (Mobile) */}
            {typeof window !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Share2 className="h-5 w-5" />
                Mais opções
              </button>
            )}

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Copy className="h-5 w-5" />
              {copied ? '✓ Link Copiado!' : 'Copiar Link'}
            </button>
          </div>

          {/* URL Display */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
            <div className="flex-1 text-sm text-gray-600 truncate font-mono">
              {listingUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="flex-shrink-0 text-primary-600 hover:text-primary-700"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-cyan-900 mb-3">
            📋 O que acontece agora?
          </h3>
          <ul className="space-y-2 text-cyan-800">
            <li className="flex items-start">
              <span className="mr-2">💬</span>
              <span>Compradores interessados entrarão em contato via mensagens</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔔</span>
              <span>Você receberá notificações por email quando receber mensagens</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✏️</span>
              <span>Você pode editar ou pausar seu anúncio a qualquer momento</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📊</span>
              <span>Acompanhe as visualizações no seu dashboard</span>
            </li>
          </ul>
        </div>

        {/* CTA: Criar Laudo Técnico */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-900 mb-2">
                🔒 Destaque seu Anúncio com Laudo Técnico!
              </h3>
              <p className="text-green-800 mb-4">
                Anúncios com laudo técnico verificado recebem <strong>até 3x mais visualizações</strong> e 
                vendem mais rápido! Compradores confiam mais em produtos certificados.
              </p>
              <ul className="space-y-2 text-sm text-green-800 mb-4">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Badge verde de "Laudo Verificado" no seu anúncio</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Relatório profissional em PDF para compartilhar</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Maior credibilidade e confiança dos compradores</span>
                </li>
              </ul>
              <Link
                href={`/laudo/criar?listingId=${params.id}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                <FileText className="h-5 w-5" />
                Criar Laudo Técnico Agora
              </Link>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href={`/anuncios/${params.id}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            <Eye className="h-5 w-5" />
            Ver Anúncio Publicado
          </Link>
          <Link
            href="/dashboard/anuncios"
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Ir para Meus Anúncios
          </Link>
        </div>

        {/* Tip */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Dica:</strong> Compartilhe seu anúncio regularmente para aumentar as chances de venda!
          </p>
        </div>
      </div>
    </div>
  )
}
