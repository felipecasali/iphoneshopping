import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { avatar } = await req.json()

    // Atualizar avatar do usuário
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { avatar: avatar || null },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar avatar' },
      { status: 500 }
    )
  }
}
