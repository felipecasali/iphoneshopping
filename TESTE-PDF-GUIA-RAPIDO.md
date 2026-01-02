# 🚀 Guia Rápido: Como Testar os PDFs

## Método Mais Fácil (Recomendado) ⭐

### 1. Iniciar o servidor
```bash
npm run dev
```

### 2. Abrir no navegador
```
http://localhost:3000/test/pdf
```

### 3. Clicar nos cards
- 📱 **Excelente** → iPhone 15 Pro Max perfeito
- 📱 **Bom** → iPhone 14 Pro com leves marcas
- 📱 **Regular** → iPhone 13 com marcas visíveis
- 📱 **Ruim** → iPhone 12 trincado/danificado
- 📱 **iPad** → iPad Pro 11" com Pencil + Keyboard

### 4. Pronto! 🎉
O PDF baixa automaticamente

---

## Método Alternativo: Link Direto

Após `npm run dev`, abra no navegador:

```
http://localhost:3000/api/test/pdf?scenario=excelente
http://localhost:3000/api/test/pdf?scenario=bom
http://localhost:3000/api/test/pdf?scenario=regular
http://localhost:3000/api/test/pdf?scenario=ruim
http://localhost:3000/api/test/pdf?scenario=ipad
```

---

## O que você vai ver nos PDFs:

### ✨ Design Novo
- Header com gradiente azul profissional
- Badge colorido do tipo de laudo
- QR code grande e visível
- Parecer final estilo selo/certificado

### 🔋 Seção de Bateria
- Gauge circular visual (tipo velocímetro)
- Status inteligente (Excelente/Boa/Requer atenção)
- Ciclos estimados

### 💰 Valor Estimado (NOVO!)
- Cálculo automático baseado em:
  - Modelo do aparelho
  - Condição física
  - Bateria
  - Funcionalidades
  - Acessórios
- Recomendações personalizadas
- Score geral em círculo

### ⚙️ Funcionalidade
- Pontuação X/8 em destaque
- Percentual aprovado
- Grid visual com círculos coloridos

### 📦 Acessórios
- Cards visuais
- Ícones e status colorido
- Fundo verde/vermelho

---

## Dica Pro 💡

Gere todos de uma vez clicando em **"Gerar Todos os Cenários"** e compare:
- Como o valor muda baseado na condição
- As diferentes recomendações
- Os pareceres finais (verde/amarelo/vermelho)
- Os scores gerais

---

## Resolução de Problemas

**Não baixa o PDF?**
→ Desabilite o bloqueador de popup

**Erro na página?**
→ Execute `npm install` e tente novamente

**Servidor não inicia?**
→ Verifique se a porta 3000 está livre

---

**Tudo pronto! Basta rodar `npm run dev` e acessar `/test/pdf` 🚀**
