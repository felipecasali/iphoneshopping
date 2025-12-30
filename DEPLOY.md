# Guia de Deploy para Produção - iPhoneShopping

## 📋 Checklist Pré-Deploy

### 1. ✅ Ajustes Necessários

#### A) Variáveis de Ambiente
Crie um arquivo `.env.production` ou configure no serviço de hospedagem:

```env
# Database (PostgreSQL em produção - NÃO use SQLite!)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="[GERE UM SECRET SEGURO]"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="seu-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="iphoneshopping_preset"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="sua-api-secret"
```

**Importante**: 
- ⚠️ SQLite NÃO funciona em produção na maioria dos serviços (Vercel, Railway, etc)
- Use PostgreSQL (recomendado), MySQL ou MongoDB
- NUNCA commite o arquivo `.env` no Git

#### B) Migração do Banco de Dados

**De SQLite para PostgreSQL:**

1. Configure a nova DATABASE_URL no `.env`
2. Atualize o `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Mude de sqlite para postgresql
  url      = env("DATABASE_URL")
}
```

3. Execute as migrações:
```bash
npx prisma migrate deploy
```

#### C) NEXTAUTH_SECRET

Gere um secret seguro:
```bash
openssl rand -base64 32
```
Ou use: https://generate-secret.vercel.app/32

#### D) Ajustes de Segurança

1. **Headers de Segurança** - Adicione em `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

2. **Rate Limiting** - Considere adicionar no futuro para proteger APIs

#### E) Performance

1. **Otimização de Imagens** - Já configurado com Next.js Image
2. **Caching** - Considere adicionar cache de API no futuro
3. **Indexação do Banco** - Adicione índices se necessário

---

## 🚀 Opções de Deploy

### Opção 1: Vercel (RECOMENDADO - Mais Simples)

**Vantagens:**
- ✅ Feito pela equipe do Next.js
- ✅ Deploy automático via Git
- ✅ SSL grátis
- ✅ CDN global
- ✅ Plano gratuito generoso
- ✅ Zero configuração

**Passos:**

1. **Criar conta na Vercel**
   - Acesse: https://vercel.com
   - Faça login com GitHub/GitLab/Bitbucket

2. **Preparar o repositório Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/seu-usuario/iphoneshopping.git
   git push -u origin main
   ```

3. **Importar projeto na Vercel**
   - Clique em "New Project"
   - Selecione seu repositório
   - Configure as variáveis de ambiente:
     - DATABASE_URL
     - NEXTAUTH_URL (use a URL da Vercel)
     - NEXTAUTH_SECRET
     - Variáveis do Cloudinary

4. **Banco de Dados PostgreSQL**
   
   **Opção A: Vercel Postgres (integrado)**
   - Na Vercel, vá em "Storage" > "Create Database"
   - Escolha "Postgres"
   - Copie a DATABASE_URL gerada
   
   **Opção B: Neon.tech (gratuito)**
   - Acesse: https://neon.tech
   - Crie um projeto
   - Copie a connection string
   
   **Opção C: Supabase (gratuito)**
   - Acesse: https://supabase.com
   - Crie um projeto
   - Vá em "Database" > "Connection string"

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build (2-5 minutos)
   - Acesse sua URL: `https://seu-app.vercel.app`

6. **Executar Migrações**
   ```bash
   # Instale Vercel CLI
   npm i -g vercel
   
   # Execute as migrações
   vercel env pull
   npx prisma migrate deploy
   ```

---

### Opção 2: Railway (Alternativa Simples)

**Vantagens:**
- ✅ Banco de dados PostgreSQL incluído
- ✅ Plano gratuito com $5/mês de crédito
- ✅ Deploy via Git

**Passos:**

1. Acesse: https://railway.app
2. Faça login com GitHub
3. "New Project" > "Deploy from GitHub repo"
4. Adicione PostgreSQL: "New" > "Database" > "PostgreSQL"
5. Configure variáveis de ambiente
6. Deploy automático

---

### Opção 3: DigitalOcean App Platform

**Vantagens:**
- ✅ Controle total
- ✅ Banco gerenciado
- ✅ $200 crédito grátis (60 dias)

**Custo:** ~$12/mês

---

