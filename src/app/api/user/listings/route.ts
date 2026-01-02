import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    console.log('=== USER LISTINGS DEBUG ===')
    console.log('Session:', session)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    console.log('User found:', user)

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar anúncios do usuário
    const listings = await prisma.listing.findMany({
      where: {
        userId: user.id,
      },
      include: {
        device: true,
        technicalReports: {
          where: {
            status: 'VALIDATED',
          },
          select: {
            id: true,
            reportNumber: true,
            reportType: true,
            status: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('Listings found:', listings.length)
    console.log('First listing technicalReports:', listings[0]?.technicalReports)

    // Converter images de JSON string para array
    const listingsWithImages = listings.map((listing: any) => ({
      ...listing,
      images: listing.images ? JSON.parse(listing.images) : [],
    }))

    return NextResponse.json({
      success: true,
      listings: listingsWithImages,
    })
  } catch (error) {
    console.error('Erro ao buscar anúncios do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar anúncios' },
      { status: 500 }
    )
  }
}
