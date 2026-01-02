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
    const moderationStatus = searchParams.get('moderationStatus') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}

    // Filtro de busca (por device model)
    if (search) {
      where.OR = [
        { device: { model: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filtro por status de moderação
    if (moderationStatus) {
      where.moderationStatus = moderationStatus
    }

    // Filtro por status de venda
    if (status) {
      where.status = status
    }

    const skip = (page - 1) * limit

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { moderationStatus: 'asc' }, // PENDING primeiro
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          condition: true,
          price: true,
          status: true,
          moderationStatus: true,
          rejectionReason: true,
          featured: true,
          views: true,
          location: true,
          createdAt: true,
          moderatedAt: true,
          device: {
            select: {
              model: true,
              color: true,
              storage: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          _count: {
            select: {
              conversations: true
            }
          }
        }
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao carregar anúncios' },
      { status: error.message === 'Acesso negado' ? 403 : 500 }
    )
  }
}
