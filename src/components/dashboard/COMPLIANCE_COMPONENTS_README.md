# Compliance Components - DNA Genis Dashboard

Componentes UI premium para exibir e validar compliance de indicadores no Dashboard DNA Genis.

## Componentes

### 1. CoreIndicatorsBadge

Badge compacto que exibe status dos 8 indicadores CORE obrigatórios.

**Estados:**
- `Core: 8/8 ✓` - Completo (verde)
- `Core: 6/8 ⚠` - Incompleto (amarelo)

**Features:**
- Tooltip automático no hover com lista de indicadores ausentes
- Animação sutil de scale no hover
- ARIA labels para acessibilidade
- Design responsivo mobile-first

**Props:**
```typescript
interface CoreIndicatorsBadgeProps {
  analysis: DnaGenisAnalysis;      // Análise DNA Genis completa
  className?: string;               // Classes CSS customizadas
  showTooltip?: boolean;            // Exibir tooltip (padrão: true)
}
```

**Exemplo:**
```tsx
import { CoreIndicatorsBadge } from '@/components/dashboard';

<CoreIndicatorsBadge
  analysis={dnaAnalysis}
  showTooltip
/>
```

**Localização:**
`/src/components/dashboard/CoreIndicatorsBadge.tsx`

---

### 2. ComplianceStatus

Badge visual com 3 estados de compliance geral.

**Estados:**
- 🟢 Verde (`compliant`): 100% compliant - todos core + categoria correta
- 🟡 Amarelo (`partial`): Parcialmente compliant - faltam alguns core
- 🔴 Vermelho (`critical`): Crítico - faltam muitos core ou erros graves

**Critérios de validação:**
1. Todos os 8 indicadores CORE devem estar presentes
2. Categoria deve corresponder ao range de score
3. Score deve estar entre 0-100

**Features:**
- Animação de pulse para estado crítico
- Dot indicator animado
- ARIA labels descritivos
- Hover scale animation

**Props:**
```typescript
interface ComplianceStatusProps {
  analysis: DnaGenisAnalysis;
  className?: string;
}
```

**Exemplo:**
```tsx
import { ComplianceStatus } from '@/components/dashboard';

<ComplianceStatus analysis={dnaAnalysis} />
```

**Localização:**
`/src/components/dashboard/ComplianceStatus.tsx`

---

### 3. IndicatorSummary

Card resumo detalhado com breakdown completo de indicadores.

**Exibe:**
- Core indicators: X/8 com status visual
- Indicadores Flexíveis: Y/8 com contador
- Lista opcional de flexíveis presentes
- Status geral (Completo/Incompleto)

**Features:**
- Glassmorphism design premium
- Hover lift + glow effects
- Animações sequenciais no carregamento
- Layout responsivo com grid
- Collapsible list de indicadores flexíveis

**Props:**
```typescript
interface IndicatorSummaryProps {
  analysis: DnaGenisAnalysis;
  className?: string;
  showFlexibleList?: boolean;    // Exibir lista de flexíveis (padrão: false)
}
```

**Exemplo:**
```tsx
import { IndicatorSummary } from '@/components/dashboard';

<IndicatorSummary
  analysis={dnaAnalysis}
  showFlexibleList
/>
```

**Localização:**
`/src/components/dashboard/IndicatorSummary.tsx`

---

### 4. HeroScore (Modificado)

Componente principal de score agora integrado com badges de compliance.

**Novos Props:**
```typescript
interface HeroScoreProps {
  // ... props existentes
  analysis?: DnaGenisAnalysis;        // Análise completa (opcional)
  showComplianceBadges?: boolean;     // Exibir badges (padrão: true)
}
```

**Exemplo:**
```tsx
import { HeroScore } from '@/components/dashboard';

<HeroScore
  score={78.5}
  userName="João Silva"
  analysisNumber={3}
  autoconfianca={82.0}
  analysisDate="06/12/2025"
  analysis={dnaAnalysis}           // Novo: análise completa
  showComplianceBadges             // Novo: ativa badges
/>
```

**Localização:**
`/src/components/dashboard/HeroScore.tsx`

---

## Utilities do Zod Schema

Os componentes utilizam as seguintes utilities de `/src/lib/zod-student.ts`:

### `checkCoreIndicators(analysis)`
```typescript
{
  valid: boolean;      // true se todos os 8 core presentes
  missing: string[];   // Array de códigos ausentes
  present: string[];   // Array de códigos presentes
}
```

### `getIndicadoresFlexiveis(analysis)`
```typescript
{
  presentes: string[];  // Códigos dos flexíveis presentes
  ausentes: string[];   // Códigos dos flexíveis ausentes
  total: number;        // Contagem de presentes
}
```

### Constantes
```typescript
INDICADORES_CORE = [
  'FLUENCIA', 'DICCAO', 'MODULACAO_VOZ', 'LINGUAGEM_NAO_VERBAL',
  'PERSUASAO', 'ADAPTABILIDADE', 'LIDERANCA', 'CRIATIVIDADE'
]

INDICADORES_FLEXIVEIS = [
  'RITMO', 'DIDATICA', 'AUTOCONFIANCA', 'REPERTORIO_GERAL',
  'STORYTELLING', 'ASSERTIVIDADE', 'MARKETING_PESSOAL', 'GRAMATICA'
]
```

---

## Design System

