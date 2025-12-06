/**
 * Test Suite para Zod Student Schema
 * Valida todas as business rules e utility functions
 *
 * Coverage mínimo: 80%
 * Execução: npm test:schema ou jest --testPathPattern=zod-student
 */

import {
  dnaGenisAnalysisSchema,
  validateStudent,
  checkCoreIndicators,
  checkPesoPilares,
  validarCategoriaVsScore,
  getCategoriaByScore,
  validarConfianca,
  autoFixCategorias,
  gerarRelatorioValidacao,
  getIndicadoresFlexiveis,
  enrichIndicador,
  INDICADORES_CORE,
  INDICADORES_FLEXIVEIS,
} from '../zod-student';

// ============================================================================
// TEST DATA FIXTURES
// ============================================================================

/**
 * Fixture: Aluno válido com todos os dados corretos
 */
const validStudentData = {
  meta: {
    versao: '1.0-test',
    timestamp: '2025-12-06T10:00:00Z',
    analise_id: 'test-001',
    aluno_id: 'aluno-test-001',
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
    oratoria: {
      score: 80,
      peso: 0.3,
      categoria: 'Alta Performance',
      delta: null,
      indicador_ancora: 'FLUENCIA',
      indicador_gap: null,
    },
    interpessoal: {
      score: 70,
      peso: 0.3,
      categoria: 'Operacional',
      delta: null,
      indicador_ancora: null,
      indicador_gap: null,
    },
    intrapessoal: {
      score: 75,
      peso: 0.2,
      categoria: 'Operacional',
      delta: null,
      indicador_ancora: null,
      indicador_gap: null,
    },
    repertorio: {
      score: 72,
      peso: 0.2,
      categoria: 'Operacional',
      delta: null,
      indicador_ancora: null,
      indicador_gap: null,
    },
  },
  indicadores: [
    // CORE Indicators
    {
      codigo: 'FLUENCIA',
      nome: 'Fluência',
      pilar: 'oratoria',
      score: 85,
      categoria: 'Alta Performance',
      delta: null,
      confianca: 0.95,
      evidencias: ['Discurso fluido'],
      timestamps: ['00:00'],
      aula_recomendada: null,
      tecnica_recomendada: 'Manter',
      prioridade_acao: null,
    },
    {
      codigo: 'DICCAO',
      nome: 'Dicção',
      pilar: 'oratoria',
      score: 82,
      categoria: 'Alta Performance',
      delta: null,
      confianca: 0.92,
      evidencias: ['Pronúncia clara'],
      timestamps: ['00:10'],
      aula_recomendada: null,
      tecnica_recomendada: 'Manter',
      prioridade_acao: null,
    },
    {
      codigo: 'MODULACAO_VOZ',
      nome: 'Modulação de Voz',
      pilar: 'oratoria',
      score: 78,
      categoria: 'Operacional',
      delta: null,
      confianca: 0.85,
      evidencias: ['Variação tonal adequada'],
      timestamps: ['00:20'],
      aula_recomendada: null,
      tecnica_recomendada: 'Manter',
      prioridade_acao: null,
    },
    {
      codigo: 'LINGUAGEM_NAO_VERBAL',
      nome: 'Linguagem Não Verbal',
      pilar: 'interpessoal',
      score: 75,
      categoria: 'Operacional',
      delta: null,
      confianca: 0.88,
      evidencias: ['Gestos apropriados'],
      timestamps: ['00:30'],
      aula_recomendada: null,
      tecnica_recomendada: 'Manter',
      prioridade_acao: null,
    },
    {
      codigo: 'PERSUASAO',
      nome: 'Persuasão',
      pilar: 'interpessoal',
      score: 70,
      categoria: 'Operacional',
      delta: null,
      confianca: 0.82,
      evidencias: ['Argumentação clara'],
      timestamps: ['00:40'],
      aula_recomendada: null,
      tecnica_recomendada: 'Manter',
      prioridade_acao: null,
    },
    {
      codigo: 'ADAPTABILIDADE',
      nome: 'Adaptabilidade',
      pilar: 'interpessoal',
      score: 68,
      categoria: 'Operacional',
      delta: null,
      confianca: 0.80,
      evidencias: ['Flexibilidade demonstrada'],
      timestamps: ['00:50'],
      aula_recomendada: null,
      tecnica_recomendada: 'Manter',
      prioridade_acao: null,
    },
    {
      codigo: 'LIDERANCA',
      nome: 'Liderança',
      pilar: 'intrapessoal',
      score: 72,
      categoria: 'Operacional',
      delta: null,
      confianca: 0.85,
      evidencias: ['Presença de liderança'],
      timestamps: ['01:00'],
      aula_recomendada: null,
      tecnica_recomendada: 'Manter',
      prioridade_acao: null,
    },
    {
      codigo: 'CRIATIVIDADE',
      nome: 'Criatividade',
      pilar: 'intrapessoal',
      score: 75,
      categoria: 'Operacional',
      delta: null,
      confianca: 0.90,
      evidencias: ['Ideias originais'],
      timestamps: ['01:10'],
      aula_recomendada: null,
      tecnica_recomendada: 'Manter',
      prioridade_acao: null,
    },
  ],
};

