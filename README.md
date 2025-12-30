# iPhoneShopping - Marketplace de iPhones e iPads

Marketplace especializado na avaliação e venda de iPhones e iPads no Brasil.

## 🚀 Funcionalidades

- ✅ Sistema avançado de avaliação de aparelhos (step-by-step)
- ✅ Cálculo automático de valor de mercado
- ✅ Cadastro gratuito de anúncios
- ✅ Sistema de mensagens seguro entre compradores e vendedores
- ✅ Autenticação com NextAuth
- ✅ Interface moderna e responsiva

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **NextAuth** - Autenticação
- **Tailwind CSS** - Estilização
- **PostgreSQL** - Banco de dados

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
- DATABASE_URL: URL do PostgreSQL
- NEXTAUTH_SECRET: Gere com `openssl rand -base64 32`
- NEXTAUTH_URL: URL da aplicação (http://localhost:3000 em dev)

4. Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

5. (Opcional) Popule o banco com dispositivos:

```bash
npx prisma db seed
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse http://localhost:3000

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app/                 # Páginas e rotas da aplicação
│   │   ├── api/            # API Routes
│   │   │   ├── auth/       # Autenticação
│   │   │   ├── evaluate/   # Avaliação de aparelhos
│   │   │   ├── listings/   # Anúncios
│   │   │   └── messages/   # Mensagens
│   │   ├── login/          # Página de login
│   │   ├── register/       # Página de registro
│   │   └── page.tsx        # Home page
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                # Utilitários e configurações
│   │   ├── prisma.ts       # Cliente Prisma
│   │   ├── auth.ts         # Configuração NextAuth
│   │   └── device-pricing.ts # Sistema de precificação
│   └── types/              # Tipos TypeScript
├── prisma/
│   └── schema.prisma       # Schema do banco de dados
└── public/                 # Arquivos estáticos
```

## 💾 Banco de Dados

O projeto usa PostgreSQL com Prisma ORM. O schema inclui:

- **User**: Usuários da plataforma
- **Device**: Dispositivos Apple (iPhones e iPads)
- **Listing**: Anúncios de venda
- **Message**: Mensagens entre usuários
- **Transaction**: Transações de compra/venda
- **Rating**: Avaliações de usuários

## 🎯 Sistema de Avaliação

O sistema de avaliação considera:

1. **Modelo e armazenamento** do dispositivo
2. **Condição geral** (Novo, Excelente, Muito Bom, Bom, Regular, Com Defeito)
3. **Acessórios inclusos** (caixa, carregador, fones)
4. **Saúde da bateria** (para iPhones)
5. **Condição da tela e corpo**
6. **Danos por água**
7. **Status do iCloud** (deve estar desbloqueado)

## 🔐 Segurança

- Autenticação com NextAuth e bcrypt
- Senhas criptografadas
- Validação de dados com Zod
- Sistema de mensagens seguro
- Proteção contra iCloud bloqueado

## 📱 Próximas Funcionalidades

- [ ] Sistema de pagamento integrado
- [ ] Upload de imagens
- [ ] Notificações em tempo real
- [ ] Sistema de avaliações (reviews)
- [ ] Painel administrativo
- [ ] App mobile (React Native)
- [ ] Integração com correios para rastreamento

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é privado e não possui licença open source.

## 📧 Contato

- Email: contato@iphoneshopping.com.br
- Site: https://iphoneshopping.com.br
