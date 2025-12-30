# 🚀 Deploy Rápido - 30 minutos

## Passo 1: Preparar Banco PostgreSQL (5 min)

### Opção mais simples - Neon (Recomendado):

1. Acesse: https://console.neon.tech/signup
2. Crie uma conta (pode usar GitHub)
3. Clique em "Create Project"
4. Nome: `iphoneshopping`
5. Região: escolha mais próxima
6. **Copie a connection string** que aparece

Exemplo:
```
postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```
psql 'postgresql://neondb_owner:npg_5IMjL7yZuBQR@ep-shy-haze-ahnaqo4o-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
---

## Passo 2: Gerar Secret do NextAuth (1 min)

Execute no terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Ou use: https://generate-secret.vercel.app/32

---

## Passo 3: Deploy na Vercel (10 min)

1. **Criar repositório GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Deploy inicial"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/iphoneshopping.git
   git push -u origin main
   ```

2. **Fazer deploy:**
   - Acesse: https://vercel.com/new
   - Login com GitHub
   - Clique em "Import Project"
   - Selecione seu repositório `iphoneshopping`
   - Clique em "Import"

3. **Configurar variáveis de ambiente:**
   
   Na página de import, adicione:
   
   ```
   DATABASE_URL = [cole sua connection string do Neon aqui]
   NEXTAUTH_URL = https://SEU-APP.vercel.app
   NEXTAUTH_SECRET = [cole o secret gerado aqui]
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = [seu cloud name]
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = iphoneshopping_preset
   CLOUDINARY_API_KEY = [sua api key]
   CLOUDINARY_API_SECRET = [sua api secret]
   ```

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde 2-3 minutos

---

## Passo 4: Executar Migrações (5 min)

Depois que o deploy terminar:

1. **Instalar Vercel CLI (se ainda não tem):**
   ```bash
   npm i -g vercel
   ```

   **⚠️ IMPORTANTE (Windows/PowerShell):**
   
   Se o comando `vercel` não for reconhecido após a instalação:
   
   ```powershell
   # Opção 1: Adicionar ao PATH temporariamente (nesta sessão)
   $env:Path += ";$env:APPDATA\npm"
   
   # Opção 2: Adicionar permanentemente (recomendado)
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:APPDATA\npm", [EnvironmentVariableTarget]::User)
   
   # Depois feche e reabra o PowerShell
   ```
   
   Ou simplesmente use o caminho completo:
   ```powershell
   & "$env:APPDATA\npm\vercel.cmd" --version
   ```

2. **Fazer login:**
   ```bash
   vercel login
   ```

3. **Conectar ao projeto na Vercel:**
   ```bash
   vercel link
   ```
   
   Responda as perguntas:
   - `Set up and deploy "..."?` → **N** (não queremos fazer deploy agora)
   - `Link to existing project?` → **Y**
   - Selecione seu projeto da lista
   - `Link to it?` → **Y**

4. **Puxar variáveis de ambiente:**
   ```bash
   vercel env pull
   ```

5. **Atualizar schema.prisma:**
   
   Abra `prisma/schema.prisma` e mude:
   ```prisma
   datasource db {
     provider = "postgresql"  // Mude de "sqlite" para "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

6. **Executar migrações:**
   ```bash
   npx prisma migrate deploy
   ```

7. **Commit e push:**
   ```bash
   git add .
   git commit -m "Migrar para PostgreSQL"
   git push
   ```

---

## Passo 5: Testar! (5 min)

1. Acesse sua URL: `https://seu-app.vercel.app`
2. Crie uma conta
3. Avalie um iPhone
4. Crie um anúncio
5. Envie uma mensagem

✅ **Pronto! Seu marketplace está no ar!** 🎉

---

## 🐛 Problemas Comuns

### Comando 'vercel' não encontrado (Windows)
**Solução rápida:**
```powershell
# Execute este comando e tente novamente
$env:Path += ";$env:APPDATA\npm"
vercel --version
```

**Solução permanente:**
```powershell
# Adiciona ao PATH permanentemente
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:APPDATA\npm", [EnvironmentVariableTarget]::User)

# Feche e reabra o PowerShell
```

**Alternativa:**
Use o caminho completo sempre:
```powershell
& "$env:APPDATA\npm\vercel.cmd" login
& "$env:APPDATA\npm\vercel.cmd" env pull
```

### Erro de build
- Execute `npm run build` localmente
- Corrija erros TypeScript
- Push novamente

### Erro de conexão com banco
- Verifique se copiou a connection string correta
- Adicione `?sslmode=require` no final da URL
- Teste localmente com a mesma URL

### Imagens não carregam
- Verifique as credenciais do Cloudinary
- Confirme que next.config.js tem `res.cloudinary.com`

---

## 📝 Depois do Deploy

### Melhorias imediatas:
- [ ] Configurar domínio personalizado
- [ ] Adicionar Google Analytics
- [ ] Testar em dispositivos móveis
- [ ] Compartilhar com amigos para feedback

### Próximos passos:
- [ ] Adicionar mais modelos de dispositivos
- [ ] Implementar sistema de avaliações
- [ ] Criar sistema de transações
- [ ] Adicionar notificações por email

---

## 💡 Dica

Configure auto-deploy: toda vez que você fizer `git push`, a Vercel fará deploy automático!

Qualquer dúvida, consulte o [DEPLOY.md](DEPLOY.md) para o guia completo.
