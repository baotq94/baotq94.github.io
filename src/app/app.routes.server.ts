import { readFile } from 'node:fs/promises';
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    // Runs at build time from the project root, after `prebuild` wrote public/posts.json.
    async getPrerenderParams() {
      const posts: { slug: string }[] = JSON.parse(await readFile('public/posts.json', 'utf8'));
      return posts.map(({ slug }) => ({ slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
