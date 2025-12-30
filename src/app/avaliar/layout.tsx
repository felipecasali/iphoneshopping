import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avalie seu iPhone ou iPad Gratuitamente',
  description: 'Descubra quanto vale seu iPhone ou iPad em minutos. Sistema inteligente de avaliação considera modelo, capacidade, estado e acessórios. Avaliação 100% gratuita.',
  keywords: ['avaliar iPhone', 'avaliar iPad', 'quanto vale meu iPhone', 'preço iPhone usado', 'valor iPhone usado', 'cotação iPhone', 'vender iPhone'],
  openGraph: {
    title: 'Avalie seu iPhone ou iPad Gratuitamente - iPhoneShopping',
    description: 'Descubra quanto vale seu iPhone ou iPad em minutos com nosso sistema inteligente de avaliação.',
    type: 'website',
  },
}

export default function AvaliarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
