// Scans posts/*.md and writes public/posts.json (newest first).
// Runs before `npm start` and `npm run build`; exits 1 listing every invalid file.
import { mkdir, writeFile } from 'node:fs/promises';
import { loadPosts } from './posts.mjs';

const POSTS_DIR = 'posts';
const OUT_FILE = 'public/posts.json';

const { posts, errors } = await loadPosts(POSTS_DIR);

if (errors.length) {
  const files = new Set(errors.map((e) => e.file));
  console.error(`build-posts: ${errors.length} error(s) in ${files.size} file(s)`);
  for (const { file, field, message } of errors) console.error(`  ${file}: ${field} — ${message}`);
  process.exit(1);
}

await mkdir('public', { recursive: true });
await writeFile(OUT_FILE, JSON.stringify(posts, null, 2) + '\n');
console.log(`build-posts: wrote ${posts.length} posts to ${OUT_FILE}`);
