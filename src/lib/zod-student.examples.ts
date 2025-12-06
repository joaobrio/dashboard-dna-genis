/**
 * EXEMPLOS DE USO - Enhanced Zod Schema DNA Genis
 *
 * Este arquivo demonstra como utilizar as validações e utility functions
 * do schema híbrido com indicadores core obrigatórios + flexíveis opcionais.
 */

import {
  dnaGenisAnalysisSchema,
  validateStudent,
  checkCoreIndicators,
  checkPesoPilares,
  autoFixCategorias,
  gerarRelatorioValidacao,
  getIndicadoresFlexiveis,
  getCategoriaByScore,
  INDICADORES_CORE,
  INDICADORES_FLEXIVEIS,
  type DnaGenisAnalysis,
  type CategoriaPerformance,
} from './zod-student';

// ============================================================================
// EXEMPLO 1: Validação básica com Zod parse
// ============================================================================

export function exemplo1_validacaoBasica() {
  console.log('\n=== EXEMPLO 1: Validação Básica ===\n');

  const dadosAluno = {
    meta: {
      versao: '2.0',
      timestamp: '2025-01-15T10:00:00Z',
      analise_id: 'analise_001',
      aluno_id: 'aluno_teste',
    },
    resumo: {
      score_geral: 75,
      score_autoconfianca: 70,
      categoria_geral: 'Operacional', // Deve corresponder ao score (60-79)
      evolucao_percentual: null,
      numero_analise: 1,
      dias_desde_anterior: null,
    },
    pilares: {
      oratoria: {
        score: 80,
        peso: 0.25,
        categoria: 'Alta Performance',
        delta: null,
        indicador_ancora: 'FLUENCIA',
        indicador_gap: 'DICCAO',
      },
      interpessoal: {
        score: 70,
        peso: 0.25,
        categoria: 'Operacional',
        delta: null,
        indicador_ancora: 'PERSUASAO',
        indicador_gap: 'ADAPTABILIDADE',
      },
      intrapessoal: {
        score: 75,
        peso: 0.25,
        categoria: 'Operacional',
        delta: null,
        indicador_ancora: 'LIDERANCA',
        indicador_gap: 'AUTOCONFIANCA',
      },
      repertorio: {
        score: 70,
        peso: 0.25,
        categoria: 'Operacional',
        delta: null,
        indicador_ancora: 'CRIATIVIDADE',
        indicador_gap: 'REPERTORIO_GERAL',
      },
    },
    indicadores: [
      // 8 indicadores CORE obrigatórios
      {
        codigo: 'FLUENCIA',
        nome: 'Fluência',
        pilar: 'oratoria',
        score: 85,
        categoria: 'Alta Performance',
        delta: null,
        confianca: 0.9,
        evidencias: ['Fala sem hesitações'],
        timestamps: ['00:05:30'],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'DICCAO',
        nome: 'Dicção',
        pilar: 'oratoria',
        score: 75,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'MODULACAO_VOZ',
        nome: 'Modulação de Voz',
        pilar: 'oratoria',
        score: 70,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'LINGUAGEM_NAO_VERBAL',
        nome: 'Linguagem Não-Verbal',
        pilar: 'oratoria',
        score: 65,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'PERSUASAO',
        nome: 'Persuasão',
        pilar: 'interpessoal',
        score: 72,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'ADAPTABILIDADE',
        nome: 'Adaptabilidade',
        pilar: 'interpessoal',
        score: 68,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'LIDERANCA',
        nome: 'Liderança',
        pilar: 'intrapessoal',
        score: 78,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'CRIATIVIDADE',
        nome: 'Criatividade',
        pilar: 'repertorio',
        score: 73,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      // 2 indicadores FLEXÍVEIS opcionais
      {
        codigo: 'AUTOCONFIANCA',
        nome: 'Autoconfiança',
        pilar: 'intrapessoal',
        score: 70,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'REPERTORIO_GERAL',
        nome: 'Repertório Geral',
        pilar: 'repertorio',
        score: 67,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
    ],
  };

  try {
    const analiseValidada = dnaGenisAnalysisSchema.parse(dadosAluno);
    console.log('✓ Análise validada com sucesso!');
    console.log(`Total de indicadores: ${analiseValidada.indicadores.length}`);
    console.log(`Score geral: ${analiseValidada.resumo.score_geral}`);
    console.log(`Categoria: ${analiseValidada.resumo.categoria_geral}`);
  } catch (error) {
    console.error('✗ Erro na validação:', error);
  }
}

// ============================================================================
// EXEMPLO 2: Validação de indicadores core ausentes (DEVE FALHAR)
// ============================================================================

export function exemplo2_coreAusentes() {
  console.log('\n=== EXEMPLO 2: Indicadores Core Ausentes (Deve Falhar) ===\n');

  const dadosIncompletos = {
    meta: {
      versao: '2.0',
      timestamp: '2025-01-15T10:00:00Z',
      analise_id: 'analise_002',
      aluno_id: 'aluno_incompleto',
    },
    resumo: {
      score_geral: 75,
      score_autoconfianca: 70,
      categoria_geral: 'Operacional',
      evolucao_percentual: null,
      numero_analise: 1,
      dias_desde_anterior: null,
    },
    pilares: {
      oratoria: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      interpessoal: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      intrapessoal: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      repertorio: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
    },
    indicadores: [
      // Apenas 5 dos 8 core obrigatórios (faltam MODULACAO_VOZ, ADAPTABILIDADE, CRIATIVIDADE)
      {
        codigo: 'FLUENCIA',
        nome: 'Fluência',
        pilar: 'oratoria',
        score: 75,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'DICCAO',
        nome: 'Dicção',
        pilar: 'oratoria',
        score: 75,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'LINGUAGEM_NAO_VERBAL',
        nome: 'Linguagem Não-Verbal',
        pilar: 'oratoria',
        score: 75,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'PERSUASAO',
        nome: 'Persuasão',
        pilar: 'interpessoal',
        score: 75,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'LIDERANCA',
        nome: 'Liderança',
        pilar: 'intrapessoal',
        score: 75,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
    ],
  };

  try {
    const analise = dnaGenisAnalysisSchema.parse(dadosIncompletos);
    console.log('✗ Validação passou (NÃO DEVERIA!)');
  } catch (error: any) {
    console.log('✓ Validação falhou conforme esperado');
    console.log('Mensagem:', error.errors?.[0]?.message);
  }
}

// ============================================================================
// EXEMPLO 3: Validação de soma de pesos (DEVE FALHAR)
// ============================================================================

export function exemplo3_pesoInvalido() {
  console.log('\n=== EXEMPLO 3: Soma de Pesos Inválida (Deve Falhar) ===\n');

  const dadosPesoErrado = {
    meta: {
      versao: '2.0',
      timestamp: '2025-01-15T10:00:00Z',
      analise_id: 'analise_003',
      aluno_id: 'aluno_peso_errado',
    },
    resumo: {
      score_geral: 75,
      score_autoconfianca: 70,
      categoria_geral: 'Operacional',
      evolucao_percentual: null,
      numero_analise: 1,
      dias_desde_anterior: null,
    },
    pilares: {
      // Soma = 0.3 + 0.3 + 0.3 + 0.3 = 1.2 (INCORRETO!)
      oratoria: { score: 75, peso: 0.3, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      interpessoal: { score: 75, peso: 0.3, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      intrapessoal: { score: 75, peso: 0.3, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      repertorio: { score: 75, peso: 0.3, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
    },
    indicadores: INDICADORES_CORE.map(codigo => ({
      codigo,
      nome: codigo,
      pilar: 'oratoria' as const,
      score: 75,
      categoria: 'Operacional' as CategoriaPerformance,
      delta: null,
      evidencias: [],
      timestamps: [],
      aula_recomendada: null,
      tecnica_recomendada: null,
      prioridade_acao: null,
    })),
  };

  try {
    const analise = dnaGenisAnalysisSchema.parse(dadosPesoErrado);
    console.log('✗ Validação passou (NÃO DEVERIA!)');
  } catch (error: any) {
    console.log('✓ Validação falhou conforme esperado');
    console.log('Mensagem:', error.errors?.[0]?.message);
  }
}

// ============================================================================
// EXEMPLO 4: Uso de utility functions
// ============================================================================

export function exemplo4_utilityFunctions() {
  console.log('\n=== EXEMPLO 4: Utility Functions ===\n');

  // Dados de exemplo
  const analise: DnaGenisAnalysis = {
    meta: {
      versao: '2.0',
      timestamp: '2025-01-15T10:00:00Z',
      analise_id: 'analise_004',
      aluno_id: 'aluno_teste',
    },
    resumo: {
      score_geral: 75,
      score_autoconfianca: 70,
      categoria_geral: 'Operacional',
      evolucao_percentual: null,
      numero_analise: 1,
      dias_desde_anterior: null,
    },
    pilares: {
      oratoria: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      interpessoal: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      intrapessoal: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      repertorio: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
    },
    indicadores: [
      ...INDICADORES_CORE.map(codigo => ({
        codigo,
        nome: codigo,
        pilar: 'oratoria' as const,
        score: 75,
        categoria: 'Operacional' as CategoriaPerformance,
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      })),
      // Adicionar alguns flexíveis
      {
        codigo: 'AUTOCONFIANCA',
        nome: 'Autoconfiança',
        pilar: 'intrapessoal',
        score: 70,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
      {
        codigo: 'STORYTELLING',
        nome: 'Storytelling',
        pilar: 'repertorio',
        score: 68,
        categoria: 'Operacional',
        delta: null,
        evidencias: [],
        timestamps: [],
        aula_recomendada: null,
        tecnica_recomendada: null,
        prioridade_acao: null,
      },
    ],
  };

  // 1. Verificar indicadores core
  const coreCheck = checkCoreIndicators(analise);
  console.log('1. CHECK CORE INDICATORS:');
  console.log(`   Válido: ${coreCheck.valid}`);
  console.log(`   Presentes: ${coreCheck.present.length}/8`);
  console.log(`   Ausentes: ${coreCheck.missing.join(', ') || 'Nenhum'}`);

  // 2. Verificar pesos dos pilares
  const pesoCheck = checkPesoPilares(analise);
  console.log('\n2. CHECK PESO PILARES:');
  console.log(`   Válido: ${pesoCheck.valid}`);
  console.log(`   Soma: ${pesoCheck.soma.toFixed(4)}`);
  console.log(`   Diferença: ${pesoCheck.diferenca.toFixed(4)}`);

  // 3. Validação completa
  const validation = validateStudent(analise);
  console.log('\n3. VALIDAÇÃO COMPLETA:');
  console.log(`   Válido: ${validation.valid}`);
  console.log(`   Erros: ${validation.errors.length}`);

  // 4. Indicadores flexíveis presentes
  const flexCheck = getIndicadoresFlexiveis(analise);
  console.log('\n4. INDICADORES FLEXÍVEIS:');
  console.log(`   Total: ${flexCheck.total}/8`);
  console.log(`   Presentes: ${flexCheck.presentes.join(', ')}`);
  console.log(`   Ausentes: ${flexCheck.ausentes.join(', ')}`);

  // 5. Relatório de validação
  console.log('\n5. RELATÓRIO COMPLETO:');
  console.log(gerarRelatorioValidacao(analise));
}

// ============================================================================
// EXEMPLO 5: Auto-fix de categorias
// ============================================================================

export function exemplo5_autoFix() {
  console.log('\n=== EXEMPLO 5: Auto-Fix de Categorias ===\n');

  const dadosComCategoriaErrada = {
    meta: {
      versao: '2.0',
      timestamp: '2025-01-15T10:00:00Z',
      analise_id: 'analise_005',
      aluno_id: 'aluno_autofix',
    },
    resumo: {
      score_geral: 85, // Score de "Alta Performance"
      score_autoconfianca: 70,
      categoria_geral: 'Operacional', // CATEGORIA ERRADA! (deveria ser Alta Performance)
      evolucao_percentual: null,
      numero_analise: 1,
      dias_desde_anterior: null,
    },
    pilares: {
      oratoria: {
        score: 90,
        peso: 0.25,
        categoria: 'Operacional', // ERRADO! (deveria ser Alta Performance)
        delta: null,
        indicador_ancora: null,
        indicador_gap: null,
      },
      interpessoal: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      intrapessoal: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
      repertorio: { score: 75, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
    },
    indicadores: INDICADORES_CORE.map(codigo => ({
      codigo,
      nome: codigo,
      pilar: 'oratoria' as const,
      score: 85,
      categoria: 'Operacional' as CategoriaPerformance, // ERRADO!
      delta: null,
      evidencias: [],
      timestamps: [],
      aula_recomendada: null,
      tecnica_recomendada: null,
      prioridade_acao: null,
    })),
  };

  console.log('ANTES DO AUTO-FIX:');
  console.log(`Score geral: ${dadosComCategoriaErrada.resumo.score_geral}`);
  console.log(`Categoria geral: ${dadosComCategoriaErrada.resumo.categoria_geral} (ERRADO!)`);
  console.log(`Categoria esperada: ${getCategoriaByScore(dadosComCategoriaErrada.resumo.score_geral)}`);

  // Auto-fix
  const dadosCorrigidos = autoFixCategorias(dadosComCategoriaErrada as DnaGenisAnalysis);

  console.log('\nDEPOIS DO AUTO-FIX:');
  console.log(`Score geral: ${dadosCorrigidos.resumo.score_geral}`);
  console.log(`Categoria geral: ${dadosCorrigidos.resumo.categoria_geral} (CORRIGIDO!)`);

  // Validar após correção
  try {
    const validado = dnaGenisAnalysisSchema.parse(dadosCorrigidos);
    console.log('\n✓ Dados corrigidos passam na validação!');
  } catch (error) {
    console.log('\n✗ Ainda há erros após auto-fix');
  }
}

// ============================================================================
// EXEMPLO 6: Demonstração de ranges de categoria
// ============================================================================

export function exemplo6_categoriaRanges() {
  console.log('\n=== EXEMPLO 6: Ranges de Categoria ===\n');

  const scores = [95, 85, 75, 65, 55, 45, 35, 25];

  console.log('Score → Categoria:');
  scores.forEach(score => {
    const categoria = getCategoriaByScore(score);
    console.log(`  ${score.toString().padStart(3)} → ${categoria}`);
  });
}

// ============================================================================
// EXECUTAR TODOS OS EXEMPLOS
// ============================================================================

export function runAllExamples() {
  exemplo1_validacaoBasica();
  exemplo2_coreAusentes();
  exemplo3_pesoInvalido();
  exemplo4_utilityFunctions();
  exemplo5_autoFix();
  exemplo6_categoriaRanges();
}

// Se executado diretamente
if (require.main === module) {
  runAllExamples();
}