// ============================================================================
// TESTS: BUSINESS RULES - CATEGORIA VS SCORE
// ============================================================================

describe('validarCategoriaVsScore', () => {
  test('Alta Performance: score >= 80', () => {
    expect(validarCategoriaVsScore('Alta Performance', 80)).toBe(true);
    expect(validarCategoriaVsScore('Alta Performance', 95)).toBe(true);
    expect(validarCategoriaVsScore('Alta Performance', 100)).toBe(true);
    expect(validarCategoriaVsScore('Alta Performance', 79)).toBe(false);
  });

  test('Operacional: 60 <= score < 80', () => {
    expect(validarCategoriaVsScore('Operacional', 60)).toBe(true);
    expect(validarCategoriaVsScore('Operacional', 70)).toBe(true);
    expect(validarCategoriaVsScore('Operacional', 79)).toBe(true);
    expect(validarCategoriaVsScore('Operacional', 80)).toBe(false);
    expect(validarCategoriaVsScore('Operacional', 59)).toBe(false);
  });

  test('Essencial: 40 <= score < 60', () => {
    expect(validarCategoriaVsScore('Essencial', 40)).toBe(true);
    expect(validarCategoriaVsScore('Essencial', 50)).toBe(true);
    expect(validarCategoriaVsScore('Essencial', 59)).toBe(true);
    expect(validarCategoriaVsScore('Essencial', 60)).toBe(false);
    expect(validarCategoriaVsScore('Essencial', 39)).toBe(false);
  });

  test('Crítico: score < 40', () => {
    expect(validarCategoriaVsScore('Crítico', 0)).toBe(true);
    expect(validarCategoriaVsScore('Crítico', 20)).toBe(true);
    expect(validarCategoriaVsScore('Crítico', 39)).toBe(true);
    expect(validarCategoriaVsScore('Crítico', 40)).toBe(false);
  });

  test('Categorias inválidas retornam false', () => {
    expect(validarCategoriaVsScore('Invalido', 50)).toBe(false);
    expect(validarCategoriaVsScore('', 50)).toBe(false);
  });
});

// ============================================================================
// TESTS: GET CATEGORIA BY SCORE
// ============================================================================

describe('getCategoriaByScore', () => {
  test('Retorna categoria correta para scores na faixa Alta Performance', () => {
    expect(getCategoriaByScore(80)).toBe('Alta Performance');
    expect(getCategoriaByScore(95)).toBe('Alta Performance');
    expect(getCategoriaByScore(100)).toBe('Alta Performance');
  });

  test('Retorna categoria correta para scores na faixa Operacional', () => {
    expect(getCategoriaByScore(60)).toBe('Operacional');
    expect(getCategoriaByScore(70)).toBe('Operacional');
    expect(getCategoriaByScore(79)).toBe('Operacional');
  });

  test('Retorna categoria correta para scores na faixa Essencial', () => {
    expect(getCategoriaByScore(40)).toBe('Essencial');
    expect(getCategoriaByScore(50)).toBe('Essencial');
    expect(getCategoriaByScore(59)).toBe('Essencial');
  });

  test('Retorna categoria correta para scores na faixa Crítico', () => {
    expect(getCategoriaByScore(0)).toBe('Crítico');
    expect(getCategoriaByScore(20)).toBe('Crítico');
    expect(getCategoriaByScore(39)).toBe('Crítico');
  });
});

// ============================================================================
// TESTS: VALIDAR CONFIANCA
// ============================================================================

