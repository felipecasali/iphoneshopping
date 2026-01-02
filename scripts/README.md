# 🧪 Testes de Geração de PDF

Este diretório contém ferramentas para testar a geração de PDFs de laudos técnicos de forma rápida e automatizada.

## 🎯 Objetivo

Visualizar e validar as melhorias implementadas no design dos laudos técnicos em PDF, testando diferentes cenários de condição de dispositivos.

## 🚀 Métodos de Teste

### Método 1: Interface Web (Recomendado) ⭐

A forma mais fácil e visual de testar:

```bash
npm run dev
```

Depois acesse: **http://localhost:3000/test/pdf**

**Recursos:**
- Interface visual bonita com cards clicáveis
- Gera PDFs com um clique
- Download automático
- Todos os 5 cenários disponíveis
- Botão para gerar todos de uma vez

### Método 2: Via API

Você pode chamar a API diretamente:

```bash
# Gerar PDF excelente
curl http://localhost:3000/api/test/pdf?scenario=excelente -o laudo-excelente.pdf

# Gerar PDF bom
curl http://localhost:3000/api/test/pdf?scenario=bom -o laudo-bom.pdf

# Gerar PDF regular
curl http://localhost:3000/api/test/pdf?scenario=regular -o laudo-regular.pdf

# Gerar PDF ruim
curl http://localhost:3000/api/test/pdf?scenario=ruim -o laudo-ruim.pdf

# Gerar PDF iPad
curl http://localhost:3000/api/test/pdf?scenario=ipad -o laudo-ipad.pdf
```

Ou simplesmente abra no navegador:
- http://localhost:3000/api/test/pdf?scenario=excelente
- http://localhost:3000/api/test/pdf?scenario=bom
- http://localhost:3000/api/test/pdf?scenario=regular
- http://localhost:3000/api/test/pdf?scenario=ruim
- http://localhost:3000/api/test/pdf?scenario=ipad

### Método 3: Script TypeScript

```bash
# Gerar um cenário específico
npm run test:pdf excelente
npm run test:pdf bom
npm run test:pdf regular
npm run test:pdf ruim
npm run test:pdf ipad

# Gerar todos os cenários
npm run test:pdf:all
```

### Método 4: HTML Standalone

Abra diretamente no navegador:
```
scripts/test-pdf-browser.html
```

## 📋 Cenários Disponíveis

### 1. 🟢 Excelente
- **Dispositivo:** iPhone 15 Pro Max
- **Condição:** Perfeito
- **Bateria:** 98%
- **Acessórios:** Todos (caixa, carregador, cabo, fones, nota fiscal)
- **Resultado:** CONFORME
- **Valor Estimado:** ~R$ 5.500

### 2. 🔵 Bom
- **Dispositivo:** iPhone 14 Pro
- **Condição:** Leves marcas de uso
- **Bateria:** 85%
- **Acessórios:** Caixa, cabo
- **Resultado:** CONFORME
- **Valor Estimado:** ~R$ 3.800

### 3. 🟡 Regular
- **Dispositivo:** iPhone 13
- **Condição:** Marcas visíveis
- **Bateria:** 72%
- **Acessórios:** Carregador, cabo
- **Defeitos:** Wi-Fi não funciona
- **Resultado:** CONFORME COM OBSERVAÇÃO
- **Valor Estimado:** ~R$ 2.100

### 4. 🔴 Ruim
- **Dispositivo:** iPhone 12
- **Condição:** Tela trincada, corpo danificado
- **Bateria:** 65%
- **Acessórios:** Nenhum
- **Defeitos:** Touch, Wi-Fi, speakers não funcionam
- **Resultado:** NÃO CONFORME
- **Valor Estimado:** ~R$ 900

### 5. 🟣 iPad
- **Dispositivo:** iPad Pro 11" M4 (2024)
- **Condição:** Perfeito/Leves marcas
- **Bateria:** 94%
- **Acessórios:** Caixa, carregador, cabo, nota fiscal, Apple Pencil, Magic Keyboard
- **Resultado:** CONFORME
- **Valor Estimado:** ~R$ 7.200

## ✨ O que Verificar nos PDFs

### Design Geral
- ✅ Header com gradiente azul (3 tons)
- ✅ Logo "iPhoneShopping" em destaque
- ✅ Badge do tipo de laudo (PREMIUM/STANDARD/BASIC)
- ✅ Número do laudo visível no topo

