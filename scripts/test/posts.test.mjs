import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
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
  it('excludes drafts from published data but still validates them', async (t) => {
    const dir = await mkdtemp(join(tmpdir(), 'draft-posts-'));
    t.after(() => rm(dir, { recursive: true, force: true }));
    await writeFile(
      join(dir, 'published.md'),
      '---\ntitle: Published\ndate: 2026-10-10\ncategory: Backend\nstatus: post\n---\n',
    );
    await writeFile(
      join(dir, 'draft.md'),
      '---\ntitle: Draft\ndate: 2026-10-11\ncategory: Cloud\nstatus: draft\n---\nPrivate draft body.',
    );
    const { posts, errors } = await loadPosts(dir);
    assert.deepEqual(errors, []);
    assert.deepEqual(
      posts.map((post) => post.slug),
      ['published'],
    );
    assert.ok(!JSON.stringify(posts).includes('Private draft body'));
    await writeFile(
      join(dir, 'draft.md'),
      '---\ntitle: Draft\ndate: invalid\ncategory: Cloud\nstatus: draft\n---\n',
    );
    const invalid = await loadPosts(dir);
    assert.deepEqual(
      invalid.errors.map((error) => error.field),
      ['date'],
    );
  });

  it('loads nested posts with filename slugs, descriptions, and empty bodies', async (t) => {
    const dir = await mkdtemp(join(tmpdir(), 'nested-posts-'));
    t.after(() => rm(dir, { recursive: true, force: true }));
    await mkdir(join(dir, 'Backend', 'Java'), { recursive: true });
    await mkdir(join(dir, 'Personal'));
    await writeFile(
      join(dir, 'Backend', 'Java', 'references.md'),
      '---\ntitle: References\ndate: 2026-10-11\nstatus: post\ncategory: Backend Engineering\nexcerpt: How references work.\n---\n',
    );
    await writeFile(
      join(dir, 'Personal', 'career.md'),
      '---\ntitle: Career\ndate: 2026-10-10\nstatus: post\ncategory: Personal\n---\n',
    );
    await writeFile(join(dir, 'notes.txt'), 'Not a post');
    const { posts, errors } = await loadPosts(dir);
    assert.deepEqual(errors, []);
    assert.deepEqual(
      posts.map((post) => post.slug),
      ['references', 'career'],
    );
    assert.equal(posts[0].category, 'Backend Engineering');
    assert.equal(posts[0].excerpt, 'How references work.');
    assert.equal(posts[0].html, '');
  });

  it('reports duplicate filename slugs across folders before they create conflicting URLs', async (t) => {
    const dir = await mkdtemp(join(tmpdir(), 'duplicate-posts-'));
    t.after(() => rm(dir, { recursive: true, force: true }));
    for (const category of ['Backend', 'Cloud']) {
      await mkdir(join(dir, category));
      await writeFile(
        join(dir, category, 'same.md'),
        `---\ntitle: Same\ndate: 2026-10-11\nstatus: post\ncategory: ${category}\n---\n`,
      );
    }
    const { errors } = await loadPosts(dir);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].field, 'slug');
    assert.equal(errors[0].file, join(dir, 'Cloud', 'same.md'));
    assert.match(errors[0].message, /duplicate slug "same"/);
  });

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
      status: 'post',
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
  for (const status of ['draft', 'post']) {
    it(`accepts status ${status}`, () => {
      const { post, errors } = parsePost(
        'status.md',
        `---\ntitle: Status\ndate: 2026-10-11\ncategory: Notes\nstatus: ${status}\n---\n`,
      );
      assert.deepEqual(errors, []);
      assert.equal(post.status, status);
    });
  }

  for (const status of [undefined, 'published', 'Draft', 'null']) {
    it(`rejects status ${status}`, () => {
      const field = status === undefined ? '' : `status: ${status}\n`;
      const { errors } = parsePost(
        'status.md',
        `---\ntitle: Status\ndate: 2026-10-11\ncategory: Notes\n${field}---\n`,
      );
      assert.deepEqual(
        errors.map((error) => error.field),
        ['status'],
      );
    });
  }

  it('reports YAML syntax errors instead of throwing', () => {
    const { errors } = parsePost('broken.md', '---\ntitle: [unclosed\n---\n');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].field, 'front-matter');
  });

  it('rejects non-text titles such as bare numbers', () => {
    const { errors } = parsePost(
      'x.md',
      '---\ntitle: 1984\ndate: 2026-01-01\nstatus: post\ncategory: Books\n---\n',
    );
    assert.deepEqual(
      errors.map((e) => e.field),
      ['title'],
    );
  });
});
