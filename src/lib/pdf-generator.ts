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
  
  // Box branco com borda
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.rect(parecerBoxX, parecerBoxY, parecerBoxWidth, parecerBoxHeight, 'FD')
  
  // Título
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('PARECER FINAL', parecerBoxX + parecerBoxWidth/2, parecerBoxY + 5, { align: 'center' })
  
  // Ícone e status
  doc.setFillColor(...parecerColor)
  const iconSize = 12
  const iconX = parecerBoxX + (parecerBoxWidth - iconSize) / 2
  const iconY = parecerBoxY + 8
  doc.circle(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(parecerIcon, iconX + iconSize/2, iconY + iconSize/2 + 0.5, { align: 'center', baseline: 'middle' })
  
  // Texto do parecer
  doc.setTextColor(...parecerColor)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  const parecerLines = doc.splitTextToSize(parecerTexto, parecerBoxWidth - 4)
  doc.text(parecerLines, parecerBoxX + parecerBoxWidth/2, iconY + iconSize + 2, { align: 'center' })

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
  doc.rect(situacaoBoxX, situacaoBoxY, situacaoBoxWidth, situacaoBoxHeight, 'FD')
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('SITUAÇÃO GERAL', situacaoBoxX + situacaoBoxWidth/2, situacaoBoxY + 6, { align: 'center' })
  
  // Gráfico de pizza simplificado
  const chartCenterX = situacaoBoxX + situacaoBoxWidth / 2
  const chartCenterY = situacaoBoxY + situacaoBoxHeight / 2 + 2
  const chartRadius = 20
  
  // Calcular ângulos
  const conformeAngle = (totalConforme / totalVerificado) * 360
  const naoConformeAngle = (totalNaoConforme / totalVerificado) * 360
  
  // Desenhar pizza
  doc.setFillColor(34, 197, 94) // verde
  doc.circle(chartCenterX, chartCenterY, chartRadius, 'F')
  
  if (totalNaoConforme > 0) {
    doc.setFillColor(239, 68, 68) // vermelho
    // Desenhar fatia de não conforme
    const startAngle = -90
    const endAngle = startAngle + naoConformeAngle
    
    // Aproximação simples com polígono
    const points: [number, number][] = [[chartCenterX, chartCenterY]]
    for (let angle = startAngle; angle <= endAngle; angle += 10) {
      const rad = (angle * Math.PI) / 180
      points.push([
        chartCenterX + chartRadius * Math.cos(rad),
        chartCenterY + chartRadius * Math.sin(rad)
      ])
    }
    
    if (points.length > 2) {
      doc.setFillColor(239, 68, 68)
      const pathData = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ') + ' Z'
      // Fallback: usar retângulo se não conforme > 50%
      if (totalNaoConforme > totalConforme) {
        doc.circle(chartCenterX + chartRadius/2, chartCenterY, chartRadius/2, 'F')
      }
    }
  }
  
  // Número no centro
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(totalVerificado.toString(), chartCenterX, chartCenterY + 1, { align: 'center', baseline: 'middle' })
  
  doc.setFontSize(7)
  doc.setTextColor(100, 100, 100)
  doc.text('ITENS', chartCenterX, chartCenterY + 7, { align: 'center' })
  doc.text('VERIFICADOS', chartCenterX, chartCenterY + 11, { align: 'center' })
  
  // Legenda
  const legendY = chartCenterY + chartRadius + 8
  doc.setFontSize(8)
  
  // Conforme
  doc.setFillColor(34, 197, 94)
  doc.circle(situacaoBoxX + 8, legendY, 2, 'F')
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.text(`CONFORME`, situacaoBoxX + 12, legendY + 1)
  doc.setFont('helvetica', 'bold')
  doc.text(`${totalConforme} ITENS`, situacaoBoxX + situacaoBoxWidth - 5, legendY + 1, { align: 'right' })
  
  // Com Observação (se houver)
  if (totalNaoConforme > 0 && totalNaoConforme <= 2) {
    doc.setFillColor(234, 179, 8)
    doc.circle(situacaoBoxX + 8, legendY + 5, 2, 'F')
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text(`C/ OBSERVAÇÃO`, situacaoBoxX + 12, legendY + 6)
    doc.setFont('helvetica', 'bold')
    doc.text(`${totalNaoConforme} ITENS`, situacaoBoxX + situacaoBoxWidth - 5, legendY + 6, { align: 'right' })
  }
  
  // Não Conforme
  if (totalNaoConforme > 0) {
    const ncLegendY = totalNaoConforme <= 2 ? legendY + 10 : legendY + 5
    doc.setFillColor(239, 68, 68)
    doc.circle(situacaoBoxX + 8, ncLegendY, 2, 'F')
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text(`NÃO CONFORME`, situacaoBoxX + 12, ncLegendY + 1)
    doc.setFont('helvetica', 'bold')
    doc.text(`0 ITENS`, situacaoBoxX + situacaoBoxWidth - 5, ncLegendY + 1, { align: 'right' })
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
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('3. CONDIÇÃO FÍSICA', 17, yPos + 5)
  yPos += 12

  autoTable(doc, {
    startY: yPos,
    head: [['Componente', 'Condição', 'Observações']],
    body: [
      ['Tela', CONDITION_LABELS[report.screenCondition] || report.screenCondition, report.screenConditionNotes || '-'],
      ['Carcaça', CONDITION_LABELS[report.bodyCondition] || report.bodyCondition, report.bodyConditionNotes || '-'],
      ['Câmeras', CONDITION_LABELS[report.cameraCondition] || report.cameraCondition, report.cameraConditionNotes || '-']
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 15, right: 15 }
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Seção 4: Bateria
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('4. SAÚDE DA BATERIA', 17, yPos + 5)
  yPos += 12

  const batteryColor: [number, number, number] = report.batteryHealthPercent >= 80 ? [34, 197, 94] : 
                       report.batteryHealthPercent >= 50 ? [234, 179, 8] : [239, 68, 68]
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Capacidade Máxima:', 17, yPos)
  doc.setFillColor(...batteryColor)
  doc.rect(70, yPos - 4, 50, 6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  const batteryPercent = report.batteryHealthPercent || 0
  doc.text(`${batteryPercent}%`, 95, yPos, { align: 'center' })

  yPos += 10

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
  doc.text('5. TESTES FUNCIONAIS', 17, yPos + 5)
  yPos += 12

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

  autoTable(doc, {
    startY: yPos,
    head: [['Funcionalidade', 'Status']],
    body: functionalTests.map(test => [
      test.label,
      test.value ? '✓ Funcionando' : '✗ Com Problema'
    ]),
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 15, right: 15 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { 
        cellWidth: 60,
        halign: 'center'
      }
    }
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

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

  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Status']],
    body: [
      ['iCloud', report.icloudFree ? '✓ Livre' : '✗ Bloqueado'],
      ['Operadora', report.carrierUnlocked ? '✓ Desbloqueado' : '🔒 Bloqueado'],
      ['Contato com Líquido', report.hasWaterDamage ? '⚠ Sim' : '✓ Não'],
      ['Reparos Anteriores', report.hasRepairs ? '⚠ Sim' : '✓ Não']
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 15, right: 15 }
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
  yPos += 12

  const accessories = [
    { label: 'Caixa Original', value: report.hasBox },
    { label: 'Carregador', value: report.hasCharger },
    { label: 'Cabo', value: report.hasCable },
    { label: 'Fones de Ouvido', value: report.hasEarphones },
    { label: 'Nota Fiscal', value: report.hasInvoice }
  ]

  autoTable(doc, {
    startY: yPos,
    body: accessories.map(acc => [
      acc.label,
      acc.value ? '✓ Sim' : '✗ Não'
    ]),
    theme: 'plain',
    margin: { left: 15, right: 15 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 30, halign: 'center' }
    }
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

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
