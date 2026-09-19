// Scans posts/*.md → public/posts.json and books/*.md → public/books.json (both newest first).
// Runs before `npm start` and `npm run build`; exits 1 listing every invalid file.
import { mkdir, writeFile } from 'node:fs/promises';
import { loadBooks } from './books.mjs';
import { loadPosts } from './posts.mjs';

const [{ posts, errors: postErrors }, { books, errors: bookErrors }] = await Promise.all([
  loadPosts('posts'),
  loadBooks('books'),
]);
const errors = [...postErrors, ...bookErrors];

if (errors.length) {
  const files = new Set(errors.map((e) => e.file));
  console.error(`build-posts: ${errors.length} error(s) in ${files.size} file(s)`);
  for (const { file, field, message } of errors) console.error(`  ${file}: ${field} — ${message}`);
  process.exit(1);
}

await mkdir('public', { recursive: true });
await writeFile('public/posts.json', JSON.stringify(posts, null, 2) + '\n');
await writeFile('public/books.json', JSON.stringify(books, null, 2) + '\n');
console.log(
  `build-posts: wrote ${posts.length} posts to public/posts.json, ${books.length} books to public/books.json`,
);