## 📝 Configuração Pós-Deploy

### 1. Domínio Personalizado

**Na Vercel:**
1. Vá em "Settings" > "Domains"
2. Adicione seu domínio
3. Configure DNS:
   - Tipo: CNAME
   - Nome: www (ou @)
   - Valor: cname.vercel-dns.com

### 2. Monitoramento

**Ferramentas gratuitas:**
- **Vercel Analytics**: Já incluído
- **Google Analytics**: Adicione o código
- **Sentry**: Para tracking de erros

### 3. Backup do Banco

Configure backups automáticos:
- **Vercel Postgres**: Backups automáticos
- **Neon**: Snapshots diários (plano gratuito)
- **Supabase**: Backups diários

---

## 🔒 Segurança em Produção

### Checklist:
- [ ] NEXTAUTH_SECRET único e forte
- [ ] DATABASE_URL segura (não exposta)
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] Cloudinary API secret não exposta
- [ ] Rate limiting (considere no futuro)
- [ ] Validação de entrada em todas APIs
- [ ] Sanitização de dados

---

## 📊 Monitoramento Recomendado

### Métricas importantes:
1. **Performance**
   - Tempo de carregamento
   - Core Web Vitals
   - Taxa de erro de API

2. **Uso**
   - Usuários ativos
   - Anúncios criados
   - Mensagens enviadas

3. **Negócio**
   - Taxa de conversão
   - Tempo médio no site
   - Taxa de retorno

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"
- Verifique a DATABASE_URL
- Confirme que o IP está na whitelist do banco
- Teste a conexão com `npx prisma db pull`

### Erro: "NextAuth configuration error"
- Confirme NEXTAUTH_URL com https://
- Gere novo NEXTAUTH_SECRET
- Verifique se todas variáveis estão configuradas

### Erro de build na Vercel
- Execute `npm run build` localmente
- Corrija erros TypeScript
- Verifique logs na Vercel

### Imagens não carregam
- Adicione `res.cloudinary.com` em `next.config.js`
- Verifique credenciais do Cloudinary

---

## 📈 Otimizações Futuras

### Fase 2 - Após Deploy:
1. **Cache de API** com Redis
2. **CDN para assets** estáticos
3. **Compressão** de respostas
4. **Lazy loading** de componentes
5. **Service Worker** para PWA
6. **Analytics** detalhado
7. **A/B Testing**
8. **Email transacional** (SendGrid, Resend)

### Fase 3 - Escala:
1. **Load balancing**
2. **Multiple regions**
3. **Database replicas**
4. **Search engine** (Algolia, Meilisearch)
5. **Message queue** para processamento assíncrono

---

## 💰 Custos Estimados

### Setup Gratuito:
- **Vercel**: Free tier (generoso)
- **Neon PostgreSQL**: Free tier (0.5GB)
- **Cloudinary**: Free tier (25GB)
- **Total**: $0/mês 🎉

### Setup Profissional (~$20/mês):
- **Vercel Pro**: $20/mês
- **Neon Scale**: Incluído
- **Cloudinary Plus**: $0 (ainda no free)
- **Domínio**: ~$12/ano

### Quando escalar:
- Neon vai ficar pago após 0.5GB
- Cloudinary após 25GB de storage
- Vercel após limites de bandwidth

---

## 🎯 Próximos Passos

1. **Agora (Pré-Deploy):**
   - [ ] Gerar NEXTAUTH_SECRET
   - [ ] Criar conta Vercel
   - [ ] Criar banco PostgreSQL (Neon recomendado)
   - [ ] Configurar variáveis de ambiente
   - [ ] Testar build local: `npm run build`

2. **Deploy:**
   - [ ] Push para GitHub
   - [ ] Conectar na Vercel
   - [ ] Executar migrações
   - [ ] Testar funcionalidades

3. **Pós-Deploy:**
   - [ ] Configurar domínio (opcional)
   - [ ] Adicionar Google Analytics
   - [ ] Configurar backups
   - [ ] Monitorar erros

---

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Neon Docs**: https://neon.tech/docs

---

## ✅ Você está pronto para produção!

O projeto está bem estruturado e pronto para deploy. Siga os passos acima e em menos de 1 hora seu marketplace estará online! 🚀
