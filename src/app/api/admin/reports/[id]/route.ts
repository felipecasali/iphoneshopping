import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const report = await prisma.technicalReport.findUnique({
      where: { id: params.id },
      include: {
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
        evaluation: {
          select: {
            id: true,
            deviceType: true,
            estimatedValue: true,
            createdAt: true
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Laudo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ report })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao carregar laudo' },
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

    const report = await prisma.technicalReport.findUnique({
      where: { id: params.id }
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Laudo não encontrado' },
        { status: 404 }
      )
    }

    let updateData: any = {
      validatedAt: new Date(),
      validatedBy: currentUser.id
    }

    switch (action) {
      case 'validate':
        updateData.isValidated = true
        updateData.invalidationReason = null
        break

      case 'invalidate':
        if (!reason) {
          return NextResponse.json(
            { error: 'Motivo da invalidação é obrigatório' },
            { status: 400 }
          )
        }
        updateData.isValidated = false
        updateData.invalidationReason = reason
        updateData.status = 'EXPIRED' // Marca como expirado
        break

      case 'delete':
        await prisma.technicalReport.delete({
          where: { id: params.id }
        })
        return NextResponse.json({
          message: 'Laudo excluído com sucesso'
        })

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        )
    }

    const updatedReport = await prisma.technicalReport.update({
      where: { id: params.id },
      data: updateData,
      include: {
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
      report: updatedReport
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar laudo' },
      { status: error.message === 'Acesso negado' ? 403 : 500 }
    )
  }
}
