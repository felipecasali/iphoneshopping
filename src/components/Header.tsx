'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { MessageSquare, User, LogOut, LayoutDashboard, Menu, X, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Header() {
  const { data: session, status } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUnreadCount()
      fetchUserProfile()
      // Atualizar contador a cada 30 segundos
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [status])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      if (data.user?.avatar) {
        setUserAvatar(data.user.avatar)
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
    }
  }

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
      {/* Overlay para fechar os menus */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false)
            setShowMobileMenu(false)
          }}
        />
      )}
      
      <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
            <Image 
              src="/logo.png" 
              alt="iPhoneShopping Logo" 
              width={32} 
              height={32} 
              className="h-6 w-6 sm:h-8 sm:w-8"
              priority
            />
            <span className="text-lg sm:text-2xl font-bold text-gray-900">iPhoneShopping</span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/avaliar" className="text-gray-700 hover:text-primary font-medium text-sm">
              Avaliar Aparelho
            </Link>
            <Link href="/anuncios" className="text-gray-700 hover:text-primary font-medium text-sm">
              Anúncios
            </Link>
            <Link href="/laudo/criar" className="text-gray-700 hover:text-primary font-medium flex items-center gap-1 text-sm">
              Laudo Técnico
              <span className="text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded-full">Novo</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {status === 'authenticated' ? (
              <>
                {/* Mensagens */}
                <Link 
                  href="/dashboard/mensagens" 
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-primary relative"
                  title="Mensagens"
                  onClick={() => setUnreadCount(0)}
                >
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Menu do usuário */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 text-gray-600 hover:text-primary transition"
                    title="Menu do usuário"
                  >
                    <div className="relative">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold ring-2 ring-primary ring-offset-1 overflow-hidden text-sm">
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt={session.user?.name || 'Avatar'}
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          session.user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      {/* Indicador online */}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="hidden lg:block font-medium text-gray-700 text-sm">
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
                        href="/dashboard/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Perfil
                      </Link>
                      <Link
                        href="/dashboard/anuncios"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4" />
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
                  className="hidden sm:inline-block bg-primary text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-primary/90 font-medium text-sm"
                >
                  Anunciar
                </Link>

                {/* Botão Menu Mobile */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-1.5 text-gray-600 hover:text-primary"
                  title="Menu"
                >
                  {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary font-medium text-sm">
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-primary/90 font-medium text-sm"
                >
                  Cadastrar
                </Link>

                {/* Botão Menu Mobile */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-1.5 text-gray-600 hover:text-primary"
                  title="Menu"
                >
                  {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {showMobileMenu && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/avaliar" 
                className="block text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Avaliar Aparelho
              </Link>
              <Link 
                href="/anuncios" 
                className="block text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Anúncios
              </Link>
              <Link 
                href="/laudo/criar" 
                className="block text-gray-700 hover:text-primary font-medium py-2 flex items-center gap-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Laudo Técnico
                <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">Novo</span>
              </Link>
              {status === 'authenticated' && (
                <Link 
                  href="/criar-anuncio" 
                  className="block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Criar Anúncio
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
    </>
  )
}
