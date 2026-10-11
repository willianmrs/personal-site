import { useEffect, useRef, useState } from 'react';
import { articles, draftPosts, localPosts, profiles, selectedArticles, type Article } from './content';
import { Arrow } from './components/Arrow';
import { ArticleList } from './components/ArticleList';
import { DataFlow } from './components/DataFlow';
import { SocialIcon } from './components/SocialIcon';
import { formatDate, normalizePath, site } from './lib/site';
import { createArticleSearch } from './lib/search';

const searchArticles = createArticleSearch(articles);

export function pageMeta(path: string) {
  path = normalizePath(path);
  const post = localPosts.find((article) => article.url === path);
  const draft = draftPosts.find((article) => article.url === path);
  const pages: Record<string, { title: string; description: string }> = {
    '/': { title: 'Willian Moreira — ML Platform Engineer', description: site.description },
    '/writing': { title: 'Writing — Willian Moreira', description: 'Articles on data systems, Spark, machine learning platforms and Bitcoin by Willian Moreira.' },
    '/about': { title: 'About — Willian Moreira', description: 'From data science to technical leadership. The experience and background of Willian Moreira, Lead ML Platform Engineer at iFood.' },
  };
  return draft ? { title: `Draft: ${draft.title} — Willian Moreira`, description: draft.description, draft }
    : post ? { title: `${post.title} — Willian Moreira`, description: post.description, post }
    : { ...(pages[path] || { title: 'Page not found — Willian Moreira', description: 'This page could not be found.' }), notFound: !pages[path] };
}

function ExternalLink({ to, children, className = '' }: { to: string; children: React.ReactNode; className?: string }) {
  return <a href={to} className={className} target="_blank" rel="noopener noreferrer">{children}<Arrow external /></a>;
}

function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return <header className="site-header" onKeyDown={(event) => {
    if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
  }}>
    <a className="wordmark" href="/" aria-label="Willian Moreira, home">willian<span>_</span></a>
    <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}<span>{open ? '−' : '+'}</span></button>
    <nav id="main-navigation" className={open ? 'navigation open' : 'navigation'} aria-label="Main navigation">
      {[['/', 'Home'], ['/writing', 'Writing'], ['/about', 'About']].map(([href, label]) => <a key={href} href={href} aria-current={(href === '/' ? path === '/' : path.startsWith(href)) ? 'page' : undefined}>{label}</a>)}
      <div className="nav-socials">{(['github', 'linkedin'] as const).map((name) => {
        const label = name === 'github' ? 'GitHub' : 'LinkedIn';
        return <a key={name} className="social-link" href={profiles[name]} aria-label={label} title={label} target="_blank" rel="noopener noreferrer"><SocialIcon name={name} /></a>;
      })}</div>
    </nav>
  </header>;
}

function Footer() {
  return <footer className="site-footer"><a className="wordmark" href="/" aria-label="Back to home">willian<span>_</span></a><span className="footer-note">Campinas, Brazil</span><div className="footer-links"><a href="/writing">Writing<Arrow /></a><ExternalLink to={profiles.github}>GitHub</ExternalLink><ExternalLink to={profiles.linkedin}>LinkedIn</ExternalLink></div></footer>;
}

function Home() {
  return <>
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-copy"><p className="eyebrow cyan">// data · systems · people</p><h1 id="home-title">Willian<br />Moreira<span className="cyan">.</span></h1><p className="hero-role">ML Platforms &amp; Technical Leadership</p><p className="hero-description">I build real-time ML platforms at scale.</p><div className="hero-actions"><a className="button primary" href="/writing">Explore my writing<Arrow /></a><a className="button secondary" href="/about">More about me<Arrow /></a></div></div>
      <DataFlow />
    </section>
    <section className="home-writing section-rule" aria-labelledby="selected-title"><p className="section-label">01 / SELECTED WRITING</p><div className="section-heading"><h2 id="selected-title">A few ideas, written down<span className="cyan">.</span></h2><a className="text-link" href="/writing">All articles<Arrow /></a></div><ArticleList articles={selectedArticles} compact /></section>
    <section className="home-about section-rule" aria-labelledby="story-title"><p className="section-label">02 / ABOUT</p><div className="section-heading"><h2 id="story-title">From data science to technical leadership<span className="cyan">.</span></h2><a className="text-link" href="/about">Read my story<Arrow /></a></div><p>I lead the evolution of iFood’s Feature Platform and help engineers grow.</p></section>
  </>;
}

