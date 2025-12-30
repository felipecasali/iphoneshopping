# Guia de Configuração: SEO, Analytics e Performance

Este guia cobre todas as otimizações implementadas para melhorar o SEO, engajamento e performance do iPhoneShopping.

## 📊 Google Analytics e Tag Manager

### 1. Criar Conta no Google Analytics 4

1. Acesse https://analytics.google.com/
2. Clique em "Começar a medir" ou "Admin"
3. Crie uma nova propriedade:
   - Nome: **iPhoneShopping**
   - Fuso horário: **Brasil (GMT-3)**
   - Moeda: **Real brasileiro (BRL)**
4. Configure um stream da Web:
   - URL: **https://www.iphoneshopping.com.br**
   - Nome do stream: **iPhoneShopping - Produção**
5. Copie o **ID de medição** (formato: G-XXXXXXXXXX)

### 2. Criar Conta no Google Tag Manager

1. Acesse https://tagmanager.google.com/
2. Crie uma conta:
   - Nome da conta: **iPhoneShopping**
   - País: **Brasil**
3. Configure um contêiner:
   - Nome: **iPhoneShopping Web**
   - Tipo: **Web**
4. Copie o **ID do contêiner** (formato: GTM-XXXXXXX)

### 3. Configurar no Código

Edite o arquivo `src/app/layout.tsx` e substitua:

```typescript
// Linha 33: Substitua GTM-XXXXXXX pelo seu ID do Google Tag Manager
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');  // ← AQUI

// Linha 41: Substitua G-XXXXXXXXXX pelo seu ID do Google Analytics
src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"  // ← AQUI

// Linha 48: Substitua novamente
gtag('config', 'G-XXXXXXXXXX', {  // ← AQUI

// Linha 58: Substitua GTM novamente para noscript
src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"  // ← AQUI
```

### 4. Eventos Importantes para Rastrear

Configure estes eventos no Google Tag Manager:

**Eventos de Conversão:**
- `listing_view` - Visualização de anúncio
- `listing_create` - Criação de anúncio
- `message_send` - Mensagem enviada
- `evaluation_complete` - Avaliação concluída
- `user_register` - Registro de usuário
- `user_login` - Login

**Exemplo de implementação:**
```typescript
// Em qualquer página que precise rastrear eventos
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'listing_view', {
    listing_id: listingId,
    listing_title: title,
    price: price,
  });
}
```

## 🔍 Google Search Console

### 1. Verificar Propriedade

1. Acesse https://search.google.com/search-console
2. Adicione a propriedade: **https://www.iphoneshopping.com.br**
3. Escolha método de verificação: **Tag HTML**
4. Copie o código de verificação (formato: google-site-verification=XXXXXXXXX)
5. Edite `src/app/layout.tsx` linha 70:
   ```typescript
   verification: {
     google: 'XXXXXXXXX', // ← Cole seu código aqui
   },
   ```
6. Faça deploy e clique em "Verificar"

### 2. Enviar Sitemap

1. No Search Console, vá em "Sitemaps"
2. Adicione o URL do sitemap: **https://www.iphoneshopping.com.br/sitemap.xml**
3. Clique em "Enviar"
4. Aguarde a indexação (pode levar alguns dias)

## 🖼️ Imagens de Compartilhamento Social

### Criar Open Graph Image

Crie uma imagem com estas especificações:
- **Tamanho:** 1200x630 pixels
- **Formato:** JPG (melhor compressão) ou PNG
- **Conteúdo:**
  - Logo do iPhoneShopping
  - Texto: "Compre e Venda iPhones e iPads com Segurança"
  - Elementos visuais de iPhones/iPads
  - Cores da marca

Salve como:
- `public/og-image.jpg` (principal)
- `public/apple-touch-icon.png` (180x180px para iOS)
- `public/favicon.ico` (favicon padrão)
- `public/icon-192x192.png` (PWA)
- `public/icon-512x512.png` (PWA)

### Testar Compartilhamento

**Facebook Debugger:**
https://developers.facebook.com/tools/debug/

**Twitter Card Validator:**
https://cards-validator.twitter.com/

**LinkedIn Post Inspector:**
https://www.linkedin.com/post-inspector/

## 🚀 Otimizações de Performance Implementadas

### 1. Fontes Otimizadas
- ✅ Google Fonts com `display: swap`
- ✅ Preconnect para fonts.googleapis.com e fonts.gstatic.com
- ✅ Preload automático do Next.js

### 2. Imagens
- ✅ Formatos modernos (AVIF, WebP)
- ✅ Lazy loading automático
- ✅ Cache de 24 horas (86400s)
- ✅ Múltiplos tamanhos responsivos

### 3. Cache e Compressão
- ✅ Compressão gzip/brotli habilitada
- ✅ Cache de assets estáticos por 1 ano
- ✅ Revalidação otimizada

