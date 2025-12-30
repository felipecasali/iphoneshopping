import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criar Anúncio de iPhone ou iPad',
  description: 'Anuncie seu iPhone ou iPad gratuitamente. Publique fotos, descreva o aparelho e negocie diretamente com compradores interessados.',
  keywords: ['vender iPhone', 'vender iPad', 'anunciar iPhone', 'publicar anúncio', 'anuncio gratis'],
  robots: {
    index: false,
    follow: true,
  },
}

export default function CriarAnuncioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
