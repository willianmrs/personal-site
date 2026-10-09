import Fuse from 'fuse.js';

export function createArticleSearch<T extends { title: string; description: string }>(items: readonly T[]) {
  const index = new Fuse(items, {
    keys: [{ name: 'title', weight: 2 }, { name: 'description', weight: 1 }],
    threshold: .35,
    ignoreLocation: true,
    ignoreDiacritics: true,
    useTokenSearch: true,
    tokenMatch: 'all',
  });

  return (query: string): T[] => query.trim()
    ? index.search(query.trim()).map(({ item }) => item)
    : [...items];
}
