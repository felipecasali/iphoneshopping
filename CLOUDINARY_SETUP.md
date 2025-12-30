# Configuração do Cloudinary para Upload de Imagens

Este guia explica como configurar o Cloudinary para o upload de imagens dos anúncios.

## Por que Cloudinary?

- **Gratuito**: Plano gratuito com 25GB de armazenamento
- **CDN Global**: Entrega rápida de imagens
- **Otimização Automática**: Compressão e transformação de imagens
- **Upload Direto**: Upload direto do navegador (sem passar pelo servidor)
- **Transformações**: Redimensionar, recortar, aplicar filtros automaticamente

## Passo a Passo

### 1. Criar Conta no Cloudinary

1. Acesse [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Preencha o formulário de registro
3. Confirme seu email
4. Faça login no dashboard

### 2. Obter as Credenciais

No dashboard do Cloudinary:

1. Na página inicial, você verá o **Dashboard**
2. Anote as seguintes informações:
   - **Cloud Name**: aparece logo no topo
   - **API Key**: aparece no card "Account Details"
   - **API Secret**: clique em "Reveal" para visualizar

### 3. Criar um Upload Preset

Um Upload Preset é uma configuração que define como as imagens serão processadas:

1. No menu lateral, vá em **Settings** (ícone de engrenagem)
2. Clique na aba **Upload**
3. Role até a seção **Upload presets**
4. Clique em **Add upload preset**
5. Configure da seguinte forma:
   - **Preset name**: `iphoneshopping_preset` (ou outro nome de sua preferência)
   - **Signing Mode**: Selecione **Unsigned** (permite upload sem autenticação)
   - **Folder**: `iphoneshopping` (opcional, organiza as imagens em uma pasta)
   - **Allowed formats**: `jpg, png, webp`
   - **Transformation**: 
     - Width: `1200`
     - Height: `1200`
     - Crop: `limit` (mantém proporção, não ultrapassa limites)
     - Quality: `auto`
     - Format: `auto`
6. Clique em **Save**

### 4. Adicionar as Credenciais ao Projeto

1. Abra o arquivo `.env` na raiz do projeto
2. Adicione as seguintes variáveis:

```env
# Cloudinary (Upload de Imagens)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="seu-cloud-name-aqui"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="iphoneshopping_preset"
CLOUDINARY_API_KEY="sua-api-key-aqui"
CLOUDINARY_API_SECRET="sua-api-secret-aqui"
```

**Importante**: Substitua os valores pelos dados reais do seu dashboard.

### 5. Testar o Upload

1. Reinicie o servidor Next.js (se estiver rodando):
   ```bash
   npm run dev
   ```

2. Acesse o sistema e faça login
3. Vá para a página de criar anúncio
4. Clique na área de upload de imagens
5. Selecione uma imagem e faça o upload
6. Você deve ver a imagem aparecer na preview

## Configurações Avançadas (Opcional)

### Otimização de Imagens

O Cloudinary permite transformar imagens automaticamente. Exemplos:

```typescript
// Imagem com largura máxima de 800px
https://res.cloudinary.com/{cloud_name}/image/upload/w_800,c_limit/{public_id}

// Thumbnail quadrado de 200x200px
https://res.cloudinary.com/{cloud_name}/image/upload/w_200,h_200,c_fill/{public_id}

// Imagem com qualidade reduzida (carregamento mais rápido)
https://res.cloudinary.com/{cloud_name}/image/upload/q_auto:low/{public_id}
```

### Limites do Plano Gratuito

- **Armazenamento**: 25GB
- **Largura de banda**: 25GB/mês
- **Transformações**: 25.000/mês
- **Créditos**: Suficiente para um projeto médio

Para um marketplace de iPhones, o plano gratuito deve ser suficiente no início.

## Troubleshooting

### Erro: "Upload preset not found"

- Verifique se o nome do preset está correto
- Certifique-se de que o preset está configurado como **Unsigned**

### Erro: "Invalid signature"

- Isso acontece quando o preset é **Signed**
- Mude para **Unsigned** ou implemente assinatura no backend

### Imagens não aparecem

- Verifique se o Cloud Name está correto
- Abra o console do navegador (F12) para ver erros
- Confirme que as URLs retornadas pelo Cloudinary estão acessíveis

### Upload muito lento

- O Cloudinary tem CDN global, mas o upload depende da internet
- Considere adicionar validação de tamanho máximo (já configurado: 5MB)

## Recursos Adicionais

- [Documentação Oficial](https://cloudinary.com/documentation)
- [Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Next.js Integration](https://next.cloudinary.dev/)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

## Suporte

Em caso de problemas, consulte:
- [Cloudinary Support](https://support.cloudinary.com/)
- [Community Forum](https://community.cloudinary.com/)
