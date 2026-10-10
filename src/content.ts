import type { ComponentType } from 'react';

export type Topic = 'Data & ML' | 'Bitcoin';
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  topic: Topic;
  tags: string[];
  language: 'EN' | 'PT';
  readingMinutes?: number;
};
export type Article = PostMeta & { source: 'Medium' | 'On this site'; url: string; Body?: ComponentType; Cover?: ComponentType };
export type DraftArticle = Article & { draft: true; reconstructed: boolean };

// Use Medium story permalinks instead of hard-coding the personal domain.
const external: Article[] = [
  {
    slug: 'arbitrary-stateful-aggregation-with-spark',
    title: 'Arbitrary Stateful Aggregation with Spark',
    description: 'How to build custom stateful streaming logic with flatMapGroupsWithState, including timeouts, conditional outputs, practical examples and performance considerations.',
    date: '2025-05-03', topic: 'Data & ML', tags: ['Spark', 'Streaming'], language: 'EN',
    source: 'Medium', url: 'https://medium.com/p/b08a5afae576',
  },
  {
    slug: 'economics-and-value-of-bitcoin', title: 'Economics and Value of Bitcoin',
    description: 'An exploration of Bitcoin’s limited supply, halving cycles and price volatility, alongside the debate around its role as a store of value.',
    date: '2024-08-31', topic: 'Bitcoin', tags: ['Bitcoin', 'Economics'], language: 'EN',
    source: 'Medium', url: 'https://medium.com/p/1d5d02377fc0',
  },
  {
    slug: 'the-basics-of-bitcoin', title: 'The Basics of Bitcoin: What It Is and How It Works?',
    description: 'An introduction to Bitcoin’s architecture, covering blockchain, cryptographic hashes, proof of work and how the network reaches consensus.',
    date: '2024-08-27', topic: 'Bitcoin', tags: ['Bitcoin'], language: 'EN',
    source: 'Medium', url: 'https://medium.com/p/cbd2572ddb4b',
  },
  {
    slug: 'ifood-feature-platform', title: 'How iFood improved feature management to combat fraud',
    description: 'A look at iFood’s Feature Platform: how real-time feature computation, consistent definitions and low-latency serving support fraud detection.',
    date: '2024-01-24', topic: 'Data & ML', tags: ['ML Platforms', 'Feature Engineering'], language: 'PT',
    source: 'Medium', url: 'https://medium.com/p/4d378cfe796f',
  },
  {
    slug: 'data-evolution', title: 'From Data Warehouses to Data Mesh',
    description: 'A tour of data warehouses, data lakes and data mesh, exploring how data ownership, governance and architecture evolve as organizations grow.',
    date: '2023-07-20', topic: 'Data & ML', tags: ['Data Architecture'], language: 'EN',
    source: 'Medium', url: 'https://medium.com/p/3c08be86a28d',
  },
  {
    slug: 'what-the-hell-is-big-data', title: 'What the Hell is… Big Data?',
    description: 'An introduction to big data’s defining characteristics, common business applications and the privacy concerns that come with collecting and analyzing data.',
    date: '2020-11-27', topic: 'Data & ML', tags: ['Data Fundamentals'], language: 'EN',
    source: 'Medium', url: 'https://medium.com/p/fce0c94beca5',
  },
];

const modules = import.meta.glob<{ default: ComponentType; meta: PostMeta; Cover?: ComponentType }>('./content/posts/*.mdx', { eager: true });
const usedSlugs = new Set(external.map((article) => article.slug));
const local: Article[] = Object.entries(modules).map(([file, module]) => {
  const meta = module.meta;
  if (!meta || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug) || usedSlugs.has(meta.slug)) {
    throw new Error(`Missing, invalid or duplicate post slug: ${file}`);
  }
  if (!meta.title?.trim() || !meta.description?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)
      || !Number.isFinite(Date.parse(meta.date)) || new Date(meta.date).toISOString().slice(0, 10) !== meta.date
      || !['Data & ML', 'Bitcoin'].includes(meta.topic) || !['EN', 'PT'].includes(meta.language)
      || !Array.isArray(meta.tags) || !meta.tags.every((tag) => typeof tag === 'string')) {
    throw new Error(`Invalid post metadata: ${file}`);
  }
  usedSlugs.add(meta.slug);
  return { ...meta, source: 'On this site', url: `/writing/${meta.slug}`, Body: module.default, Cover: module.Cover };
});

export const articles: Article[] = [...external, ...local].sort((a, b) => b.date.localeCompare(a.date));
export const selectedArticles = ['we-made-coding-faster', 'arbitrary-stateful-aggregation-with-spark', 'ifood-feature-platform']
  .map((slug) => articles.find((article) => article.slug === slug)!);
export const localPosts = local;

// Vite replaces DEV with false in production. Drafts are never published posts.
const draftModules = import.meta.env.DEV
  ? import.meta.glob<{ default: ComponentType; meta: PostMeta & { draft: true; reconstructed?: boolean }; Cover?: ComponentType }>('../content/drafts/*.mdx', { eager: true })
  : {};
export const draftPosts: DraftArticle[] = Object.entries(draftModules).map(([file, module]) => {
  if (module.meta?.draft !== true || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(module.meta.slug)
      || usedSlugs.has(module.meta.slug) || !module.meta.title?.trim() || !module.meta.description?.trim()) {
    throw new Error(`Invalid draft metadata: ${file}`);
  }
  usedSlugs.add(module.meta.slug);
  return {
    ...module.meta, draft: true, reconstructed: module.meta.reconstructed === true,
    source: 'On this site', url: `/drafts/${module.meta.slug}`, Body: module.default, Cover: module.Cover,
  };
});

export const profiles = {
  github: 'https://github.com/willianmrs',
  linkedin: 'https://www.linkedin.com/in/willianmrs/',
};