### Cores (CVA Variants)

**CoreIndicatorsBadge:**
```css
complete: 'bg-emerald-50 text-emerald-800 border-emerald-200'
incomplete: 'bg-amber-50 text-amber-800 border-amber-200'
```

**ComplianceStatus:**
```css
compliant: 'bg-emerald-50 text-emerald-800 border-emerald-200'
partial: 'bg-amber-50 text-amber-800 border-amber-200'
critical: 'bg-red-50 text-red-800 border-red-200'
```

### Animações (Framer Motion)

**Badge Hover:**
```typescript
whileHover={{ scale: 1.05 }}
transition={{ type: 'spring', stiffness: 400, damping: 20 }}
```

**Tooltip Enter/Exit:**
```typescript
initial={{ opacity: 0, y: 10, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 10, scale: 0.95 }}
```

**Critical Pulse:**
```typescript
animate={{ opacity: [1, 0.8, 1] }}
transition={{ duration: 2, repeat: Infinity }}
```

---

## Acessibilidade (WCAG AA)

### ARIA Labels
Todos os componentes incluem labels descritivos:

```tsx
// CoreIndicatorsBadge
<div role="status" aria-label="Todos os 8 indicadores core presentes">

// ComplianceStatus
<div role="status" aria-label="Status de conformidade: Completo">

// IndicatorSummary
<div role="region" aria-label="Resumo de indicadores DNA Genis">
```

### Keyboard Navigation
- Todos os elementos interativos são keyboard-accessible
- Tooltips aparecem no hover E no focus
- Tab order lógico e sequencial

### Color Contrast
- Todas as combinações de texto/background atendem WCAG AA
- Ícones complementam informação de cor
- Estados visuais múltiplos (cor + ícone + texto)

---

## Performance

### GPU Acceleration
Animações usam apenas propriedades aceleradas:
- `transform` (scale, translate)
- `opacity`
- `filter` (blur)

### Conditional Rendering
```tsx
{showComplianceBadges && analysis && (
  <CoreIndicatorsBadge analysis={analysis} />
)}
```

### Memoization Opportunities
```typescript
// Para listas grandes, adicionar:
export const CoreIndicatorsBadge = React.memo(CoreIndicatorsBadgeComponent);

// Ou usar useMemo para cálculos:
const coreStatus = useMemo(
  () => checkCoreIndicators(analysis),
  [analysis]
);
```

---

## Testes

Arquivo de testes: `__tests__/compliance.test.tsx`

**Cobertura:**
- Renderização condicional de estados
- Interação com tooltip (hover)
- Validação de ARIA labels
- Cálculo correto de compliance

**Executar:**
```bash
npm test -- compliance.test.tsx
```

---

## Layouts Recomendados

### Layout 1: Hero + Summary Card
```tsx
<div className="space-y-8">
  <HeroScore
    {...props}
    analysis={analysis}
    showComplianceBadges
  />

  <IndicatorSummary
    analysis={analysis}
    showFlexibleList
  />
</div>
```

### Layout 2: Grid com Badges Standalone
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <CoreIndicatorsBadge analysis={analysis} />
  <ComplianceStatus analysis={analysis} />
  <div>Total: {analysis.indicadores.length}</div>
</div>
```

### Layout 3: Inline Badges (compact)
```tsx
<div className="flex items-center gap-3">
  <span className="text-neutral-600">Status:</span>
  <CoreIndicatorsBadge analysis={analysis} />
  <ComplianceStatus analysis={analysis} />
</div>
```

---

## Exemplo Completo

Ver arquivo: `/src/components/dashboard/ComplianceExample.tsx`

```tsx
import { ComplianceExample } from '@/components/dashboard/ComplianceExample';

function DashboardPage() {
  const analysis = useDnaAnalysis(); // seu hook de dados

  return <ComplianceExample analysis={analysis} />;
}
```

---

## Roadmap

### v1.1 (Próxima versão)
- [ ] Adicionar modo dark
- [ ] Suporte a i18n (pt-BR, en, es)
- [ ] Export PDF dos badges
- [ ] Histórico de compliance (timeline)

### v1.2
- [ ] Gráfico de radar para indicadores
- [ ] Drill-down modal com detalhes
- [ ] Comparação entre análises

---

## Troubleshooting

### Badge não aparece
```tsx
// Certifique-se de passar o objeto analysis completo
<HeroScore analysis={dnaAnalysis} showComplianceBadges />
```

### Tooltip não funciona
```tsx
// Verifique se showTooltip está true (padrão)
<CoreIndicatorsBadge analysis={analysis} showTooltip />
```

### Cores incorretas
```tsx
// Verifique se Tailwind CSS está configurado corretamente
// tailwind.config.js deve incluir:
content: ['./src/**/*.{js,ts,jsx,tsx}']
```

### Animações travando
```tsx
// Desative animações em testes ou mobile low-end
<ComplianceStatus analysis={analysis} className="motion-reduce:animate-none" />
```

---

## Contato

Dúvidas ou sugestões sobre os componentes de compliance:
- Documentação técnica: `/src/lib/zod-student.ts`
- Testes: `__tests__/compliance.test.tsx`
- Exemplos: `ComplianceExample.tsx`

---

**Versão:** 1.0.0
**Última atualização:** 2025-12-06
**Compatibilidade:** React 18+, Next.js 14+, Tailwind CSS 4+
