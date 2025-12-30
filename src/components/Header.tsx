'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Smartphone, MessageSquare, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const { data: session, status } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUnreadCount()
      // Atualizar contador a cada 30 segundos
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [status])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      if (data.success) {
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens não lidas:', error)
    }
  }

  return (
    <>
      {/* Overlay para fechar o menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
      
      <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Smartphone className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/avaliar" className="text-gray-700 hover:text-primary font-medium">
              Avaliar Aparelho
            </Link>
            <Link href="/anuncios" className="text-gray-700 hover:text-primary font-medium">
              Anúncios
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'authenticated' ? (
              <>
                {/* Mensagens */}
                <Link 
                  href="/dashboard/mensagens" 
                  className="p-2 text-gray-600 hover:text-primary relative"
                  title="Mensagens"
                  onClick={() => setUnreadCount(0)}
                >
                  <MessageSquare className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Menu do usuário */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary transition"
                    title="Menu do usuário"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold ring-2 ring-primary ring-offset-2">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      {/* Indicador online */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="hidden md:block font-medium text-gray-700">
                      {session.user?.name?.split(' ')[0] || 'Usuário'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/anuncios"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Smartphone className="w-4 h-4" />
                        Meus Anúncios
                      </Link>
                      <Link
                        href="/dashboard/mensagens"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Mensagens
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>

                <Link 
                  href="/criar-anuncio" 
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 font-medium"
                >
                  Anunciar
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary font-medium">
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 font-medium"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
    </>
  )
}
