import fs from 'fs';
import path from 'path';

// ============== TYPES ==============

export interface Indicador {
  nome: string;
  score: number;
  pilar: string;
  categoria?: string;
}

export interface Pilar {
  nome: string;
  score: number;
  categoria?: string;
}

export interface VideoSnapshotCompleto {
  label: string;
  date?: string;
  scoreGeral: number | null;
  autoconfianca: number | null;
  pilares: {
    oratoria: number | null;
    interpessoal: number | null;
    intrapessoal: number | null;
    repertorio: number | null;
  };
  indicadores: Indicador[];
  fortalezas: { nome: string; score: number }[];
  gaps: { nome: string; score: number }[];
}

export interface DeltaIndicador {
  nome: string;
  v1: number | null;
  v2: number | null;
  delta: number | null;
  trend: 'up' | 'down' | 'flat' | 'new' | 'removed';
}

export interface EvolucaoCompleta {
  slug: string;
  nome: string;
  video1: VideoSnapshotCompleto;
  video2: VideoSnapshotCompleto;
  deltas: {
    scoreGeral: number | null;
    autoconfianca: number | null;
    pilares: {
      oratoria: number | null;
      interpessoal: number | null;
      intrapessoal: number | null;
      repertorio: number | null;
    };
    indicadores: DeltaIndicador[];
    maioresEvolucoes: DeltaIndicador[];
    maioresQuedas: DeltaIndicador[];
  };
}

// Simplified type for index page
export interface EvolucaoAluno {
  slug: string;
  nome: string;
  video1: { label: string; date?: string; scoreGeral: number | null };
  video2: { label: string; date?: string; scoreGeral: number | null };
  delta: number | null;
}

// ============== PATHS ==============

const VIDEO1_DIR = path.resolve(process.cwd(), '../analise-sensorial-041225/video-01/relatorios-feedback');
const VIDEO2_DIR = path.resolve(process.cwd(), '../analise-sensorial-041225/video-02/feedback-supremo');

// ============== HELPERS ==============

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const ALIAS: Record<string, string> = {
  jeff: 'jefferson',
  will: 'william',
  vic: 'victoria',
};

function normalizeSlug(slug: string): string {
  return ALIAS[slug] || slug;
}

function calcTrend(v1: number | null, v2: number | null): 'up' | 'down' | 'flat' | 'new' | 'removed' {
  if (v1 === null && v2 !== null) return 'new';
  if (v1 !== null && v2 === null) return 'removed';
  if (v1 === null || v2 === null) return 'flat';
  if (v2 > v1) return 'up';
  if (v2 < v1) return 'down';
  return 'flat';
}

// ============== VIDEO 1 PARSER ==============

