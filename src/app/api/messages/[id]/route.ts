import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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

    // Buscar conversa
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        listing: {
          include: {
            device: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário faz parte da conversa
    if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Marcar mensagens como lidas
    await prisma.message.updateMany({
      where: {
        conversationId: params.id,
        receiverId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    // Formatar conversa
    const otherUser = conversation.buyerId === user.id 
      ? conversation.seller 
      : conversation.buyer

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        listing: {
          ...conversation.listing,
          images: conversation.listing.images 
            ? JSON.parse(conversation.listing.images) 
            : [],
        },
        otherUser,
        messages: conversation.messages,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar conversa:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conversa' },
      { status: 500 }
    )
  }
}
