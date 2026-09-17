// Reads and validates posts/*.md: front-matter plus a Markdown body. Used by build-posts.mjs and its tests.
// The shared validators below are also used by books.mjs.
import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { basename, join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

// gray-matter forwards options to its bundled js-yaml. JSON_SCHEMA keeps `date:` as the
// literal text; the default schema would turn 2026-02-30 into a Date for March 2.
const yaml = createRequire(import.meta.resolve('gray-matter'))('js-yaml');
export const MATTER_OPTIONS = { schema: yaml.JSON_SCHEMA };

export const DEFAULT_LANG = 'en';
// Simplified BCP 47: language plus optional subtags, e.g. vi, ja, en-US, zh-Hant.
export const LANG_TAG = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Strict YYYY-MM-DD → UTC Date, or null if the text is malformed or not a real calendar day. */
export function parseDate(value) {
  const match = typeof value === 'string' ? ISO_DATE.exec(value) : null;
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const roundTrips =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return roundTrips ? date : null;
}

export const isText = (value) => typeof value === 'string' && value.trim() !== '';

export const describe = (value) => (value === undefined ? 'missing' : `got ${JSON.stringify(value)}`);

export function isHttpsUrl(value) {
  if (!isText(value)) return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates one file. Returns { post, errors } where errors is a list of { file, field, message };
 * post is only set when errors is empty.
 */
export function parsePost(file, source) {
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
  if (!isText(data.category)) fail('category', `required text, ${describe(data.category)}`);

  const date = parseDate(data.date);
  if (!date) fail('date', `required real calendar date as YYYY-MM-DD, ${describe(data.date)}`);

  if (data.excerpt !== undefined && typeof data.excerpt !== 'string') {
    fail('excerpt', `must be text, ${describe(data.excerpt)}`);
  }
  if (data.tags !== undefined && !(Array.isArray(data.tags) && data.tags.every(isText))) {
    fail('tags', `must be a list of text, ${describe(data.tags)}`);
  }

  if (data.lang !== undefined && !(typeof data.lang === 'string' && LANG_TAG.test(data.lang))) {
    fail('lang', `must be a language tag like "vi" or "ja", ${describe(data.lang)}`);
  }

  if (errors.length) return { errors };

  return {
    errors,
    post: {
      slug: basename(file, '.md'),
      title: data.title.trim(),
      date: data.date,
      timestamp: date.getTime(),
      category: data.category.trim(),
      excerpt: data.excerpt?.trim() ?? '',
      tags: data.tags ?? [],
      lang: data.lang ?? DEFAULT_LANG,
      html: marked.parse(content, { async: false }).trim(),
    },
  };
}

/** Reads every .md file in dir. Collects errors from all files instead of stopping at the first. */
export async function loadPosts(dir) {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
  const results = await Promise.all(
    files.map(async (f) => parsePost(join(dir, f), await readFile(join(dir, f), 'utf8'))),
  );

  const errors = results.flatMap((r) => r.errors);
  const posts = results
    .flatMap((r) => (r.post ? [r.post] : []))
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(({ timestamp, ...post }) => post);

  return { posts, errors };
}
