import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import { App } from './App';
import './styles.css';

const root = document.getElementById('root')!;
const app = <StrictMode><App path={window.location.pathname} /></StrictMode>;
if (root.querySelector('.site-shell') && !root.dataset.notFound) hydrateRoot(root, app);
else createRoot(root).render(app);
