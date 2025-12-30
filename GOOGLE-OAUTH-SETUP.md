# Configuração do Google OAuth

## Passo 1: Criar um Projeto no Google Cloud Console

1. Acesse https://console.cloud.google.com/
2. Clique em "Select a project" → "New Project"
3. Nome do projeto: "iPhoneShopping" (ou qualquer nome)
4. Clique em "Create"

## Passo 2: Configurar OAuth Consent Screen

1. No menu lateral, vá em "APIs & Services" → "OAuth consent screen"
2. Selecione "External" (para permitir qualquer usuário Gmail)
3. Clique em "Create"
4. Preencha:
   - **App name**: iPhoneShopping
   - **User support email**: seu@email.com
   - **Developer contact**: seu@email.com
5. Clique em "Save and Continue"
6. Em "Scopes", clique em "Add or Remove Scopes"
7. Adicione:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Clique em "Save and Continue"
9. Em "Test users", adicione seu email para testes
10. Clique em "Save and Continue"

## Passo 3: Criar Credenciais OAuth 2.0

1. No menu lateral, vá em "APIs & Services" → "Credentials"
2. Clique em "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Nome: "iPhoneShopping Web Client"
5. **Authorized JavaScript origins**:
   - `http://localhost:3000` (para desenvolvimento)
   - `https://iphoneshopping.vercel.app` (para produção)
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
   - `https://iphoneshopping.vercel.app/api/auth/callback/google` (produção)
7. Clique em "Create"
8. **Copie o Client ID e Client Secret** que aparecerem na tela

## Passo 4: Adicionar ao .env.local

Adicione as credenciais ao arquivo `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id_aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

## Passo 5: Adicionar ao Vercel (Produção)

1. Acesse https://vercel.com/seu-usuario/iphoneshopping/settings/environment-variables
2. Adicione as variáveis:
   - `GOOGLE_CLIENT_ID`: Cole o Client ID
   - `GOOGLE_CLIENT_SECRET`: Cole o Client Secret
3. Selecione "Production" e "Preview"
4. Clique em "Save"
5. Faça um novo deploy (git push) para aplicar as mudanças

## Passo 6: Testar

1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse http://localhost:3000/login
3. Clique em "Continuar com Google"
4. Faça login com sua conta Google
5. Você será redirecionado para o dashboard

## Observações Importantes

- Durante o desenvolvimento, o Google mostrará um aviso "This app isn't verified". Clique em "Advanced" → "Go to iPhoneShopping (unsafe)" para continuar
- Para remover esse aviso em produção, você precisa submeter o app para verificação do Google
- As contas criadas via Google não terão senha (campo password será null)
- O campo `emailVerified` será preenchido automaticamente pelo Google

## Troubleshooting

### Erro: redirect_uri_mismatch
- Verifique se as URLs de redirect no Google Console estão corretas
- Certifique-se de incluir `/api/auth/callback/google` no final

### Erro: invalid_client
- Verifique se o GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos no .env.local

### Usuário não consegue fazer login
- Verifique se o email está nos "Test users" no OAuth consent screen
- Ou publique o app como "In Production" no OAuth consent screen
