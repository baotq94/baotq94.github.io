# Personal site at <https://baotq94.github.io/>.

## Local commands

| Command | When |
|---|---|
| `npm start` | Developing. Dev server at <http://localhost:4200/>, reloads on save in `src/` |
| `npm test` | Before pushing. Posts pipeline tests, then Angular unit tests |
| `npm run build` | Checking the real output. Builds and prerenders into `dist/baotq94.github.io/browser/` |

Edited a post while `npm start` is running? Run `npm run posts` in another terminal (triggers `scripts/build-posts.mjs`); the page reloads.

### Check the real static output GitHub Pages

```bash
npm run build
npx http-server dist/baotq94.github.io/browser -p 8080 -c-1
```

## Posts

Posts are front-matter only; the full text lives on Substack. Add `posts/<slug>.md`:

```yaml
---
title: The case for a boring portfolio      # required, text (quote numbers: "1984")
date: 2026-09-12                            # required, YYYY-MM-DD, must be a real date
category: Investment                        # required, text
substackUrl: https://baotq94.substack.com/p/…  # required, https URL
excerpt: Index funds, a savings rate, and time.  # optional
tags: [investing, index-funds]              # optional, list of text
lang: vi                                    # optional, language tag (default en); ja/vi get typography tweaks
---
```

## Books

Add `books/<slug>.md`. `/books` groups them by the year of `finished`, newest first. The Markdown body is your review;
leave it empty and the row only shows the summary.

```yaml
---
title: Clean Architecture                   # required, text
author: Robert C. Martin                    # required, text
finished: 2025-03-12                        # required, YYYY-MM-DD; the year is the group
summary: Two or three sentences on the book.   # required, text
rating: 4                                   # optional, whole number 1–5
tags: [architecture, dev]                   # optional, list of text
link: https://www.goodreads.com/…           # optional, https URL
lang: vi                                    # optional, language tag (default en)
---

My review. Optional.
```

## Deploy

`.github/workflows/deploy.yml` runs `npm ci` → `npm run build` → GitHub Pages when:

- anything is pushed to `main` (a direct push, or merging a PR into `main`)
- it's started by hand: Actions tab → *Deploy to GitHub Pages* → *Run workflow*
