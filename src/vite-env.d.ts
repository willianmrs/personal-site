/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
  export const meta: import('./content').PostMeta;
  export const Cover: ComponentType | undefined;
}
