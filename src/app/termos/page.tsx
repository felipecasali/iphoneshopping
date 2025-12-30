'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, FileText, AlertCircle, Scale } from 'lucide-react'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Termos de Uso</h1>
          </div>
          
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-8">
            {/* Seção 1 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">1. Aceitação dos Termos</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ao acessar e usar a plataforma iPhoneShopping, você concorda com estes Termos de Uso. 
                Se você não concorda com qualquer parte destes termos, não deve usar nossa plataforma.
              </p>
            </section>

            {/* Seção 2 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">2. Descrição do Serviço</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                O iPhoneShopping é um marketplace online que conecta vendedores e compradores de 
                iPhones e iPads usados. Oferecemos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Sistema de avaliação de dispositivos</li>
                <li>Plataforma para criar e gerenciar anúncios</li>
                <li>Sistema de mensagens entre compradores e vendedores</li>
                <li>Ferramentas para facilitar transações seguras</li>
              </ul>
            </section>

            {/* Seção 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cadastro e Conta</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Para usar certos recursos da plataforma, você deve:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Fornecer informações verdadeiras, precisas e completas</li>
                <li>Manter suas informações atualizadas</li>
                <li>Manter a confidencialidade de sua senha</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
                <li>Notificar imediatamente sobre uso não autorizado</li>
              </ul>
            </section>

            {/* Seção 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Responsabilidades do Vendedor</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Ao criar um anúncio, o vendedor compromete-se a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Fornecer descrições precisas e honestas dos produtos</li>
                <li>Usar fotos reais do dispositivo à venda</li>
                <li>Informar corretamente sobre o estado e condição do aparelho</li>
                <li>Cumprir com os acordos feitos com compradores</li>
                <li>Não vender produtos roubados, falsificados ou ilegais</li>
              </ul>
            </section>

            {/* Seção 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Responsabilidades do Comprador</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Ao manifestar interesse em um produto, o comprador deve:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Verificar cuidadosamente as informações do anúncio</li>
                <li>Fazer perguntas ao vendedor antes de finalizar a compra</li>
                <li>Inspecionar o produto pessoalmente quando possível</li>
                <li>Verificar o IMEI e funcionamento do aparelho</li>
                <li>Usar métodos de pagamento seguros</li>
              </ul>
            </section>

            {/* Seção 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Transações e Pagamentos</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 mb-1">Importante</p>
                    <p className="text-sm text-yellow-700">
                      O iPhoneShopping atua apenas como intermediário. Não processamos pagamentos 
                      nem garantimos transações. Toda negociação é de responsabilidade das partes envolvidas.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Recomendamos fortemente encontros presenciais em locais públicos e seguros, 
                inspeção completa do produto antes do pagamento, e uso de métodos de pagamento rastreáveis.
              </p>
            </section>

            {/* Seção 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Conteúdo Proibido</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                É proibido publicar ou transmitir através da plataforma:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Produtos falsificados ou roubados</li>
                <li>Conteúdo ofensivo, discriminatório ou ilegal</li>
                <li>Informações falsas ou enganosas</li>
                <li>Spam ou conteúdo promocional não relacionado</li>
                <li>Violações de propriedade intelectual</li>
              </ul>
            </section>

            {/* Seção 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Privacidade e Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                O tratamento de seus dados pessoais é regido por nossa Política de Privacidade. 
                Coletamos apenas informações necessárias para o funcionamento da plataforma e 
                nunca compartilhamos seus dados com terceiros sem seu consentimento.
              </p>
            </section>

            {/* Seção 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                O iPhoneShopping não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Qualidade, segurança ou legalidade dos produtos anunciados</li>
                <li>Veracidade das informações fornecidas pelos usuários</li>
                <li>Cumprimento de acordos entre compradores e vendedores</li>
                <li>Danos diretos ou indiretos decorrentes do uso da plataforma</li>
                <li>Perda de dados ou interrupção do serviço</li>
              </ul>
            </section>

            {/* Seção 10 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Modificações dos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamos o direito de modificar estes termos a qualquer momento. 
                Mudanças significativas serão notificadas através da plataforma. 
                O uso continuado após as modificações constitui aceitação dos novos termos.
              </p>
            </section>

            {/* Seção 11 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Suspensão e Encerramento</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos suspender ou encerrar sua conta se você violar estes termos, 
                envolver-se em atividades fraudulentas, ou por qualquer motivo que consideremos 
                necessário para proteger a plataforma e seus usuários.
              </p>
            </section>

            {/* Seção 12 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Lei Aplicável</h2>
              <p className="text-gray-700 leading-relaxed">
                Estes Termos de Uso são regidos pelas leis brasileiras. 
                Qualquer disputa será resolvida nos tribunais competentes do Brasil.
              </p>
            </section>

            {/* Contato */}
            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Dúvidas sobre os Termos?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco.
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Falar Conosco
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
