import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY não configurado. Emails não serão enviados.')
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'test_key')

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  try {
    console.log('📧 Tentando enviar email...')
    console.log('  Para:', to)
    console.log('  Assunto:', subject)
    console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? `Configurado (${process.env.RESEND_API_KEY.substring(0, 10)}...)` : '❌ NÃO CONFIGURADO')
    console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || '❌ NÃO CONFIGURADO')

    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️  Email SIMULADO - RESEND_API_KEY não configurado')
      console.log('📧 Email simulado:')
      console.log(`   Para: ${to}`)
      console.log(`   Assunto: ${subject}`)
      console.log(`   HTML length: ${html.length} caracteres`)
      return { success: true, simulated: true }
    }

    console.log('✉️  Enviando email via Resend...')

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'iPhoneShopping <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('❌ Erro retornado pelo Resend:', error)
      return { success: false, error }
    }

    console.log('✅ Email enviado com sucesso!')
    console.log('   ID:', data?.id)
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Exceção ao enviar email:', error)
    console.error('   Mensagem:', error.message)
    console.error('   Stack:', error.stack)
    return { success: false, error }
  }
}
