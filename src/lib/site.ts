export const site = {
  name: 'Willian Moreira',
  url: (import.meta.env.VITE_SITE_URL || 'https://www.willianmoreira.dev').replace(/\/$/, ''),
  description: 'Data platforms, real-time systems, and the people behind them. Writing and experience by Willian Moreira, Lead ML Platform Engineer at iFood.',
};

export function normalizePath(path: string) {
  return path.split('?')[0].replace(/\/+$/, '') || '/';
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${value}T00:00:00Z`));
}
