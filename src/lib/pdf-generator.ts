import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import QRCode from 'qrcode'

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
  batteryHealthPercent: number
  screenCondition: string
  bodyCondition: string
  cameraCondition: string
  screenConditionNotes?: string
  bodyConditionNotes?: string
  cameraConditionNotes?: string
  touchWorking: boolean
  faceIdWorking: boolean
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
  createdAt: Date
  expiresAt?: Date
  frontPhoto?: string
  backPhoto?: string
  sidesPhotos?: string
  screenOnPhoto?: string
  screenOffPhoto?: string
  batteryHealthPhoto?: string
  imeiPhoto?: string
  boxPhoto?: string
  invoicePhoto?: string
  accessoriesPhotos?: string
}

const CONDITION_LABELS: Record<string, string> = {
  PERFEITO: 'Perfeito',
  ARRANHOES_LEVES: 'Arranhões Leves',
  ARRANHOES_VISIVEIS: 'Arranhões Visíveis',
  MARCAS_USO: 'Marcas de Uso',
  ARRANHOES: 'Arranhões',
  AMASSADOS: 'Amassados',
  TRINCADO: 'Trincado',
  QUEBRADO: 'Quebrado',
  DANIFICADO: 'Danificado',
  FUNCIONAL: 'Funcional',
  COM_DEFEITO: 'Com Defeito'
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  BASIC: 'Laudo Básico',
  STANDARD: 'Laudo Profissional',
  PREMIUM: 'Laudo Premium'
}

// Helper para carregar imagem de URL
async function loadImageAsDataURL(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Erro ao carregar imagem:', url, error)
    return null
  }
}

