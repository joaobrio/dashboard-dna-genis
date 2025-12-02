import fs from 'fs';
import path from 'path';
import { DNAGenisAnalysis } from '@/types/dna-genis';
import { pedroWerlangData } from '@/data/pedro-werlang';

const FEEDBACK_DIR = path.resolve(process.cwd(), '../feedbacks-supremos-011225');

export function prettyNameFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function loadAnalysisFromMarkdown(slug: string): Promise<DNAGenisAnalysis | null> {
  try {
    const filePath = path.join(FEEDBACK_DIR, `${slug}_FEEDBACK-SUPREMO.md`);
    if (!fs.existsSync(filePath)) return null;
    const raw = await fs.promises.readFile(filePath, 'utf-8');

    const match = raw.match(/---DNA_GENIS_DASHBOARD_START---\s*```json\s*({[\s\S]*?})\s*```/);
    if (!match?.[1]) return null;

    const parsed = JSON.parse(match[1]);
    return parsed as DNAGenisAnalysis;
  } catch (error) {
    console.error('Erro ao carregar análise do aluno', slug, error);
    return pedroWerlangData;
  }
}