### 4. Segurança
- ✅ Headers de segurança (X-Frame-Options, CSP, etc)
- ✅ Remoção do header X-Powered-By
- ✅ Proteção contra XSS

### 5. JavaScript
- ✅ SWC minifier (mais rápido que Terser)
- ✅ Remoção de console.log em produção
- ✅ React Strict Mode

## 📱 Progressive Web App (PWA)

O arquivo `manifest.json` está configurado. Para tornar um PWA completo:

### 1. Adicionar Service Worker

Crie `public/sw.js`:
```javascript
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
  // Cache de assets estáticos
});
```

### 2. Registrar Service Worker

Em `src/app/layout.tsx`, adicione após o body:
```typescript
<Script id="sw-register" strategy="afterInteractive">
  {`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  `}
</Script>
```

## 🎯 Structured Data (JSON-LD) Implementado

### Schemas Disponíveis

1. **OrganizationSchema** - Dados da empresa
2. **WebSiteSchema** - Dados do site e search box
3. **ProductSchema** - Para páginas de anúncios
4. **BreadcrumbSchema** - Navegação estruturada
5. **FAQSchema** - Perguntas frequentes

### Uso nos Anúncios

Para adicionar schema de produto em uma página de anúncio:

```tsx
import { ProductSchema } from '@/components/StructuredData'

<ProductSchema
  name={listing.title}
  description={listing.description}
  image={listing.images[0]}
  model={listing.model}
  price={listing.price}
  condition="UsedCondition"
  seller={{ name: listing.user.name }}
  aggregateRating={
    listing.averageRating ? {
      ratingValue: listing.averageRating,
      reviewCount: listing.totalRatings
    } : undefined
  }
/>
```

## ✅ Checklist Pós-Deploy

Após fazer deploy destas alterações:

### SEO e Indexação
- [ ] Verificar robots.txt: https://www.iphoneshopping.com.br/robots.txt
- [ ] Verificar sitemap: https://www.iphoneshopping.com.br/sitemap.xml
- [ ] Verificar propriedade no Google Search Console
- [ ] Enviar sitemap no Search Console
- [ ] Testar structured data: https://search.google.com/test/rich-results

### Analytics
- [ ] Substituir IDs do Google Analytics e Tag Manager
- [ ] Testar eventos com Google Tag Assistant
- [ ] Verificar dados no Google Analytics (pode demorar 24-48h)
- [ ] Configurar conversões importantes

### Compartilhamento Social
- [ ] Criar e adicionar imagem og-image.jpg
- [ ] Testar no Facebook Debugger
- [ ] Testar no Twitter Card Validator
- [ ] Testar no LinkedIn Post Inspector

### Performance
- [ ] Testar no PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Testar no GTmetrix: https://gtmetrix.com/
- [ ] Verificar Core Web Vitals no Search Console
- [ ] Meta: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Acessibilidade
- [ ] Testar com leitor de tela
- [ ] Verificar contraste de cores
- [ ] Testar navegação por teclado
- [ ] Validar HTML: https://validator.w3.org/

## 📈 Monitoramento Contínuo

### Métricas Importantes

**Google Analytics:**
- Usuários ativos
- Taxa de conversão (cadastros, anúncios criados)
- Páginas mais visitadas
- Tempo médio na página
- Taxa de rejeição

**Search Console:**
- Impressões no Google
- Taxa de cliques (CTR)
- Posição média
- Consultas de pesquisa
- Páginas indexadas

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- INP (Interaction to Next Paint): < 200ms

## 🔗 Links Úteis

- Google Analytics: https://analytics.google.com/
- Google Tag Manager: https://tagmanager.google.com/
- Google Search Console: https://search.google.com/search-console
- PageSpeed Insights: https://pagespeed.web.dev/
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly

## 🆘 Troubleshooting

### Analytics não está rastreando

1. Verifique se os IDs foram substituídos corretamente
2. Use a extensão "Google Tag Assistant" no Chrome
3. Abra o console do navegador e procure por erros
4. Aguarde 24-48h para dados aparecerem no GA4

### Sitemap não está sendo indexado

1. Verifique se o sitemap está acessível publicamente
2. Confirme se o robots.txt aponta corretamente
3. Reenvie no Search Console
4. Aguarde alguns dias para indexação completa

### Imagens OG não aparecem

1. Limpe o cache: Facebook Debugger, Twitter Card Validator
2. Verifique se as imagens são públicas (não requerem login)
3. Confirme dimensões corretas (1200x630)
4. Aguarde alguns minutos após limpar cache

### Performance baixa

1. Comprima imagens (use TinyPNG, Squoosh)
2. Verifique se AVIF/WebP estão sendo servidos
3. Ative CDN do Vercel (já habilitado por padrão)
4. Minimize JavaScript personalizado
5. Use lazy loading para imagens e componentes pesados

---

**Última atualização:** 30 de dezembro de 2025
