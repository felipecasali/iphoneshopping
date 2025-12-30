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
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 Email simulado (RESEND_API_KEY não configurado):')
      console.log(`Para: ${to}`)
      console.log(`Assunto: ${subject}`)
      return { success: true, simulated: true }
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'iPhoneShopping <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('❌ Erro ao enviar email:', error)
      return { success: false, error }
    }

    console.log('✅ Email enviado com sucesso:', data?.id)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return { success: false, error }
  }
}
