import Link from 'next/link'
import { Smartphone, Shield, MessageSquare, TrendingUp, Award, Clock, BadgeCheck, Target } from 'lucide-react'
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
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <p className="text-sm font-semibold">🚗 Venda seu iPhone como quem vende um carro: com valor, confiança e transparência</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Seu iPhone Vale Mais<br />Do Que Você Imagina
            </h1>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Assim como carros premium, iPhones e iPads mantêm valor excepcional. Avalie, anuncie e venda com a mesma segurança e profissionalismo.
            </p>
            <nav className="flex flex-col sm:flex-row justify-center gap-4 mb-12" aria-label="Ações principais">
              <Link 
                href="/avaliar"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="Avaliar meu aparelho"
              >
                ✨ Descobrir Valor do Meu Aparelho
              </Link>
              <Link 
                href="/anuncios"
                className="bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-400 transition border-2 border-white/30"
                aria-label="Ver anúncios disponíveis"
              >
                🔍 Explorar Anúncios
              </Link>
            </nav>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">5-7 anos</div>
                <div className="text-sm text-primary-100">Vida útil média</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">70%+</div>
                <div className="text-sm text-primary-100">Retenção de valor</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm text-primary-100">Avaliação grátis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">0 taxas</div>
                <div className="text-sm text-primary-100">Para anunciar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition - Like Premium Cars */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Produtos Apple São Investimentos Duráveis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Assim como veículos premium, iPhones e iPads são projetados para durar. Qualidade de construção, 
              sistema operacional otimizado e suporte de longa duração fazem toda a diferença.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border-t-4 border-blue-500">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Qualidade Premium</h3>
              <p className="text-gray-600 text-center">
                Construção em alumínio e vidro, processadores de última geração e câmeras profissionais.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border-t-4 border-green-500">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Longa Durabilidade</h3>
              <p className="text-gray-600 text-center">
                Atualizações de iOS por até 7 anos. Seu aparelho continua atual e valorizado por muito tempo.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border-t-4 border-purple-500">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BadgeCheck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Valor Preservado</h3>
              <p className="text-gray-600 text-center">
                Produtos Apple mantêm 60-80% do valor original mesmo após anos de uso.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border-t-4 border-orange-500">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Alta Demanda</h3>
              <p className="text-gray-600 text-center">
                Mercado aquecido com milhares de compradores procurando iPhones e iPads usados.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">
              🏆 Venda com Transparência Total
            </h3>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Nossa avaliação considera mais de 15 fatores - do estado da bateria aos acessórios inclusos. 
              Você recebe um laudo completo como uma vistoria veicular!
            </p>
            <Link 
              href="/avaliar"
              className="inline-block bg-white text-primary-600 px-10 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg text-lg"
            >
              Começar Avaliação Gratuita →
            </Link>
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