describe('validarConfianca', () => {
  test('Aceita valores no range 0-1', () => {
    expect(validarConfianca(0)).toBe(true);
    expect(validarConfianca(0.5)).toBe(true);
    expect(validarConfianca(1)).toBe(true);
    expect(validarConfianca(0.95)).toBe(true);
  });

  test('Rejeita valores fora do range', () => {
    expect(validarConfianca(-0.1)).toBe(false);
    expect(validarConfianca(1.1)).toBe(false);
    expect(validarConfianca(2)).toBe(false);
  });

  test('Aceita undefined (confiança opcional)', () => {
    expect(validarConfianca(undefined)).toBe(true);
  });
});

// ============================================================================
// TESTS: CHECK CORE INDICATORS
// ============================================================================

describe('checkCoreIndicators', () => {
  test('Retorna valid=true quando todos os 8 core indicators estão presentes', () => {
    const result = checkCoreIndicators(validStudentData as any);
    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.present).toHaveLength(8);
  });

  test('Detecta indicadores core ausentes', () => {
    const invalidData = {
      ...validStudentData,
      indicadores: validStudentData.indicadores.slice(0, 3), // Apenas 3 indicadores
    };

    const result = checkCoreIndicators(invalidData as any);
    expect(result.valid).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
    expect(result.present.length).toBe(3);
  });

  test('Retorna lista correta de presentes e ausentes', () => {
    const result = checkCoreIndicators(validStudentData as any);
    expect(result.present.sort()).toEqual(INDICADORES_CORE.slice().sort());
  });
});

// ============================================================================
// TESTS: CHECK PESO PILARES
// ============================================================================

describe('checkPesoPilares', () => {
  test('Retorna valid=true quando soma dos pesos é 1.0', () => {
    const result = checkPesoPilares(validStudentData as any);
    expect(result.valid).toBe(true);
    expect(Math.abs(result.soma - 1.0)).toBeLessThan(0.01);
  });

  test('Detecta quando soma não é 1.0', () => {
    const invalidData = {
      ...validStudentData,
      pilares: {
        ...validStudentData.pilares,
        oratoria: { ...validStudentData.pilares.oratoria, peso: 0.5 }, // 0.5 + 0.3 + 0.2 + 0.2 = 1.2
      },
    };

    const result = checkPesoPilares(invalidData as any);
    expect(result.valid).toBe(false);
    expect(result.soma).not.toBeCloseTo(1.0, 2);
  });

  test('Retorna detalhes de cada pilar', () => {
    const result = checkPesoPilares(validStudentData as any);
    expect(result.detalhes).toHaveProperty('oratoria');
    expect(result.detalhes).toHaveProperty('interpessoal');
    expect(result.detalhes).toHaveProperty('intrapessoal');
    expect(result.detalhes).toHaveProperty('repertorio');
  });

  test('Respeita tolerância customizada', () => {
    const invalidData = {
      ...validStudentData,
      pilares: {
        ...validStudentData.pilares,
        oratoria: { ...validStudentData.pilares.oratoria, peso: 0.305 }, // soma = 1.005
      },
    };

    expect(checkPesoPilares(invalidData as any, 0.01).valid).toBe(true);
    expect(checkPesoPilares(invalidData as any, 0.001).valid).toBe(false);
  });
});

// ============================================================================
// TESTS: VALIDATE STUDENT (MAIN FUNCTION)
// ============================================================================

