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
  const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, { width: 80, margin: 0 })
  doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 35, 5, 30, 30)

  yPos = 45

  // Tipo de Laudo e Número
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Tipo: ${REPORT_TYPE_LABELS[report.reportType] || report.reportType}`, 15, yPos)
  doc.text(`Número: ${report.reportNumber}`, 15, yPos + 5)
  doc.text(`Emissão: ${new Date(report.createdAt).toLocaleDateString('pt-BR')}`, 15, yPos + 10)
  if (report.expiresAt) {
    doc.text(`Validade: ${new Date(report.expiresAt).toLocaleDateString('pt-BR')}`, 15, yPos + 15)
  }

  yPos += 25

  // Seção 1: Identificação do Aparelho
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('1. IDENTIFICAÇÃO DO APARELHO', 17, yPos + 5)
  yPos += 12

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
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 15, right: 15 }
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Seção 1.5: Fotos do Dispositivo
  if (yPos > pageHeight - 100) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('FOTOS DO DISPOSITIVO', 17, yPos + 5)
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

  // Seção 2: Condição Física
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('2. CONDIÇÃO FÍSICA', 17, yPos + 5)
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

  // Seção 3: Bateria
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('3. SAÚDE DA BATERIA', 17, yPos + 5)
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
  doc.text(`${report.batteryHealthPercent}%`, 95, yPos, { align: 'center' })

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

  // Seção 4: Testes Funcionais
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = 20
  }

  doc.setTextColor(0, 0, 0)
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('4. TESTES FUNCIONAIS', 17, yPos + 5)
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
      1: { 
        cellWidth: 40,
        halign: 'center'
      }
    }
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Seção 5: Status e Bloqueios
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('5. STATUS E BLOQUEIOS', 17, yPos + 5)
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

  // Seção 6: Acessórios
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos, pageWidth - 30, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('6. ACESSÓRIOS INCLUSOS', 17, yPos + 5)
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

  // Seção 7: Documentação e Evidências Fotográficas
  if (report.imeiPhoto || report.boxPhoto || report.invoicePhoto || (report.accessoriesPhotos && report.accessoriesPhotos !== '[]')) {
    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = 20
    }

    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPos, pageWidth - 30, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('7. DOCUMENTAÇÃO E EVIDÊNCIAS', 17, yPos + 5)
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
  yPos += 8

  if (report.reportType !== 'BASIC') {
    doc.setFillColor(34, 197, 94)
    doc.rect(15, yPos, pageWidth - 30, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('✓ LAUDO VERIFICADO E CERTIFICADO', pageWidth / 2, yPos + 7, { align: 'center' })
  }

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
