import Script from 'next/script'

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  contactPoint?: {
    email?: string
    telephone?: string
  }
}

export function OrganizationSchema({
  name = 'iPhoneShopping',
  url = 'https://www.iphoneshopping.com.br',
  logo = 'https://www.iphoneshopping.com.br/logo.png',
  description = 'Marketplace especializado na compra e venda de iPhones e iPads no Brasil',
  contactPoint = {
    email: 'contato@iphoneshopping.com.br'
  }
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    contactPoint: {
      '@type': 'ContactPoint',
      email: contactPoint.email,
      telephone: contactPoint.telephone,
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: 'Portuguese'
    },
    sameAs: [
      // Adicionar redes sociais quando disponíveis
      // 'https://www.facebook.com/iphoneshopping',
      // 'https://www.instagram.com/iphoneshopping',
      // 'https://twitter.com/iphoneshopping'
    ]
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebSiteSchemaProps {
  name?: string
  url?: string
  description?: string
}

export function WebSiteSchema({
  name = 'iPhoneShopping',
  url = 'https://www.iphoneshopping.com.br',
  description = 'Marketplace especializado na compra e venda de iPhones e iPads no Brasil'
}: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/anuncios?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProductSchemaProps {
  name: string
  description: string
  image?: string
  brand?: string
  model?: string
  price: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition'
  seller?: {
    name: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export function ProductSchema({
  name,
  description,
  image,
  brand = 'Apple',
  model,
  price,
  currency = 'BRL',
  availability = 'InStock',
  condition = 'UsedCondition',
  seller,
  aggregateRating
}: ProductSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    model,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      itemCondition: `https://schema.org/${condition}`,
      seller: seller ? {
        '@type': 'Person',
        name: seller.name
      } : undefined
    }
  }

  if (aggregateRating && aggregateRating.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1
    }
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
