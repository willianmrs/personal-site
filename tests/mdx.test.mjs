import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile, rm, mkdir, mkdtemp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

test('a real MDX file becomes a local post, with Markdown and React components', async () => {
  const slug = `integration-${randomUUID()}`;
  const file = `src/content/posts/${slug}.mdx`;
  await mkdir('tmp', { recursive: true });
  const directory = await mkdtemp('tmp/mdx-');
  try {
    await writeFile(file, `
export const meta = {
  slug: '${slug}', title: 'MDX integration fixture',
  description: 'Temporary content used only by the test.',
  date: '2026-10-09', topic: 'Data & ML', tags: ['Testing'], language: 'EN'
}

export function Example() { return <button type="button">A React component</button> }

## A Markdown heading

This paragraph has **strong emphasis**.

| Feature | Supported |
| --- | --- |
| Tables | Yes |

<Example />
`);
    await build({ logLevel: 'silent', publicDir: false, build: { ssr: 'src/entry-server.tsx', outDir: directory } });
    const entry = await import(pathToFileURL(resolve(directory, 'entry-server.js')).href);
    const route = `/writing/${slug}`;
    assert.ok(entry.routes.includes(route));
    const { html, meta } = entry.render(route);
    assert.equal(meta.post.slug, slug);
    assert.match(html, /<h2>A Markdown heading<\/h2>/);
    assert.match(html, /<strong>strong emphasis<\/strong>/);
    assert.match(html, /<table>/);
    assert.match(html, /<button type="button">A React component<\/button>/);
    const writing = entry.render('/writing').html;
    assert.ok(writing.includes(`href="${route}"`));
    assert.match(writing, /On this site/);
    assert.match(writing, /https:\/\/medium.com\/p\/b08a5afae576/);
  } finally {
    await rm(file, { force: true });
    await rm(directory, { recursive: true, force: true });
  }
});