### QR Code
- ✅ QR code grande (32x32mm) no header
- ✅ Fundo branco com bordas arredondadas
- ✅ Label "Verificar Autenticidade"
- ✅ QR code maior no rodapé (35x35mm)

### Parecer Final
- ✅ Design tipo selo/certificado
- ✅ Fundo colorido baseado no resultado
- ✅ Verde claro para CONFORME
- ✅ Amarelo claro para C/ OBSERVAÇÃO
- ✅ Vermelho claro para NÃO CONFORME
- ✅ Ícone grande (✓, ⚠, ✗)
- ✅ Borda grossa na cor do parecer

### Seções
- ✅ Títulos com fundo azul e bordas arredondadas
- ✅ Emojis para identificação visual (📱, 🔋, ⚙️, 📦, 💰)
- ✅ Cards para informações

### Bateria
- ✅ Gauge circular visual
- ✅ Percentual destacado no centro
- ✅ Status textual inteligente
- ✅ Ciclos estimados
- ✅ Recomendação baseada na saúde

### Funcionalidade
- ✅ Card de pontuação geral (X/8)
- ✅ Badge com percentual
- ✅ Grid de testes com círculos coloridos
- ✅ Verde para aprovado, vermelho para reprovado

### Acessórios
- ✅ Cards visuais com ícones
- ✅ Status "INCLUÍDO" / "NÃO INCLUÍDO"
- ✅ Fundo verde claro / vermelho claro

### 💰 Avaliação Comercial (NOVO)
- ✅ Card destacado em verde
- ✅ Valor estimado em destaque
- ✅ Cálculo baseado em:
  - Modelo do dispositivo
  - Condição física
  - Saúde da bateria
  - Funcionalidades
  - Acessórios inclusos
- ✅ Pontuação geral em círculo azul
- ✅ Recomendações personalizadas

### Rodapé
- ✅ QR code grande (35x35mm)
- ✅ Informações completas de verificação
- ✅ URL, ID do laudo, data/hora
- ✅ Card com contato e suporte
- ✅ Email e website visíveis

## 🎨 Comparação Visual

Para melhor análise, recomendamos:

1. **Gerar todos os cenários** usando `npm run test:pdf:all`
2. **Abrir todos os PDFs** lado a lado
3. **Comparar**:
   - Cores e badges diferentes por condição
   - Valores estimados variando
   - Recomendações personalizadas
   - Layout consistente entre cenários

## 📝 Notas de Desenvolvimento

- Os dados são **mocks** (não vêm do banco de dados)
- As **fotos são null** (não afetam o layout principal)
- O cálculo de valor é **estimativo** (pode ser refinado)
- IDs e números de laudo são **aleatórios**

## 🐛 Troubleshooting

**PDFs não estão sendo baixados?**
- Verifique se o popup blocker está desabilitado
- Tente usar outro navegador
- Verifique o console do navegador para erros

**Erro ao gerar PDF?**
- Certifique-se de que o servidor está rodando (`npm run dev`)
- Verifique se não há erros de compilação
- Limpe o cache do Next.js (`rm -rf .next`)

**Layout quebrado?**
- Verifique se todas as dependências estão instaladas
- Execute `npm install` novamente
- Certifique-se de usar jsPDF 3.0.4 ou superior

## 🔗 Links Úteis

- **Interface Web:** http://localhost:3000/test/pdf
- **API Endpoint:** http://localhost:3000/api/test/pdf
- **Código do Gerador:** `src/lib/pdf-generator.ts`
- **API de Teste:** `src/app/api/test/pdf/route.ts`

## 📊 Métricas de Melhorias

**Antes:**
- Design básico com texto simples
- QR code pequeno (28mm)
- Parecer final sem destaque
- Sem cálculo de valor
- Sem recomendações

**Depois:**
- Design profissional com gradientes e cards
- QR code grande (32mm header + 35mm footer)
- Parecer final estilo selo colorido
- Cálculo inteligente de valor estimado
- Recomendações personalizadas baseadas no score
- Emojis para navegação visual
- Cores dinâmicas baseadas em condições

---

**Desenvolvido com ❤️ para iPhoneShopping**
