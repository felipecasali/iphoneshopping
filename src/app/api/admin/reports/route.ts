import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function GET(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const reportType = searchParams.get('reportType') || ''
    const isValidated = searchParams.get('isValidated') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}

    // Filtro de busca
    if (search) {
      where.OR = [
        { deviceModel: { contains: search, mode: 'insensitive' } },
        { reportNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Filtro por tipo de laudo
    if (reportType) {
      where.reportType = reportType
    }

    // Filtro por validação
    if (isValidated === 'true') {
      where.isValidated = true
    } else if (isValidated === 'false') {
      where.isValidated = false
    }

    // Filtro por status
    if (status) {
      where.status = status
    }

    const skip = (page - 1) * limit

    const [reports, total] = await Promise.all([
      prisma.technicalReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isValidated: 'asc' }, // Invalidados primeiro
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          reportNumber: true,
          deviceType: true,
          deviceModel: true,
          storage: true,
          color: true,
          reportType: true,
          status: true,
          isValidated: true,
          invalidationReason: true,
          validatedAt: true,
          batteryHealthPercent: true,
          estimatedPrice: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      }),
      prisma.technicalReport.count({ where })
    ])

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao carregar laudos' },
      { status: error.message === 'Acesso negado' ? 403 : 500 }
    )
  }
}
