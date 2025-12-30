'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, Download, Share2, CheckCircle, XCircle, Award, Calendar, Shield, Smartphone } from 'lucide-react'
import { generateTechnicalReportPDF, downloadPDF } from '@/lib/pdf-generator'

interface TechnicalReport {
  id: string
  reportNumber: string
  reportType: string
  deviceType: string
  deviceModel: string
  storage: number
  color: string
  imei: string
  serialNumber?: string
  frontPhoto: string
  backPhoto: string
  sidesPhotos: string
  screenOnPhoto: string
  batteryHealthPhoto: string
  batteryHealthPercent: number
  screenCondition: string
  bodyCondition: string
  cameraCondition: string
  screenConditionNotes?: string
  bodyConditionNotes?: string
  cameraConditionNotes?: string
  touchWorking: boolean
  faceIdWorking: boolean
  biometricsWorking: boolean
  wifiWorking: boolean
  bluetoothWorking: boolean
  speakersWorking: boolean
  microphoneWorking: boolean
  vibrationWorking: boolean
  buttonsWorking: boolean
  icloudFree: boolean
  carrierUnlocked: boolean
  hasWaterDamage: boolean
  hasRepairs: boolean
  repairDetails?: string
  hasBox: boolean
  hasCharger: boolean
  hasCable: boolean
  hasEarphones: boolean
  hasInvoice: boolean
  hasWarranty: boolean
  estimatedPrice?: number
  status: string
  verifiedAt?: string
  createdAt: string
  expiresAt?: string
  user: {
    name: string
    email: string
  }
}

export default function LaudoPage() {
  const params = useParams()
  const [report, setReport] = useState<TechnicalReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [params.id])

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/technical-reports/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setReport(data.report)
      }
    } catch (error) {
      console.error('Erro ao carregar laudo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!report) return
    
    setDownloading(true)
    try {
      const pdfBlob = await generateTechnicalReportPDF(report as any)
      const filename = `Laudo_${report.reportNumber}_${report.deviceModel.replace(/\s/g, '_')}.pdf`
      downloadPDF(pdfBlob, filename)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  }

  if (!report) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Laudo não encontrado</h1>
        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  }

  const isExpired = report.expiresAt && new Date(report.expiresAt) < new Date()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Laudo Técnico Oficial</h1>
              </div>
              <p className="text-primary-100">Documento verificado e assinado digitalmente</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{report.reportNumber}</div>
              <div className="text-sm text-primary-100">
                {new Date(report.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span>{downloading ? 'Gerando PDF...' : 'Baixar PDF'}</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
              <Share2 className="h-4 w-4" />
              <span>Compartilhar</span>
            </button>
          </div>
          
          {isExpired ? (
            <div className="flex items-center text-red-600 text-sm">
              <XCircle className="h-5 w-5 mr-2" />
              Laudo Expirado
            </div>
          ) : (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-5 w-5 mr-2" />
              Laudo Válido
            </div>
          )}
        </div>

        {/* Main Report */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Device Info */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Smartphone className="h-6 w-6 mr-2 text-primary-600" />
              Identificação do Aparelho
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Tipo</div>
                <div className="font-semibold">{report.deviceType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Modelo</div>
                <div className="font-semibold">{report.deviceModel}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Armazenamento</div>
                <div className="font-semibold">{report.storage} GB</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Cor</div>
                <div className="font-semibold">{report.color}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">IMEI</div>
                <div className="font-semibold font-mono">{report.imei}</div>
              </div>
              {report.serialNumber && (
                <div>
                  <div className="text-sm text-gray-600">Número de Série</div>
                  <div className="font-semibold font-mono">{report.serialNumber}</div>
                </div>
              )}
            </div>
          </div>

          {/* Photos Grid */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentação Fotográfica</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Frente</div>
                <Image src={report.frontPhoto} alt="Frente" width={300} height={300} className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Traseira</div>
                <Image src={report.backPhoto} alt="Traseira" width={300} height={300} className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Tela Ligada</div>
                <Image src={report.screenOnPhoto} alt="Tela" width={300} height={300} className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Saúde da Bateria</div>
                <Image src={report.batteryHealthPhoto} alt="Bateria" width={300} height={300} className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
              </div>
            </div>
          </div>

          {/* Condition Assessment */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Avaliação de Condição</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Tela</div>
                  <div className="text-lg font-bold text-primary-600">{report.screenCondition}</div>
                </div>
                {report.screenConditionNotes && (
                  <div className="text-sm text-gray-600">{report.screenConditionNotes}</div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Corpo/Chassi</div>
                  <div className="text-lg font-bold text-primary-600">{report.bodyCondition}</div>
                </div>
                {report.bodyConditionNotes && (
                  <div className="text-sm text-gray-600">{report.bodyConditionNotes}</div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Câmera</div>
                  <div className="text-lg font-bold text-primary-600">{report.cameraCondition}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">Saúde da Bateria</div>
                  <div className="text-2xl font-bold text-green-600">{report.batteryHealthPercent}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Functionality Tests */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Testes de Funcionalidade</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Touch Screen', value: report.touchWorking },
                { label: 'Face ID', value: report.faceIdWorking },
                { label: 'Wi-Fi', value: report.wifiWorking },
                { label: 'Bluetooth', value: report.bluetoothWorking },
                { label: 'Alto-falantes', value: report.speakersWorking },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  {item.value ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status & Accessories */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Status e Acessórios</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Status do Aparelho</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    {report.icloudFree ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className="text-sm">iCloud Desbloqueado</span>
                  </div>
                  <div className="flex items-center">
                    {report.carrierUnlocked ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className="text-sm">Desbloqueado Operadora</span>
                  </div>
                  <div className="flex items-center">
                    {!report.hasWaterDamage ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className="text-sm">Sem Danos por Líquido</span>
                  </div>
                  <div className="flex items-center">
                    {!report.hasRepairs ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className="text-sm">Sem Reparos Anteriores</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Acessórios Inclusos</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    {report.hasBox ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mr-2" />
                    )}
                    <span className="text-sm">Caixa Original</span>
                  </div>
                  <div className="flex items-center">
                    {report.hasCharger ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mr-2" />
                    )}
                    <span className="text-sm">Carregador</span>
                  </div>
                  <div className="flex items-center">
                    {report.hasCable ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mr-2" />
                    )}
                    <span className="text-sm">Cabo</span>
                  </div>
                  <div className="flex items-center">
                    {report.hasInvoice ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mr-2" />
                    )}
                    <span className="text-sm">Nota Fiscal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Estimate */}
          {report.estimatedPrice && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Valor Estimado</h2>
                  <p className="text-sm text-gray-600">Baseado em condições atuais do mercado</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">
                    R$ {report.estimatedPrice.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Válido até {report.expiresAt && new Date(report.expiresAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <Award className="h-12 w-12 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Certificação Digital</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Este laudo foi verificado e certificado digitalmente pela plataforma iPhoneShopping.
                  Todos os dados foram validados e as fotos autenticadas.
                </p>
                <div className="flex items-center text-sm text-gray-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Verificado em: {report.verifiedAt && new Date(report.verifiedAt).toLocaleString('pt-BR')}
                </div>
                <div className="flex items-center text-sm text-gray-700 mt-1">
                  <Shield className="h-4 w-4 mr-2" />
                  Laudo: {report.reportNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>iPhoneShopping - Laudo Técnico Certificado</p>
          <p className="mt-1">www.iphoneshopping.com.br</p>
        </div>
      </div>
    </div>
  )
}
