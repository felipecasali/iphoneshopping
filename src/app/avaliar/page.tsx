'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Smartphone, ChevronRight, ChevronLeft } from 'lucide-react'
import { DEVICES } from '@/lib/device-pricing'

export default function AvaliarPage() {
  const [step, setStep] = useState(1)
  const [evaluation, setEvaluation] = useState({
    type: '',
    model: '',
    storage: 0,
    color: '',
    purchaseDate: '',
    hasInvoice: false,
    hasWarranty: false,
    condition: '',
    screenCondition: '',
    bodyCondition: '',
    batteryHealth: 100,
    hasBox: false,
    hasCharger: false,
    hasCable: false,
    icloudFree: false,
    imeiClean: false,
    hasWaterDamage: false,
    hasFunctionalIssues: false,
    functionalIssuesDescription: '',
  })
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [evaluationId, setEvaluationId] = useState<string | null>(null)

  const iPhones = DEVICES.filter(d => d.type === 'IPHONE')
  const iPads = DEVICES.filter(d => d.type === 'IPAD')
  const selectedDevice = DEVICES.find(d => d.model === evaluation.model && d.type === evaluation.type)

  const calculatePrice = async () => {
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluation)
      })
      const data = await response.json()
      setEstimatedPrice(data.estimatedPrice)
      setEvaluationId(data.evaluationId || null)
      setStep(7)
    } catch (error) {
      console.error('Erro ao calcular preço:', error)
    }
  }

  const nextStep = () => {
    if (step < 6) setStep(step + 1)
    else calculatePrice()
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return evaluation.type !== ''
      case 2: return evaluation.model !== '' && evaluation.storage > 0 && evaluation.color !== ''
      case 3: return evaluation.purchaseDate !== ''
      case 4: return evaluation.condition !== '' && evaluation.screenCondition !== '' && evaluation.bodyCondition !== ''
      case 5: return evaluation.type !== 'IPAD' || true
      case 6: return evaluation.icloudFree && evaluation.imeiClean
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Smartphone className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">iPhoneShopping</span>
          </Link>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        {step < 7 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Etapa {step} de 6</span>
              <span className="text-sm text-gray-500">{Math.round((step / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Tipo de Aparelho */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Qual tipo de aparelho você quer avaliar?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setEvaluation({ ...evaluation, type: 'IPHONE' })}
                className={`p-6 border-2 rounded-lg text-left transition ${
                  evaluation.type === 'IPHONE'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-4xl mb-2">📱</div>
                <h3 className="text-xl font-semibold mb-1">iPhone</h3>
                <p className="text-gray-600">Smartphones da Apple</p>
              </button>

              <button
                onClick={() => setEvaluation({ ...evaluation, type: 'IPAD' })}
                className={`p-6 border-2 rounded-lg text-left transition ${
                  evaluation.type === 'IPAD'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-4xl mb-2">📲</div>
                <h3 className="text-xl font-semibold mb-1">iPad</h3>
                <p className="text-gray-600">Tablets da Apple</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Modelo e Especificações */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Especificações do Aparelho</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <select
                  value={evaluation.model}
                  onChange={(e) => setEvaluation({ ...evaluation, model: e.target.value, storage: 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Selecione o modelo</option>
                  {(evaluation.type === 'IPHONE' ? iPhones : iPads).map(device => (
                    <option key={device.model} value={device.model}>
                      {device.model}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDevice && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Armazenamento
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {selectedDevice.storage.map(storage => (
                        <button
                          key={storage}
                          onClick={() => setEvaluation({ ...evaluation, storage })}
                          className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                            evaluation.storage === storage
                              ? 'border-primary-600 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          {storage}GB
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor
                    </label>
                    <select
                      value={evaluation.color}
                      onChange={(e) => setEvaluation({ ...evaluation, color: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione a cor</option>
                      {selectedDevice.colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Tempo de Uso e Documentação */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Tempo de Uso e Documentação</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quando você comprou o aparelho?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Mês</label>
                    <select
                      value={evaluation.purchaseDate.split('-')[1] || ''}
                      onChange={(e) => {
                        const year = evaluation.purchaseDate.split('-')[0] || new Date().getFullYear()
                        setEvaluation({ ...evaluation, purchaseDate: `${year}-${e.target.value}` })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="01">Janeiro</option>
                      <option value="02">Fevereiro</option>
                      <option value="03">Março</option>
                      <option value="04">Abril</option>
                      <option value="05">Maio</option>
                      <option value="06">Junho</option>
                      <option value="07">Julho</option>
                      <option value="08">Agosto</option>
                      <option value="09">Setembro</option>
                      <option value="10">Outubro</option>
                      <option value="11">Novembro</option>
                      <option value="12">Dezembro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Ano</label>
                    <select
                      value={evaluation.purchaseDate.split('-')[0] || ''}
                      onChange={(e) => {
                        const month = evaluation.purchaseDate.split('-')[1] || '01'
                        setEvaluation({ ...evaluation, purchaseDate: `${e.target.value}-${month}` })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {evaluation.purchaseDate && (
                  <p className="text-sm text-gray-600 mt-2">
                    Data selecionada: {new Date(evaluation.purchaseDate + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={evaluation.hasInvoice}
                    onChange={(e) => setEvaluation({ ...evaluation, hasInvoice: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium">Possuo Nota Fiscal</div>
                    <div className="text-sm text-gray-600">+R$ 200 no valor final</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={evaluation.hasWarranty}
                    onChange={(e) => setEvaluation({ ...evaluation, hasWarranty: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium">Ainda está na Garantia Apple</div>
                    <div className="text-sm text-gray-600">+R$ 300 no valor final</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Estado Físico */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Estado Físico do Aparelho</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condição Geral
                </label>
                <select
                  value={evaluation.condition}
                  onChange={(e) => setEvaluation({ ...evaluation, condition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="NOVO">Novo na Caixa - Nunca usado</option>
                  <option value="EXCELENTE">Excelente - Como novo, sem marcas de uso</option>
                  <option value="MUITO_BOM">Muito Bom - Leves sinais de uso</option>
                  <option value="BOM">Bom - Marcas de uso visíveis</option>
                  <option value="REGULAR">Regular - Marcas e riscos evidentes</option>
                  <option value="DEFEITO">Com Defeito - Necessita reparos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado da Tela
                </label>
                <select
                  value={evaluation.screenCondition}
                  onChange={(e) => setEvaluation({ ...evaluation, screenCondition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="PERFEITA">Perfeita - Sem arranhões</option>
                  <option value="LEVES_ARRANHOS">Arranhões Leves - Visíveis apenas com luz</option>
                  <option value="ARRANHOS_VISIVEIS">Arranhões Visíveis</option>
                  <option value="TRINCADA">Trincada ou Quebrada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado do Corpo/Carcaça
                </label>
                <select
                  value={evaluation.bodyCondition}
                  onChange={(e) => setEvaluation({ ...evaluation, bodyCondition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="PERFEITO">Perfeito - Sem marcas</option>
                  <option value="LEVES_MARCAS">Leves Marcas de Uso</option>
                  <option value="MARCAS_VISIVEIS">Marcas e Riscos Visíveis</option>
                  <option value="AMASSADOS">Amassados ou Danos Evidentes</option>
                </select>
              </div>

              {evaluation.type === 'IPHONE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saúde da Bateria: {evaluation.batteryHealth}%
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-800">
                      <strong>📱 Como verificar:</strong>
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      iPhone: Ajustes → Bateria → Saúde e Carregamento da Bateria → Capacidade Máxima
                    </p>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={evaluation.batteryHealth}
                    onChange={(e) => setEvaluation({ ...evaluation, batteryHealth: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={evaluation.hasWaterDamage}
                    onChange={(e) => setEvaluation({ ...evaluation, hasWaterDamage: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="font-medium">Teve contato com água/líquidos</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={evaluation.hasFunctionalIssues}
                    onChange={(e) => setEvaluation({ ...evaluation, hasFunctionalIssues: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="font-medium">Possui problemas funcionais (câmera, alto-falante, etc.)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Acessórios */}
        {step === 5 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Acessórios Inclusos</h2>
            <p className="text-gray-600 mb-6">Selecione todos os acessórios originais que você ainda possui:</p>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={evaluation.hasBox}
                  onChange={(e) => setEvaluation({ ...evaluation, hasBox: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium">Caixa Original</div>
                  <div className="text-sm text-gray-600">+R$ 150</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={evaluation.hasCharger}
                  onChange={(e) => setEvaluation({ ...evaluation, hasCharger: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium">Carregador Original</div>
                  <div className="text-sm text-gray-600">+R$ 100</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={evaluation.hasCable}
                  onChange={(e) => setEvaluation({ ...evaluation, hasCable: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium">Cabo Original</div>
                  <div className="text-sm text-gray-600">+R$ 80</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 6: Verificações Finais */}
        {step === 6 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Verificações Finais</h2>
            <p className="text-gray-600 mb-6">Estas verificações são obrigatórias para venda:</p>
            
            <div className="space-y-4">
              <div className={`p-4 border-2 rounded-lg ${evaluation.icloudFree ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evaluation.icloudFree}
                    onChange={(e) => setEvaluation({ ...evaluation, icloudFree: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mt-1"
                  />
                  <div>
                    <div className="font-medium text-lg">iCloud Desbloqueado</div>
                    <div className="text-sm text-gray-700 mt-1">
                      Confirmo que o aparelho está desvinculado do iCloud e não possui Buscar iPhone ativo.
                      Aparelhos com iCloud bloqueado não podem ser vendidos.
                    </div>
                  </div>
                </label>
              </div>

              <div className={`p-4 border-2 rounded-lg ${evaluation.imeiClean ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evaluation.imeiClean}
                    onChange={(e) => setEvaluation({ ...evaluation, imeiClean: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mt-1"
                  />
                  <div>
                    <div className="font-medium text-lg">IMEI Limpo</div>
                    <div className="text-sm text-gray-700 mt-1">
                      Confirmo que o IMEI do aparelho está limpo, sem bloqueios ou restrições de operadora.
                    </div>
                  </div>
                </label>
              </div>

              {(!evaluation.icloudFree || !evaluation.imeiClean) && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Ambas as verificações são obrigatórias para prosseguir com a avaliação.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 7: Resultado */}
        {step === 7 && estimatedPrice !== null && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-bold mb-2">Avaliação Concluída!</h2>
              <p className="text-gray-600 mb-8">Baseado nas informações fornecidas, o valor estimado do seu aparelho é:</p>
              
              <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-8 mb-8">
                <div className="text-sm text-primary-600 font-medium mb-2">VALOR SUGERIDO</div>
                <div className="text-5xl font-bold text-primary-600 mb-2">
                  R$ {estimatedPrice.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-gray-600">
                  Faixa: R$ {Math.round(estimatedPrice * 0.9).toLocaleString('pt-BR')} - 
                  R$ {Math.round(estimatedPrice * 1.1).toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold mb-4">Resumo da Avaliação:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aparelho:</span>
                    <span className="font-medium">{evaluation.model} {evaluation.storage}GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condição:</span>
                    <span className="font-medium">{evaluation.condition}</span>
                  </div>
                  {evaluation.type === 'IPHONE' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bateria:</span>
                      <span className="font-medium">{evaluation.batteryHealth}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Acessórios:</span>
                    <span className="font-medium">
                      {[
                        evaluation.hasBox && 'Caixa',
                        evaluation.hasCharger && 'Carregador',
                        evaluation.hasCable && 'Cabo'
                      ].filter(Boolean).join(', ') || 'Nenhum'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Salva os dados da avaliação no localStorage
                    localStorage.setItem('evaluationData', JSON.stringify({
                      ...evaluation,
                      estimatedPrice
                    }))
                    window.location.href = '/criar-anuncio'
                  }}
                  className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  🚀 Anunciar Agora
                </button>

                {evaluationId && (
                  <Link
                    href={`/laudo/criar?evaluationId=${evaluationId}`}
                    className="w-full block bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center shadow-lg hover:shadow-xl"
                  >
                    📋 Criar Laudo Técnico Profissional
                  </Link>
                )}

                <button
                  onClick={() => {
                    setStep(1)
                    setEstimatedPrice(null)
                    setEvaluationId(null)
                    setEvaluation({
                      type: '',
                      model: '',
                      storage: 0,
                      color: '',
                      purchaseDate: '',
                      hasInvoice: false,
                      hasWarranty: false,
                      condition: '',
                      screenCondition: '',
                      bodyCondition: '',
                      batteryHealth: 100,
                      hasBox: false,
                      hasCharger: false,
                      hasCable: false,
                      icloudFree: false,
                      imeiClean: false,
                      hasWaterDamage: false,
                      hasFunctionalIssues: false,
                      functionalIssuesDescription: '',
                    })
                  }}
                  className="w-full bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  🔄 Nova Avaliação
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 7 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center px-6 py-3 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary-600"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Voltar
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 6 ? 'Calcular Valor' : 'Próximo'}
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
