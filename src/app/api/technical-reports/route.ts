import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Gerar número único do laudo
function generateReportNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `LDO-${year}-${random}`
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const data = await request.json()

    // Validações básicas
    if (!data.deviceType || !data.deviceModel) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando: tipo e modelo do dispositivo' },
        { status: 400 }
      )
    }

    // Enquanto não temos pagamento, todos os laudos são gratuitos
    data.paidAmount = 0

    // Gerar número do laudo
    const reportNumber = generateReportNumber()

    // Calcular validade (90 dias)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90)

    // Calcular validade do preço (30 dias)
    const priceValidity = new Date()
    priceValidity.setDate(priceValidity.getDate() + 30)

    // Calcular preço estimado baseado nas condições
    let estimatedPrice = 0
    // Preços base por modelo (simplificado - expandir depois)
    const basePrices: Record<string, number> = {
      'iPhone 15 Pro Max': 7000,
      'iPhone 15 Pro': 6500,
      'iPhone 15': 5500,
      'iPhone 14 Pro Max': 5500,
      'iPhone 14 Pro': 5000,
      'iPhone 14': 4000,
      'iPhone 13 Pro Max': 4500,
      'iPhone 13 Pro': 4000,
      'iPhone 13': 3500,
      'iPad Pro 12.9': 6000,
      'iPad Pro 11': 5000,
      'iPad Air': 3500,
    }

    const modelKey = Object.keys(basePrices).find(key => 
      data.deviceModel.toLowerCase().includes(key.toLowerCase())
    )

    if (modelKey) {
      estimatedPrice = basePrices[modelKey]

      // Ajustes baseados na condição
      const conditionMultipliers: Record<string, number> = {
        'Perfeito': 1.0,
        'Excelente': 0.95,
        'Muito Bom': 0.85,
        'Bom': 0.75,
        'Regular': 0.60,
        'Ruim': 0.40
      }

      estimatedPrice *= (conditionMultipliers[data.screenCondition] || 0.8)
      estimatedPrice *= (conditionMultipliers[data.bodyCondition] || 0.8)

      // Ajuste por saúde da bateria
      if (data.batteryHealthPercent >= 90) {
        estimatedPrice *= 1.0
      } else if (data.batteryHealthPercent >= 80) {
        estimatedPrice *= 0.95
      } else if (data.batteryHealthPercent >= 70) {
        estimatedPrice *= 0.85
      } else {
        estimatedPrice *= 0.70
      }

      // Bônus por acessórios
      if (data.hasBox) estimatedPrice += 100
      if (data.hasCharger) estimatedPrice += 50
      if (data.hasInvoice) estimatedPrice += 150
      if (data.hasWarranty) estimatedPrice += 300

      // Penalidades
      if (data.hasWaterDamage) estimatedPrice *= 0.60
      if (data.hasRepairs) estimatedPrice *= 0.85
      if (!data.icloudFree) estimatedPrice *= 0.50
      if (!data.carrierUnlocked) estimatedPrice *= 0.90

      // Arredondar
      estimatedPrice = Math.round(estimatedPrice / 50) * 50
    }

    // Criar o laudo técnico
    const report = await prisma.technicalReport.create({
      data: {
        userId: user.id,
        reportNumber,
        status: 'COMPLETED',
        verifiedAt: new Date(),
        expiresAt,
        estimatedPrice: estimatedPrice > 0 ? estimatedPrice : null,
        priceValidity: estimatedPrice > 0 ? priceValidity : null,
        
        // Dados do dispositivo
        deviceType: data.deviceType,
        deviceModel: data.deviceModel,
        storage: data.storage || 0,
        color: data.color || 'Não especificado',
        imei: data.imei || 'Não informado',
        serialNumber: data.serialNumber || null,
        
        // Tipo de laudo e pagamento (GRATUITO por enquanto)
        reportType: data.reportType || 'BASIC',
        paidAmount: 0,
        
        // Fotos obrigatórias (com fallback)
        frontPhoto: data.frontPhoto || '',
        backPhoto: data.backPhoto || '',
        sidesPhotos: data.sidesPhotos || '[]',
        screenOnPhoto: data.screenOnPhoto || data.frontPhoto || '',
        screenOffPhoto: data.screenOffPhoto || data.frontPhoto || '',
        batteryHealthPhoto: data.batteryHealthPhoto || '',
        
        // Fotos opcionais
        imeiPhoto: data.imeiPhoto || null,
        invoicePhoto: data.invoicePhoto || null,
        boxPhoto: data.boxPhoto || null,
        accessoriesPhotos: data.accessoriesPhotos || '[]',
        
        // Condições físicas
        screenCondition: data.screenCondition || 'Não avaliado',
        screenConditionNotes: data.screenConditionNotes || null,
        bodyCondition: data.bodyCondition || 'Não avaliado',
        bodyConditionNotes: data.bodyConditionNotes || null,
        cameraCondition: data.cameraCondition || 'Não avaliado',
        cameraConditionNotes: data.cameraConditionNotes || null,
        
        // Saúde da bateria
        batteryHealthPercent: data.batteryHealthPercent || 0,
        
        // Testes funcionais
        touchWorking: data.touchWorking ?? true,
        faceIdWorking: data.faceIdWorking ?? true,
        biometricsWorking: data.biometricsWorking ?? true,
        wifiWorking: data.wifiWorking ?? true,
        bluetoothWorking: data.bluetoothWorking ?? true,
        speakersWorking: data.speakersWorking ?? true,
        microphoneWorking: data.microphoneWorking ?? true,
        vibrationWorking: data.vibrationWorking ?? true,
        buttonsWorking: data.buttonsWorking ?? true,
        
        // Status e bloqueios
        icloudFree: data.icloudFree ?? false,
        carrierUnlocked: data.carrierUnlocked ?? false,
        hasWaterDamage: data.hasWaterDamage ?? false,
        hasRepairs: data.hasRepairs ?? false,
        repairDetails: data.repairDetails || null,
        
        // Acessórios
        hasBox: data.hasBox ?? false,
        hasCharger: data.hasCharger ?? false,
        hasCable: data.hasCable ?? false,
        hasEarphones: data.hasEarphones ?? false,
        hasInvoice: data.hasInvoice ?? false,
        hasWarranty: data.hasWarranty ?? false,
        warrantyUntil: data.warrantyUntil || null,
        
        // Vínculo com avaliação
        evaluationId: data.evaluationId || null,
        listingId: data.listingId || null,
      }
    })

    console.log('✅ Laudo técnico criado:', reportNumber)

    return NextResponse.json({
      success: true,
      reportId: report.id,
      reportNumber: report.reportNumber,
      estimatedPrice: report.estimatedPrice
    })

  } catch (error) {
    console.error('Erro ao criar laudo técnico:', error)
    return NextResponse.json(
      { error: 'Erro ao criar laudo técnico' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Buscar todos os laudos do usuário
    const reports = await prisma.technicalReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, reports })

  } catch (error) {
    console.error('Erro ao buscar laudos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar laudos' },
      { status: 500 }
    )
  }
}
