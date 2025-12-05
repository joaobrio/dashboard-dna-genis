import fs from 'fs';
import path from 'path';

interface VideoSnapshot {
  label: string;
  date?: string;
  scoreGeral: number | null;
}

export interface EvolucaoAluno {
  slug: string;
  nome: string;
  video1: VideoSnapshot;
  video2: VideoSnapshot;
  delta: number | null;
}

const VIDEO1_DIR = path.resolve(process.cwd(), '../analise-sensorial-041225/video-01/relatorios-feedback');
const VIDEO2_DIR = path.resolve(process.cwd(), '../analise-sensorial-041225/video-02/feedback-supremo');

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Mapa de aliases para unificar nomes entre vídeo 01 e 02
const ALIAS: Record<string, string> = {
  jeff: 'jefferson',
  will: 'william',
  vic: 'victoria',
};

function normalizeSlug(slug: string): string {
  return ALIAS[slug] || slug;
}

function extractScoreVideo1(content: string): number | null {
  const tableMatch = content.match(/Score Geral\s*\|\s*(\d+)/i);
  if (tableMatch) return Number(tableMatch[1]);
  return null;
}

function extractScoreVideo2(content: string): number | null {
  const match = content.match(/Score Geral:\s*\**\s*(\d+)/i);
  if (match) return Number(match[1]);
  return null;
}

export function loadEvolucaoAlunos(): EvolucaoAluno[] {
  const alunos: Record<string, Partial<EvolucaoAluno>> = {};

  // Video 1
  if (fs.existsSync(VIDEO1_DIR)) {
    fs.readdirSync(VIDEO1_DIR)
      .filter((f) => f.endsWith('.md'))
      .forEach((file) => {
        const raw = fs.readFileSync(path.join(VIDEO1_DIR, file), 'utf-8');
        const score = extractScoreVideo1(raw);
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
        const score = extractScoreVideo2(raw);
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
