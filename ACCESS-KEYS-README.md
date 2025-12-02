# Sistema de Chaves de Acesso - Dashboard DNA Genis

## Visao Geral

Este sistema implementa uma camada de protecao para os dashboards individuais e da diretoria atraves de chaves de acesso aleatorias de 6 caracteres alfanumericos.

## Como Funciona

### Estrutura de URLs

**Antes:**
- Individual: `https://dashboard-dna-genis.vercel.app/bruno-monteiro`
- Diretoria: `https://dashboard-dna-genis.vercel.app/diretoria`

**Depois:**
- Individual: `https://dashboard-dna-genis.vercel.app/bruno-monteiro/[chave]`
- Diretoria: `https://dashboard-dna-genis.vercel.app/diretoria/[chave]`

### Validacao

- Cada slug possui uma chave unica associada
- URLs sem chave ou com chave incorreta retornam 404
- O sistema nao expoe se a chave esta errada (security by obscurity)
- Comparacao de chaves usa algoritmo constant-time para prevenir timing attacks

## Arquivos do Sistema

### Arquivos de Dados

| Arquivo | Descricao | Git Status |
|---------|-----------|------------|
| `src/data/access-keys.json` | Chaves reais (SENSITIVO) | **Ignorado** |
| `src/data/access-keys.example.json` | Template de exemplo | Versionado |

### Arquivos de Codigo

| Arquivo | Descricao |
|---------|-----------|
| `src/lib/access-keys.ts` | Funcoes de validacao |
| `src/app/[aluno]/[key]/page.tsx` | Rota do dashboard individual |
| `src/app/diretoria/[key]/page.tsx` | Rota do dashboard da diretoria |

## Como Gerar Novas Chaves

Se precisar regenerar chaves (por exemplo, se uma chave vazar), use o seguinte script:

```javascript
const crypto = require('crypto');

function generateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    key += chars[bytes[i] % chars.length];
  }
  return key;
}

console.log(generateKey());
```

## Atualizando Chaves

Para atualizar a chave de um aluno:

1. Gere uma nova chave usando o script acima
2. Atualize `src/data/access-keys.json`
3. Atualize o JSON do aluno em `src/data/alunos/[slug].json` (campo `meta.access_key`)
4. Faca o deploy
5. Comunique a nova URL ao aluno

## Lista de URLs Atuais

**ATENCAO: Este documento contem informacoes sensiveis. Mantenha em local seguro.**

### Dashboard Diretoria
- URL: `https://dashboard-dna-genis.vercel.app/diretoria/l9dlss`

### Dashboards Individuais

| Aluno | URL Completa |
|-------|--------------|
| Bruno Monteiro | `https://dashboard-dna-genis.vercel.app/bruno-monteiro/3n5msu` |
| Elias | `https://dashboard-dna-genis.vercel.app/elias/3wdmga` |
| Enio Prado | `https://dashboard-dna-genis.vercel.app/enio-prado/k8mwui` |
| Gabriel Creator | `https://dashboard-dna-genis.vercel.app/gabriel-creator/aqezea` |
| Gabriel Ferreira | `https://dashboard-dna-genis.vercel.app/gabriel-ferreira/ekgyzn` |
| Guilherme Lorenzatto | `https://dashboard-dna-genis.vercel.app/guilherme-lorenzatto/7tjmqn` |
| Guilherme | `https://dashboard-dna-genis.vercel.app/guilherme/x661ra` |
| Joao Eduardo | `https://dashboard-dna-genis.vercel.app/joao-eduardo/s7rkfl` |
| Lucas Harth | `https://dashboard-dna-genis.vercel.app/lucas-harth/qocx7a` |
| Maite Balensiefer | `https://dashboard-dna-genis.vercel.app/maite-balensiefer/7cc15d` |
| Marco Birck | `https://dashboard-dna-genis.vercel.app/marco-birck/57hyg6` |
| Marina Rocha | `https://dashboard-dna-genis.vercel.app/marina-rocha/27btrd` |
| Matheus Kobielski | `https://dashboard-dna-genis.vercel.app/matheus-kobielski/hzbli5` |
| Mauricio Ramos Dutra | `https://dashboard-dna-genis.vercel.app/mauricio-ramos-dutra/cldsl7` |
| Paulo Ricardo | `https://dashboard-dna-genis.vercel.app/paulo-ricardo/bgy2t3` |
| Pedro Werlang | `https://dashboard-dna-genis.vercel.app/pedro-werlang/vt2keu` |
| Ricardo Petri | `https://dashboard-dna-genis.vercel.app/ricardo-petri/mtmjpn` |
| Theo Fogaca | `https://dashboard-dna-genis.vercel.app/theo-fogaca/d02499` |
| Victoria Clasen | `https://dashboard-dna-genis.vercel.app/victoria-clasen/c3eqfp` |
| Vitor Sim | `https://dashboard-dna-genis.vercel.app/vitor-sim/wlsvs5` |
| Willian | `https://dashboard-dna-genis.vercel.app/willian/g3fy64` |

## Avisos de Seguranca

1. **NUNCA** commite o arquivo `access-keys.json` no Git
2. O arquivo esta listado no `.gitignore` por seguranca
3. Para deploy, configure as chaves como variavel de ambiente ou use um sistema de secrets
4. Se uma chave vazar, gere uma nova imediatamente
5. Considere usar um sistema de autenticacao mais robusto para producao (OAuth, JWT, etc.)

## Limitacoes

- As chaves sao estaticas (nao expiram)
- Nao ha rate limiting por tentativa de chave
- Nao ha log de tentativas de acesso invalidas
- Links com chaves podem ser compartilhados

## Proximos Passos (Sugestoes)

Para aumentar a seguranca:

1. Implementar rate limiting por IP
2. Adicionar expiracao de chaves
3. Implementar autenticacao OAuth/OIDC
4. Adicionar logs de acesso
5. Considerar autenticacao baseada em email magic links
