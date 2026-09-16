# baotq94.github.io

Personal site at <https://baotq94.github.io/>. Angular 22, fully prerendered (`outputMode: "static"`), deployed to GitHub Pages.
Design rules live in [`design-system/baotq94/MASTER.md`](design-system/baotq94/MASTER.md).

## Local commands

| Command | What it does |
|---|---|
| `npm start` | Generates `public/posts.json`, then runs the dev server at <http://localhost:4200/> |
| `npm run build` | Generates `public/posts.json`, then builds and prerenders every route into `dist/baotq94.github.io/browser/` |
| `npm test` | Runs the posts pipeline tests (`node --test`), then the Angular unit tests (Vitest) |
| `npm run posts` | Only regenerates `public/posts.json` |
| `npm run test:posts` | Only runs the posts pipeline tests |

Use `npm start` / `npm run build`, not bare `ng serve` / `ng build`: the npm `pre*` hooks are what generate `posts.json`.

### Check the real static output

`ng serve` is not what gets deployed. Before pushing a change to routing or paths, serve the build the way GitHub Pages will:

```bash
npm run build
npx http-server dist/baotq94.github.io/browser -p 8080 -c-1
```

Open <http://localhost:8080/>. `-c-1` disables caching so rebuilds show up immediately.
`dist/baotq94.github.io/prerendered-routes.json` lists every route that got a static HTML file.
Unknown URLs return a plain 404 locally; `404.html` is only added by the deploy workflow.

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
---
```

`scripts/build-posts.mjs` validates every file and fails the build listing each bad file and field.
Output is sorted newest first.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: `npm ci` → `npm run build` → GitHub Pages.
The repo's **Settings → Pages → Source** must be set to **GitHub Actions**.
