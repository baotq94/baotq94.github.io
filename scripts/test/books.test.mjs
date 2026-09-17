import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { loadBooks, parseBook, parseFinished } from '../books.mjs';

const fixtures = join(import.meta.dirname, 'fixtures', 'books');
const fieldsByFile = (errors) => {
  const out = {};
  for (const { file, field } of errors) (out[file.split('/').pop()] ??= []).push(field);
  return out;
};

describe('loadBooks', () => {
  it('passes valid files, sorts year desc then order asc, and renders the review', async () => {
    const { books, errors } = await loadBooks(join(fixtures, 'valid'));
    assert.deepEqual(errors, []);
    assert.deepEqual(books.map((b) => b.slug), ['no-review', 'year-only-b', 'year-only-a', 'clean-architecture']);
    assert.deepEqual(books[3], {
      slug: 'clean-architecture',
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      finished: '2025-03-12',
      order: null,
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
        order: null,
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

  it('accepts a bare year, quoted or not, and an unknown author', async () => {
    const { books } = await loadBooks(join(fixtures, 'valid'));
    // year-only-b has order 1, so it must come before year-only-a despite the filename.
    const [first, second] = books.filter((b) => b.slug.startsWith('year-only'));
    assert.deepEqual([first.finished, first.order, first.author], ['2025', 1, 'Known Author']);
    assert.deepEqual([second.finished, second.order, second.author], ['2025', 2, null]);
  });

  it('reports every bad field in every bad file, with the filename', async () => {
    const { books, errors } = await loadBooks(join(fixtures, 'invalid'));
    assert.deepEqual(books, []);
    assert.deepEqual(fieldsByFile(errors), {
      'malformed.md': ['title', 'finished', 'order', 'rating', 'tags', 'link', 'lang'],
      'missing-fields.md': ['title', 'summary'],
    });
  });

  it('treats a missing directory as no books', async () => {
    assert.deepEqual(await loadBooks(join(fixtures, 'does-not-exist')), { books: [], errors: [] });
  });
});

describe('parseFinished', () => {
  for (const [input, expected] of [['2026', '2026'], [2026, '2026'], ['2024-02-29', '2024-02-29']]) {
    it(`accepts ${JSON.stringify(input)}`, () => assert.equal(parseFinished(input), expected));
  }
  for (const bad of ['26', '2026-02', '2026-02-30', 202, 2026.5, undefined]) {
    it(`rejects ${JSON.stringify(bad)}`, () => assert.equal(parseFinished(bad), null));
  }
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
