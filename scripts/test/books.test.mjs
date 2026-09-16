import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { loadBooks, parseBook } from '../books.mjs';

const fixtures = join(import.meta.dirname, 'fixtures', 'books');
const fieldsByFile = (errors) => {
  const out = {};
  for (const { file, field } of errors) (out[file.split('/').pop()] ??= []).push(field);
  return out;
};

describe('loadBooks', () => {
  it('passes valid files, sorts newest finished first and renders the review', async () => {
    const { books, errors } = await loadBooks(join(fixtures, 'valid'));
    assert.deepEqual(errors, []);
    assert.deepEqual(books.map((b) => b.slug), ['no-review', 'clean-architecture']);
    assert.deepEqual(books[1], {
      slug: 'clean-architecture',
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      finished: '2025-03-12',
      summary: 'Boundaries, dependency rule, and why frameworks are details.',
      rating: 4,
      tags: ['architecture', 'dev'],
      link: 'https://www.goodreads.com/book/show/18043011',
      lang: 'vi',
      hasReview: true,
      review: '<p>Phần review của tôi.</p>\n<ul>\n<li>Một <strong>ý</strong> chính</li>\n</ul>',
    });
  });

  it('emits hasReview: false and nulls for a whitespace-only body and missing optionals', async () => {
    const { books } = await loadBooks(join(fixtures, 'valid'));
    assert.deepEqual(
      { ...books[0] },
      {
        slug: 'no-review',
        title: 'No review yet',
        author: 'Someone',
        finished: '2026-01-05',
        summary: 'Only a summary.',
        rating: null,
        tags: [],
        link: null,
        lang: 'en',
        hasReview: false,
        review: '',
      },
    );
  });

  it('reports every bad field in every bad file, with the filename', async () => {
    const { books, errors } = await loadBooks(join(fixtures, 'invalid'));
    assert.deepEqual(books, []);
    assert.deepEqual(fieldsByFile(errors), {
      'malformed.md': ['title', 'finished', 'rating', 'tags', 'link', 'lang'],
      'missing-fields.md': ['title', 'author', 'summary'],
    });
  });

  it('treats a missing directory as no books', async () => {
    assert.deepEqual(await loadBooks(join(fixtures, 'does-not-exist')), { books: [], errors: [] });
  });
});

describe('parseBook', () => {
  it('reports YAML syntax errors instead of throwing', () => {
    const { errors } = parseBook('broken.md', '---\ntitle: [unclosed\n---\n');
    assert.deepEqual(errors.map((e) => e.field), ['front-matter']);
  });

  for (const bad of [0, 2.5, '4']) {
    it(`rejects rating ${JSON.stringify(bad)}`, () => {
      const source = `---\ntitle: T\nauthor: A\nfinished: 2025-01-01\nsummary: S\nrating: ${JSON.stringify(bad)}\n---\n`;
      assert.deepEqual(parseBook('x.md', source).errors.map((e) => e.field), ['rating']);
    });
  }
});
