# 🔍 Troubleshooting - Sistema de E-mails

## Como Investigar Problemas com E-mails

### 1. Testar o Sistema de E-mails

Acesse esta URL enquanto estiver logado:

```
https://www.iphoneshopping.com.br/api/test-email?type=welcome
```

Tipos disponíveis:
- `?type=welcome` - Email de boas-vindas
- `?type=listing` - Email de anúncio criado
- `?type=message` - Email de nova mensagem

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Email enviado! Verifique sua caixa de entrada (e spam).",
  "details": {
    "type": "welcome",
    "to": "seu@email.com",
    "result": { "success": true, "data": { "id": "..." } },
    "env": {
      "hasApiKey": true,
      "emailFrom": "iPhoneShopping <noreply@iphoneshopping.com.br>"
    }
  }
}
```

### 2. Verificar Logs no Vercel

1. Acesse: https://vercel.com/seu-usuario/iphoneshopping/logs
2. Filtros úteis:
   - Buscar por: `Email`
   - Buscar por: `sendEmail`
   - Buscar por: `RESEND_API_KEY`

**Logs esperados ao criar anúncio:**
```
🎯 Preparando email de anúncio criado...
   Para: usuario@email.com
   Usuário: João Silva
   Anúncio: iPhone 15 Pro Max 256GB
   Preço: R$ 5.999,00
📧 Tentando enviar email...
   Para: usuario@email.com
   Assunto: ✅ Anúncio publicado: iPhone 15 Pro Max 256GB
   RESEND_API_KEY: Configurado (re_xxxxxxx...)
   EMAIL_FROM: iPhoneShopping <noreply@iphoneshopping.com.br>
✉️  Enviando email via Resend...
✅ Email enviado com sucesso!
   ID: re_xxxxx
```

### 3. Checklist de Diagnóstico

#### ✅ Passo 1: Variáveis de Ambiente

Verifique se estão configuradas no Vercel:

```bash
# Acesse:
https://vercel.com/seu-usuario/iphoneshopping/settings/environment-variables

# Deve ter:
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=iPhoneShopping <noreply@iphoneshopping.com.br>
```

**Como verificar:**
- Abra a página de environment variables
- Procure por `RESEND_API_KEY`
- Deve estar em Production e Preview
- Se não existir ou estiver errado, adicione/atualize

#### ✅ Passo 2: API Key Válida

1. Acesse: https://resend.com/api-keys
2. Verifique se a key existe e está ativa
3. Se necessário, crie uma nova:
   - Nome: "iPhoneShopping Production"
   - Permissões: "Sending access"
   - Copie a key (só aparece uma vez!)

#### ✅ Passo 3: Domínio Verificado

1. Acesse: https://resend.com/domains
2. Verifique se `iphoneshopping.com.br` está:
   - ✅ Verified (verde)
   - ❌ Pending (amarelo) - aguarde verificação DNS
   - ❌ Failed (vermelho) - verifique DNS

**Se não estiver verificado:**
- Use temporariamente: `onboarding@resend.dev`
- Configure `EMAIL_FROM=iPhoneShopping <onboarding@resend.dev>`

#### ✅ Passo 4: Redeploy

Após alterar variáveis de ambiente:

1. Vá em: https://vercel.com/seu-usuario/iphoneshopping/deployments
2. Clique nos "..." do último deploy
3. Clique em "Redeploy"
4. OU faça: `git commit --allow-empty -m "Trigger redeploy" && git push`

### 4. Problemas Comuns

#### 🔴 "Email simulado - RESEND_API_KEY não configurado"

**Causa:** Variável de ambiente não está configurada

**Solução:**
1. Adicione `RESEND_API_KEY` no Vercel
2. Faça redeploy
3. Teste novamente

#### 🔴 "Error: Missing API key"

**Causa:** API key inválida ou vazia

**Solução:**
1. Verifique se não há espaços extras na key
2. Certifique-se que começa com `re_`
3. Crie uma nova key se necessário

#### 🔴 "Error: Domain not verified"

**Causa:** Domínio não verificado no Resend

**Solução temporária:**
```env
EMAIL_FROM=iPhoneShopping <onboarding@resend.dev>
```

**Solução permanente:**
1. Verifique DNS do domínio
2. Aguarde até 48h para propagação
3. Re-verifique no Resend

#### 🔴 Email vai para SPAM

**Causa:** Domínio não configurado corretamente

**Solução:**
1. Configure SPF, DKIM e DMARC
2. Use domínio verificado
3. Não use palavras como "free", "grátis" excessivamente
4. Peça aos usuários para adicionar aos contatos

#### 🔴 "Rate limit exceeded"

**Causa:** Excedeu limite do plano free (100/dia)

**Solução:**
1. Verifique quantos emails foram enviados hoje
2. Aguarde reset (meia-noite UTC)
3. Considere upgrade do plano

### 5. Teste Passo a Passo

#### Teste 1: API Key configurada?

```bash
# No terminal local:
vercel env pull

