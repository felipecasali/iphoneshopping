# Dashboard Administrativo - iPhoneShopping

## Acesso ao Dashboard

URL: `/admin/dashboard`

## Como Criar o Primeiro Admin

Após a implementação, você precisa definir um usuário como admin manualmente no banco de dados:

### Opção 1: Via Prisma Studio (Recomendado)

```bash
npx prisma studio
```

1. Abra o Prisma Studio
2. Vá para a tabela `users`
3. Encontre seu usuário
4. Edite o campo `role` de `"USER"` para `"ADMIN"`
5. Salve

### Opção 2: Via SQL Direto

Execute no seu banco de dados PostgreSQL (Neon):

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'seu-email@exemplo.com';
```

### Opção 3: Via Script Node.js

Crie um arquivo temporário `scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('❌ Forneça um email: npm run create-admin seu@email.com')
    process.exit(1)
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  })

  console.log('✅ Usuário promovido a ADMIN:', user.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Execute:
```bash
npx tsx scripts/create-admin.ts seu@email.com
```

## Roles Disponíveis

- `USER` (padrão): Usuário comum
- `ADMIN`: Acesso total ao dashboard e gerenciamento
- `MODERATOR`: Futuro - moderação de conteúdo

## Funcionalidades do Dashboard

### 1. Dashboard Principal (`/admin/dashboard`)
#### Métricas Principais
- Total de usuários
- Total de avaliações
- Total de laudos técnicos
- Total de anúncios

#### Crescimento (30 dias)
- Novos usuários
- Novas avaliações
- Novos laudos
- Novos anúncios
- Percentual de crescimento comparado ao mês anterior

#### Funil de Conversão
- Taxa de conversão: Avaliação → Laudo
- Taxa de conversão: Laudo → Anúncio
- Taxa de conversão: Avaliação → Anúncio

#### Atividades Recentes
- 5 últimos usuários cadastrados
- 5 últimas avaliações
- 5 últimos laudos técnicos
- 5 últimos anúncios

### 2. Gestão de Usuários (`/admin/users`) ✅ IMPLEMENTADO

#### Lista de Usuários
- Tabela com todos os usuários do sistema
- Busca por nome ou email
- Filtros:
  - Por role (USER, MODERATOR, ADMIN)
  - Por status (ACTIVE, BANNED)
- Paginação (10 usuários por página)

#### Informações Exibidas
- Avatar e nome
- Email e telefone
- Role (com badge colorido)
- Status (Ativo/Banido)
- Contadores de atividade:
  - Número de anúncios
  - Número de laudos técnicos
  - Número de avaliações
- Data de cadastro

#### Ações Disponíveis
- **Ver Detalhes**: Abre página com informações completas
- **Banir/Ativar**: Bloqueia ou libera acesso do usuário
- **Promover a Admin**: Concede permissões administrativas

#### Detalhes do Usuário (`/admin/users/[id]`)
- Informações completas de contato
- Estatísticas de atividade
- Lista de anúncios recentes (últimos 5)
- Lista de laudos técnicos (últimos 5)
- Botões de ação:
  - Banir/Ativar usuário
  - Promover a Admin
  - Alterar role

#### Proteção de Acesso
- Usuários banidos não conseguem fazer login
- Validação no callback `signIn` do NextAuth
- Mensagem de erro automática ao tentar acessar

### 3. Moderação de Anúncios ⏳ PENDENTE
- Listar anúncios pendentes de aprovação
- Aprovar ou rejeitar anúncios
- Destacar anúncios na página principal
- Remover anúncios por violação de políticas

### 4. Gestão de Laudos ⏳ PENDENTE
- Listar todos os laudos técnicos
- Validar ou invalidar laudos
- Ver detalhes completos de cada laudo
- Histórico de alterações

### 5. Logs de Atividades ⏳ PENDENTE
- Registro de ações importantes
- Filtros por tipo de ação e usuário
- Busca por período
- Exportação de logs

## Segurança

O dashboard é protegido por:

1. **Autenticação NextAuth**: Requer login
2. **Verificação de Role**: Apenas usuários com `role = "ADMIN"` podem acessar
3. **Redirecionamento automático**: Usuários não-admin são redirecionados para home

## Próximas Melhorias Sugeridas

### Fase 2 - Gerenciamento
- [ ] Lista completa de usuários com ações (banir, promover)
- [ ] Moderação de anúncios (aprovar, rejeitar, destacar)
- [ ] Validação manual de laudos
- [ ] Sistema de denúncias

### Fase 3 - Analytics Avançado
- [ ] Gráficos de tendência (Chart.js ou Recharts)
- [ ] Análise de preços médios
- [ ] Tempo médio de venda
- [ ] Dispositivos mais vendidos
- [ ] Exportar relatórios (CSV/PDF)

### Fase 4 - Automações
- [ ] Alertas por email para atividades suspeitas
- [ ] Relatórios semanais/mensais automáticos
- [ ] Sistema de notificações in-app
- [ ] Logs de auditoria

### Fase 5 - Integrações
- [ ] Integração com Google Analytics (eventos customizados)
- [ ] Webhooks para eventos importantes
- [ ] API de estatísticas públicas

## Monitoramento Externo (Recomendado)

Para análise mais profunda, considere integrar:

1. **Mixpanel** ou **Amplitude**: Analytics comportamental
2. **Sentry**: Monitoramento de erros
3. **LogRocket**: Session replay e debugging
4. **Vercel Analytics**: Performance e Web Vitals

## Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com o desenvolvedor.