function Writing() {
  const [query, setQuery] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const filtered = searchArticles(query);
  const clearSearch = () => { setQuery(''); searchInput.current?.focus(); };
  return <>
    <section className="page-intro"><p className="eyebrow cyan">// notes from the field</p><h1>Writing<span className="cyan">.</span></h1><p className="page-description">Thoughts on data systems, streaming and machine learning platforms.</p></section>
    <section className="writing-index" aria-label="Articles">
      <div className="article-search" role="search" aria-label="Search writing">
        <label className="sr-only" htmlFor="article-search">Search articles</label>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
        <input ref={searchInput} id="article-search" type="search" placeholder="Search articles…" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); clearSearch(); } }} aria-describedby="search-hint" autoComplete="off" spellCheck={false} />
        {query && <button className="clear-search" type="button" onClick={clearSearch} aria-label="Clear search">×</button>}
      </div>
      <p className="search-hint" id="search-hint">Search by title or description.</p>
      <p className="result-count" role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}<span className="count-line" /></p>
      {filtered.length ? <ArticleList articles={filtered} /> : <div className="search-empty"><h2>No articles found.</h2><p>Try a different word or a shorter search.</p><button className="text-link" type="button" onClick={clearSearch}>Clear search<Arrow /></button></div>}
      <p className="writing-note">Some articles were originally published in Portuguese. <span>EN / PT indicates the original language.</span></p>
    </section>
  </>;
}

const experience = [
  { date: '2022 — Present', company: 'iFood', role: 'Lead Machine Learning Platform Engineer', description: 'Technical leadership, architecture and team development.' },
  { date: '2021 — 2022', company: 'iFood', role: 'Senior Machine Learning Platform Engineer', description: 'Real-time feature computation, storage and low-latency serving.' },
  { date: '2019 — 2020', company: 'Dextra Digital', role: 'Data Engineer', description: 'Streaming data platforms with Spark, Kafka and Redis.' },
  { date: '2016 — 2019', company: 'Dom Rock', role: 'Data Scientist', description: 'Data pipelines, analysis and machine learning.' },
];

function AboutGraphic() {
  return <div className="about-graphic" aria-hidden="true"><svg viewBox="0 0 360 320"><circle className="orbit" cx="180" cy="178" r="117" fill="none" stroke="currentColor" strokeDasharray="2 8" /><path d="m180 62 115 196H65Z" fill="none" stroke="currentColor" opacity=".6" />{[{ x: 180, y: 62, label: 'Data' }, { x: 65, y: 258, label: 'Platforms' }, { x: 295, y: 258, label: 'People' }].map((node) => <g key={node.label}><circle cx={node.x} cy={node.y} r="51" fill="#080a0c" stroke="currentColor" /><text x={node.x} y={node.y - 5} textAnchor="middle">{node.label}</text><circle cx={node.x} cy={node.y + 16} r="3.5" fill="currentColor" /></g>)}<text className="diagram-caption" x="180" y="165" textAnchor="middle">BETTER<tspan x="180" dy="20">SYSTEMS</tspan><tspan x="180" dy="20">TOGETHER</tspan></text></svg></div>;
}

