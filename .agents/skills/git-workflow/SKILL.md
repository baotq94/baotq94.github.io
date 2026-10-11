---
name: git-workflow
description: Follow repository Git conventions when creating branches, committing, pushing, opening pull requests, or merging an approved change.
---

# Git workflow

## Conventions

- Use English Conventional Commits: `feat`, `fix`, `chore`, `docs`, `refactor`, or `test`, with an optional scope.
- Use lowercase English branch names with hyphens, such as `feat/book-search` or `chore/update-docs`.
- Deliver changes on a topic branch with a PR targeting `main`; do not push directly to `main`.
- Follow explicit user choices and more specific repository instructions when they differ from these defaults.

## Branch and commit

1. Inspect the current branch, working tree, diff, and remote. Preserve unrelated user changes.
2. For a new task, fetch `origin` and branch from current `origin/main`. For an existing task, continue its topic branch. If local changes conflict with the base, resolve within scope without discarding them.
3. Review the final diff for scope, secrets, and generated files. Run the checks appropriate to the changes and `git diff --check`.
4. Stage named files or selected hunks, inspect the staged diff, then commit a coherent change. Include user edits only when the requested review/delivery covers them.

## Push and PR

1. Push only when the user requested delivery or already authorized it. Use `git push -u origin <branch>` for the first push; avoid force-pushing shared history.
2. Reuse a PR for the branch if one exists; otherwise create one targeting `main` using `gh` or an available GitHub tool.
3. Lead the PR description with the problem and resulting behavior, then record actual validation and any remaining limitation. Keep Git metadata in English.
4. When using `gh`, put multiline PR text in a temporary file and pass `--body-file`.
5. Check remote PR state and required CI. Fix failures attributable to this change; report permission, service, or unrelated failures without claiming success.
6. Report the branch, commit, PR link, and checks. If a remote operation fails ambiguously, inspect remote state before retrying to avoid duplicate delivery.

## Merge when requested

- Creating or pushing a PR does not authorize merging it. If the user has requested a merge, proceed once the PR is concrete and required checks/reviews pass.
- Confirm the PR targets `main`, inspect its final diff and head commit, and honor branch protection. Do not merge with unresolved blocking reviews or failed required checks.
- Use the repository's configured merge method; prefer squash if several methods are allowed and no preference is specified.
- Verify the merged state. Synchronize local `main` only when the working tree permits a safe fast-forward; preserve pending work.
- In this repository, merging to `main` triggers GitHub Pages deployment. Report merge and deployment status separately.
