import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/users/[id] - Atualizar usuário (banir, alterar role)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const { id } = params
    const body = await request.json()
    const { action, role, status } = body

    // Validações
    if (!action) {
      return NextResponse.json(
        { error: 'Ação não especificada' },
        { status: 400 }
      )
    }

    // Não permitir alterar próprio status
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { email: true }
    })

    let updateData: any = {}

    switch (action) {
      case 'ban':
        updateData.status = 'BANNED'
        break
      
      case 'activate':
        updateData.status = 'ACTIVE'
        break
      
      case 'changeRole':
        if (!role || !['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
          return NextResponse.json(
            { error: 'Role inválido' },
            { status: 400 }
          )
        }
        updateData.role = role
        break
      
      case 'update':
        if (status) updateData.status = status
        if (role) updateData.role = role
        break
      
      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        )
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Usuário atualizado com sucesso`
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar usuário' },
      { status: error.message?.includes('Acesso negado') ? 403 : 500 }
    )
  }
}

// GET /api/admin/users/[id] - Detalhes do usuário
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const { id } = params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            listings: true,
            technicalReports: true,
            evaluations: true,
            sentMessages: true,
            receivedMessages: true
          }
        },
        listings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            condition: true,
            price: true,
            status: true,
            createdAt: true,
            device: {
              select: { model: true }
            }
          }
        },
        technicalReports: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            reportNumber: true,
            deviceModel: true,
            reportType: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar usuário' },
      { status: error.message?.includes('Acesso negado') ? 403 : 500 }
    )
  }
}