function About() {
  return <>
    <section className="about-intro"><div><p className="eyebrow cyan">// about</p><h1>Building real-time systems. Leading engineering teams<span className="cyan">.</span></h1><p>I’m Willian, a Lead Machine Learning Platform Engineer at iFood, based in Campinas, Brazil. I lead the technical delivery and architecture of the Feature Platform, while mentoring engineers and shaping its roadmap.</p></div><AboutGraphic /></section>
    <div className="background section-rule"><section className="experience" aria-labelledby="experience-title"><h2 className="section-label" id="experience-title">01 / EXPERIENCE</h2><ol className="timeline">{experience.map((job) => <li key={job.date}><span className="timeline-date">{job.date}</span><div className="timeline-detail"><h3>{job.company}</h3><p className="job-role">{job.role}</p><p className="job-description">{job.description}</p></div></li>)}</ol></section><aside className="education"><h2 className="section-label">02 / EDUCATION</h2><div className="education-item"><h3>BSc in Computer Science</h3><p>UTFPR · 2012–2016</p></div><div className="tools"><h2 className="section-label">TOOLS I’VE WORKED WITH</h2><p>Spark · Kafka · Redis<br />Scala · Python · Go</p></div></aside></div>
    <section className="connect section-rule"><h2>Let’s connect<span className="cyan">.</span></h2><div className="connect-links"><ExternalLink className="button accent-outline" to={profiles.linkedin}>LinkedIn</ExternalLink><ExternalLink className="button secondary" to={profiles.github}>GitHub</ExternalLink><a className="text-link" href="/writing">Read my writing<Arrow /></a></div></section>
  </>;
}

function Post({ path }: { path: string }) {
  const draft = draftPosts.find((article) => article.url === path);
  const post: Article | undefined = draft || localPosts.find((article) => article.url === path);
  if (!post?.Body) return <NotFound />;
  const Body = post.Body;
  const Cover = post.Cover;
  return <article className="post"><a className="text-link back-link" href="/writing"><Arrow />All writing</a>
    {draft && <aside className="draft-notice" aria-label="Draft status"><span className="draft-label">Draft · Local preview</span><p>{draft.reconstructed ? 'Reconstructed working draft. Text and research are still under editorial review.' : 'Working draft. Not approved for publication.'}</p></aside>}
    <header className="post-header"><p className="eyebrow cyan">// {post.tags.join(' · ').toLowerCase()}</p><h1>{post.title}{!/[.!?]$/.test(post.title) && <span className="cyan">.</span>}</h1><p className="post-description">{post.description}</p>{Cover && <Cover />}<div className="post-meta"><a href="/about" rel="author">Willian Moreira</a><span>{draft ? 'Last edited ' : ''}<time dateTime={post.date}>{formatDate(post.date)}</time></span>{!draft && post.dateModified && post.dateModified > post.date && <span>Updated <time dateTime={post.dateModified}>{formatDate(post.dateModified)}</time></span>}{post.readingMinutes && <span>{post.readingMinutes} min read</span>}<span>{post.language}</span></div></header><div className="prose"><Body /></div><a className="text-link post-end" href="/writing">More writing<Arrow /></a></article>;
}

function NotFound() {
  return <section className="not-found"><p className="eyebrow cyan">// 404</p><h1>This path ends here<span className="cyan">.</span></h1><p>The page you’re looking for could not be found.</p><a className="button primary" href="/">Back to home<Arrow /></a></section>;
}

export function App({ path }: { path: string }) {
  path = normalizePath(path);
  useEffect(() => {
    const meta = pageMeta(path);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    if (meta.draft) {
      const robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'noindex, nofollow';
      document.head.append(robots);
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('.section-rule, .article-list li').forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); if (meta.draft) document.querySelector('meta[name="robots"]')?.remove(); };
  }, [path]);
  return <div className="site-shell"><a className="skip-link" href="#main">Skip to content</a><Header path={path} /><main id="main">{path === '/' ? <Home /> : path === '/writing' ? <Writing /> : path === '/about' ? <About /> : path.startsWith('/writing/') || (import.meta.env.DEV && path.startsWith('/drafts/')) ? <Post path={path} /> : <NotFound />}</main><Footer /></div>;
}
