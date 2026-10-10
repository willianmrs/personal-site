import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, readdir, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, createServer } from 'vite';

test('drafts preview locally and stay out of client and server production builds', async () => {
  const slug = `local-only-${randomUUID()}`;
  const route = `/drafts/${slug}`;
  const title = 'Local-only editorial review fixture';
  const file = `content/drafts/${slug}.mdx`;
  const originalNodeEnv = process.env.NODE_ENV;
  let server;
  await mkdir('content/drafts', { recursive: true });
  await mkdir('tmp', { recursive: true });
  const directory = await mkdtemp('tmp/drafts-');
  try {
    await writeFile(file, `
export const meta = {
  slug: '${slug}', title: '${title}', description: 'Private content for integration testing.',
  date: '2026-10-09', topic: 'Data & ML', tags: ['Testing'], language: 'EN', draft: true
}

## A private draft

Private draft content used only by the integration test.
`);
    process.env.NODE_ENV = 'development';
    server = await createServer({ server: { middlewareMode: true }, logLevel: 'silent' });
    const development = await server.ssrLoadModule('/src/entry-server.tsx');
    const { html, meta } = development.render(route);
    assert.equal(meta.draft.draft, true);
    assert.ok(html.includes(title));
    assert.match(html, /Draft · Local preview/);
    assert.doesNotMatch(development.render('/writing').html, /Local-only editorial review fixture/);
    assert.equal(development.render(`/writing/${slug}`).meta.notFound, true);
    await server.close();
    server = undefined;

    process.env.NODE_ENV = 'production';
    await build({ logLevel: 'silent', publicDir: false, build: { outDir: directory } });
    const serverDirectory = `${directory}/ssr`;
    await build({ logLevel: 'silent', publicDir: false, build: { ssr: 'src/entry-server.tsx', outDir: serverDirectory } });
    const production = await import(pathToFileURL(resolve(serverDirectory, 'entry-server.js')).href);
    assert.ok(!production.routes.includes(route));
    assert.equal(production.render(route).meta.notFound, true);
    for (const outputFile of await readdir(directory, { recursive: true })) {
      if (!/\.(?:html|js)$/.test(outputFile)) continue;
      const output = await readFile(`${directory}/${outputFile}`, 'utf8');
      assert.ok(!output.includes(title), `Draft content leaked into ${outputFile}`);
      assert.ok(!output.includes(slug), `Draft slug leaked into ${outputFile}`);
    }
  } finally {
    await server?.close();
    await rm(file, { force: true });
    await rm(directory, { recursive: true, force: true });
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }
});
