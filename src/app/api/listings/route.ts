import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { DEVICES } from '@/lib/device-pricing'
import { sendListingCreatedEmail } from '@/lib/emailTemplates'

const listingSchema = z.object({
  deviceModel: z.string(),
  deviceType: z.string(),
  storage: z.number(),
  condition: z.enum(['NOVO', 'EXCELENTE', 'MUITO_BOM', 'BOM', 'REGULAR', 'DEFEITO']),
  hasBox: z.boolean(),
  hasCharger: z.boolean(),
  hasEarphones: z.boolean().optional(),
  imei: z.string().optional(),
  icloudFree: z.boolean(),
  batteryHealth: z.number().min(0).max(100).optional(),
  screenCondition: z.string().optional(),
  bodyCondition: z.string().optional(),
  hasWaterDamage: z.boolean().optional(),
  price: z.number().min(0),
  acceptsTrade: z.boolean().default(false),
  negotiable: z.boolean().default(true),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, 'Adicione pelo menos uma imagem'),
  location: z.string().min(1, 'Localização é obrigatória'),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const data = listingSchema.parse(body)

    // Buscar ou criar o device no banco
    const deviceInfo = DEVICES.find(
      d => d.model === data.deviceModel && d.type === data.deviceType
    )

    if (!deviceInfo) {
      return NextResponse.json(
        { error: 'Dispositivo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar ou criar device no banco
    let device = await prisma.device.findFirst({
      where: {
        model: data.deviceModel,
        type: data.deviceType,
        storage: data.storage,
      },
    })

    if (!device) {
      device = await prisma.device.create({
        data: {
          model: data.deviceModel,
          type: data.deviceType,
          storage: data.storage,
          color: 'Não especificado', // Pode ser expandido depois
          year: deviceInfo.year,
          basePrice: deviceInfo.basePrice,
        },
      })
    }

    // Converter array de images para JSON string (SQLite)
    const imagesJson = JSON.stringify(data.images)

    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        deviceId: device.id,
        condition: data.condition,
        hasBox: data.hasBox,
        hasCharger: data.hasCharger,
        hasEarphones: false, // Sempre false para iPhones modernos
        imei: data.imei,
        icloudFree: data.icloudFree,
        batteryHealth: data.batteryHealth,
        screenCondition: data.screenCondition || 'Não especificado',
        bodyCondition: data.bodyCondition || 'Não especificado',
        hasWaterDamage: data.hasWaterDamage || false,
        price: data.price,
        acceptsTrade: data.acceptsTrade,
        negotiable: data.negotiable,
        description: data.description,
        images: imagesJson,
        location: data.location,
      },
      include: {
        device: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    // Enviar email de confirmação (não aguarda)
    const listingTitle = `${device.model} ${device.storage}GB`
    const listingPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(listing.price)

    sendListingCreatedEmail(
      user.email,
      user.name,
      listingTitle,
      listingPrice,
      listing.id
    ).catch(err => console.error('Erro ao enviar email de anúncio criado:', err))

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erro ao criar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao criar anúncio' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const model = searchParams.get('model')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const condition = searchParams.get('condition')
    const location = searchParams.get('location')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      status: 'ACTIVE'
    }

    if (type) where.device = { type }
    if (model) where.device = { ...where.device, model: { contains: model, mode: 'insensitive' } }
    if (condition) where.condition = condition
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          device: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where })
    ])

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar anúncios' },
      { status: 500 }
    )
  }
}
