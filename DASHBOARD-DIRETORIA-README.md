# Dashboard Diretoria - DNA Genis

## Visão Geral
Dashboard administrativo consolidado para a diretoria do Grupo Genis visualizar todos os dados dos alunos avaliados no DNA Genis em uma única página.

## Rota de Acesso
```
https://seu-dominio.com/diretoria
```

## Arquivos Criados

### 1. Biblioteca de Agregação de Dados
**Arquivo:** `/src/lib/load-all-students.ts`
- Carrega todos os JSONs dos alunos
- Agrega dados em estruturas consolidadas
- Calcula métricas gerais automaticamente
- Exports:
  - `StudentSummary`: Interface de dados resumidos por aluno
  - `ConsolidatedMetrics`: Interface de métricas consolidadas
  - `loadAllStudentsData()`: Função principal de carregamento

### 2. Utilitários de Categoria
**Arquivo:** `/src/lib/categoria-utils.ts`
- Configuração de cores por categoria
- Mapeamento de labels e estilos
- Exports:
  - `CATEGORIA_CONFIG`: Objeto com configurações de cada categoria
  - `getCategoriaConfig()`: Função para obter configuração por categoria

### 3. Componentes da Diretoria

#### MetricsCards
**Arquivo:** `/src/components/diretoria/MetricsCards.tsx`
- Cards com métricas gerais no topo da página
- Exibe:
  - Total de alunos avaliados
  - Média geral dos scores
  - Média de autoconfiança
  - Distribuição por categoria

#### StudentsTable
**Arquivo:** `/src/components/diretoria/StudentsTable.tsx`
- Tabela completa com todos os alunos
- Colunas ordenáveis (clique no header)
- Cores categorizadas por desempenho
- Link direto para dashboard individual
- Suporta ordenação por:
  - Nome
  - Score Geral
  - Autoconfiança
  - Cada pilar (Oratória, Interpessoal, Intrapessoal, Repertório)
  - Categoria

#### ChartsSection
**Arquivo:** `/src/components/diretoria/ChartsSection.tsx`
- 4 gráficos visuais usando Recharts:
  1. **Distribuição de Scores**: Histograma mostrando ranges de score
  2. **Média dos Pilares**: Barras horizontais com média de cada pilar
  3. **Top 10 Alunos**: Ranking dos 10 melhores scores
  4. **Distribuição por Categoria**: Pizza com proporção de categorias

#### ExportButton
**Arquivo:** `/src/components/diretoria/ExportButton.tsx`
- Botão de exportação CSV
- Gera arquivo com todos os dados dos alunos
- Nome do arquivo: `dna-genis-alunos-YYYY-MM-DD.csv`

### 4. Página Principal
**Arquivo:** `/src/app/diretoria/page.tsx`
- Página Next.js com Server Components
- Carrega todos os dados no build time (SSG)
- Layout responsivo
- Seções:
  - Header com ícone e data de atualização
  - Métricas Gerais (4 cards)
  - Análises Visuais (4 gráficos)
  - Tabela de Alunos (ordenável + exportação)
  - Footer

## Funcionalidades

### 1. Métricas Consolidadas
- Total de alunos: 21
- Score médio geral: Calculado automaticamente
- Score médio de autoconfiança: Calculado automaticamente
- Distribuição por categoria:
  - Crítico
  - A Desenvolver
  - Adequado
  - Forte
  - Excelente

### 2. Visualizações
- Gráficos interativos com tooltips
- Cores consistentes com o design system Genis
- Responsivos (adapta-se a diferentes telas)

### 3. Tabela de Alunos
- Ordenação por qualquer coluna
- Indicadores visuais por categoria
- Links diretos para dashboards individuais
- Formatação de números (1 casa decimal)
- Tratamento de valores nulos (exibe "-")

### 4. Exportação de Dados
- Formato CSV para Excel/Google Sheets
- Inclui todos os dados da tabela
- Nome de arquivo com timestamp

## Design System

### Cores por Categoria
- **Crítico**: Vermelho (`#EF4444`)
- **A Desenvolver**: Laranja (`#F97316`)
- **Adequado**: Amarelo (`#E8D21D`)
- **Forte**: Verde claro (`#4ADE80`)
- **Excelente**: Verde escuro (`#10B981`)

### Cores dos Pilares
- **Oratória**: Azul (`#3B82F6`)
- **Interpessoal**: Verde (`#10B981`)
- **Intrapessoal**: Roxo (`#8B5CF6`)
- **Repertório**: Amarelo Genis (`#E8D21D`)

### Layout
- Max-width: 7xl (1280px)
- Padding horizontal: 6 (24px)
- Gap entre seções: 8 (32px)
- Cards: Glass effect com backdrop blur
- Tipografia: Space Grotesk (display) + Inter (body)

## Performance
- **Build Time**: ~4.3s
- **Geração Estática**: 26 páginas (1 diretoria + 25 alunos individuais)
- **Strategy**: SSG (Static Site Generation)
- **Prerender**: Todos os dados são pré-renderizados no build

## Dados Processados
A página processa 21 alunos com as seguintes informações:
- Score Geral (0-100)
- Score de Autoconfiança (0-100)
- Scores dos 4 pilares:
  - Oratória
  - Interpessoal
  - Intrapessoal
  - Repertório (pode ser null)
- Categoria de desempenho

## Tecnologias Utilizadas
- **Next.js 16** (App Router + RSC)
- **TypeScript** (type-safe)
- **Recharts** (gráficos)
- **Tailwind CSS 4** (estilização)
- **Lucide React** (ícones)
- **Zod** (validação de dados)

## Como Usar

### Desenvolvimento
```bash
npm run dev
# Acesse: http://localhost:3000/diretoria
```

### Build de Produção
```bash
npm run build
npm start
# Acesse: http://localhost:3000/diretoria
```

### Deploy (Vercel)
A página será automaticamente gerada estaticamente no deploy:
```bash
vercel --prod
```

## Acessibilidade
- Navegação por teclado funcional
- Focus states visíveis
- ARIA labels em botões
- Contraste de cores adequado (WCAG AA)
- Tooltips informativos nos gráficos
- Semântica HTML correta

## Segurança
- A rota `/diretoria` não é óbvia para alunos
- Considere adicionar autenticação se necessário
- Dados são server-side rendered (sem exposição de API)

## Manutenção

### Adicionar Novo Aluno
1. Adicione o JSON em `/src/data/alunos/`
2. O dashboard automaticamente detecta e processa
3. Rebuild para atualizar a página estática

### Atualizar Dados de Aluno
1. Edite o JSON correspondente em `/src/data/alunos/`
2. Rebuild para atualizar

### Customizar Métricas
Edite `/src/lib/load-all-students.ts` para adicionar novas métricas à interface `ConsolidatedMetrics`

## Roadmap Futuro
- [ ] Filtros por categoria
- [ ] Busca por nome
- [ ] Comparação entre alunos
- [ ] Exportação em PDF
- [ ] Autenticação/proteção da rota
- [ ] Gráficos de evolução temporal
- [ ] Dashboard mobile otimizado

## Suporte
Para questões sobre o dashboard, entre em contato com o time de desenvolvimento.

---

**Desenvolvido para Grupo Genis**
Dashboard DNA Genis - Análise de Comunicação com IA
