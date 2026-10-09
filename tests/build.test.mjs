import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { render, routes, site } from '../.prerender/entry-server.js';

test('every page ships its content and metadata as static HTML', async () => {
  for (const route of routes) {
    const path = route === '/' ? 'dist/index.html' : `dist${route}.html`;
    const html = await readFile(path, 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<main id="main">[\s\S]+<\/main>/);
    assert.equal((html.match(/<title>/g) || []).length, 1);
    assert.equal((html.match(/name="description"/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="${new URL(route, site.url).href}"`));
    assert.doesNotMatch(html, /<!--(?:app-html|page-head)-->/);
  }
});

test('Writing contains the six original Medium links and language labels', async () => {
  const html = await readFile('dist/writing.html', 'utf8');
  for (const id of ['b08a5afae576', '1d5d02377fc0', 'cbd2572ddb4b', '4d378cfe796f', '3c08be86a28d', 'fce0c94beca5']) {
    assert.ok(html.includes(`href="https://medium.com/p/${id}"`));
  }
  assert.match(html, /Article in Portuguese/);
  assert.match(html, /Article in English/);
  assert.match(html, /flatMapGroupsWithState/);
});

test('the homepage uses internal navigation and real curated articles', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  assert.match(html, /href="\/writing"/);
  assert.match(html, /href="\/about"/);
  assert.match(html, /Arbitrary Stateful Aggregation with Spark/);
  assert.match(html, /How iFood improved feature management/);
});

test('unknown routes render an actual not-found page', async () => {
  const { html, meta } = render('/writing/does-not-exist');
  assert.equal(meta.notFound, true);
  assert.match(html, /This path ends here/);
  const output = await readFile('dist/404.html', 'utf8');
  assert.match(output, /name="robots" content="noindex"/);
  assert.doesNotMatch(output, /rel="canonical"/);
});

test('sitemap contains published routes and excludes the template and 404', async () => {
  const xml = await readFile('dist/sitemap.xml', 'utf8');
  for (const route of routes) assert.ok(xml.includes(new URL(route, site.url).href));
  assert.doesNotMatch(xml, /your-post-slug|\/404/);
});
