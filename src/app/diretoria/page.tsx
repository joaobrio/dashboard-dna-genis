import { notFound } from 'next/navigation';

/**
 * Fallback page for /diretoria route WITHOUT access key.
 * Always returns 404 to enforce key-based access control.
 *
 * Valid URL requires the format: /diretoria/[key]
 * Example: /diretoria/l9dlss
 */
export default function DiretoriaWithoutKeyPage() {
  return notFound();
}

export async function generateStaticParams() {
  return [{}];
}
