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

  // Header com logo (placeholder)
  doc.setFillColor(37, 99, 235) // primary-600
  doc.rect(0, 0, pageWidth, 35, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('iPhoneShopping', 15, 18)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Laudo Técnico Profissional', 15, 26)

  // QR Code de verificação
  const qrCodeUrl = `https://www.iphoneshopping.com.br/laudo/${report.id}`
  const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, { width: 76, margin: 0 })
  doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 34, 5, 28.5, 28.5)

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

  // Box de PARECER FINAL (ao lado do QR Code no topo)
  const parecerBoxX = pageWidth - 95
  const parecerBoxY = 5
  const parecerBoxWidth = 58
  const parecerBoxHeight = 28.5
  
  // Box branco com borda e cantos arredondados
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.roundedRect(parecerBoxX, parecerBoxY, parecerBoxWidth, parecerBoxHeight, 3, 3, 'FD')
  
  // Título
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('PARECER FINAL', parecerBoxX + parecerBoxWidth/2, parecerBoxY + 5, { align: 'center' })
  
  // Texto do parecer em destaque (sem círculo)
  doc.setTextColor(...parecerColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  const parecerLines = doc.splitTextToSize(parecerTexto, parecerBoxWidth - 8)
  doc.text(parecerLines, parecerBoxX + parecerBoxWidth/2, parecerBoxY + 17, { align: 'center' })

  yPos = 45

  // Tipo de Laudo e Número
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Tipo: ${REPORT_TYPE_LABELS[report.reportType] || report.reportType}`, 15, yPos)
  doc.text(`Nº Laudo: ${report.reportNumber}`, 15, yPos + 5)
  doc.text(`Emissão: ${new Date(report.createdAt).toLocaleDateString('pt-BR')}`, 15, yPos + 10)
  if (report.expiresAt) {
    doc.text(`Validade: ${new Date(report.expiresAt).toLocaleDateString('pt-BR')}`, 15, yPos + 15)
  }

  yPos += 25

  // Seção 1: DADOS DO APARELHO (esquerda) + SITUAÇÃO GERAL (direita)
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('DADOS DO APARELHO', 17, yPos + 5)
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
  const chartRadius = 18
  
  // Ícone do dispositivo com cor baseada na avaliação (acima do gráfico)
  const deviceIconY = chartCenterY - chartRadius - 20
  const deviceColor: [number, number, number] = totalNaoConforme === 0 ? [34, 197, 94] : // Verde - tudo conforme
                                                  totalNaoConforme <= 2 ? [234, 179, 8] : // Amarelo - poucos problemas
                                                  [239, 68, 68] // Vermelho - muitos problemas
  
  // Desenhar dispositivo (iPhone ou iPad)
  const isIPad = report.deviceType === 'IPAD'
  const deviceWidth = isIPad ? 20 : 12
  const deviceHeight = isIPad ? 16 : 20
  const deviceX = chartCenterX - deviceWidth/2
  
  doc.setFillColor(...deviceColor)
  doc.roundedRect(deviceX, deviceIconY, deviceWidth, deviceHeight, 2, 2, 'F')
  
  // Tela (parte clara)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(deviceX + 1, deviceIconY + 1, deviceWidth - 2, deviceHeight - 2, 1, 1, 'F')
  
  // Botão home (se iPhone)
  if (!isIPad) {
    doc.setFillColor(...deviceColor)
    doc.circle(deviceX + deviceWidth/2, deviceIconY + deviceHeight - 2, 1, 'F')
  }
  
  // Informações dentro do quadro (sem gráfico circular)
  const infoY = deviceIconY + deviceHeight + 8
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

  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('2. FOTOS DO DISPOSITIVO', 17, yPos + 5)
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

  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('3. AVALIAÇÃO DE CONDIÇÃO', 17, yPos + 5)
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

  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('4. SAÚDE DA BATERIA', 17, yPos + 5)
  yPos += 15

  // Card de bateria
  const batteryPercent = report.batteryHealthPercent || 0
  const batteryColor: [number, number, number] = batteryPercent >= 80 ? [34, 197, 94] : 
                       batteryPercent >= 50 ? [234, 179, 8] : [239, 68, 68]
  
  doc.setFillColor(249, 250, 251)
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.5)
  doc.roundedRect(15, yPos, pageWidth - 30, 18, 3, 3, 'FD')
  
  // Label
  doc.setTextColor(75, 85, 99)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Saúde da Bateria', 20, yPos + 11)
  
  // Percentual com destaque
  doc.setTextColor(...batteryColor)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`${batteryPercent}%`, pageWidth - 20, yPos + 12, { align: 'right' })
  
  yPos += 23

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

  doc.setTextColor(0, 0, 0)
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('5. TESTES DE FUNCIONALIDADE', 17, yPos + 5)
  yPos += 15

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

  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('6. STATUS E BLOQUEIOS', 17, yPos + 5)
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

  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('7. ACESSÓRIOS INCLUSOS', 17, yPos + 5)
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

  // Seção 8: Documentação e Evidências Fotográficas
  if (report.imeiPhoto || report.boxPhoto || report.invoicePhoto || (report.accessoriesPhotos && report.accessoriesPhotos !== '[]')) {
    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = 20
    }

    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPos, pageWidth - 30, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('8. DOCUMENTAÇÃO E EVIDÊNCIAS', 17, yPos + 5)
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

  // Footer com assinatura digital
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  doc.setDrawColor(200, 200, 200)
  doc.line(15, yPos, pageWidth - 15, yPos)
  yPos += 8

  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(100, 100, 100)
  doc.text('Este laudo foi gerado digitalmente pela plataforma iPhoneShopping.', 17, yPos)
  yPos += 4
  doc.text(`Verificação de autenticidade: ${qrCodeUrl}`, 17, yPos)
  yPos += 4
  doc.text(`ID do Laudo: ${report.id}`, 17, yPos)

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
