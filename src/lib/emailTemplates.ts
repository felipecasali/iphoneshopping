import { render } from '@react-email/render'
import { sendEmail } from './email'
import WelcomeEmail from '@/emails/WelcomeEmail'
import ListingCreatedEmail from '@/emails/ListingCreatedEmail'
import ListingUpdatedEmail from '@/emails/ListingUpdatedEmail'
import NewMessageEmail from '@/emails/NewMessageEmail'

export const sendWelcomeEmail = async (userName: string, userEmail: string) => {
  const html = await render(
    WelcomeEmail({ userName, userEmail })
  )

  return sendEmail({
    to: userEmail,
    subject: `Bem-vindo ao iPhoneShopping, ${userName}! 🎉`,
    html,
  })
}

export const sendListingCreatedEmail = async (
  userEmail: string,
  userName: string,
  listingTitle: string,
  listingPrice: string,
  listingId: string
) => {
  const html = await render(
    ListingCreatedEmail({ userName, listingTitle, listingPrice, listingId })
  )

  return sendEmail({
    to: userEmail,
    subject: `✅ Anúncio publicado: ${listingTitle}`,
    html,
  })
}

export const sendListingUpdatedEmail = async (
  userEmail: string,
  userName: string,
  listingTitle: string,
  listingId: string
) => {
  const html = await render(
    ListingUpdatedEmail({ userName, listingTitle, listingId })
  )

  return sendEmail({
    to: userEmail,
    subject: `✏️ Anúncio atualizado: ${listingTitle}`,
    html,
  })
}

export const sendNewMessageEmail = async (
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  messagePreview: string,
  listingTitle: string,
  conversationId: string
) => {
  const html = await render(
    NewMessageEmail({
      recipientName,
      senderName,
      messagePreview,
      listingTitle,
      conversationId,
    })
  )

  return sendEmail({
    to: recipientEmail,
    subject: `💬 Nova mensagem de ${senderName} sobre ${listingTitle}`,
    html,
  })
}