function parseVideo1(content: string): Omit<VideoSnapshotCompleto, 'label'> {
  // Score Geral: | Score Geral | 55 |
  const scoreMatch = content.match(/Score Geral\s*\|\s*(\d+)/i);
  const scoreGeral = scoreMatch ? Number(scoreMatch[1]) : null;

  // Autoconfiança: | Autoconfianca | 54.5 |
  const autoMatch = content.match(/Autoconfianca\s*\|\s*([\d.]+)/i);
  const autoconfianca = autoMatch ? Number(autoMatch[1]) : null;

  // Pilares: ### Pilar 1: Oratoria (53/100)
  const pilares = {
    oratoria: null as number | null,
    interpessoal: null as number | null,
    intrapessoal: null as number | null,
    repertorio: null as number | null,
  };

  const pilarRegex = /### Pilar \d+: (\w+) \((\d+)\/100\)/gi;
  let pilarMatch;
  while ((pilarMatch = pilarRegex.exec(content)) !== null) {
    const nome = pilarMatch[1].toLowerCase();
    const score = Number(pilarMatch[2]);
    if (nome in pilares) {
      pilares[nome as keyof typeof pilares] = score;
    }
  }

  // Indicadores: | Diccao | 80 | Forte |
  const indicadores: Indicador[] = [];
  const indicadorRegex = /\|\s*([A-Za-zÀ-ú\s-]+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|/g;
  let indMatch;
  const skipTerms = ['Metrica', 'Indicador', 'Score', 'Valor', 'Evolucao', 'Categoria', 'Pilar'];

  while ((indMatch = indicadorRegex.exec(content)) !== null) {
    const nome = indMatch[1].trim();
    const score = Number(indMatch[2]);
    const categoria = indMatch[3].trim();

    if (!skipTerms.some(t => nome.toLowerCase().includes(t.toLowerCase())) && score <= 100) {
      // Determine pilar by context (search backwards for pilar header)
      const beforeMatch = content.substring(0, indMatch.index);
      const lastPilarMatch = beforeMatch.match(/### Pilar \d+: (\w+)/gi);
      const pilar = lastPilarMatch ? lastPilarMatch[lastPilarMatch.length - 1].match(/(\w+)$/)?.[1] || 'oratoria' : 'oratoria';

      indicadores.push({ nome, score, pilar: pilar.toLowerCase(), categoria });
    }
  }

  // Fortalezas: **Principal forca:** Diccao (80)
  const fortalezas: { nome: string; score: number }[] = [];
  const forcaMatch = content.match(/\*\*Principal forca:\*\*\s*([^(]+)\((\d+)\)/i);
  if (forcaMatch) {
    fortalezas.push({ nome: forcaMatch[1].trim(), score: Number(forcaMatch[2]) });
  }

  // Gaps: **Principal gap:** Linguagem Nao Verbal (45)
  const gaps: { nome: string; score: number }[] = [];
  const gapMatch = content.match(/\*\*Principal gap:\*\*\s*([^(]+)\((\d+)\)/i);
  if (gapMatch) {
    gaps.push({ nome: gapMatch[1].trim(), score: Number(gapMatch[2]) });
  }

  return {
    date: '22/05/2024',
    scoreGeral,
    autoconfianca,
    pilares,
    indicadores,
    fortalezas,
    gaps,
  };
}

// ============== VIDEO 2 PARSER ==============

function parseVideo2(content: string): Omit<VideoSnapshotCompleto, 'label'> {
  // Score Geral: **Score Geral:** 73/100
  const scoreMatch = content.match(/\*\*Score Geral:\*\*\s*(\d+)/i);
  const scoreGeral = scoreMatch ? Number(scoreMatch[1]) : null;

  // Autoconfiança: **Autoconfiança Calculada:** 71.5%
  const autoMatch = content.match(/Autoconfian[çc]a Calculada:\*\*\s*([\d.]+)/i);
  const autoconfianca = autoMatch ? Number(autoMatch[1]) : null;

  // Pilares from table: | **ORATÓRIA** | 68 |
  const pilares = {
    oratoria: null as number | null,
    interpessoal: null as number | null,
    intrapessoal: null as number | null,
    repertorio: null as number | null,
  };

  const pilarTableRegex = /\|\s*\*\*(\w+)\*\*\s*\|\s*(\d+)\s*\|/gi;
  let pilarMatch;
  while ((pilarMatch = pilarTableRegex.exec(content)) !== null) {
    const nome = pilarMatch[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const score = Number(pilarMatch[2]);
    if (nome in pilares) {
      pilares[nome as keyof typeof pilares] = score;
    }
  }

  // Indicadores from detailed tables
  const indicadores: Indicador[] = [];

  // Find sections: ### Indicadores Detalhados - Oratória
  const sections = content.split(/### Indicadores Detalhados - (\w+)/i);
  for (let i = 1; i < sections.length; i += 2) {
    const pilar = sections[i]?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || 'oratoria';
    const sectionContent = sections[i + 1] || '';

    const indicadorRegex = /\|\s*([A-Za-zÀ-ú\s-]+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|/g;
    let indMatch;
    while ((indMatch = indicadorRegex.exec(sectionContent)) !== null) {
      const nome = indMatch[1].trim();
      const score = Number(indMatch[2]);
      const categoria = indMatch[3].trim();

      if (!['Indicador', 'Score', 'Categoria'].includes(nome) && score <= 100) {
        indicadores.push({ nome, score, pilar, categoria });
      }
    }
  }

  // Top 3 Fortalezas from table after "### Top 3 Fortalezas"
  const fortalezas: { nome: string; score: number }[] = [];
  const fortalezasSection = content.match(/### Top 3 Fortalezas[\s\S]*?\|[\s\S]*?\|([\s\S]*?)(?=###|---|\n\n\n)/i);
  if (fortalezasSection) {
    const fortRegex = /\|\s*\d+[ºª]?\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*(\d+)\s*\|/g;
    let fortMatch;
    while ((fortMatch = fortRegex.exec(fortalezasSection[0])) !== null) {
      fortalezas.push({ nome: fortMatch[1].trim(), score: Number(fortMatch[2]) });
    }
  }

  // Top 3 Gaps from "### Top 3 Prioridades"
  const gaps: { nome: string; score: number }[] = [];
  const gapsSection = content.match(/### Top 3 Prioridades[\s\S]*?\|[\s\S]*?\|([\s\S]*?)(?=###|---|\n\n\n)/i);
  if (gapsSection) {
    const gapRegex = /\|\s*\d+[ºª]?\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*(\d+)\s*\|/g;
    let gapMatch;
    while ((gapMatch = gapRegex.exec(gapsSection[0])) !== null) {
      gaps.push({ nome: gapMatch[1].trim(), score: Number(gapMatch[2]) });
    }
  }

  return {
    date: '04/12/2025',
    scoreGeral,
    autoconfianca,
    pilares,
    indicadores,
    fortalezas,
    gaps,
  };
}

// ============== MAIN LOADERS ==============

export function loadEvolucaoCompleta(slug: string): EvolucaoCompleta | null {
  const normalizedSlug = normalizeSlug(slug);

  // Find matching files
  let video1Content: string | null = null;
  let video2Content: string | null = null;

  if (fs.existsSync(VIDEO1_DIR)) {
    const files = fs.readdirSync(VIDEO1_DIR).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const fileSlug = normalizeSlug(slugify(file.replace(/-feedback-dna-genis\.md$/i, '').replace(/\.md$/i, '')));
      if (fileSlug === normalizedSlug) {
        video1Content = fs.readFileSync(path.join(VIDEO1_DIR, file), 'utf-8');
        break;
      }
    }
  }

  if (fs.existsSync(VIDEO2_DIR)) {
    const files = fs.readdirSync(VIDEO2_DIR).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const fileSlug = normalizeSlug(slugify(file.replace(/_feedback\.md$/i, '').replace(/\.md$/i, '')));
      if (fileSlug === normalizedSlug) {
        video2Content = fs.readFileSync(path.join(VIDEO2_DIR, file), 'utf-8');
        break;
      }
    }
  }

  if (!video1Content && !video2Content) return null;

  const nome = normalizedSlug.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  const video1 = video1Content
    ? { label: 'Vídeo 01', ...parseVideo1(video1Content) }
    : emptySnapshot('Vídeo 01');

  const video2 = video2Content
    ? { label: 'Vídeo 02', ...parseVideo2(video2Content) }
    : emptySnapshot('Vídeo 02');

  // Calculate deltas
  const deltaScoreGeral = video1.scoreGeral !== null && video2.scoreGeral !== null
    ? video2.scoreGeral - video1.scoreGeral
    : null;

  const deltaAutoconfianca = video1.autoconfianca !== null && video2.autoconfianca !== null
    ? video2.autoconfianca - video1.autoconfianca
    : null;

  const deltaPilares = {
    oratoria: calcDelta(video1.pilares.oratoria, video2.pilares.oratoria),
    interpessoal: calcDelta(video1.pilares.interpessoal, video2.pilares.interpessoal),
    intrapessoal: calcDelta(video1.pilares.intrapessoal, video2.pilares.intrapessoal),
    repertorio: calcDelta(video1.pilares.repertorio, video2.pilares.repertorio),
  };

  // Merge indicadores and calculate deltas
  const allIndicadores = new Map<string, DeltaIndicador>();

  for (const ind of video1.indicadores) {
    const key = normalizeIndicadorName(ind.nome);
    allIndicadores.set(key, {
      nome: ind.nome,
      v1: ind.score,
      v2: null,
      delta: null,
      trend: 'removed',
    });
  }

  for (const ind of video2.indicadores) {
    const key = normalizeIndicadorName(ind.nome);
    const existing = allIndicadores.get(key);
    if (existing) {
      existing.v2 = ind.score;
      existing.delta = ind.score - (existing.v1 || 0);
      existing.trend = calcTrend(existing.v1, ind.score);
    } else {
      allIndicadores.set(key, {
        nome: ind.nome,
        v1: null,
        v2: ind.score,
        delta: null,
        trend: 'new',
      });
    }
  }

  const indicadoresDeltas = Array.from(allIndicadores.values());

  // Sort by delta for top evolutions and drops
  const withDelta = indicadoresDeltas.filter(i => i.delta !== null);
  const maioresEvolucoes = [...withDelta].sort((a, b) => (b.delta || 0) - (a.delta || 0)).slice(0, 3);
  const maioresQuedas = [...withDelta].sort((a, b) => (a.delta || 0) - (b.delta || 0)).slice(0, 3);

  return {
    slug: normalizedSlug,
    nome,
    video1,
    video2,
    deltas: {
      scoreGeral: deltaScoreGeral,
      autoconfianca: deltaAutoconfianca,
      pilares: deltaPilares,
      indicadores: indicadoresDeltas,
      maioresEvolucoes,
      maioresQuedas,
    },
  };
}

function emptySnapshot(label: string): VideoSnapshotCompleto {
  return {
    label,
    date: undefined,
    scoreGeral: null,
    autoconfianca: null,
    pilares: { oratoria: null, interpessoal: null, intrapessoal: null, repertorio: null },
    indicadores: [],
    fortalezas: [],
    gaps: [],
  };
}

function calcDelta(v1: number | null, v2: number | null): number | null {
  if (v1 === null || v2 === null) return null;
  return v2 - v1;
}

function normalizeIndicadorName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// ============== SIMPLIFIED LOADER (for index) ==============

export function loadEvolucaoAlunos(): EvolucaoAluno[] {
  const alunos: Record<string, Partial<EvolucaoAluno>> = {};

  // Video 1
  if (fs.existsSync(VIDEO1_DIR)) {
    fs.readdirSync(VIDEO1_DIR)
      .filter((f) => f.endsWith('.md'))
      .forEach((file) => {
        const raw = fs.readFileSync(path.join(VIDEO1_DIR, file), 'utf-8');
        const scoreMatch = raw.match(/Score Geral\s*\|\s*(\d+)/i);
        const score = scoreMatch ? Number(scoreMatch[1]) : null;
        const slug = normalizeSlug(slugify(file.replace(/-feedback-dna-genis\.md$/i, '').replace(/\.md$/i, '')));
        const nome = slug.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        if (!alunos[slug]) alunos[slug] = { slug, nome };
        alunos[slug]!.video1 = { label: 'Vídeo 01', scoreGeral: score, date: '22/05/2024' };
      });
  }

  // Video 2
  if (fs.existsSync(VIDEO2_DIR)) {
    fs.readdirSync(VIDEO2_DIR)
      .filter((f) => f.endsWith('.md'))
      .forEach((file) => {
        const raw = fs.readFileSync(path.join(VIDEO2_DIR, file), 'utf-8');
        const scoreMatch = raw.match(/\*\*Score Geral:\*\*\s*(\d+)/i);
        const score = scoreMatch ? Number(scoreMatch[1]) : null;
        const slug = normalizeSlug(slugify(file.replace(/_feedback\.md$/i, '').replace(/\.md$/i, '')));
        const nome = slug.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        if (!alunos[slug]) alunos[slug] = { slug, nome };
        alunos[slug]!.video2 = { label: 'Vídeo 02', scoreGeral: score, date: '04/12/2025' };
      });
  }

  const list: EvolucaoAluno[] = Object.values(alunos).map((a) => {
    const video1 = a.video1 || { label: 'Vídeo 01', scoreGeral: null };
    const video2 = a.video2 || { label: 'Vídeo 02', scoreGeral: null };
    const delta = video1.scoreGeral != null && video2.scoreGeral != null
      ? video2.scoreGeral - video1.scoreGeral
      : null;
    return {
      slug: a.slug || '',
      nome: a.nome || 'Aluno',
      video1,
      video2,
      delta,
    };
  });

  return list.sort((a, b) => (b.delta ?? -Infinity) - (a.delta ?? -Infinity));
}

// Get list of available slugs for static generation
export function getEvolucaoSlugs(): string[] {
  const slugs = new Set<string>();

  if (fs.existsSync(VIDEO1_DIR)) {
    fs.readdirSync(VIDEO1_DIR)
      .filter(f => f.endsWith('.md'))
      .forEach(file => {
        const slug = normalizeSlug(slugify(file.replace(/-feedback-dna-genis\.md$/i, '').replace(/\.md$/i, '')));
        slugs.add(slug);
      });
  }

  if (fs.existsSync(VIDEO2_DIR)) {
    fs.readdirSync(VIDEO2_DIR)
      .filter(f => f.endsWith('.md'))
      .forEach(file => {
        const slug = normalizeSlug(slugify(file.replace(/_feedback\.md$/i, '').replace(/\.md$/i, '')));
        slugs.add(slug);
      });
  }

  return Array.from(slugs);
}
