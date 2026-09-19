# Personal site at <https://baotq94.github.io/>.

## Local commands

| Command         | When                                                                                   |
| --------------- | -------------------------------------------------------------------------------------- |
| `npm start`     | Developing. Dev server at <http://localhost:4200/>, reloads on save in `src/`          |
| `npm test`      | Before pushing. Posts pipeline tests, then Angular unit tests                          |
| `npm run build` | Checking the real output. Builds and prerenders into `dist/baotq94.github.io/browser/` |

Edited a post while `npm start` is running? Run `npm run posts` in another terminal (triggers `scripts/build-posts.mjs`); the page reloads.

### Check the real static output GitHub Pages

```bash
npm run build
npx http-server dist/baotq94.github.io/browser -p 8080 -c-1
```

## Posts

```yaml
---
title: Why I keep a reading log # required, text (quote numbers: "1984")
date: 2026-09-12 # required, YYYY-MM-DD, must be a real date
category: Notes # required, text
excerpt: Short notes compound. # optional
tags: [books, habits] # optional, list of text
lang: vi # optional, language tag (default en); ja/vi get typography tweaks
---
The post body, in Markdown. Rendered at /blog/<file name without .md>/.
```

## Books

```yaml
---
title: Clean Architecture # required, text
author: Robert C. Martin # optional, text
finished: "2025" # required, YYYY or YYYY-MM-DD; the year is the group
order: 1 # optional, whole number from 1; position within the year
summary: Two or three sentences on the book. # required, text
rating: 4 # optional, whole number 1–5
tags: [architecture, dev] # optional, list of text
link: https://www.goodreads.com/… # optional, https URL
lang: vi # optional, language tag (default en)
---
My review. Optional.
```

## Deploy

`.github/workflows/deploy.yml` runs `npm ci` → `npm run build` → GitHub Pages when:

- anything is pushed to `main` (a direct push, or merging a PR into `main`)
- it's started by hand: Actions tab → _Deploy to GitHub Pages_ → _Run workflow_