describe('validateStudent', () => {
  test('Retorna valid=true para dados válidos', () => {
    const result = validateStudent(validStudentData as any);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Detecta falta de core indicators', () => {
    const invalidData = {
      ...validStudentData,
      indicadores: validStudentData.indicadores.slice(0, 3),
    };

    const result = validateStudent(invalidData as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 'core_indicators')).toBe(true);
  });

  test('Detecta peso dos pilares incorreto', () => {
    const invalidData = {
      ...validStudentData,
      pilares: {
        ...validStudentData.pilares,
        oratoria: { ...validStudentData.pilares.oratoria, peso: 0.5 },
      },
    };

    const result = validateStudent(invalidData as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 'peso_pilares')).toBe(true);
  });

  test('Detecta categoria geral incorreta', () => {
    const invalidData = {
      ...validStudentData,
      resumo: { ...validStudentData.resumo, categoria_geral: 'Alta Performance' }, // score 75 = Operacional
    };

    const result = validateStudent(invalidData as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 'categoria_score_geral')).toBe(true);
  });

  test('Detecta categoria incorreta em indicadores', () => {
    const invalidData = {
      ...validStudentData,
      indicadores: validStudentData.indicadores.map((ind, idx) => {
        if (idx === 0) {
          return { ...ind, categoria: 'Operacional' }; // score 85 = Alta Performance
        }
        return ind;
      }),
    };

    const result = validateStudent(invalidData as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 'categoria_score_indicador')).toBe(true);
  });

  test('Detecta confiança fora do range', () => {
    const invalidData = {
      ...validStudentData,
      indicadores: validStudentData.indicadores.map((ind, idx) => {
        if (idx === 0) {
          return { ...ind, confianca: 1.5 }; // Inválido
        }
        return ind;
      }),
    };

    const result = validateStudent(invalidData as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.rule === 'confianca_range')).toBe(true);
  });

  test('Retorna múltiplos erros quando houver vários problemas', () => {
    const invalidData = {
      ...validStudentData,
      resumo: { ...validStudentData.resumo, categoria_geral: 'Crítico' }, // Errado
      indicadores: validStudentData.indicadores.slice(0, 3), // Faltam core indicators
    };

    const result = validateStudent(invalidData as any);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

// ============================================================================
// TESTS: AUTO FIX CATEGORIAS
// ============================================================================

describe('autoFixCategorias', () => {
  test('Corrige categoria geral baseada no score', () => {
    const invalidData = {
      ...validStudentData,
      resumo: { ...validStudentData.resumo, categoria_geral: 'Crítico' },
    };

    const fixed = autoFixCategorias(invalidData as any);
    expect(fixed.resumo.categoria_geral).toBe('Operacional');
  });

  test('Corrige categorias de indicadores', () => {
    const invalidData = {
      ...validStudentData,
      indicadores: validStudentData.indicadores.map((ind, idx) => {
        if (idx === 0) {
          return { ...ind, categoria: 'Crítico' }; // Errado, score 85 = Alta Performance
        }
        return ind;
      }),
    };

    const fixed = autoFixCategorias(invalidData as any);
    expect(fixed.indicadores[0].categoria).toBe('Alta Performance');
  });

  test('Corrige categorias dos pilares', () => {
    const invalidData = {
      ...validStudentData,
      pilares: {
        ...validStudentData.pilares,
        oratoria: { ...validStudentData.pilares.oratoria, categoria: 'Crítico' }, // Errado, score 80
      },
    };

    const fixed = autoFixCategorias(invalidData as any);
    expect(fixed.pilares.oratoria.categoria).toBe('Alta Performance');
  });

  test('Não modifica o objeto original', () => {
    const originalData = JSON.parse(JSON.stringify(validStudentData));
    const fixed = autoFixCategorias(originalData as any);

    expect(fixed).not.toBe(originalData);
    expect(originalData.resumo.categoria_geral).toBe(validStudentData.resumo.categoria_geral);
  });
});

// ============================================================================
// TESTS: GERAR RELATORIO VALIDACAO
// ============================================================================

describe('gerarRelatorioValidacao', () => {
  test('Gera relatório string para dados válidos', () => {
    const report = gerarRelatorioValidacao(validStudentData as any);
    expect(typeof report).toBe('string');
    expect(report).toContain('RELATÓRIO DE VALIDAÇÃO');
    expect(report).toContain('aluno-test-001');
  });

  test('Relatório contém informações sobre core indicators', () => {
    const report = gerarRelatorioValidacao(validStudentData as any);
    expect(report).toContain('INDICADORES CORE');
    expect(report).toContain('8');
  });

  test('Relatório contém informações sobre pesos', () => {
    const report = gerarRelatorioValidacao(validStudentData as any);
    expect(report).toContain('PESOS DOS PILARES');
    expect(report).toContain('1.0');
  });

  test('Relatório mostra status VÁLIDO para dados corretos', () => {
    const report = gerarRelatorioValidacao(validStudentData as any);
    expect(report).toContain('✓');
  });
});

// ============================================================================
// TESTS: GET INDICADORES FLEXIVEIS
// ============================================================================

describe('getIndicadoresFlexiveis', () => {
  test('Retorna indicadores flexíveis presentes', () => {
    const dataWithFlexiveis = {
      ...validStudentData,
      indicadores: [
        ...validStudentData.indicadores,
        {
          codigo: 'RITMO',
          nome: 'Ritmo',
          pilar: 'oratoria' as const,
          score: 75,
          categoria: 'Operacional',
          delta: null,
          confianca: 0.85,
          evidencias: [],
          timestamps: [],
          aula_recomendada: null,
          tecnica_recomendada: null,
          prioridade_acao: null,
        },
      ],
    };

    const result = getIndicadoresFlexiveis(dataWithFlexiveis as any);
    expect(result.presentes).toContain('RITMO');
    expect(result.total).toBeGreaterThan(0);
  });

  test('Retorna lista correta de flexíveis ausentes', () => {
    const result = getIndicadoresFlexiveis(validStudentData as any);
    expect(result.ausentes.length).toBeGreaterThan(0);
    expect(result.ausentes).toContain('RITMO');
  });
});

// ============================================================================
// TESTS: ENRICH INDICADOR
// ============================================================================

describe('enrichIndicador', () => {
  test('Marca indicador como core quando apropriado', () => {
    const indicador = validStudentData.indicadores[0];
    const enriched = enrichIndicador(indicador as any);
    expect(enriched.isCore).toBe(true);
    expect(enriched.isFlexivel).toBe(false);
  });

  test('Preserva dados originais do indicador', () => {
    const indicador = validStudentData.indicadores[0];
    const enriched = enrichIndicador(indicador as any);
    expect(enriched.codigo).toBe(indicador.codigo);
    expect(enriched.score).toBe(indicador.score);
  });
});

// ============================================================================
// TESTS: ZOD SCHEMA VALIDATION
// ============================================================================

describe('dnaGenisAnalysisSchema', () => {
  test('Valida dados corretos com sucesso', () => {
    const result = dnaGenisAnalysisSchema.safeParse(validStudentData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.aluno_id).toBe('aluno-test-001');
    }
  });

  test('Rejeita dados sem core indicators', () => {
    const invalidData = {
      ...validStudentData,
      indicadores: validStudentData.indicadores.slice(0, 3),
    };

    const result = dnaGenisAnalysisSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('Rejeita dados com peso incorreto', () => {
    const invalidData = {
      ...validStudentData,
      pilares: {
        ...validStudentData.pilares,
        oratoria: { ...validStudentData.pilares.oratoria, peso: 0.5 },
      },
    };

    const result = dnaGenisAnalysisSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('Rejeita indicadores sem score no range 0-100', () => {
    const invalidData = {
      ...validStudentData,
      indicadores: validStudentData.indicadores.map((ind, idx) => {
        if (idx === 0) {
          return { ...ind, score: 150 }; // Fora do range
        }
        return ind;
      }),
    };

    const result = dnaGenisAnalysisSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('Rejeita confiança fora do range 0-1', () => {
    const invalidData = {
      ...validStudentData,
      indicadores: validStudentData.indicadores.map((ind, idx) => {
        if (idx === 0) {
          return { ...ind, confianca: 1.5 };
        }
        return ind;
      }),
    };

    const result = dnaGenisAnalysisSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Integration Tests', () => {
  test('Fluxo completo: validação + auto-fix + re-validação', () => {
    // Dados inválidos
    const invalidData = {
      ...validStudentData,
      resumo: { ...validStudentData.resumo, categoria_geral: 'Crítico' },
      pilares: {
        ...validStudentData.pilares,
        oratoria: { ...validStudentData.pilares.oratoria, categoria: 'Crítico' },
      },
    };

    // Validar e encontrar erros
    const initialValidation = validateStudent(invalidData as any);
    expect(initialValidation.valid).toBe(false);

    // Corrigir
    const fixed = autoFixCategorias(invalidData as any);

    // Re-validar
    const finalValidation = validateStudent(fixed as any);
    expect(finalValidation.valid).toBe(true);
    expect(finalValidation.errors).toHaveLength(0);
  });

  test('Validação de aluno com todos os indicadores flexíveis', () => {
    const dataWithAll = {
      ...validStudentData,
      indicadores: [
        ...validStudentData.indicadores,
        {
          codigo: 'RITMO',
          nome: 'Ritmo',
          pilar: 'oratoria' as const,
          score: 75,
          categoria: 'Operacional',
          delta: null,
          confianca: 0.85,
          evidencias: [],
          timestamps: [],
          aula_recomendada: null,
          tecnica_recomendada: null,
          prioridade_acao: null,
        },
        {
          codigo: 'DIDATICA',
          nome: 'Didática',
          pilar: 'oratoria' as const,
          score: 70,
          categoria: 'Operacional',
          delta: null,
          confianca: 0.80,
          evidencias: [],
          timestamps: [],
          aula_recomendada: null,
          tecnica_recomendada: null,
          prioridade_acao: null,
        },
      ],
    };

    const result = validateStudent(dataWithAll as any);
    expect(result.valid).toBe(true);

    const flexiveis = getIndicadoresFlexiveis(dataWithAll as any);
    expect(flexiveis.presentes.length).toBeGreaterThan(0);
  });
});
