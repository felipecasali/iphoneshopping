# Configuração de Envio de E-mails com Resend

## 📧 Visão Geral

O sistema de emails está configurado para enviar notificações automaticamente em 4 situações:

1. **Welcome Email** - Ao criar uma conta
2. **Listing Created** - Ao publicar um anúncio  
3. **Listing Updated** - Ao editar um anúncio
4. **New Message** - Ao receber uma mensagem

## 🚀 Setup Rápido

### 1. Criar Conta no Resend

1. Acesse https://resend.com/
2. Clique em "Sign Up" 
3. Crie sua conta (use o email da sua empresa se possível)
4. Confirme seu email

### 2. Obter API Key

1. Após fazer login, vá em **API Keys** no menu lateral
2. Clique em "Create API Key"
3. Nome: "iPhoneShopping Production"
4. Permissões: "Sending access"
5. Clique em "Create"
6. **⚠️ IMPORTANTE**: Copie a API key imediatamente (só aparece uma vez!)

### 3. Configurar Domínio (Recomendado para Produção)

Para usar seu próprio domínio nos emails (ex: `noreply@iphoneshopping.com.br`):

1. No Resend, vá em **Domains** → "Add Domain"
2. Digite: `iphoneshopping.com.br`
3. Siga as instruções para adicionar os registros DNS:
   - Um registro **TXT** para verificação
   - Um registro **MX** para recebimento (opcional)
   - Registros **CNAME** para autenticação (SPF, DKIM)

#### Exemplo de Registros DNS

```
Tipo: TXT
Nome: _resend
Valor: [valor fornecido pelo Resend]

Tipo: CNAME  
Nome: resend._domainkey
Valor: [valor fornecido pelo Resend]

Tipo: CNAME
Nome: resend2._domainkey
Valor: [valor fornecido pelo Resend]
```

4. Aguarde a verificação (pode levar até 48h, mas geralmente é rápido)

### 4. Configurar Variáveis de Ambiente

#### Desenvolvimento (.env.local)

```env
# Resend API Key
RESEND_API_KEY=re_123456789_seu_token_aqui

# Email remetente (use um verificado no Resend)
EMAIL_FROM=iPhoneShopping <noreply@iphoneshopping.com.br>
```

#### Produção (Vercel)

1. Acesse: https://vercel.com/seu-usuario/iphoneshopping/settings/environment-variables
2. Adicione:
   - **Nome**: `RESEND_API_KEY`
   - **Valor**: Sua API key do Resend
   - **Ambiente**: Production, Preview
   
3. Adicione:
   - **Nome**: `EMAIL_FROM`
   - **Valor**: `iPhoneShopping <noreply@iphoneshopping.com.br>`
   - **Ambiente**: Production, Preview

4. Faça um novo deploy: `git push`

## 🎨 Templates Disponíveis

### 1. Welcome Email
- **Quando**: Ao criar uma conta
- **Para**: Novo usuário
- **Conteúdo**: Boas-vindas + funcionalidades da plataforma

### 2. Listing Created
- **Quando**: Ao publicar um anúncio
- **Para**: Vendedor
- **Conteúdo**: Confirmação + dicas + link para o anúncio

### 3. Listing Updated
- **Quando**: Ao editar um anúncio
- **Para**: Vendedor
- **Conteúdo**: Confirmação da atualização

### 4. New Message
- **Quando**: Ao receber uma mensagem
- **Para**: Destinatário da mensagem
- **Conteúdo**: Preview da mensagem + link para responder

## 🧪 Testar Emails

### Modo Desenvolvimento (sem API key)

Se `RESEND_API_KEY` não estiver configurado, os emails serão simulados no console:

```
📧 Email simulado (RESEND_API_KEY não configurado):
Para: usuario@email.com
Assunto: Bem-vindo ao iPhoneShopping, João! 🎉
```

### Modo Produção (com API key)

1. Crie uma conta de teste
2. Verifique se o email chegou
3. Teste todos os 4 cenários:
   - Criar conta ✅
   - Criar anúncio ✅
   - Editar anúncio ✅
   - Enviar mensagem ✅

## 📊 Monitoramento

### Dashboard do Resend

1. Acesse https://resend.com/emails
2. Veja todos os emails enviados
3. Status: Delivered, Bounced, Complained
4. Abra emails para ver como ficaram renderizados

### Logs

Os emails são logados no console:
- ✅ Email enviado com sucesso: [id]
- ❌ Erro ao enviar email: [erro]

## 💰 Pricing (Free Tier)

O plano gratuito do Resend inclui:
- ✅ **100 emails por dia**
- ✅ **3.000 emails por mês**
- ✅ Domínio personalizado
- ✅ API ilimitada
- ✅ Templates React Email

Perfeito para começar! Depois pode upgradar se necessário.

## 🎨 Personalizar Templates

Os templates estão em `src/emails/`:

```
src/emails/
├── WelcomeEmail.tsx
├── ListingCreatedEmail.tsx
├── ListingUpdatedEmail.tsx
└── NewMessageEmail.tsx
```

Para editar:
1. Abra o arquivo do template
2. Modifique textos, cores, estilos
3. Teste localmente
4. Faça deploy

## 🔧 Troubleshooting

### Email não chega

1. **Verifique o spam/lixo eletrônico**
2. **Confirme a API key** está correta
3. **Veja os logs do Resend** em https://resend.com/emails
4. **Domínio não verificado?** Use `onboarding@resend.dev` temporariamente

### Erro "API key is invalid"

- Verifique se copiou a key completa
- Certifique-se que não há espaços extras
- Recrie a key se necessário

### Domínio não verifica

- Aguarde até 48h para propagação DNS
- Use `nslookup` ou https://mxtoolbox.com/ para verificar registros
- Contate suporte do Resend se persistir

## 📚 Recursos

- **Documentação Resend**: https://resend.com/docs
- **React Email**: https://react.email/docs
- **Exemplos**: https://demo.react.email/

## 🎯 Próximos Passos

1. [ ] Configurar domínio personalizado
2. [ ] Testar todos os emails
3. [ ] Adicionar analytics (opcional)
4. [ ] Criar template de "Anúncio vendido"
5. [ ] Criar template de "Avaliação recebida"
