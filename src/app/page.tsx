import Link from 'next/link'
import { Smartphone, Shield, MessageSquare, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header com detecção de sessão */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Compre e Venda iPhones e iPads com Segurança
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              O marketplace especializado em dispositivos Apple no Brasil
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/avaliar"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Avaliar Meu Aparelho
              </Link>
              <Link 
                href="/anuncios"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition"
              >
                Ver Anúncios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher o iPhoneShopping?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Avaliação Inteligente</h3>
              <p className="text-gray-600">
                Sistema avançado que calcula o valor real do seu aparelho em minutos
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transações Seguras</h3>
              <p className="text-gray-600">
                Garantia de segurança em todas as negociações entre compradores e vendedores
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat Seguro</h3>
              <p className="text-gray-600">
                Comunique-se diretamente com compradores e vendedores de forma segura
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Anúncio Gratuito</h3>
              <p className="text-gray-600">
                Cadastre seu aparelho gratuitamente após a avaliação
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Avalie seu Aparelho</h3>
              <p className="text-gray-600">
                Responda algumas perguntas sobre o estado do seu iPhone ou iPad
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba a Avaliação</h3>
              <p className="text-gray-600">
                Veja o valor estimado baseado nas condições do aparelho
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Anuncie Gratuitamente</h3>
              <p className="text-gray-600">
                Publique seu anúncio e negocie com compradores interessados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Vender seu iPhone ou iPad?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Comece agora e descubra quanto vale seu aparelho
          </p>
          <Link 
            href="/avaliar"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Avaliar Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">iPhoneShopping</h3>
              <p className="text-gray-400">
                Marketplace especializado em iPhones e iPads no Brasil
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/avaliar" className="text-gray-400 hover:text-white">Avaliar Aparelho</Link></li>
                <li><Link href="/anuncios" className="text-gray-400 hover:text-white">Ver Anúncios</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white">Entrar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><Link href="/ajuda" className="text-gray-400 hover:text-white">Central de Ajuda</Link></li>
                <li><Link href="/contato" className="text-gray-400 hover:text-white">Contato</Link></li>
                <li><Link href="/termos" className="text-gray-400 hover:text-white">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <p className="text-gray-400">
                contato@iphoneshopping.com.br
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 iPhoneShopping. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
