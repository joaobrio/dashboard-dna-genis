import fs from 'fs';
import path from 'path';
import { DNAGenisAnalysis } from '@/types/dna-genis';
import { pedroWerlangData } from '@/data/pedro-werlang';

// Em produção (Vercel), arquivos fora do projeto não são acessíveis.
// Mantemos os MDs em data/feedbacks-supremos-011225 dentro do projeto.
const FEEDBACK_DIR = path.resolve(process.cwd(), 'data/feedbacks-supremos-011225');

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

    // Suporta blocos com ou sem fence ```json
    const patterns = [
      /---DNA_GENIS_DASHBOARD_START---\s*```json\s*({[\s\S]*?})\s*---DNA_GENIS_DASHBOARD_END---\s*```/m,
      /---DNA_GENIS_DASHBOARD_START---\s*({[\s\S]*?})\s*---DNA_GENIS_DASHBOARD_END---/m,
    ];

    for (const regex of patterns) {
      const m = regex.exec(raw);
      if (m?.[1]) {
        const parsed = JSON.parse(m[1]);
        return parsed as DNAGenisAnalysis;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar análise do aluno', slug, error);
    return pedroWerlangData;
  }
}
