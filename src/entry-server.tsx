import { renderToString } from 'react-dom/server';
import { App, pageMeta } from './App';
import { localPosts } from './content';
import { site } from './lib/site';

export const routes = ['/', '/writing', '/about', ...localPosts.map((post) => post.url)];
export { site };
export function render(path: string) {
  return { html: renderToString(<App path={path} />), meta: pageMeta(path) };
}
