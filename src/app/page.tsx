import Link from 'next/link'
import { Smartphone, Shield, MessageSquare, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import { OrganizationSchema, WebSiteSchema, FAQSchema } from '@/components/StructuredData'

export default function Home() {
  const faqData = [
    {
      question: 'Como funciona a avaliação do meu iPhone ou iPad?',
      answer: 'Nossa avaliação é simples e rápida. Você responde algumas perguntas sobre o modelo, capacidade de armazenamento, estado geral e funcionalidades do aparelho. Nosso sistema inteligente calcula um valor justo baseado nas condições do mercado.'
    },
    {
      question: 'É seguro comprar e vender no iPhoneShopping?',
      answer: 'Sim! Oferecemos um sistema de chat seguro para comunicação entre compradores e vendedores, além de um sistema de avaliações que ajuda a identificar vendedores confiáveis. Recomendamos sempre realizar transações presenciais em locais seguros.'
    },
    {
      question: 'Quanto custa para anunciar?',
      answer: 'A publicação de anúncios é totalmente gratuita! Você pode avaliar seu aparelho e publicar quantos anúncios quiser sem nenhum custo.'
    },
    {
      question: 'Posso negociar o preço?',
      answer: 'Sim! Compradores e vendedores podem negociar diretamente através do nosso sistema de mensagens. O preço sugerido pela avaliação é apenas uma referência baseada no mercado.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <OrganizationSchema />
      <WebSiteSchema />
      <FAQSchema questions={faqData} />

      {/* Header com detecção de sessão */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white" aria-label="Seção principal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Compre e Venda iPhones e iPads com Segurança
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              O marketplace especializado em dispositivos Apple no Brasil
            </p>
            <nav className="flex justify-center gap-4" aria-label="Ações principais">
              <Link 
                href="/avaliar"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                aria-label="Avaliar meu aparelho"
              >
                Avaliar Meu Aparelho
              </Link>
              <Link 
                href="/anuncios"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition"
                aria-label="Ver anúncios disponíveis"
              >
                Ver Anúncios
              </Link>
            </nav>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="features-heading" className="text-3xl font-bold text-center mb-12">
            Por que escolher o iPhoneShopping?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <article className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Avaliação Inteligente</h3>
              <p className="text-gray-600">
                Sistema avançado que calcula o valor real do seu aparelho em minutos
              </p>
            </article>

            <article className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transações Seguras</h3>
              <p className="text-gray-600">
                Garantia de segurança em todas as negociações entre compradores e vendedores
              </p>
            </article>

            <article className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat Seguro</h3>
              <p className="text-gray-600">
                Comunique-se diretamente com compradores e vendedores de forma segura
              </p>
            </article>

            <article className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Smartphone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Anúncio Gratuito</h3>
              <p className="text-gray-600">
                Cadastre seu aparelho gratuitamente após a avaliação
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="how-it-works-heading" className="text-3xl font-bold text-center mb-12">
            Como Funciona
          </h2>
          <ol className="grid md:grid-cols-3 gap-8">
            <li className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold" aria-hidden="true">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Avalie seu Aparelho</h3>
              <p className="text-gray-600">
                Responda algumas perguntas sobre o estado do seu iPhone ou iPad
              </p>
            </li>

            <li className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold" aria-hidden="true">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba a Avaliação</h3>
              <p className="text-gray-600">
                Veja o valor estimado baseado nas condições do aparelho
              </p>
            </li>

            <li className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold" aria-hidden="true">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Anuncie Gratuitamente</h3>
              <p className="text-gray-600">
                Publique seu anúncio e negocie com compradores interessados
              </p>
            </li>
          </ol>
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <details 
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold text-lg hover:bg-gray-50 transition">
                  {faq.question}
                </summary>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
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
