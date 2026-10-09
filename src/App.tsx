import { useEffect, useRef, useState } from 'react';
import { articles, localPosts, profiles, selectedArticles } from './content';
import type { Topic } from './content';
import { Arrow } from './components/Arrow';
import { ArticleList } from './components/ArticleList';
import { DataFlow } from './components/DataFlow';
import { formatDate, normalizePath, site } from './lib/site';

export function pageMeta(path: string) {
  path = normalizePath(path);
  const post = localPosts.find((article) => article.url === path);
  const pages: Record<string, { title: string; description: string }> = {
    '/': { title: 'Willian Moreira — ML Platform Engineer', description: site.description },
    '/writing': { title: 'Writing — Willian Moreira', description: 'Articles on data systems, Spark, machine learning platforms and Bitcoin by Willian Moreira.' },
    '/about': { title: 'About — Willian Moreira', description: 'From data science to technical leadership. The experience and background of Willian Moreira, Lead ML Platform Engineer at iFood.' },
  };
  return post ? { title: `${post.title} — Willian Moreira`, description: post.description, post }
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
      <ExternalLink to={profiles.github}>GitHub</ExternalLink><ExternalLink to={profiles.linkedin}>LinkedIn</ExternalLink>
    </nav>
  </header>;
}

function Footer() {
  return <footer className="site-footer"><a className="wordmark" href="/" aria-label="Back to home">willian<span>_</span></a><span className="footer-note">Campinas, Brazil</span><div className="footer-links"><a href="/writing">Writing<Arrow /></a><ExternalLink to={profiles.github}>GitHub</ExternalLink><ExternalLink to={profiles.linkedin}>LinkedIn</ExternalLink></div></footer>;
}

function Home() {
  return <>
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-copy"><p className="eyebrow cyan">// data · systems · people</p><h1 id="home-title">Willian<br />Moreira<span className="cyan">.</span></h1><p className="hero-role">Lead Machine Learning Platform Engineer at iFood.</p><p className="hero-description">I build data and machine learning platforms,<br className="desktop-break" /> with a focus on real-time processing.</p><div className="hero-actions"><a className="button primary" href="/writing">Explore my writing<Arrow /></a><a className="button secondary" href="/about">More about me<Arrow /></a></div></div>
      <DataFlow />
    </section>
    <section className="home-writing section-rule" aria-labelledby="selected-title"><p className="section-label">01 / SELECTED WRITING</p><div className="section-heading"><h2 id="selected-title">A few ideas, written down<span className="cyan">.</span></h2><a className="text-link" href="/writing">All articles<Arrow /></a></div><ArticleList articles={selectedArticles} compact /></section>
    <section className="home-about section-rule" aria-labelledby="story-title"><p className="section-label">02 / ABOUT</p><div className="section-heading"><h2 id="story-title">From data science to technical leadership<span className="cyan">.</span></h2><a className="text-link" href="/about">Read my story<Arrow /></a></div><p>I lead the evolution of iFood’s Feature Platform and help engineers grow.</p></section>
  </>;
}

function Writing() {
  const [filter, setFilter] = useState<'All' | Topic>('All');
  const filtered = articles.filter((article) => filter === 'All' || article.topic === filter);
  return <>
    <section className="page-intro"><p className="eyebrow cyan">// notes from the field</p><h1>Writing<span className="cyan">.</span></h1><p className="page-description">Thoughts on data systems, streaming and machine learning platforms.</p></section>
    <section className="writing-index" aria-label="Articles">
      <div className="filters" role="group" aria-label="Filter articles by topic">{(['All', 'Data & ML', 'Bitcoin'] as const).map((topic) => <button key={topic} className={`filter-button ${topic === filter ? 'active' : ''}`} aria-pressed={topic === filter} onClick={() => setFilter(topic)}>{topic}</button>)}</div>
      <p className="result-count" role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}<span className="count-line" /></p>
      <ArticleList articles={filtered} />
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
    <section className="about-intro"><div><p className="eyebrow cyan">// about</p><h1>Data platforms, real-time systems, and the people behind them<span className="cyan">.</span></h1><p>I’m Willian, a Lead Machine Learning Platform Engineer at iFood, based in Campinas, Brazil. I lead the technical delivery and architecture of the Feature Platform, while mentoring engineers and shaping its roadmap.</p></div><AboutGraphic /></section>
    <div className="background section-rule"><section className="experience" aria-labelledby="experience-title"><h2 className="section-label" id="experience-title">01 / EXPERIENCE</h2><ol className="timeline">{experience.map((job) => <li key={job.date}><span className="timeline-date">{job.date}</span><div className="timeline-detail"><h3>{job.company}</h3><p className="job-role">{job.role}</p><p className="job-description">{job.description}</p></div></li>)}</ol></section><aside className="education"><h2 className="section-label">02 / EDUCATION</h2><div className="education-item"><h3>BSc in Computer Science</h3><p>UTFPR · 2012–2016</p></div><div className="education-item"><h3>Deep Learning Nanodegree</h3><p>Udacity · 2018</p></div><div className="tools"><h2 className="section-label">TOOLS I’VE WORKED WITH</h2><p>Spark · Kafka · Redis<br />Scala · Python · Go</p></div></aside></div>
    <section className="connect section-rule"><h2>Let’s connect<span className="cyan">.</span></h2><div className="connect-links"><ExternalLink className="button accent-outline" to={profiles.linkedin}>LinkedIn</ExternalLink><ExternalLink className="button secondary" to={profiles.github}>GitHub</ExternalLink><a className="text-link" href="/writing">Read my writing<Arrow /></a></div></section>
  </>;
}

function Post({ path }: { path: string }) {
  const post = localPosts.find((article) => article.url === path);
  if (!post?.Body) return <NotFound />;
  const Body = post.Body;
  return <article className="post"><a className="text-link back-link" href="/writing"><Arrow />All writing</a><header className="post-header"><p className="eyebrow cyan">// {post.tags.join(' · ').toLowerCase()}</p><h1>{post.title}<span className="cyan">.</span></h1><p className="post-description">{post.description}</p><div className="post-meta"><span>Willian Moreira</span><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.language}</span></div></header><div className="prose"><Body /></div><a className="text-link post-end" href="/writing">More writing<Arrow /></a></article>;
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
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('.section-rule, .article-list li').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [path]);
  return <div className="site-shell"><a className="skip-link" href="#main">Skip to content</a><Header path={path} /><main id="main">{path === '/' ? <Home /> : path === '/writing' ? <Writing /> : path === '/about' ? <About /> : path.startsWith('/writing/') ? <Post path={path} /> : <NotFound />}</main><Footer /></div>;
}
