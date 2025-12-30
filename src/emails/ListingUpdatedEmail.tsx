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

interface ListingUpdatedEmailProps {
  userName: string
  listingTitle: string
  listingId: string
}

export default function ListingUpdatedEmail({
  userName,
  listingTitle,
  listingId,
}: ListingUpdatedEmailProps) {
  const listingUrl = `https://www.iphoneshopping.com.br/anuncios/${listingId}`

  return (
    <Html>
      <Head />
      <Preview>Seu anúncio foi atualizado</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>✏️ Anúncio Atualizado</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Olá, {userName}!</Heading>
            
            <Text style={text}>
              Seu anúncio foi atualizado com sucesso:
            </Text>

            <Section style={infoBox}>
              <Text style={infoValue}>{listingTitle}</Text>
            </Section>

            <Text style={text}>
              As alterações já estão visíveis para todos os compradores interessados.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={listingUrl}>
                Ver Anúncio Atualizado
              </Button>
            </Section>
          </Section>

          <Section style={footer}>
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
  backgroundColor: '#f59e0b',
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

const infoBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const infoValue = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
}

const footer = {
  borderTop: '1px solid #e6e6e6',
  padding: '24px 40px',
}

const footerText = {
  color: '#999999',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
  textAlign: 'center' as const,
}
