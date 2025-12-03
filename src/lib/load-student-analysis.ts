import fs from 'fs';
import path from 'path';
import { dnaGenisAnalysisSchema, type DnaGenisAnalysis } from '@/lib/zod-student';

const DATA_DIR = path.resolve(process.cwd(), 'src/data/alunos');

export function prettyNameFromSlug(slug?: string): string {
  if (!slug) return 'Aluno';
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getAllStudentSlugs(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));
}

export async function loadStudentJson(slug: string): Promise<DnaGenisAnalysis | null> {
  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const raw = await fs.promises.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    const validated = dnaGenisAnalysisSchema.parse(parsed);
    return validated;
  } catch (error) {
    console.error('Erro ao carregar/validar JSON do aluno', slug, error);
    return null;
  }
}
