import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anúncios de iPhones e iPads Usados',
  description: 'Encontre as melhores ofertas de iPhones e iPads usados e seminovos no Brasil. Centenas de anúncios verificados com preços competitivos. Compre com segurança.',
  keywords: ['iPhone usado', 'iPad usado', 'iPhone seminovo', 'comprar iPhone', 'comprar iPad', 'iPhone barato', 'iPad barato', 'marketplace Apple'],
  openGraph: {
    title: 'Anúncios de iPhones e iPads Usados - iPhoneShopping',
    description: 'Encontre as melhores ofertas de iPhones e iPads usados no Brasil. Centenas de anúncios verificados.',
    type: 'website',
  },
}

export default function AnunciosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
