---
name: local-development
description: Develop a feature or fix locally from an idea through repository verification, implementation, testing, review, and a concise evidence-based report.
---

# Local development

## Idea and verification

- Turn the request into concrete expected behavior and a small set of acceptance criteria. For a bug, reproduce it or identify direct evidence before choosing the fix.
- Read applicable `AGENTS.md`, relevant source, existing tests, and package scripts. Verify assumptions against the current checkout.
- Ask only about missing decisions that materially affect behavior; continue independent work while waiting. For explanation-only or review-only requests, report findings and wait for implementation authorization.
- State the intended change and validation briefly. Keep the scope aligned with the user's request; use the Git workflow skill for requested branch/PR delivery.

## Implement

- Make the smallest coherent change using existing patterns. Preserve unrelated user edits and avoid speculative abstractions or dependencies.
- This site uses standalone Angular components, lazy routes, SCSS, and static prerendering. Keep browser APIs compatible with prerendering and update client/server routes together when needed.
- Edit content in `posts/**/*.md` and `books/*.md`, following the front-matter rules in `README.md`. Regenerate JSON with `npm run posts`; never hand-edit or commit generated `public/posts.json` or `public/books.json`.
- Use npm and the committed lockfile. CI runs Node.js 24. Follow `.prettierrc`; format only the files changed by the task.
- Keep secrets out of source and client assets. Preserve Angular's HTML sanitization when rendering Markdown.

## Test

Choose checks that exercise the affected behavior and run required repository checks:

| Change                                     | Validation                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Every change                               | `git diff --check` and `npm run format:check`                                               |
| Posts, books, or parser behavior           | `npm run test:posts`                                                                        |
| Angular behavior                           | `npm test -- --watch=false` and `npm run build`                                             |
| Routes, prerendering, or deployment output | `npm run build`; inspect the affected static output                                         |
| Visible UI                                 | Preview locally and check the affected interactions, viewport sizes, and language rendering |

Add regression tests for meaningful changed behavior. Documentation-only edits need formatting and content/link review rather than unrelated runtime tests. Fix failures caused by the change and rerun the affected checks; distinguish unrelated baseline failures. Report unavailable checks as blocked, never passed.

## Review and report

- Inspect the final diff for correctness, scope, edge cases, accessibility when relevant, and accidental secret/generated-file changes. Check acceptance criteria against observed results.
- Fix discovered issues and repeat only the checks affected by those fixes.
- Report the outcome, key changes, checks actually run, and material limitations. Separate local/mock validation from live or deployed evidence.
- Do not claim a feature is verified solely because it builds. Commit, push, open a PR, or merge only within the user's delivery authorization.
