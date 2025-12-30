import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendListingUpdatedEmail } from '@/lib/emailTemplates'

const updateListingSchema = z.object({
  price: z.number().min(0).optional(),
  acceptsTrade: z.boolean().optional(),
  negotiable: z.boolean().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  status: z.enum(['ACTIVE', 'SOLD', 'RESERVED', 'INACTIVE']).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        device: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    // Incrementar visualizações (apenas se não for o dono do anúncio)
    let shouldIncrementView = true
    
    if (session?.user?.email) {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      })
      
      // Não incrementa se for o próprio dono
      if (currentUser && currentUser.id === listing.userId) {
        shouldIncrementView = false
      }
    }

    if (shouldIncrementView) {
      await prisma.listing.update({
        where: { id: params.id },
        data: {
          views: {
            increment: 1,
          },
        },
      })
    }

    // Converter images de JSON string para array
    const listingWithImages = {
      ...listing,
      images: listing.images ? JSON.parse(listing.images) : [],
      views: shouldIncrementView ? listing.views + 1 : listing.views,
    }

    return NextResponse.json({
      success: true,
      listing: listingWithImages,
    })
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar anúncio' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o anúncio pertence ao usuário
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    if (existingListing.userId !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar este anúncio' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateListingSchema.parse(body)

    // Converter images para JSON string se fornecido
    const updateData: any = { ...data }
    if (data.images) {
      updateData.images = JSON.stringify(data.images)
    }

    const listing = await prisma.listing.update({
      where: { id: params.id },
      data: updateData,
      include: {
        device: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
      },
    })

    // Enviar email de atualização (não aguarda)
    const listingTitle = `${listing.device.model} ${listing.device.storage}GB`
    sendListingUpdatedEmail(
      listing.user.email,
      listing.user.name,
      listingTitle,
      listing.id
    ).catch(err => console.error('Erro ao enviar email de anúncio atualizado:', err))

    return NextResponse.json({
      success: true,
      listing,
    })
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar anúncio' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o anúncio pertence ao usuário
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    if (existingListing.userId !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para excluir este anúncio' },
        { status: 403 }
      )
    }

    await prisma.listing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Anúncio excluído com sucesso',
    })
  } catch (error) {
    console.error('Erro ao excluir anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir anúncio' },
      { status: 500 }
    )
  }
}
