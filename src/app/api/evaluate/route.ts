import { NextResponse } from 'next/server'
import { DEVICES, calculateDevicePrice, CONDITION_MULTIPLIERS } from '@/lib/device-pricing'

export async function POST(request: Request) {
  try {
    const evaluation = await request.json()

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
      }
    })
  } catch (error) {
    console.error('Erro ao avaliar dispositivo:', error)
    return NextResponse.json(
      { error: 'Erro ao processar avaliação' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    devices: DEVICES,
    conditions: Object.keys(CONDITION_MULTIPLIERS),
  })
}
