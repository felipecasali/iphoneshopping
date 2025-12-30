import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a equipe do iPhoneShopping. Tire suas dúvidas, envie sugestões ou reporte problemas.',
  keywords: ['contato', 'suporte', 'ajuda', 'atendimento'],
  openGraph: {
    title: 'Contato - iPhoneShopping',
    description: 'Entre em contato com a equipe do iPhoneShopping.',
    type: 'website',
  },
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
