import { getAllStudentSlugs, loadStudentJson, prettyNameFromSlug } from './load-student-analysis';
import type { DnaGenisAnalysis } from './zod-student';

export interface StudentSummary {
  slug: string;
  nome: string;
  scoreGeral: number;
  scoreAutoconfianca: number;
  categoria: string;
  oratoria: number | null;
  interpessoal: number | null;
  intrapessoal: number | null;
  repertorio: number | null;
}

export interface ConsolidatedMetrics {
  totalAlunos: number;
  mediaScoreGeral: number;
  mediaAutoconfianca: number;
  distribuicaoCategorias: Record<string, number>;
  mediaPilares: {
    oratoria: number;
    interpessoal: number;
    intrapessoal: number;
    repertorio: number;
  };
}

export async function loadAllStudentsData(): Promise<{
  students: StudentSummary[];
  metrics: ConsolidatedMetrics;
}> {
  const slugs = getAllStudentSlugs();
  const allData: Array<{ slug: string; data: DnaGenisAnalysis }> = [];

  // Load all student data
  for (const slug of slugs) {
    const data = await loadStudentJson(slug);
    if (data) {
      allData.push({ slug, data });
    }
  }

  // Transform to summaries
  const students: StudentSummary[] = allData.map(({ slug, data }) => ({
    slug,
    nome: prettyNameFromSlug(slug),
    scoreGeral: data.resumo.score_geral,
    scoreAutoconfianca: data.resumo.score_autoconfianca,
    categoria: data.resumo.categoria_geral,
    oratoria: data.pilares.oratoria?.score ?? null,
    interpessoal: data.pilares.interpessoal?.score ?? null,
    intrapessoal: data.pilares.intrapessoal?.score ?? null,
    repertorio: data.pilares.repertorio?.score ?? null,
  }));

  // Calculate metrics
  const totalAlunos = students.length;
  const mediaScoreGeral = students.reduce((acc, s) => acc + s.scoreGeral, 0) / totalAlunos;
  const mediaAutoconfianca = students.reduce((acc, s) => acc + s.scoreAutoconfianca, 0) / totalAlunos;

  const distribuicaoCategorias: Record<string, number> = {
    critico: 0,
    a_desenvolver: 0,
    adequado: 0,
    forte: 0,
    excelente: 0,
  };

  students.forEach((s) => {
    if (distribuicaoCategorias[s.categoria] !== undefined) {
      distribuicaoCategorias[s.categoria]++;
    }
  });

  // Calculate average scores per pillar
  const oratoriasValidas = students.filter((s) => s.oratoria !== null) as Array<StudentSummary & { oratoria: number }>;
  const interpessoaisValidas = students.filter((s) => s.interpessoal !== null) as Array<StudentSummary & { interpessoal: number }>;
  const intrapessoaisValidas = students.filter((s) => s.intrapessoal !== null) as Array<StudentSummary & { intrapessoal: number }>;
  const repertoriosValidos = students.filter((s) => s.repertorio !== null) as Array<StudentSummary & { repertorio: number }>;

  const mediaPilares = {
    oratoria: oratoriasValidas.reduce((acc, s) => acc + s.oratoria, 0) / (oratoriasValidas.length || 1),
    interpessoal: interpessoaisValidas.reduce((acc, s) => acc + s.interpessoal, 0) / (interpessoaisValidas.length || 1),
    intrapessoal: intrapessoaisValidas.reduce((acc, s) => acc + s.intrapessoal, 0) / (intrapessoaisValidas.length || 1),
    repertorio: repertoriosValidos.reduce((acc, s) => acc + s.repertorio, 0) / (repertoriosValidos.length || 1),
  };

  const metrics: ConsolidatedMetrics = {
    totalAlunos,
    mediaScoreGeral,
    mediaAutoconfianca,
    distribuicaoCategorias,
    mediaPilares,
  };

  return { students, metrics };
}
