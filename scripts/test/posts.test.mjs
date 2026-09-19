import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { loadPosts, parseDate, parsePost } from '../posts.mjs';

const fixtures = join(import.meta.dirname, 'fixtures');
const fieldsByFile = (errors) => {
  const out = {};
  for (const { file, field } of errors) (out[file.split('/').pop()] ??= []).push(field);
  return out;
};

describe('loadPosts', () => {
  it('passes valid files and sorts newest first by timestamp', async () => {
    const { posts, errors } = await loadPosts(join(fixtures, 'valid'));
    assert.deepEqual(errors, []);
    assert.deepEqual(
      posts.map((p) => p.slug),
      ['newer', 'older'],
    );
    assert.deepEqual(posts[0], {
      slug: 'newer',
      title: 'Newer post',
      date: '2026-10-02',
      category: 'Books',
      excerpt: '',
      tags: [],
      lang: 'en',
      html: '<p>Quoted date, no excerpt or tags.</p>',
    });
    assert.equal(posts[1].lang, 'vi');
  });

  it('reports every bad field in every bad file, with the filename', async () => {
    const { posts, errors } = await loadPosts(join(fixtures, 'invalid'));
    assert.deepEqual(posts, []);
    assert.deepEqual(fieldsByFile(errors), {
      'malformed.md': ['date', 'tags', 'lang'],
      'missing-fields.md': ['title', 'category'],
    });
    for (const e of errors) assert.match(e.file, /fixtures\/invalid\/[\w-]+\.md$/);
  });
});

describe('parseDate', () => {
  it('accepts real YYYY-MM-DD dates', () => {
    assert.equal(parseDate('2024-02-29')?.toISOString(), '2024-02-29T00:00:00.000Z');
  });

  for (const bad of [
    '2026-9-5',
    '2026-02-30',
    '2026-13-01',
    'Sep 5, 2026',
    '2026-09-05T10:00:00Z',
    20260905,
    null,
  ]) {
    it(`rejects ${JSON.stringify(bad)}`, () => assert.equal(parseDate(bad), null));
  }
});

describe('parsePost', () => {
  it('reports YAML syntax errors instead of throwing', () => {
    const { errors } = parsePost('broken.md', '---\ntitle: [unclosed\n---\n');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].field, 'front-matter');
  });

  it('rejects non-text titles such as bare numbers', () => {
    const { errors } = parsePost(
      'x.md',
      '---\ntitle: 1984\ndate: 2026-01-01\ncategory: Books\n---\n',
    );
    assert.deepEqual(
      errors.map((e) => e.field),
      ['title'],
    );
  });
});
