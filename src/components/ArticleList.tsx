import { Arrow } from './Arrow';
import type { Article } from '../content';

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export function ArticleList({ articles, compact = false }: { articles: Article[]; compact?: boolean }) {
  return <ul className={`article-list ${compact ? 'compact' : ''}`}>
    {articles.map((article) => <li key={article.slug}>
      <a className="article-link" href={article.url} {...(article.source === 'Medium' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        <time className="article-year" dateTime={article.date}>{compact ? article.date.slice(0, 4) : monthYear.format(new Date(`${article.date}T00:00:00Z`))}</time>
        <div className="article-info"><h3>{article.title}</h3>{!compact && <p>{article.description}</p>}<div className="article-tags">{article.tags.join(' · ')}</div></div>
        <div className="article-destination">{!compact && <span className="source-label">{article.source}</span>}<span className="language" aria-label={`Article in ${article.language === 'EN' ? 'English' : 'Portuguese'}`}>{article.language}</span><Arrow external={article.source === 'Medium'} /></div>
      </a>
    </li>)}
  </ul>;
}
