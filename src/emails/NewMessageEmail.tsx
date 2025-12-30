import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface NewMessageEmailProps {
  recipientName: string
  senderName: string
  messagePreview: string
  listingTitle: string
  conversationId: string
}

export default function NewMessageEmail({
  recipientName,
  senderName,
  messagePreview,
  listingTitle,
  conversationId,
}: NewMessageEmailProps) {
  const messageUrl = `https://www.iphoneshopping.com.br/dashboard/mensagens/${conversationId}`

  return (
    <Html>
      <Head />
      <Preview>Nova mensagem de {senderName} sobre {listingTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>💬 Nova Mensagem</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Olá, {recipientName}!</Heading>
            
            <Text style={text}>
              Você recebeu uma nova mensagem de <strong>{senderName}</strong> sobre o anúncio:
            </Text>

            <Section style={listingBox}>
              <Text style={listingTitleStyle}>{listingTitle}</Text>
            </Section>

            <Section style={messageBox}>
              <Text style={messageLabel}>Mensagem:</Text>
              <Text style={messageText}>"{messagePreview}"</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={messageUrl}>
                Responder Mensagem
              </Button>
            </Section>

            <Text style={tip}>
              <strong>⏱️ Responda rápido!</strong> Vendedores que respondem em até 1 hora 
              têm 70% mais chances de fechar negócio.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Você está recebendo este email porque tem mensagens habilitadas no iPhoneShopping.
            </Text>
            <Text style={footerText}>
              © 2025 iPhoneShopping. Todos os direitos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginTop: '32px',
  marginBottom: '32px',
  borderRadius: '8px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#8b5cf6',
  padding: '32px 40px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const content = {
  padding: '40px',
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const listingBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const listingTitleStyle = {
  color: '#1e40af',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
}

const messageBox = {
  backgroundColor: '#f8fafc',
  border: '2px solid #e2e8f0',
  borderLeft: '4px solid #8b5cf6',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const messageLabel = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
}

const messageText = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontStyle: 'italic',
  lineHeight: '24px',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#8b5cf6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
}

const tip = {
  backgroundColor: '#dbeafe',
  border: '1px solid #60a5fa',
  borderRadius: '8px',
  padding: '16px',
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0',
}

const footer = {
  borderTop: '1px solid #e6e6e6',
  padding: '24px 40px',
}

const footerText = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '8px 0',
  textAlign: 'center' as const,
}
