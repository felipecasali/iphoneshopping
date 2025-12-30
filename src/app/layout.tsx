import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'iPhoneShopping - Compre e Venda iPhones e iPads com Segurança',
  description: 'Marketplace especializado na compra e venda de iPhones e iPads no Brasil. Avalie seu aparelho e anuncie gratuitamente.',
  keywords: 'iPhone, iPad, comprar iPhone, vender iPhone, marketplace Apple, iPhone usado',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
