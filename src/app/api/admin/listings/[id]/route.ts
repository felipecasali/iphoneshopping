import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        device: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
            _count: {
              select: {
                listings: true,
                technicalReports: true
              }
            }
          }
        },
        _count: {
          select: {
            conversations: true,
            transactions: true
          }
        }
      }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ listing })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao carregar anúncio' },
      { status: error.message === 'Acesso negado' ? 403 : 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { action, reason } = body

    const listing = await prisma.listing.findUnique({
      where: { id: params.id }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    let updateData: any = {
      moderatedAt: new Date(),
      moderatedBy: currentUser.id
    }

    switch (action) {
      case 'approve':
        updateData.moderationStatus = 'APPROVED'
        updateData.rejectionReason = null
        break

      case 'reject':
        if (!reason) {
          return NextResponse.json(
            { error: 'Motivo da rejeição é obrigatório' },
            { status: 400 }
          )
        }
        updateData.moderationStatus = 'REJECTED'
        updateData.rejectionReason = reason
        updateData.status = 'INACTIVE' // Desativa o anúncio
        break

      case 'feature':
        updateData.featured = true
        break

      case 'unfeature':
        updateData.featured = false
        break

      case 'delete':
        await prisma.listing.delete({
          where: { id: params.id }
        })
        return NextResponse.json({
          message: 'Anúncio excluído com sucesso'
        })

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        )
    }

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: updateData,
      include: {
        device: {
          select: {
            model: true,
            color: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Ação executada com sucesso',
      listing: updatedListing
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar anúncio' },
      { status: error.message === 'Acesso negado' ? 403 : 500 }
    )
  }
}