# Verifique se tem RESEND_API_KEY no arquivo
cat .env.local | grep RESEND
```

#### Teste 2: Resend funcionando?

```bash
# Teste direto com curl:
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer SUA_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "seu@email.com",
    "subject": "Teste",
    "html": "<p>Teste de email</p>"
  }'
```

#### Teste 3: Endpoint de teste

```bash
# Faça login no site e acesse:
https://www.iphoneshopping.com.br/api/test-email?type=welcome
```

#### Teste 4: Criar anúncio real

1. Faça login
2. Crie um anúncio
3. Verifique logs no Vercel
4. Verifique email (e spam!)

### 6. Dashboard do Resend

Acesse: https://resend.com/emails

Aqui você pode:
- ✅ Ver todos os emails enviados
- ✅ Status de cada email (Delivered, Bounced, etc)
- ✅ Preview de como o email ficou
- ✅ Logs de erro detalhados
- ✅ Analytics de taxa de abertura

### 7. Comandos Úteis

```bash
# Verificar variáveis de ambiente no Vercel
vercel env ls

# Puxar variáveis para .env.local
vercel env pull

# Ver logs em tempo real
vercel logs --follow

# Forçar redeploy
vercel --prod --force
```

### 8. Contato com Suporte

Se nada funcionar:

**Resend Support:**
- Email: support@resend.com
- Docs: https://resend.com/docs
- Discord: https://resend.com/discord

**Informações úteis para reportar:**
- API Key ID (não a key completa!)
- Timestamp do erro
- Email ID (se disponível)
- Logs completos do erro

### 9. Checklist Final

Antes de reportar um problema:

- [ ] API key configurada no Vercel?
- [ ] Variável EMAIL_FROM configurada?
- [ ] Deploy feito após configurar variáveis?
- [ ] Domínio verificado ou usando onboarding@resend.dev?
- [ ] Verificou a pasta de spam?
- [ ] Verificou os logs no Vercel?
- [ ] Verificou o dashboard do Resend?
- [ ] Testou a rota /api/test-email?
- [ ] Aguardou 5-10 minutos para propagação?

### 10. Exemplo de Configuração Correta

**Vercel Environment Variables:**
```
RESEND_API_KEY=re_123abc456def789ghi
EMAIL_FROM=iPhoneShopping <noreply@iphoneshopping.com.br>
```

**Resend Dashboard:**
- Domain: iphoneshopping.com.br ✅ Verified
- API Key: Active, Sending access
- Emails sent today: 15/100

**Expected Behavior:**
1. Usuário cria anúncio → Email enviado em ~2 segundos
2. Log: "✅ Email enviado com sucesso! ID: re_xxxxx"
3. Email aparece na caixa de entrada em ~5 segundos
4. Dashboard Resend: Status "Delivered"
