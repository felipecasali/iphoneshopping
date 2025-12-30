'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // Simular envio (aqui você implementaria a lógica real de envio)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Resetar mensagem de sucesso após 5 segundos
      setTimeout(() => setSent(false), 5000)
    }, 1000)
  }

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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h1>
          <p className="text-xl text-gray-600">
            Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {sent && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Mensagem enviada com sucesso!</p>
                    <p className="text-sm text-green-700">
                      Obrigado pelo contato. Responderemos em breve.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida sobre a plataforma</option>
                    <option value="suporte">Suporte técnico</option>
                    <option value="denuncia">Denunciar anúncio ou usuário</option>
                    <option value="sugestao">Sugestão ou feedback</option>
                    <option value="parceria">Parceria comercial</option>
                    <option value="outro">Outro assunto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Descreva sua dúvida, problema ou sugestão..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-6">
            {/* Card de Email */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">E-mail</h3>
                  <p className="text-sm text-gray-600">Resposta em até 24h</p>
                </div>
              </div>
              <a
                href="mailto:contato@iphoneshopping.com.br"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                contato@iphoneshopping.com.br
              </a>
            </div>

            {/* Card de FAQ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Central de Ajuda</h3>
                  <p className="text-sm text-gray-600">Respostas rápidas</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-3">
                Antes de entrar em contato, confira nossa central de ajuda. 
                Você pode encontrar a resposta para sua dúvida mais rápido!
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Ver Perguntas Frequentes →
              </button>
            </div>

            {/* Card de Suporte */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Suporte</h3>
                  <p className="text-sm text-gray-600">Segunda a Sexta</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Horário de atendimento:<br />
                09:00 às 18:00 (horário de Brasília)
              </p>
            </div>

            {/* Card de Localização */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Online</h3>
                  <p className="text-sm text-gray-600">100% digital</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Somos uma plataforma totalmente online, 
                conectando compradores e vendedores em todo o Brasil.
              </p>
            </div>
          </div>
        </div>

        {/* Dicas de Segurança */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Atenção: Segurança em Primeiro Lugar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1">🔒 Nunca compartilhe senhas</p>
              <p>Nossa equipe nunca pedirá sua senha por e-mail ou telefone.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">💳 Cuidado com pagamentos</p>
              <p>Não fazemos intermediação financeira. Negocie diretamente com segurança.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🚨 Denuncie abusos</p>
              <p>Encontrou algo suspeito? Nos avise imediatamente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
