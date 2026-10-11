import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { render, routes, site } from '../.prerender/entry-server.js';

const base = new URL(site.url);
if (!['https:', 'http:'].includes(base.protocol) || base.pathname !== '/') {
  throw new Error('VITE_SITE_URL must be a complete origin such as https://example.dev');
}
const escape = (text) => String(text).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const sitemapEntries = [];
const template = await readFile('dist/index.html', 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--page-head-->')) {
  throw new Error('The build template is missing its prerender placeholders.');
}

for (const route of [...routes, '/404']) {
  const { html, meta } = render(route);
  const canonical = new URL(route === '/' ? '/' : route, base).href;
  const structured = meta.post ? {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: meta.post.title,
    description: meta.description, datePublished: meta.post.date,
    ...(meta.post.dateModified ? { dateModified: meta.post.dateModified } : {}),
    author: { '@type': 'Person', name: site.name, url: new URL('/about', base).href }, url: canonical,
  } : route === '/' ? {
    '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: canonical,
    jobTitle: 'Lead Machine Learning Platform Engineer',
    worksFor: { '@type': 'Organization', name: 'iFood' },
    sameAs: ['https://github.com/willianmrs', 'https://www.linkedin.com/in/willianmrs/'],
  } : null;
  if (!meta.notFound) {
    const lastModified = meta.post ? meta.post.dateModified || meta.post.date : undefined;
    sitemapEntries.push(`<url><loc>${escape(canonical)}</loc>${lastModified ? `<lastmod>${escape(lastModified)}</lastmod>` : ''}</url>`);
  }
  const head = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    meta.notFound ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${escape(canonical)}" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:type" content="${meta.post ? 'article' : 'website'}" />`,
    `<meta property="og:url" content="${escape(canonical)}" />`,
    '<meta name="twitter:card" content="summary" />',
    structured ? `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ');
  const output = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*\/>/, '')
    .replace('<!--page-head-->', head)
    .replace('<!--app-html-->', html)
    .replace('<div id="root">', `<div id="root"${meta.notFound ? ' data-not-found="true"' : ''}>`);
  const file = route === '/' ? 'dist/index.html' : join('dist', `${route.slice(1)}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, output);
  console.log(`Prerendered ${route}`);
}

await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', base).href}\n`);
