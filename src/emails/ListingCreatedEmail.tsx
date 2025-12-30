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

interface ListingCreatedEmailProps {
  userName: string
  listingTitle: string
  listingPrice: string
  listingId: string
}

export default function ListingCreatedEmail({
  userName,
  listingTitle,
  listingPrice,
  listingId,
}: ListingCreatedEmailProps) {
  const listingUrl = `https://www.iphoneshopping.com.br/anuncios/${listingId}`

  return (
    <Html>
      <Head />
      <Preview>Seu anúncio foi publicado com sucesso! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>📱 Anúncio Publicado!</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Parabéns, {userName}!</Heading>
            
            <Text style={text}>
              Seu anúncio foi publicado com sucesso no iPhoneShopping e já está disponível 
              para milhares de compradores interessados! 🚀
            </Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>Anúncio:</Text>
              <Text style={infoValue}>{listingTitle}</Text>
              
              <Text style={infoLabel}>Preço:</Text>
              <Text style={infoValue}>{listingPrice}</Text>
            </Section>

            <Text style={text}>
              <strong>O que acontece agora?</strong>
            </Text>

            <ul style={list}>
              <li style={listItem}>💬 Compradores interessados entrarão em contato via mensagens</li>
              <li style={listItem}>🔔 Você receberá notificações por email quando receber mensagens</li>
              <li style={listItem}>✏️ Você pode editar ou pausar seu anúncio a qualquer momento</li>
            </ul>

            <Section style={buttonContainer}>
              <Button style={button} href={listingUrl}>
                Ver Meu Anúncio
              </Button>
            </Section>

            <Text style={tip}>
              <strong>💡 Dica:</strong> Anúncios com fotos de qualidade e descrição detalhada 
              recebem até 3x mais visualizações!
            </Text>
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
  backgroundColor: '#10b981',
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
}

const infoLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0 4px',
  textTransform: 'uppercase' as const,
}

const infoValue = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const list = {
  margin: '16px 0',
  paddingLeft: '20px',
}

const listItem = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '28px',
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

const tip = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '8px',
  padding: '16px',
  color: '#78350f',
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
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
  textAlign: 'center' as const,
}
