import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { render, routes, site } from '../.prerender/entry-server.js';

const route = '/writing/we-made-coding-faster';
const title = 'We Made Coding Faster. Did We Make Engineering Better?';

test('the published essay ships its illustration, editorial elements, and seven references', async () => {
  assert.ok(routes.includes(route));
  const { html, meta } = render(route);
  assert.equal(meta.post.slug, 'we-made-coding-faster');
  assert.ok(html.includes(title));
  assert.match(html, /class="engineering-flow"/);
  assert.match(html, /Pause engineering flow animation/);
  assert.match(html, /incoming code changes/);
  assert.equal((html.match(/<blockquote class="editorial-quote">/g) || []).length, 2);
  assert.equal((html.match(/<aside class="editorial-highlight"/g) || []).length, 2);
  assert.match(html.replace(/<!--.*?-->/g, ''), /12 min read/);
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.equal((html.match(/<h2/g) || []).length, 7);
  const references = html.split('class="research-references"')[1];
  assert.equal((references.match(/<li>/g) || []).length, 7);
  assert.doesNotMatch(html, /draft-notice|Reconstructed working draft|working draft|Last edited/);

  const output = await readFile(`dist${route}.html`, 'utf8');
  const head = output.match(/<head>[\s\S]*?<\/head>/)[0];
  assert.ok(head.includes(`rel="canonical" href="${new URL(route, site.url).href}"`));
  assert.doesNotMatch(head, /noindex/);
  assert.match(head, /property="og:type" content="article"/);
  const structured = JSON.parse(head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(structured['@type'], 'BlogPosting');
  assert.equal(structured.headline, title);
  assert.equal(structured.datePublished, '2026-10-09');
});

test('the essay is listed on Writing, featured on Home, and included in the sitemap', async () => {
  for (const page of ['/writing', '/']) {
    assert.ok(render(page).html.includes(`href="${route}"`));
  }
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.ok(sitemap.includes(new URL(route, site.url).href));
  assert.doesNotMatch(sitemap, /\/drafts\//);
  assert.equal(render('/drafts/we-made-coding-faster').meta.notFound, true);
});
