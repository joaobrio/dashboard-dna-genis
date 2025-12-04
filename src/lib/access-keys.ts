import fs from 'fs';
import path from 'path';

// Type for the access keys object
type AccessKeys = Record<string, string>;

const ACCESS_KEYS_PATH = path.resolve(process.cwd(), 'src/data/access-keys.json');

function loadAccessKeys(): AccessKeys {
  try {
    const raw = fs.readFileSync(ACCESS_KEYS_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed as AccessKeys;
  } catch (error) {
    console.error('Erro ao carregar access-keys.json', error);
    return {};
  }
}

/**
 * Validates if the provided key matches the slug's access key
 * @param slug - The student or page slug
 * @param key - The access key to validate
 * @returns boolean indicating if the key is valid
 */
export function validateAccessKey(slug: string, key: string): boolean {
  const accessKeys = loadAccessKeys();
  const expectedKey = accessKeys[slug];
  if (!expectedKey) return false;

  // Constant-time comparison to prevent timing attacks
  if (key.length !== expectedKey.length) return false;

  let result = 0;
  for (let i = 0; i < key.length; i++) {
    result |= key.charCodeAt(i) ^ expectedKey.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Gets the access key for a specific slug
 * @param slug - The student or page slug
 * @returns The access key or null if not found
 */
export function getAccessKey(slug: string): string | null {
  const accessKeys = loadAccessKeys();
  return accessKeys[slug] || null;
}

/**
 * Gets all student slugs that have access keys
 * @returns Array of slugs
 */
export function getAllSlugsWithKeys(): string[] {
  const accessKeys = loadAccessKeys();
  return Object.keys(accessKeys).filter(slug => slug !== 'diretoria');
}

/**
 * Checks if a slug exists in the access keys
 * @param slug - The slug to check
 * @returns boolean
 */
export function slugExists(slug: string): boolean {
  const accessKeys = loadAccessKeys();
  return slug in accessKeys;
}
