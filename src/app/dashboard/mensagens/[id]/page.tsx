'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Send, Loader2, Package } from 'lucide-react'

interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  read: boolean
  sender: {
    id: string
    name: string
    avatar: string | null
  }
}

interface ConversationData {
  id: string
  listing: {
    id: string
    title: string
    price: number
    images: string[]
    status: string
    device: {
      model: string
      storage: string
      condition: string
    }
  }
  otherUser: {
    id: string
    name: string
    avatar: string | null
  }
  messages: Message[]
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversation, setConversation] = useState<ConversationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversation()
      
      // Iniciar polling a cada 3 segundos
      pollingIntervalRef.current = setInterval(() => {
        fetchConversation()
      }, 3000)

      // Limpar intervalo ao desmontar
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
        }
      }
    }
  }, [status, params.id])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/messages/${params.id}`)
      const data = await response.json()

      if (data.success) {
        const newConversation = data.conversation
        
        // Verificar se há novas mensagens
        if (conversation && newConversation.messages.length > conversation.messages.length) {
          // Som de notificação poderia ser adicionado aqui
          console.log('Nova mensagem recebida!')
        }
        
        setConversation(newConversation)
      } else {
        if (loading) {
          router.push('/dashboard/mensagens')
        }
      }
    } catch (error) {
      console.error('Erro ao buscar conversa:', error)
      if (loading) {
        router.push('/dashboard/mensagens')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !conversation || sending) return

    setSending(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: conversation.listing.id,
          receiverId: conversation.otherUser.id,
          content: message.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('')
        fetchConversation() // Recarregar conversa
      } else {
        alert('Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      alert('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getUserId = async () => {
    if (!session?.user?.email) return null
    // Este é um hack temporário - idealmente o userId deveria vir da sessão
    return conversation?.messages.find(m => m.sender.id)?.sender.id
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!conversation) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header fixo */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/mensagens"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {conversation.otherUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">
                  {conversation.otherUser.name}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.listing.device.model} • R$ {conversation.listing.price.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-xs text-gray-400 hidden sm:block">
                Atualiza a cada 3s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Container do Chat */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Card compacto do anúncio */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-6 flex gap-3 items-center">
              {conversation.listing.images.length > 0 && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={conversation.listing.images[0]}
                    alt={conversation.listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conversation.listing.device.model} - {conversation.listing.device.storage}
                </p>
                <p className="text-sm text-gray-600">
                  {conversation.listing.device.condition}
                </p>
              </div>
              <Link
                href={`/anuncios/${conversation.listing.id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
              >
                Ver detalhes
              </Link>
            </div>

            {/* Mensagens */}
            <div className="space-y-4">
              {conversation.messages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500">
                    Nenhuma mensagem ainda. Inicie a conversa!
                  </p>
                </div>
              ) : (
                conversation.messages.map((msg) => {
                  const isOwn = msg.sender.id !== conversation.otherUser.id

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] sm:max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwn
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-primary-100' : 'text-gray-500'
                          }`}
                        >
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Formulário de envio fixo no rodapé */}
        <div className="bg-white border-t border-gray-200 sticky bottom-0">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="hidden sm:inline">Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Enviar</span>
                  </>
                )}
              </button>
            </form>
            
            {/* Aviso de segurança compacto */}
            <div className="mt-3 text-xs text-gray-500 flex items-start gap-1">
              <span>⚠️</span>
              <span>
                <strong>Segurança:</strong> Nunca compartilhe dados pessoais antes de confirmar. Prefira encontros em locais públicos.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
