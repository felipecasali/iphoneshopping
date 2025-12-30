import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendWelcomeEmail, sendListingCreatedEmail, sendNewMessageEmail } from '@/lib/emailTemplates'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para testar.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'welcome'

    console.log('🧪 Testando envio de email...')
    console.log('Tipo:', type)
    console.log('Para:', session.user.email)
    console.log('ENV RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configurado' : '❌ Não configurado')
    console.log('ENV EMAIL_FROM:', process.env.EMAIL_FROM || 'Não configurado')

    let result

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(
          session.user.name || 'Teste',
          session.user.email
        )
        break

      case 'listing':
        result = await sendListingCreatedEmail(
          session.user.email,
          session.user.name || 'Teste',
          'iPhone 15 Pro Max 256GB',
          'R$ 5.999,00',
          'test-listing-id'
        )
        break

      case 'message':
        result = await sendNewMessageEmail(
          session.user.email,
          session.user.name || 'Teste',
          'João Silva',
          'Olá! Gostaria de saber mais sobre o iPhone...',
          'iPhone 15 Pro Max 256GB',
          'test-conversation-id'
        )
        break

      default:
        return NextResponse.json(
          { error: 'Tipo inválido. Use: welcome, listing ou message' },
          { status: 400 }
        )
    }

    console.log('Resultado do envio:', result)

    return NextResponse.json({
      success: true,
      message: 'Email enviado! Verifique sua caixa de entrada (e spam).',
      details: {
        type,
        to: session.user.email,
        result,
        env: {
          hasApiKey: !!process.env.RESEND_API_KEY,
          emailFrom: process.env.EMAIL_FROM || 'Não configurado',
        }
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao testar email:', error)
    return NextResponse.json(
      {
        error: 'Erro ao enviar email de teste',
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
