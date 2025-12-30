import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendNewMessageEmail } from '@/lib/emailTemplates'

const sendMessageSchema = z.object({
  listingId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1).max(1000),
})

// Enviar mensagem
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { listingId, receiverId, content } = sendMessageSchema.parse(body)

    // Verificar se o anúncio existe
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    // Não pode enviar mensagem para si mesmo
    if (user.id === receiverId) {
      return NextResponse.json(
        { error: 'Não é possível enviar mensagem para si mesmo' },
        { status: 400 }
      )
    }

    // Buscar ou criar conversa
    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId: listingId,
        OR: [
          { buyerId: user.id, sellerId: receiverId },
          { buyerId: receiverId, sellerId: user.id },
        ],
      },
    })

    if (!conversation) {
      // Determinar quem é comprador e quem é vendedor
      const isSeller = listing.userId === user.id
      
      conversation = await prisma.conversation.create({
        data: {
          listingId: listingId,
          buyerId: isSeller ? receiverId : user.id,
          sellerId: isSeller ? user.id : receiverId,
        },
      })
    }

    // Criar mensagem
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        receiverId: receiverId,
        content: content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Enviar email de notificação (não aguarda)
    const listingWithDevice = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { device: true },
    })

    if (listingWithDevice && message.receiver) {
      const listingTitle = `${listingWithDevice.device.model} ${listingWithDevice.device.storage}GB`
      const messagePreview = content.length > 100 
        ? content.substring(0, 100) + '...' 
        : content

      sendNewMessageEmail(
        message.receiver.email,
        message.receiver.name,
        user.name,
        messagePreview,
        listingTitle,
        conversation.id
      ).catch(err => console.error('Erro ao enviar email de nova mensagem:', err))
    }

    return NextResponse.json({
      success: true,
      message,
      conversationId: conversation.id,
    })
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}

// Buscar conversas do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    console.log('=== GET MESSAGES DEBUG ===')
    console.log('Session:', session)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

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

    // Buscar todas as conversas do usuário
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: user.id },
          { sellerId: user.id },
        ],
      },
      include: {
        listing: {
          include: {
            device: true,
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
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    console.log('Conversations found:', conversations.length)

    // Contar mensagens não lidas
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: user.id,
        read: false,
      },
    })

    // Formatar conversas
    const formattedConversations = conversations.map((conv: any) => {
      const otherUser = conv.buyerId === user.id ? conv.seller : conv.buyer
      const lastMessage = conv.messages[0]
      
      return {
        id: conv.id,
        listing: {
          id: conv.listing.id,
          images: conv.listing.images ? JSON.parse(conv.listing.images) : [],
          device: conv.listing.device,
        },
        otherUser,
        lastMessage,
        updatedAt: conv.updatedAt,
      }
    })

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
      unreadCount,
    })
  } catch (error) {
    console.error('Erro ao buscar conversas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conversas' },
      { status: 500 }
    )
  }
}
