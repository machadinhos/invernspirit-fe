import { dirname, join, relative, resolve } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import ignore from 'ignore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type Options = {
  exclude: string[];
  excludeNoIndexPages: boolean;
};

export function findPages({ exclude = [], excludeNoIndexPages = false }: Partial<Options> = {}): string[] {
  const rootDir = '../../build';
  const rootPath = resolve(__dirname, rootDir);
  const results: string[] = [];

  const ig = ignore().add(exclude);

  function walk(dir: string): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      const relativePath = relative(rootPath, fullPath)
        .replace(/\\/g, '/')
        .replace(/\.html$/i, '');

      if (ig.ignores(relativePath)) continue;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        if (
          excludeNoIndexPages &&
          readFileSync(fullPath, 'utf-8').includes('<meta name="robots" content="noindex, nofollow">')
        ) {
          continue;
        }
        results.push(relativePath);
      }
    }
  }

  walk(rootPath);
  return results;
}