export async function generateTechnicalReportPDF(report: TechnicalReport): Promise<Blob> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20

  // Watermark para laudos BASIC
  if (report.reportType === 'BASIC') {
    doc.setTextColor(200, 200, 200)
    doc.setFontSize(50)
    doc.text('VERSÃO GRATUITA', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45
    })
  }

  // Header com gradiente e logo
  // Fundo com gradiente simulado (azul para verde)
  doc.setFillColor(37, 99, 235) // primary-600
  doc.rect(0, 0, pageWidth, 15, 'F')
  doc.setFillColor(45, 110, 230)
  doc.rect(0, 15, pageWidth, 10, 'F')
  doc.setFillColor(52, 121, 225)
  doc.rect(0, 25, pageWidth, 10, 'F')
  
  // Logo e Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('iPhoneShopping', 15, 22)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Laudo Técnico Certificado', 15, 29)
  
  // Badge do tipo de laudo no canto
  const badgeX = pageWidth - 70
  const badgeY = 8
  let badgeColor: [number, number, number] = [107, 114, 128] // gray
  if (report.reportType === 'PREMIUM') badgeColor = [147, 51, 234] // purple
  else if (report.reportType === 'STANDARD') badgeColor = [37, 99, 235] // blue
  
  doc.setFillColor(...badgeColor)
  doc.roundedRect(badgeX, badgeY, 55, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(REPORT_TYPE_LABELS[report.reportType] || report.reportType, badgeX + 27.5, badgeY + 5.5, { align: 'center' })
  
  // Número do laudo em destaque
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Nº ${report.reportNumber}`, badgeX + 27.5, badgeY + 13, { align: 'center' })

  // QR Code de verificação (maior e mais visível)
  const qrSize = 32
  const qrX = pageWidth - qrSize - 13
  const qrY = 40
  
  // Fundo branco para o QR code
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 2, 2, 'F')
  
  const qrCodeUrl = `https://www.iphoneshopping.com.br/laudo/${report.id}`
  const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, { width: 256, margin: 1 })
  doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)
  
  // Texto "Verificar Autenticidade"
  doc.setTextColor(75, 85, 99)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('Verificar', qrX + qrSize / 2, qrY + qrSize + 5, { align: 'center' })
  doc.text('Autenticidade', qrX + qrSize / 2, qrY + qrSize + 8.5, { align: 'center' })

  // Calcular resultado da avaliação ANTES de desenhar o parecer
  const functionalTestsResults = [
    report.touchWorking, report.faceIdWorking, report.wifiWorking, 
    report.bluetoothWorking, report.speakersWorking, report.microphoneWorking,
    report.vibrationWorking, report.buttonsWorking
  ]
  const conformeCount = functionalTestsResults.filter(t => t).length
  const naoConformeCount = functionalTestsResults.filter(t => !t).length
  
  // Adicionar condições físicas ao cálculo
  const physicalConditions = [
    report.screenCondition !== 'TRINCADO' && report.screenCondition !== 'QUEBRADO' && report.screenCondition !== 'DANIFICADO',
    report.bodyCondition !== 'DANIFICADO',
    report.cameraCondition !== 'DANIFICADO'
  ]
  const physicalConformeCount = physicalConditions.filter(c => c).length
  const physicalNaoConformeCount = physicalConditions.filter(c => !c).length
  
  const totalConforme = conformeCount + physicalConformeCount
  const totalNaoConforme = naoConformeCount + physicalNaoConformeCount
  const totalVerificado = totalConforme + totalNaoConforme
  
  // Determinar parecer
  let parecerTexto = ''
  let parecerColor: [number, number, number] = [34, 197, 94]
  let parecerIcon = '✓'
  
  if (totalNaoConforme === 0 && report.batteryHealthPercent >= 80 && report.icloudFree && !report.hasWaterDamage) {
    parecerTexto = 'CONFORME'
    parecerColor = [34, 197, 94]
    parecerIcon = '✓'
  } else if (totalNaoConforme <= 2 && report.batteryHealthPercent >= 50 && report.icloudFree) {
    parecerTexto = 'CONFORME COM OBSERVAÇÃO'
    parecerColor = [234, 179, 8]
    parecerIcon = '⚠'
  } else {
    parecerTexto = 'NÃO CONFORME'
    parecerColor = [239, 68, 68]
    parecerIcon = '✗'
  }

  // Box de PARECER FINAL (ao lado do QR Code no topo) - Estilo selo profissional
  const parecerBoxX = pageWidth - 110
  const parecerBoxY = 40
  const parecerBoxWidth = 55
  const parecerBoxHeight = 34
  
  // Fundo do box com cor baseada no parecer (com transparência simulada)
  if (parecerTexto === 'CONFORME') {
    doc.setFillColor(220, 252, 231) // green-100
  } else if (parecerTexto === 'CONFORME COM OBSERVAÇÃO') {
    doc.setFillColor(254, 249, 195) // yellow-100
  } else {
    doc.setFillColor(254, 226, 226) // red-100
  }
  doc.roundedRect(parecerBoxX, parecerBoxY, parecerBoxWidth, parecerBoxHeight, 3, 3, 'F')
  
  // Borda colorida
  doc.setDrawColor(...parecerColor)
  doc.setLineWidth(1.5)
  doc.roundedRect(parecerBoxX, parecerBoxY, parecerBoxWidth, parecerBoxHeight, 3, 3, 'D')
  
  // Título
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(75, 85, 99)
  doc.text('PARECER FINAL', parecerBoxX + parecerBoxWidth/2, parecerBoxY + 5, { align: 'center' })
  
  // Ícone grande
  doc.setTextColor(...parecerColor)
  doc.setFontSize(18)
  doc.text(parecerIcon, parecerBoxX + parecerBoxWidth/2, parecerBoxY + 15, { align: 'center' })
  
  // Texto do parecer em destaque
  doc.setTextColor(...parecerColor)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  const parecerLines = doc.splitTextToSize(parecerTexto, parecerBoxWidth - 6)
  const parecerYStart = parecerBoxY + 22
  parecerLines.forEach((line: string, index: number) => {
    doc.text(line, parecerBoxX + parecerBoxWidth/2, parecerYStart + (index * 3.5), { align: 'center' })
  })

  yPos = 80

  // Card de Informações Básicas
  doc.setFillColor(249, 250, 251) // gray-50
  doc.roundedRect(15, yPos, pageWidth - 30, 22, 2, 2, 'F')
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('INFORMACOES DO LAUDO', 17, yPos + 5)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Tipo: ${REPORT_TYPE_LABELS[report.reportType] || report.reportType}`, 17, yPos + 11)
  doc.text(`Nº Laudo: ${report.reportNumber}`, 17, yPos + 16)
  
  doc.text(`Emissão: ${new Date(report.createdAt).toLocaleDateString('pt-BR')}`, pageWidth/2 + 10, yPos + 11)
  if (report.expiresAt) {
    doc.text(`Validade: ${new Date(report.expiresAt).toLocaleDateString('pt-BR')}`, pageWidth/2 + 10, yPos + 16)
  }

  yPos += 28

  // Seção 1: DADOS DO APARELHO (esquerda) + SITUAÇÃO GERAL (direita)
  doc.setFillColor(37, 99, 235)
  doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('1. IDENTIFICACAO DO DISPOSITIVO', 18, yPos + 7)
  yPos += 12

  // Tabela de identificação (lado esquerdo, 60% da largura)
  const tableWidth = (pageWidth - 30) * 0.55
  
  autoTable(doc, {
    startY: yPos,
    head: [['Campo', 'Informação']],
    body: [
      ['Modelo', report.deviceModel],
      ['Tipo', report.deviceType === 'IPHONE' ? 'iPhone' : 'iPad'],
      ['Armazenamento', `${report.storage}GB`],
      ['Cor', report.color],
      ['IMEI', report.imei],
      ['Número de Série', report.serialNumber || 'Não informado']
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 15, right: pageWidth - 15 - tableWidth },
    tableWidth: tableWidth
  })

  const tableEndY = (doc as any).lastAutoTable.finalY

  // Box SITUAÇÃO GERAL (lado direito)
  const situacaoBoxX = 15 + tableWidth + 5
  const situacaoBoxY = yPos
  const situacaoBoxWidth = pageWidth - 30 - tableWidth - 5
  const situacaoBoxHeight = tableEndY - yPos
  
  doc.setFillColor(249, 250, 251)
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.roundedRect(situacaoBoxX, situacaoBoxY, situacaoBoxWidth, situacaoBoxHeight, 3, 3, 'FD')
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('SITUAÇÃO GERAL', situacaoBoxX + situacaoBoxWidth/2, situacaoBoxY + 6, { align: 'center' })
  
  // Gráfico de pizza simplificado
  const chartCenterX = situacaoBoxX + situacaoBoxWidth / 2
  const chartCenterY = situacaoBoxY + situacaoBoxHeight / 2 + 2
  
  // Informações dentro do quadro
  const infoY = chartCenterY - 15
  doc.setFontSize(8)
  
  // Total de itens
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text(`${totalVerificado} ITENS VERIFICADOS`, chartCenterX, infoY, { align: 'center' })
  
  // Legenda dentro do quadro
  const legendStartY = infoY + 6
  
  // Conforme
  doc.setFillColor(34, 197, 94)
  doc.circle(situacaoBoxX + 8, legendStartY, 2, 'F')
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text(`CONFORME`, situacaoBoxX + 12, legendStartY + 1)
  doc.setFont('helvetica', 'bold')
  doc.text(`${totalConforme}`, situacaoBoxX + situacaoBoxWidth - 5, legendStartY + 1, { align: 'right' })
  
  // Com Observação (se houver)
  if (totalNaoConforme > 0 && totalNaoConforme <= 2) {
    doc.setFillColor(234, 179, 8)
    doc.circle(situacaoBoxX + 8, legendStartY + 5, 2, 'F')
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text(`C/ OBSERVAÇÃO`, situacaoBoxX + 12, legendStartY + 6)
    doc.setFont('helvetica', 'bold')
    doc.text(`${totalNaoConforme}`, situacaoBoxX + situacaoBoxWidth - 5, legendStartY + 6, { align: 'right' })
  }
  
  // Não Conforme (se houver)
  if (totalNaoConforme > 2) {
    const ncY = legendStartY + 5
    doc.setFillColor(239, 68, 68)
    doc.circle(situacaoBoxX + 8, ncY, 2, 'F')
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text(`NÃO CONFORME`, situacaoBoxX + 12, ncY + 1)
    doc.setFont('helvetica', 'bold')
    doc.text(`${totalNaoConforme}`, situacaoBoxX + situacaoBoxWidth - 5, ncY + 1, { align: 'right' })
  }

  yPos = tableEndY + 10

  // Seção 2: Fotos do Dispositivo
  if (yPos > pageHeight - 100) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(37, 99, 235)
  doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('2. FOTOS DO DISPOSITIVO', 18, yPos + 7)
  yPos += 15

  // Carregar e adicionar fotos principais
  const photoSize = 55
  const photoSpacing = 10
  let xPos = 15

  if (report.frontPhoto) {
    const imgData = await loadImageAsDataURL(report.frontPhoto)
    if (imgData) {
      doc.addImage(imgData, 'JPEG', xPos, yPos, photoSize, photoSize)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Frontal', xPos + photoSize/2, yPos + photoSize + 4, { align: 'center' })
      xPos += photoSize + photoSpacing
    }
  }

  if (report.backPhoto) {
    const imgData = await loadImageAsDataURL(report.backPhoto)
    if (imgData) {
      doc.addImage(imgData, 'JPEG', xPos, yPos, photoSize, photoSize)
      doc.setFontSize(8)
      doc.text('Traseira', xPos + photoSize/2, yPos + photoSize + 4, { align: 'center' })
      xPos += photoSize + photoSpacing
    }
  }

  if (report.screenOnPhoto) {
    const imgData = await loadImageAsDataURL(report.screenOnPhoto)
    if (imgData) {
      doc.addImage(imgData, 'JPEG', xPos, yPos, photoSize, photoSize)
      doc.setFontSize(8)
      doc.text('Tela Ligada', xPos + photoSize/2, yPos + photoSize + 4, { align: 'center' })
      xPos += photoSize + photoSpacing
    }
  }

  yPos += photoSize + 15

  // Fotos das laterais (se houver)
  if (report.sidesPhotos) {
    try {
      const sidesPhotosArray = JSON.parse(report.sidesPhotos)
      if (sidesPhotosArray.length > 0) {
        if (yPos > pageHeight - 70) {
          doc.addPage()
          yPos = 20
        }
        
        xPos = 15
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Laterais:', 17, yPos)
        yPos += 5

        for (let i = 0; i < Math.min(sidesPhotosArray.length, 3); i++) {
          const imgData = await loadImageAsDataURL(sidesPhotosArray[i])
          if (imgData) {
            doc.addImage(imgData, 'JPEG', xPos, yPos, photoSize, photoSize)
            xPos += photoSize + photoSpacing
          }
        }
        yPos += photoSize + 10
      }
    } catch (e) {
      // Ignora erro de parse
    }
  }

  // Seção 3: Condição Física
  if (yPos > pageHeight - 100) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(37, 99, 235)
  doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('3. AVALIACAO DE CONDICAO FISICA', 18, yPos + 7)
  yPos += 15

  // Cards de condição em formato moderno
  const conditions = [
    { label: 'Tela', value: report.screenCondition, notes: report.screenConditionNotes },
    { label: 'Corpo/Chassi', value: report.bodyCondition, notes: report.bodyConditionNotes },
    { label: 'Câmera', value: report.cameraCondition, notes: report.cameraConditionNotes }
  ]

  conditions.forEach((cond) => {
    // Card background
    doc.setFillColor(249, 250, 251)
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.5)
    doc.roundedRect(15, yPos, pageWidth - 30, 18, 3, 3, 'FD')
    
    // Label
    doc.setTextColor(75, 85, 99)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(cond.label, 20, yPos + 7)
    
    // Valor com cor baseada na condição
    const conditionText = CONDITION_LABELS[cond.value] || cond.value
    let valueColor: [number, number, number] = [37, 99, 235]
    
    if (cond.value === 'PERFEITO') valueColor = [34, 197, 94]
    else if (cond.value.includes('LEVE')) valueColor = [59, 130, 246]
    else if (cond.value.includes('TRINCA') || cond.value.includes('QUEBRADO') || cond.value.includes('DANIFICADO') || cond.value.includes('DEFEITO')) valueColor = [239, 68, 68]
    else if (cond.value.includes('VISIVE') || cond.value.includes('AMASSADO')) valueColor = [234, 179, 8]
    
    doc.setTextColor(...valueColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(conditionText, pageWidth - 20, yPos + 7, { align: 'right' })
    
    // Notas se houver
    if (cond.notes && cond.notes !== '-') {
      doc.setTextColor(107, 114, 128)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      const notesText = doc.splitTextToSize(cond.notes, pageWidth - 50)
      doc.text(notesText, 20, yPos + 13)
    }
    
    yPos += 20
  })

  yPos += 5

  // Seção 4: Bateria
  if (yPos > pageHeight - 80) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(37, 99, 235)
  doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('4. SAUDE DA BATERIA', 18, yPos + 7)
  yPos += 15

  // Card de bateria com gauge visual
  const batteryPercent = report.batteryHealthPercent || 0
  const batteryColor: [number, number, number] = batteryPercent >= 80 ? [34, 197, 94] : 
                       batteryPercent >= 50 ? [234, 179, 8] : [239, 68, 68]
  
  doc.setFillColor(249, 250, 251)
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.5)
  doc.roundedRect(15, yPos, pageWidth - 30, 45, 3, 3, 'FD')
  
  // Gauge circular da esquerda
  const gaugeX = 35
  const gaugeY = yPos + 22
  const gaugeRadius = 15
  
  // Background circle (cinza claro)
  doc.setFillColor(229, 231, 235)
  doc.circle(gaugeX, gaugeY, gaugeRadius, 'F')
  
  // Progress circle (colorido baseado no percentual)
  doc.setFillColor(...batteryColor)
  const angle = (batteryPercent / 100) * 360
  if (angle > 0) {
    // Desenhar segmento circular
    const startAngle = -90
    const endAngle = startAngle + angle
    
    // Simular preenchimento com múltiplos arcos pequenos
    for (let a = startAngle; a < endAngle; a += 5) {
      const rad1 = (a * Math.PI) / 180
      const rad2 = ((a + 5) * Math.PI) / 180
      const x1 = gaugeX + Math.cos(rad1) * gaugeRadius * 0.6
      const y1 = gaugeY + Math.sin(rad1) * gaugeRadius * 0.6
      const x2 = gaugeX + Math.cos(rad1) * gaugeRadius
      const y2 = gaugeY + Math.sin(rad1) * gaugeRadius
      const x3 = gaugeX + Math.cos(rad2) * gaugeRadius
      const y3 = gaugeY + Math.sin(rad2) * gaugeRadius
      const x4 = gaugeX + Math.cos(rad2) * gaugeRadius * 0.6
      const y4 = gaugeY + Math.sin(rad2) * gaugeRadius * 0.6
      
      doc.setFillColor(...batteryColor)
      doc.circle(gaugeX + Math.cos(rad1) * gaugeRadius * 0.8, gaugeY + Math.sin(rad1) * gaugeRadius * 0.8, 3, 'F')
    }
  }
  
  // Center white circle
  doc.setFillColor(255, 255, 255)
  doc.circle(gaugeX, gaugeY, gaugeRadius * 0.6, 'F')
  
  // Percentual no centro do gauge
  doc.setTextColor(...batteryColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`${batteryPercent}%`, gaugeX, gaugeY + 2, { align: 'center' })
  
  // Informações à direita
  const batteryInfoX = 65
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Saúde da Bateria', batteryInfoX, yPos + 12)
  
  // Status textual
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  let statusText = ''
  if (batteryPercent >= 80) {
    statusText = '✓ Excelente estado - Bateria saudável'
  } else if (batteryPercent >= 50) {
    statusText = '⚠ Boa condição - Considerar troca em breve'
  } else {
    statusText = '✗ Requer atenção - Recomendada substituição'
  }
  doc.text(statusText, batteryInfoX, yPos + 20)
  
  // Dados técnicos
  doc.setTextColor(107, 114, 128)
  doc.setFontSize(7.5)
  if (report.batteryHealthPhoto) {
    doc.text('✓ Verificado com screenshot das configurações', batteryInfoX, yPos + 28)
  }
  doc.text(`Ciclos estimados: ${Math.round((100 - batteryPercent) * 5)}`, batteryInfoX, yPos + 35)
  
  yPos += 50

  // Adicionar foto da saúde da bateria
  if (report.batteryHealthPhoto) {
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = 20
    }
    
    const imgData = await loadImageAsDataURL(report.batteryHealthPhoto)
    if (imgData) {
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('Evidência (Screenshot das Configurações):', 17, yPos)
      yPos += 5
      const imgWidth = 60
      const imgHeight = 60
      doc.addImage(imgData, 'JPEG', 17, yPos, imgWidth, imgHeight)
      yPos += imgHeight + 5
    }
  }

  yPos += 5

  // Seção 5: Testes Funcionais
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(37, 99, 235)
  doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('5. TESTES DE FUNCIONALIDADE', 18, yPos + 7)
  yPos += 15
  
  // Definir testes funcionais primeiro
  const functionalTests = [
    { label: 'Touch Screen', value: report.touchWorking },
    { label: 'Face ID / Touch ID', value: report.faceIdWorking },
    { label: 'Wi-Fi', value: report.wifiWorking },
    { label: 'Bluetooth', value: report.bluetoothWorking },
    { label: 'Alto-Falantes', value: report.speakersWorking },
    { label: 'Microfone', value: report.microphoneWorking },
    { label: 'Vibração', value: report.vibrationWorking },
    { label: 'Botões Físicos', value: report.buttonsWorking }
  ]
  
  // Calcular pontuação
  const totalTests = functionalTests.length
  const passedTests = functionalTests.filter(t => t.value).length
  const scorePercent = Math.round((passedTests / totalTests) * 100)
  const scoreColor: [number, number, number] = scorePercent === 100 ? [34, 197, 94] :
                                                scorePercent >= 75 ? [59, 130, 246] :
                                                scorePercent >= 50 ? [234, 179, 8] : [239, 68, 68]
  
  // Card de pontuação
  doc.setFillColor(249, 250, 251)
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.5)
  doc.roundedRect(15, yPos, pageWidth - 30, 18, 3, 3, 'FD')
  
  // Ícone e label
  doc.setTextColor(75, 85, 99)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('PONTUACAO GERAL', 20, yPos + 8)
  
  // Score badge
  doc.setFillColor(...scoreColor)
  doc.roundedRect(pageWidth - 55, yPos + 3, 40, 12, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`${passedTests}/${totalTests}`, pageWidth - 35, yPos + 10, { align: 'center' })
  
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text(`${scorePercent}% aprovado`, pageWidth - 35, yPos + 14, { align: 'center' })
  
  yPos += 23

  // Grid de testes - 3 colunas
  const itemWidth = (pageWidth - 40) / 3
  const itemHeight = 12
  let testX = 15
  let testY = yPos
  let col = 0

  functionalTests.forEach((test, index) => {
    // Check icon com círculo
    const checkColor: [number, number, number] = test.value ? [34, 197, 94] : [239, 68, 68]
    doc.setFillColor(...checkColor)
    doc.circle(testX + 3, testY + 4, 2.5, 'F')
    
    // Ícone dentro do círculo
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    const icon = test.value ? '✓' : '✕'
    doc.text(icon, testX + 3, testY + 4.8, { align: 'center', baseline: 'middle' })
    
    // Label
    doc.setTextColor(75, 85, 99)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(test.label, testX + 8, testY + 5)
    
    col++
    if (col === 3) {
      col = 0
      testX = 15
      testY += itemHeight
    } else {
      testX += itemWidth
    }
  })

  yPos = testY + (col > 0 ? itemHeight : 0) + 5

  // Seção 6: Status e Bloqueios
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(37, 99, 235)
  doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('6. STATUS E BLOQUEIOS', 18, yPos + 7)
  yPos += 12

  const statusData = [
    ['iCloud', report.icloudFree ? '✓ Livre' : '✗ Bloqueado'],
    ['Operadora', report.carrierUnlocked ? '✓ Desbloqueado' : '✗ Bloqueado'],
    ['Contato com Líquido', report.hasWaterDamage ? '✗ Detectado' : '✓ Não Detectado'],
    ['Reparos Anteriores', report.hasRepairs ? '✗ Sim' : '✓ Não']
  ]

  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Status']],
    body: statusData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 15, right: 15 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 60 }
    }
  })

  if (report.hasRepairs && report.repairDetails) {
    yPos = (doc as any).lastAutoTable.finalY + 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Detalhes dos Reparos:', 17, yPos)
    const splitText = doc.splitTextToSize(report.repairDetails, pageWidth - 40)
    doc.text(splitText, 17, yPos + 5)
    yPos += 5 + (splitText.length * 4)
  }

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Seção 7: Acessórios
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(37, 99, 235)
  doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('7. ACESSORIOS INCLUSOS', 18, yPos + 7)
  yPos += 15

  const accessories = [
    { label: 'Caixa Original', value: report.hasBox, symbol: '▣' },
    { label: 'Carregador', value: report.hasCharger, symbol: '◎' },
    { label: 'Cabo', value: report.hasCable, symbol: '〰' },
    { label: 'Fones de Ouvido', value: report.hasEarphones, symbol: '♫' },
    { label: 'Nota Fiscal', value: report.hasInvoice, symbol: '▤' }
  ]

  // Desenhar blocos de acessórios em grid 3x2
  const boxWidth = 58
  const boxHeight = 20
  const boxSpacing = 5
  const boxesPerRow = 3
  let boxX = 15
  let boxY = yPos
  
  accessories.forEach((acc, index) => {
    if (index > 0 && index % boxesPerRow === 0) {
      boxX = 15
      boxY += boxHeight + boxSpacing
    }
    
    // Box de fundo com cantos arredondados
    const bgColor: [number, number, number] = acc.value ? [240, 253, 244] : [254, 242, 242]
    const borderColor: [number, number, number] = acc.value ? [34, 197, 94] : [239, 68, 68]
    
    doc.setFillColor(...bgColor)
    doc.setDrawColor(...borderColor)
    doc.setLineWidth(0.5)
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD')
    
    // Círculo de status
    const statusColor: [number, number, number] = acc.value ? [34, 197, 94] : [239, 68, 68]
    doc.setFillColor(...statusColor)
    doc.circle(boxX + 6, boxY + 7, 3, 'F')
    
    // Ícone de status dentro do círculo
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    const statusIcon = acc.value ? '✓' : '✕'
    doc.text(statusIcon, boxX + 6, boxY + 7.5, { align: 'center', baseline: 'middle' })
    
    // Símbolo do acessório
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(acc.symbol, boxX + 12, boxY + 8)
    
    // Label do acessório
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(acc.label, boxX + 18, boxY + 8)
    
    // Status text
    doc.setTextColor(...statusColor)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    const statusText = acc.value ? 'INCLUÍDO' : 'NÃO INCLUÍDO'
    doc.text(statusText, boxX + 18, boxY + 14)
    
    boxX += boxWidth + boxSpacing
  })

  yPos = boxY + boxHeight + 10

  // Seção NOVA: Avaliação Comercial
  if (yPos > pageHeight - 70) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(37, 99, 235)
  doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('8. AVALIACAO COMERCIAL', 18, yPos + 7)
  yPos += 15

  // Calcular valor estimado baseado em condições
  let baseValue = 0
  // Valor base estimado por modelo (simplificado)
  if (report.deviceModel.includes('Pro Max')) baseValue = 6000
  else if (report.deviceModel.includes('Pro')) baseValue = 5000
  else if (report.deviceModel.includes('Plus')) baseValue = 4000
  else baseValue = 3500

  // Ajustes por condição física
  let conditionMultiplier = 1.0
  if (report.screenCondition === 'PERFEITO' && report.bodyCondition === 'PERFEITO') {
    conditionMultiplier = 0.95
  } else if (report.screenCondition.includes('LEVE') || report.bodyCondition.includes('LEVE')) {
    conditionMultiplier = 0.85
  } else if (report.screenCondition.includes('VISIVE') || report.bodyCondition.includes('VISIVE')) {
    conditionMultiplier = 0.70
  } else if (report.screenCondition.includes('TRINCA') || report.bodyCondition.includes('DANIFICADO')) {
    conditionMultiplier = 0.50
  }

  // Ajuste por bateria
  let batteryMultiplier = 1.0
  if (report.batteryHealthPercent >= 85) batteryMultiplier = 1.0
  else if (report.batteryHealthPercent >= 80) batteryMultiplier = 0.95
  else if (report.batteryHealthPercent >= 70) batteryMultiplier = 0.85
  else if (report.batteryHealthPercent >= 50) batteryMultiplier = 0.70
  else batteryMultiplier = 0.55

  // Ajuste por funcionalidade
  let functionalityMultiplier = passedTests / totalTests

  // Ajuste por acessórios
  let accessoryBonus = 0
  if (report.hasBox) accessoryBonus += 200
  if (report.hasCharger) accessoryBonus += 100
  if (report.hasCable) accessoryBonus += 50
  if (report.hasInvoice) accessoryBonus += 150
  if (report.hasEarphones) accessoryBonus += 100

  // Valor final estimado
  const estimatedValue = Math.round(
    (baseValue * conditionMultiplier * batteryMultiplier * functionalityMultiplier) + accessoryBonus
  )

  // Card principal de valor
  doc.setFillColor(240, 253, 244) // green-50
  doc.setDrawColor(34, 197, 94)
  doc.setLineWidth(1)
  doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'FD')

  // Título
  doc.setTextColor(75, 85, 99)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('VALOR ESTIMADO DE MERCADO', 20, yPos + 8)

  // Valor principal
  doc.setTextColor(34, 197, 94)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(`R$ ${estimatedValue.toLocaleString('pt-BR')}`, 20, yPos + 22)

  // Informações adicionais
  doc.setTextColor(107, 114, 128)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.text(`✓ Baseado em ${totalVerificado} verificações`, 20, yPos + 28)
  doc.text(`✓ Validade: ${report.expiresAt ? new Date(report.expiresAt).toLocaleDateString('pt-BR') : '90 dias'}`, 20, yPos + 32)

  // Pontuação geral no canto direito
  const totalScore = Math.round((conditionMultiplier + batteryMultiplier + functionalityMultiplier) / 3 * 100)
  doc.setFillColor(37, 99, 235)
  doc.circle(pageWidth - 30, yPos + 17, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`${totalScore}`, pageWidth - 30, yPos + 19, { align: 'center' })
  doc.setFontSize(6)
  doc.text('PONTOS', pageWidth - 30, yPos + 24, { align: 'center' })

  yPos += 40

  // Recomendações personalizadas
  doc.setFillColor(249, 250, 251)
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.5)
  doc.roundedRect(15, yPos, pageWidth - 30, 22, 3, 3, 'FD')

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('RECOMENDACOES', 20, yPos + 7)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(75, 85, 99)

  // Lógica de recomendações
  let recommendation = ''
  if (totalScore >= 85 && report.icloudFree && !report.hasWaterDamage) {
    recommendation = '✓ Aparelho em excelente estado - Pronto para venda imediata com preço premium'
  } else if (totalScore >= 70 && report.icloudFree) {
    recommendation = '⚠ Boa condição geral - Considere destacar acessórios inclusos para agregar valor'
  } else if (totalScore >= 50) {
    recommendation = '⚠ Requer atenção - Recomendado reparos antes da venda para melhor valorização'
  } else {
    recommendation = '✗ Estado crítico - Venda como peças ou investimento significativo em reparos'
  }

  const recLines = doc.splitTextToSize(recommendation, pageWidth - 50)
  doc.text(recLines, 20, yPos + 14)

  yPos += 27

  // Seção 9: Documentação e Evidências Fotográficas
  if (report.imeiPhoto || report.boxPhoto || report.invoicePhoto || (report.accessoriesPhotos && report.accessoriesPhotos !== '[]')) {
    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = 20
    }

    doc.setFillColor(37, 99, 235)
    doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('9. DOCUMENTACAO E EVIDENCIAS', 18, yPos + 7)
    yPos += 15

    const docPhotoSize = 50
    let docXPos = 15

    // Foto do IMEI
    if (report.imeiPhoto) {
      const imgData = await loadImageAsDataURL(report.imeiPhoto)
      if (imgData) {
        doc.addImage(imgData, 'JPEG', docXPos, yPos, docPhotoSize, docPhotoSize)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text('IMEI/Serial', docXPos + docPhotoSize/2, yPos + docPhotoSize + 4, { align: 'center' })
        docXPos += docPhotoSize + 8
      }
    }

    // Foto da caixa
    if (report.boxPhoto && report.hasBox) {
      const imgData = await loadImageAsDataURL(report.boxPhoto)
      if (imgData) {
        doc.addImage(imgData, 'JPEG', docXPos, yPos, docPhotoSize, docPhotoSize)
        doc.setFontSize(8)
        doc.text('Caixa Original', docXPos + docPhotoSize/2, yPos + docPhotoSize + 4, { align: 'center' })
        docXPos += docPhotoSize + 8
      }
    }

    // Foto da nota fiscal
    if (report.invoicePhoto && report.hasInvoice) {
      const imgData = await loadImageAsDataURL(report.invoicePhoto)
      if (imgData) {
        doc.addImage(imgData, 'JPEG', docXPos, yPos, docPhotoSize, docPhotoSize)
        doc.setFontSize(8)
        doc.text('Nota Fiscal', docXPos + docPhotoSize/2, yPos + docPhotoSize + 4, { align: 'center' })
        docXPos += docPhotoSize + 8
      }
    }

    yPos += docPhotoSize + 10

    // Fotos de acessórios
    if (report.accessoriesPhotos) {
      try {
        const accessoriesArray = JSON.parse(report.accessoriesPhotos)
        if (accessoriesArray.length > 0) {
          if (yPos > pageHeight - 70) {
            doc.addPage()
            yPos = 20
          }

          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text('Acessórios:', 17, yPos)
          yPos += 5

          docXPos = 15
          for (let i = 0; i < Math.min(accessoriesArray.length, 3); i++) {
            const imgData = await loadImageAsDataURL(accessoriesArray[i])
            if (imgData) {
              doc.addImage(imgData, 'JPEG', docXPos, yPos, docPhotoSize, docPhotoSize)
              docXPos += docPhotoSize + 8
            }
          }
          yPos += docPhotoSize + 10
        }
      } catch (e) {
        // Ignora erro de parse
      }
    }

    yPos += 5
  }

  // Footer aprimorado com QR code e informações de verificação
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = 20
  }

  // Linha separadora
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(1)
  doc.line(15, yPos, pageWidth - 15, yPos)
  yPos += 10

  // QR Code grande para verificação
  const footerQrSize = 35
  const footerQrX = 20
  
  // Fundo branco para QR
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(footerQrX - 2, yPos - 2, footerQrSize + 4, footerQrSize + 4, 2, 2, 'F')
  
  const footerQrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, { width: 280, margin: 1 })
  doc.addImage(footerQrCodeDataUrl, 'PNG', footerQrX, yPos, footerQrSize, footerQrSize)

  // Informações de verificação ao lado do QR
  const footerInfoX = footerQrX + footerQrSize + 10
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Verificação de Autenticidade', footerInfoX, yPos + 5)
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  doc.text('Escaneie o QR Code para verificar este laudo online', footerInfoX, yPos + 11)
  
  doc.setFontSize(7.5)
  doc.setTextColor(107, 114, 128)
  doc.text(`URL: ${qrCodeUrl}`, footerInfoX, yPos + 17)
  doc.text(`ID do Laudo: ${report.id}`, footerInfoX, yPos + 22)
  doc.text(`Gerado em: ${new Date(report.createdAt).toLocaleString('pt-BR')}`, footerInfoX, yPos + 27)

  // Informações de contato e suporte
  yPos += footerQrSize + 5
  
  doc.setFillColor(249, 250, 251)
  doc.roundedRect(15, yPos, pageWidth - 30, 18, 2, 2, 'F')
  
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Suporte:', 20, yPos + 5)
  doc.setFont('helvetica', 'normal')
  doc.text('contato@iphoneshopping.com.br', 38, yPos + 5)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Website:', 20, yPos + 10)
  doc.setFont('helvetica', 'normal')
  doc.text('www.iphoneshopping.com.br', 38, yPos + 10)
  
  doc.setTextColor(75, 85, 99)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'italic')
  doc.text('Este laudo técnico certificado foi gerado pela plataforma iPhoneShopping', pageWidth / 2, yPos + 15, { align: 'center' })

  return doc.output('blob')
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
