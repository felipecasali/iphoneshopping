'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Loader2, ArrowLeft } from 'lucide-react'

interface Conversation {
  id: string
  listing: {
    id: string
    images: string[]
    device: {
      model: string
      storage: string
    }
  }
  otherUser: {
    id: string
    name: string
    avatar: string | null
  }
  lastMessage: {
    content: string
    createdAt: string
    senderId: string
    read: boolean
  } | null
  updatedAt: string
}

export default function MensagensPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations()
      
      // Atualizar conversas a cada 5 segundos
      const interval = setInterval(fetchConversations, 5000)
      
      return () => clearInterval(interval)
    }
  }, [status])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()

      if (data.success) {
        setConversations(data.conversations)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Erro ao buscar conversas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Ontem'
    } else if (days < 7) {
      return `${days} dias atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar para Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
          </div>
          {unreadCount > 0 && (
            <p className="text-gray-600">
              Você tem <span className="font-semibold text-primary">{unreadCount}</span>{' '}
              {unreadCount === 1 ? 'mensagem não lida' : 'mensagens não lidas'}
            </p>
          )}
        </div>

        {/* Conversas */}
        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma conversa ainda
            </h2>
            <p className="text-gray-600 mb-6">
              Entre em contato com vendedores através dos anúncios
            </p>
            <Link
              href="/anuncios"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Ver Anúncios
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {conversations.map((conversation) => {
              const isUnread =
                conversation.lastMessage &&
                !conversation.lastMessage.read &&
                conversation.lastMessage.senderId !== session?.user?.email

              return (
                <Link
                  key={conversation.id}
                  href={`/dashboard/mensagens/${conversation.id}`}
                  className={`block p-4 hover:bg-gray-50 transition ${
                    isUnread ? 'bg-cyan-50/50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Imagem do anúncio */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                        {conversation.listing.images.length > 0 ? (
                          <Image
                            src={conversation.listing.images[0]}
                            alt={conversation.listing.device.model}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {/* Avatar do outro usuário */}
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                            {conversation.otherUser.name.charAt(0).toUpperCase()}
                          </div>
                          <h3 className={`font-semibold text-gray-900 ${isUnread ? 'font-bold' : ''}`}>
                            {conversation.otherUser.name}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {conversation.lastMessage
                            ? formatDate(conversation.lastMessage.createdAt)
                            : formatDate(conversation.updatedAt)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-1">
                        {conversation.listing.device.model} • {conversation.listing.device.storage}
                      </p>

                      {conversation.lastMessage && (
                        <p
                          className={`text-sm text-gray-600 truncate ${
                            isUnread ? 'font-semibold text-gray-900' : ''
                          }`}
                        >
                          {conversation.lastMessage.content}
                        </p>
                      )}

                      {isUnread && (
                        <div className="mt-2">
                          <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Nova
                          </span>
                        </div>
                      )}
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
