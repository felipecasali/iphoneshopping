import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.iphoneshopping.com.br'),
  title: {
    default: 'iPhoneShopping - Compre e Venda iPhones e iPads com Segurança',
    template: '%s | iPhoneShopping'
  },
  description: 'Marketplace especializado na compra e venda de iPhones e iPads no Brasil. Avalie seu aparelho gratuitamente e anuncie com segurança. Sistema inteligente de avaliação e chat seguro.',
  keywords: ['iPhone', 'iPad', 'comprar iPhone', 'vender iPhone', 'marketplace Apple', 'iPhone usado', 'iPad usado', 'iPhone seminovo', 'avaliar iPhone', 'preço iPhone usado', 'Apple Brasil', 'vender celular'],
  authors: [{ name: 'iPhoneShopping' }],
  creator: 'iPhoneShopping',
  publisher: 'iPhoneShopping',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.iphoneshopping.com.br',
    title: 'iPhoneShopping - Compre e Venda iPhones e iPads com Segurança',
    description: 'Marketplace especializado na compra e venda de iPhones e iPads no Brasil. Avalie seu aparelho gratuitamente e anuncie com segurança.',
    siteName: 'iPhoneShopping',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'iPhoneShopping - Marketplace de iPhones e iPads',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iPhoneShopping - Compre e Venda iPhones e iPads',
    description: 'Marketplace especializado em dispositivos Apple no Brasil. Avalie e anuncie gratuitamente.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Substituir após verificar no Google Search Console
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W3VDVQJK');
            `,
          }}
        />
        
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6L0JB6BRE0"
          strategy="afterInteractive"
        />
        <Script
          id="ga-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6L0JB6BRE0', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        
        {/* NoScript fallback for GTM */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W3VDVQJK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
