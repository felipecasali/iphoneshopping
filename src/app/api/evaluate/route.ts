import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DEVICES, calculateDevicePrice, CONDITION_MULTIPLIERS } from '@/lib/device-pricing'

export async function POST(request: Request) {
  try {
    const evaluation = await request.json()
    const session = await getServerSession(authOptions)

    // Encontra o dispositivo
    const device = DEVICES.find(
      d => d.model === evaluation.model && d.type === evaluation.type
    )

    if (!device) {
      return NextResponse.json(
        { error: 'Dispositivo não encontrado' },
        { status: 404 }
      )
    }

    // Calcula o preço
    const estimatedPrice = calculateDevicePrice({
      device,
      storage: evaluation.storage,
      condition: evaluation.condition,
      purchaseDate: evaluation.purchaseDate,
      hasBox: evaluation.hasBox,
      hasCharger: evaluation.hasCharger,
      hasCable: evaluation.hasCable,
      hasPencil: evaluation.hasPencil,
      hasKeyboard: evaluation.hasKeyboard,
      hasInvoice: evaluation.hasInvoice,
      hasWarranty: evaluation.hasWarranty,
      icloudFree: evaluation.icloudFree,
      imeiClean: evaluation.imeiClean,
      batteryHealth: evaluation.batteryHealth,
      screenCondition: evaluation.screenCondition,
      bodyCondition: evaluation.bodyCondition,
      hasWaterDamage: evaluation.hasWaterDamage,
      hasFunctionalIssues: evaluation.hasFunctionalIssues,
    })

    // Se usuário estiver logado, salvar avaliação no banco
    let savedEvaluation = null
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        // Calcular data de expiração (90 dias)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 90)

        savedEvaluation = await prisma.evaluation.create({
          data: {
            userId: user.id,
            deviceType: device.type,
            deviceModel: device.model,
            storage: evaluation.storage,
            color: evaluation.color || 'Não especificado',
            condition: evaluation.condition,
            estimatedValue: estimatedPrice,
            purchaseDate: evaluation.purchaseDate ? new Date(evaluation.purchaseDate) : null,
            hasBox: evaluation.hasBox || false,
            hasCharger: evaluation.hasCharger || false,
            hasCable: evaluation.hasCable || false,
            hasPencil: evaluation.hasPencil || false,
            hasKeyboard: evaluation.hasKeyboard || false,
            hasInvoice: evaluation.hasInvoice || false,
            hasWarranty: evaluation.hasWarranty || false,
            icloudFree: evaluation.icloudFree ?? true,
            imeiClean: evaluation.imeiClean ?? true,
            batteryHealth: evaluation.batteryHealth || null,
            screenCondition: evaluation.screenCondition || null,
            bodyCondition: evaluation.bodyCondition || null,
            hasWaterDamage: evaluation.hasWaterDamage || false,
            hasFunctionalIssues: evaluation.hasFunctionalIssues || false,
            expiresAt
          }
        })
      }
    }

    return NextResponse.json({
      estimatedPrice,
      priceRange: {
        min: Math.round(estimatedPrice * 0.9),
        max: Math.round(estimatedPrice * 1.1),
      },
      device: {
        model: device.model,
        type: device.type,
        basePrice: device.basePrice,
      },
      evaluationId: savedEvaluation?.id // Retornar ID da avaliação salva
    })
  } catch (error) {
    console.error('Erro ao avaliar dispositivo:', error)
    return NextResponse.json(
      { error: 'Erro ao processar avaliação' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  // Se tiver ID, buscar avaliação específica
  if (id) {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session?.user?.email) {
        return NextResponse.json(
          { error: 'Não autorizado' },
          { status: 401 }
        )
      }

      const evaluation = await prisma.evaluation.findUnique({
        where: { id },
        include: {
          technicalReports: {
            select: {
              id: true,
              reportNumber: true,
              status: true,
              reportType: true
            }
          }
        }
      })

      if (!evaluation) {
        return NextResponse.json(
          { error: 'Avaliação não encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        evaluation: {
          ...evaluation,
          hasReport: evaluation.technicalReports.length > 0
        }
      })
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar avaliação' },
        { status: 500 }
      )
    }
  }

  // Senão, retornar lista de dispositivos
  return NextResponse.json({
    devices: DEVICES,
    conditions: Object.keys(CONDITION_MULTIPLIERS),
  })
}
