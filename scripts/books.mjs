// Reads and validates books/*.md: front-matter plus an optional Markdown review body.
// Used by build-posts.mjs and its tests.
import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { DEFAULT_LANG, describe, isHttpsUrl, isText, LANG_TAG, MATTER_OPTIONS, parseDate } from './posts.mjs';

/**
 * Validates one file. Returns { book, errors } where errors is a list of { file, field, message };
 * book is only set when errors is empty.
 */
export function parseBook(file, source) {
  const errors = [];
  const fail = (field, message) => errors.push({ file, field, message });

  let data, content;
  try {
    ({ data, content } = matter(source, MATTER_OPTIONS));
  } catch (err) {
    fail('front-matter', `invalid YAML: ${err.message.split('\n')[0]}`);
    return { errors };
  }

  if (!isText(data.title)) fail('title', `required text, ${describe(data.title)}`);
  if (!isText(data.author)) fail('author', `required text, ${describe(data.author)}`);
  if (!isText(data.summary)) fail('summary', `required text, ${describe(data.summary)}`);

  const finished = parseDate(data.finished);
  if (!finished) fail('finished', `required real calendar date as YYYY-MM-DD, ${describe(data.finished)}`);

  if (data.rating !== undefined && !(Number.isInteger(data.rating) && data.rating >= 1 && data.rating <= 5)) {
    fail('rating', `must be a whole number from 1 to 5, ${describe(data.rating)}`);
  }
  if (data.tags !== undefined && !(Array.isArray(data.tags) && data.tags.every(isText))) {
    fail('tags', `must be a list of text, ${describe(data.tags)}`);
  }
  if (data.link !== undefined && !isHttpsUrl(data.link)) {
    fail('link', `must be an https URL, ${describe(data.link)}`);
  }
  if (data.lang !== undefined && !(typeof data.lang === 'string' && LANG_TAG.test(data.lang))) {
    fail('lang', `must be a language tag like "vi" or "ja", ${describe(data.lang)}`);
  }

  if (errors.length) return { errors };

  const hasReview = content.trim() !== '';

  return {
    errors,
    book: {
      slug: basename(file, '.md'),
      title: data.title.trim(),
      author: data.author.trim(),
      finished: data.finished,
      timestamp: finished.getTime(),
      summary: data.summary.trim(),
      rating: data.rating ?? null,
      tags: data.tags ?? [],
      link: data.link ?? null,
      lang: data.lang ?? DEFAULT_LANG,
      hasReview,
      review: hasReview ? marked.parse(content, { async: false }).trim() : '',
    },
  };
}

/** Reads every .md file in dir (a missing dir means no books). Collects errors from all files. */
export async function loadBooks(dir) {
  let files;
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
  } catch (err) {
    if (err.code === 'ENOENT') return { books: [], errors: [] };
    throw err;
  }

  const results = await Promise.all(
    files.map(async (f) => parseBook(join(dir, f), await readFile(join(dir, f), 'utf8'))),
  );

  const errors = results.flatMap((r) => r.errors);
  const books = results
    .flatMap((r) => (r.book ? [r.book] : []))
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(({ timestamp, ...book }) => book);

  return { books, errors };
}
