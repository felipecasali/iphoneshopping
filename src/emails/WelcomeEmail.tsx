import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  userName: string
  userEmail: string
}

export default function WelcomeEmail({ userName, userEmail }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo ao iPhoneShopping! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🍎 iPhoneShopping</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Olá, {userName}!</Heading>
            
            <Text style={text}>
              Seja muito bem-vindo(a) ao <strong>iPhoneShopping</strong>, o marketplace especializado em 
              iPhones e iPads usados! 🎊
            </Text>

            <Text style={text}>
              Sua conta foi criada com sucesso e você já pode:
            </Text>

            <ul style={list}>
              <li style={listItem}>📱 Avaliar seu iPhone ou iPad e descobrir o valor de mercado</li>
              <li style={listItem}>📣 Criar anúncios para vender seus dispositivos</li>
              <li style={listItem}>🔍 Navegar pelos anúncios de outros vendedores</li>
              <li style={listItem}>💬 Conversar diretamente com compradores e vendedores</li>
              <li style={listItem}>⭐ Avaliar suas transações e construir reputação</li>
            </ul>

            <Section style={buttonContainer}>
              <Button style={button} href="https://www.iphoneshopping.com.br/dashboard">
                Acessar Minha Conta
              </Button>
            </Section>

            <Text style={text}>
              Se você tiver alguma dúvida, não hesite em nos contatar!
            </Text>

            <Text style={signature}>
              Atenciosamente,<br />
              <strong>Equipe iPhoneShopping</strong>
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 iPhoneShopping. Todos os direitos reservados.
            </Text>
            <Text style={footerText}>
              <Link href="https://www.iphoneshopping.com.br" style={link}>
                www.iphoneshopping.com.br
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
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
  backgroundColor: '#0070f3',
  padding: '32px 40px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
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

const signature = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '32px 0 0',
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

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
}
