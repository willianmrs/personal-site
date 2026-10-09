# Willian Moreira — personal site

A static personal website built with React, Vite and TypeScript. Black, cyan,
and a little motion. The interface and summaries are in English; published
articles keep their original language.

## Run locally

Requires Node.js 22.12+ and npm. If you use nvm, run `nvm use` first.

```sh
make install
make run
```

Open **http://127.0.0.1:5173**. The server reloads changes automatically.
Stop it with Ctrl+C. Use `make run PORT=3000` for another port.
`make instlal` is also available as an alias for `make install`.

```sh
make build        # Typecheck, bundle, and generate static HTML in dist/
make preview      # Serve the production build locally
make check        # TypeScript only
make test         # Build + static output and MDX integration tests
```

`make install` uses `npm ci` and the committed lockfile for reproducible installs.
When adding dependencies, use `npm install <package>` and commit the updated lockfile.

## Pages and interactions

- **Home** (`/`): introduction, animated data flow, selected writing, and links
  to the full writing index and background.
- **Writing** (`/writing`): article summaries, topic filters, original language
  labels, and a mixed list of Medium articles and locally published posts.
- **About** (`/about`): experience, education, tools, and social links.
- **Posts** (`/writing/<slug>`): full MDX content, when you add a post.
- **404**: a custom not-found page.

Internal navigation uses real links between generated pages. Medium and social
links open in a new tab. The data flow has a pause control, honors reduced-motion
preferences, and stops animating when offscreen or in a background tab. Content
remains readable without JavaScript; filters and animations use React in the browser.
Fonts are self-hosted through npm packages, with no Google Fonts requests.

## Publish a post

1. Copy `content/templates/post.mdx` to `src/content/posts/your-post-slug.mdx`.
2. Edit the exported `meta` object and write the body in Markdown/MDX.
3. Run `make run` to preview, then `make test` before publishing.

```mdx
export const meta = {
  slug: 'understanding-streaming-state',
  title: 'Understanding streaming state',
  description: 'A short summary of what this article covers.',
  date: '2026-10-09',
  topic: 'Data & ML',
  tags: ['Spark', 'Streaming'],
  language: 'EN'
}

## Start with the problem

Your article goes here.
```

Posts in `src/content/posts/` are published automatically. Keep unfinished posts
outside that folder; the template is intentionally outside it. Slugs must be
unique lowercase words separated by hyphens; dates use `YYYY-MM-DD`.
The current topics are `Data & ML` and `Bitcoin`, and languages are `EN` and `PT`.
The build validates metadata, adds each post to Writing, generates its HTML and
includes its URL in the sitemap. Markdown supports tables, code blocks, images,
and links. MDX can import interactive React components too.

Store post images under `public/images/` and reference them with `/images/file.webp`.
To add an external article, edit the `external` list in `src/content.ts`.
Articles are listed newest first; Home uses a separately curated selection.
External titles can be translated or shortened for display, without changing the
original article or its language.

## Vercel

Import `willianmrs/personal-site` into Vercel. `vercel.json` already specifies
`npm ci`, `npm run build`, and the `dist` output directory. No server functions
or database are required.

Set **`VITE_SITE_URL`** to the final domain, for example `https://your-domain.dev`,
in Vercel's environment variables **before deploying**. For local builds, copy
`.env.example` to `.env.local` and change its value. The default is
`https://willianmoreira.com`; replace it if hosting on your new `.dev` domain.
This setting controls canonical URLs, Open Graph tags and the sitemap.

The build prerenders every published route. Do not add a catch-all rewrite to
`index.html`: Vercel should serve the generated pages and the custom 404.

Medium story permalinks currently redirect to your configured custom domain.
If you move `willianmoreira.com` from Medium to this site, also disconnect that
domain in Medium's settings so the original articles remain accessible there.
Using a separate `.dev` domain for this site does not require that change.

## Source map

```text
src/App.tsx                  Pages, navigation and layout
src/components/DataFlow.tsx Animated canvas + static SVG fallback
src/components/ArticleList.tsx
src/content.ts               Medium articles, summaries and local post registry
src/content/posts/           Published MDX posts
src/styles.css               Responsive design and motion preferences
src/prose.css                Local article typography
scripts/prerender.mjs         Static HTML, metadata, sitemap and robots.txt
content/templates/post.mdx   Unpublished starter for a future post
```

Public bio and experience are based on the supplied LinkedIn export. Article
summaries are editorial summaries of the original publications, including the
feature-platform article also published on the AWS blog.
