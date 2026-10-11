import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { render, routes, site } from '../.prerender/entry-server.js';

const slug = 'the-case-for-real-time-features';
const route = `/writing/${slug}`;
const title = 'The Case for Real-Time Features: When Freshness Matters';

test('the real-time features article ships as an indexable post with static illustrations', async () => {
  assert.ok(routes.includes(route));
  const { meta } = render(route);
  assert.equal(meta.post.slug, slug);
  assert.equal(meta.post.date, '2026-10-10');
  assert.equal(meta.post.readingMinutes, 6);

  const output = await readFile(`dist${route}.html`, 'utf8');
  assert.ok(output.includes(title));
  assert.equal((output.match(/<figure class="freshness-figure">/g) || []).length, 3);
  assert.match(output, /Recent events must arrive before the decision/);
  assert.match(output, /previous transactions visible/);
  assert.match(output, /Request-time computation/);
  assert.doesNotMatch(output, /draft-notice|Last edited|tecton/i);

  const head = output.match(/<head>[\s\S]*?<\/head>/)[0];
  assert.ok(head.includes(`rel="canonical" href="${new URL(route, site.url).href}"`));
  assert.doesNotMatch(head, /noindex/);
  const structured = JSON.parse(head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(structured['@type'], 'BlogPosting');
  assert.equal(structured.headline, title);
  assert.equal(structured.datePublished, '2026-10-10');
});

test('the article is discoverable and its former draft route is no longer available', async () => {
  const home = render('/').html;
  assert.ok(home.includes(`href="${route}"`));
  assert.ok(home.indexOf(`href="${route}"`) < home.indexOf('href="/writing/we-made-coding-faster"'));
  assert.ok(render('/writing').html.includes(`href="${route}"`));
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.ok(sitemap.includes(new URL(route, site.url).href));
  assert.doesNotMatch(sitemap, /\/drafts\//);
  assert.equal(render(`/drafts/${slug}`).meta.notFound, true);
});
