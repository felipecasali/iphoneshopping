'use client'

import { useState } from 'react'

const scenarios = [
  { 
    id: 'excelente', 
    name: 'Excelente', 
    description: 'iPhone 15 Pro Max - Perfeito, 98% bateria, todos acessórios',
    badge: 'CONFORME',
    color: 'green'
  },
  { 
    id: 'bom', 
    name: 'Bom', 
    description: 'iPhone 14 Pro - Leves marcas, 85% bateria, com caixa',
    badge: 'CONFORME',
    color: 'blue'
  },
  { 
    id: 'regular', 
    name: 'Regular', 
    description: 'iPhone 13 - Marcas visíveis, 72% bateria, Wi-Fi com defeito',
    badge: 'C/ OBSERVAÇÃO',
    color: 'yellow'
  },
  { 
    id: 'ruim', 
    name: 'Ruim', 
    description: 'iPhone 12 - Trincado, danificado, 65% bateria',
    badge: 'NÃO CONFORME',
    color: 'red'
  },
  { 
    id: 'ipad', 
    name: 'iPad', 
    description: 'iPad Pro 11" M4 - Perfeito, 94% bateria, Pencil + Keyboard',
    badge: 'CONFORME',
    color: 'purple'
  },
]

export default function TestPDFPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleGenerate(scenario: string) {
    setLoading(scenario)
    setStatus(null)

    try {
      const response = await fetch(`/api/test/pdf?scenario=${scenario}`)
      
      if (!response.ok) {
        throw new Error('Erro ao gerar PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Laudo_Teste_${scenario}_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setStatus({ message: `✅ PDF "${scenario}" gerado com sucesso!`, type: 'success' })
    } catch (error) {
      setStatus({ message: '❌ Erro ao gerar PDF', type: 'error' })
    } finally {
      setLoading(null)
    }
  }

  async function handleGenerateAll() {
    setStatus({ message: '⏳ Gerando todos os PDFs...', type: 'success' })
    
    for (const scenario of scenarios) {
      await handleGenerate(scenario.id)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setStatus({ message: '✅ Todos os PDFs foram gerados!', type: 'success' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🧪 Teste de Geração de PDF
            </h1>
            <p className="text-gray-600 text-lg">
              Gere laudos técnicos com diferentes cenários para visualizar as melhorias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleGenerate(scenario.id)}
                disabled={loading === scenario.id}
                className={`
                  bg-gray-50 border-2 rounded-xl p-6 text-left transition-all
                  hover:border-primary-500 hover:shadow-lg hover:-translate-y-1
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${loading === scenario.id ? 'animate-pulse' : ''}
                `}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  📱 {scenario.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {scenario.description}
                </p>
                <span className={`
                  inline-block px-3 py-1 rounded-full text-xs font-semibold
                  ${scenario.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                  ${scenario.color === 'blue' ? 'bg-cyan-100 text-cyan-700' : ''}
                  ${scenario.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${scenario.color === 'red' ? 'bg-red-100 text-red-700' : ''}
                  ${scenario.color === 'purple' ? 'bg-purple-100 text-purple-700' : ''}
                `}>
                  {scenario.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleGenerateAll}
              disabled={loading !== null}
              className="
                bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold
                hover:bg-primary-700 transition-all hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              📄 Gerar Todos os Cenários
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="
                bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold
                hover:bg-gray-700 transition-all hover:shadow-lg
              "
            >
              🔄 Limpar
            </button>
          </div>

          {status && (
            <div className={`
              p-4 rounded-lg mb-6
              ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
            `}>
              {status.message}
            </div>
          )}

          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded-r-lg">
            <h4 className="font-bold text-cyan-900 mb-3">💡 Como usar:</h4>
            <ul className="space-y-2 text-cyan-800">
              <li>• Clique em um cenário para gerar o PDF correspondente</li>
              <li>• O PDF será baixado automaticamente no seu navegador</li>
              <li>• Use "Gerar Todos" para comparar todos os cenários de uma vez</li>
              <li>• Verifique o visual, cores, layout e seção de valor estimado</li>
              <li>• Compare o antes e depois das melhorias implementadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
