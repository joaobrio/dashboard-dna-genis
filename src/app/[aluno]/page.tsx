import { notFound } from 'next/navigation';
import { getAllStudentSlugs } from '@/lib/load-student-analysis';

/**
 * Fallback page for /[aluno] routes WITHOUT access key.
 * Always returns 404 to enforce key-based access control.
 *
 * Valid URLs require the format: /[aluno]/[key]
 * Example: /bruno-monteiro/3n5msu
 */
export default function AlunoWithoutKeyPage() {
  return notFound();
}

/**
 * Generate static params for all student slugs.
 * This ensures that old URLs without keys return 404.
 */
export async function generateStaticParams() {
  const slugs = getAllStudentSlugs();
  return slugs.map((slug) => ({ aluno: slug }));
}
