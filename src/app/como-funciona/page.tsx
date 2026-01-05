'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  Check, 
  X, 
  Clock, 
  MessageSquare, 
  Search, 
  DollarSign,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Target,
  ChevronRight
} from 'lucide-react'

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Venda seu iPhone de forma <span className="text-yellow-300">mais fácil e rápida</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto mb-8">
            Chega de perder tempo respondendo as mesmas perguntas dezenas de vezes. 
            No iPhoneShopping, você cria um anúncio completo em minutos.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm sm:text-base">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Clock className="h-5 w-5 text-yellow-300" />
              <span>90% menos tempo</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-yellow-300" />
              <span>Zero repetições</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            Compare os processos
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Veja como o iPhoneShopping torna a venda do seu iPhone muito mais simples
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Método Tradicional */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-lg">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Método Tradicional</h3>
                  <p className="text-sm text-red-600 font-semibold">Demorado e cansativo</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pesquisa manual de preços</p>
                    <p className="text-sm text-gray-600">OLX, Mercado Livre, grupos do WhatsApp...</p>
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>~30 minutos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Define o preço no "achômetro"</p>
                    <p className="text-sm text-gray-600">Sem saber se está certo ou errado</p>
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>~10 minutos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Cria anúncios em múltiplos lugares</p>
                    <p className="text-sm text-gray-600">Sites, grupos, redes sociais...</p>
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>~20 minutos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Responde dezenas de perguntas</p>
                    <p className="text-sm text-gray-600">As mesmas perguntas, repetidamente...</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">Tem riscos?</span>
                      <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">% bateria?</span>
                      <span className="text-xs bg-red-50 text-red-700 px-2-1 rounded">Já teve reparo?</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-2">
                      <Clock className="h-3 w-3" />
                      <span>~2-3 horas (ou mais!)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    5
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dúvidas sobre o preço</p>
                    <p className="text-sm text-gray-600">"Tá caro"... será que está mesmo?</p>
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>Frustração constante</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-red-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700">Tempo total estimado:</span>
                  <span className="text-xl font-bold text-red-600">3-4 horas</span>
                </div>
              </div>
            </div>

            {/* Com iPhoneShopping */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-green-400 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  RECOMENDADO
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Com iPhoneShopping</h3>
                  <p className="text-sm text-green-600 font-semibold">Rápido e profissional</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      Avalie
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </p>
                    <p className="text-sm text-gray-700">
                      Em menos de 1 minuto, saiba quanto vale seu iPhone ou iPad usado
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Preço baseado em dados reais de mercado
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Avaliação técnica detalhada
                      </li>
                    </ul>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mt-2">
                      <Clock className="h-3 w-3" />
                      <span>~1 minuto</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      Anuncie
                      <Target className="h-4 w-4 text-blue-500" />
                    </p>
                    <p className="text-sm text-gray-700">
                      Um link único e compartilhável com TODAS as informações
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Todas as respostas já estão no anúncio
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Compartilhe em qualquer lugar
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Laudo técnico profissional opcional
                      </li>
                    </ul>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mt-2">
                      <Clock className="h-3 w-3" />
                      <span>~3-5 minutos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      Negocie
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                    </p>
                    <p className="text-sm text-gray-700">
                      Interessados podem entrar em contato direto ou pelo site
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Sistema de mensagens integrado
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Contato direto via WhatsApp
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Zero perguntas repetitivas
                      </li>
                    </ul>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mt-2">
                      <Clock className="h-3 w-3" />
                      <span>Você escolhe quando responder</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-green-300">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="font-semibold text-gray-700">Tempo total estimado:</span>
                  <span className="text-xl font-bold text-green-600">5-10 minutos</span>
                </div>
                <div className="bg-green-600 text-white px-4 py-3 rounded-lg text-center">
                  <p className="font-bold text-lg">90% mais rápido!</p>
                  <p className="text-sm text-green-100">E muito mais profissional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Benefícios adicionais
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Credibilidade</h3>
              <p className="text-sm text-gray-600">
                Laudo técnico profissional aumenta a confiança dos compradores
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Melhor Preço</h3>
              <p className="text-sm text-gray-600">
                Anúncios completos vendem mais rápido e por valores mais justos
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Alcance</h3>
              <p className="text-sm text-gray-600">
                Compartilhe seu anúncio em qualquer lugar com um único link
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Praticidade</h3>
              <p className="text-sm text-gray-600">
                Todo o processo em uma única plataforma, simples e intuitivo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para vender seu iPhone de forma inteligente?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Comece agora mesmo e veja como é fácil
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/avaliar"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Avaliar meu iPhone
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="/anuncios"
              className="inline-flex items-center justify-center gap-2 bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-800 transition border-2 border-white/20"
            >
              Ver anúncios
            </Link>
          </div>
          <p className="text-sm text-primary-200 mt-6">
            Gratuito para começar • Sem cartão de crédito
          </p>
        </div>
      </section>
    </div>
  )
}
