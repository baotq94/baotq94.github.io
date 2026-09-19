# baotq94 — Design System (MASTER)

Global source of truth. Page-specific overrides go in `pages/<page>.md` and win over this file.

## Origin

Generated with ui-ux-pro-max (`"personal blog minimal editorial" --design-system --variance 2 --motion 2 --density 2`),
then deliberately cut down. What was dropped and why:

| Generated                                           | Decision                                                                         |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| Style: Minimalism & Swiss                           | **Kept** — the core direction                                                    |
| Pattern: scroll-triggered storytelling              | **Dropped** — a reading site, not a narrative landing page                       |
| Accent pink `#EC4899`                               | **Replaced** — 3.5:1 on light fails AA for text; one muted rust instead          |
| Libre Bodoni + Public Sans (Google Fonts)           | **Replaced** — one self-hosted variable serif for headings, system sans for body |
| Card surface, muted surface, secondary, destructive | **Dropped** — background + hairline border is enough                             |
| GSAP scroll reveal                                  | **Dropped** — no decorative or scroll-driven motion (see Interaction)            |

## Principles

1. Content first. Everything that is not text or navigation has to earn its place.
2. Monochrome base, **one** accent. The accent means "interactive" — links, hover, focus. Nothing else.
3. No gradients. No shadows. Separation comes from whitespace, then a 1px hairline.
4. One column, max 720px wide.

## Color tokens

Defined once in `src/styles.scss` on `:root`; dark values swap in under `prefers-color-scheme: dark`.
Components use tokens only — never raw hex.

| Token      | Light     | Dark      | Use                        |
| ---------- | --------- | --------- | -------------------------- |
| `--bg`     | `#FAFAF9` | `#111110` | Page background            |
| `--fg`     | `#1C1917` | `#E7E5E4` | Body text, headings        |
| `--muted`  | `#57534E` | `#A8A29E` | Meta text: dates, captions |
| `--line`   | `#E7E5E4` | `#292524` | Hairline borders, dividers |
| `--accent` | `#B4441C` | `#E8845C` | Links, hover, focus ring   |

Contrast (against `--bg`): `--fg` ≥ 15:1, `--muted` ≥ 7:1, `--accent` ≥ 5.5:1 in both modes — all pass WCAG AA for body text.

## Typography

| Token             | Stack                                                                                                                                              | Use                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `--font-serif`    | `"Source Serif 4"`, then `var(--font-serif-ja)`                                                                                                    | Headings, site name            |
| `--font-serif-ja` | `"Hiragino Mincho ProN", "Yu Mincho", YuMincho, "BIZ UDPMincho", "Noto Serif JP", "Noto Serif CJK JP", "Source Han Serif JP", "MS PMincho", serif` | Japanese fallback (no webfont) |
| `--font-sans`     | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`                                                                                         | Body, UI, meta                 |

Heading webfont: `public/fonts/source-serif-4.woff2` (107 KB, OFL). Variable, `wght` 400–700 and `opsz` 16–48,
subset to latin + latin-ext + vietnamese. `font-display: swap`, preloaded in `index.html`.
Chosen over Literata (91 KB) after a side-by-side on `/type-test`: more compact, fewer heading wraps at 720px.

Scale (rem, base 16px): `--text-sm 0.875` · `--text-base 1` · `--text-lg 1.25` · `--text-xl 1.75` · `--text-2xl 2.25`

- Body line-height 1.6; headings 1.2, weight 600, serif.
- Meta text: `--text-sm`, `--muted`, `tabular-nums` for dates.
- No uppercase tracking tricks, no italics for decoration.

### Per-language rules

Post cards carry `lang` from front-matter; CSS keys off `:lang()`.

- `vi`: headings line-height 1.3, so stacked marks (ệ, ự) don't touch the line above.
- `ja`: whole heading uses `--font-serif-ja` (its Latin shares the CJK baseline, avoiding mixed-font baseline jumps);
  line-height 1.8 body / 1.4 headings; `line-break: strict`, `word-break: auto-phrase`, `text-autospace: normal`.
- Check changes on `/type-test` (noindex, not in nav).

## Spacing & layout

Spacing scale (rem): `--space-1 0.25` · `--space-2 0.5` · `--space-3 1` · `--space-4 1.5` · `--space-5 2.5` · `--space-6 4`

- Content: `max-width: var(--measure)` = `720px`, centered, side gutter `--space-3` (never 0).
- Sections are separated by `--space-6`. Items in a list by `--space-4`.
- Mobile-first; the layout is a single column at every width, so no breakpoints are needed beyond font tweaks.

## Borders

- `--border: 1px solid var(--line)` — the only border.
- No border radius. Cards and everything else are square.
- No `box-shadow` anywhere.

## Components

**Card** (`app-card`) — the one reusable content unit (blog posts, home "latest", coming-soon states).

- Top hairline, padding-block `--space-4`, no background, no radius.
- Meta line (muted, sm) → serif title (lg) → excerpt (fg, base).
- If it has a link, the whole title is the link; hover turns the title `--accent`. External links open in a new tab with `rel="noopener"`.

**Page shell** (`app-page-shell`) — serif `h1` + optional one-line lede in `--muted`, then projected content.

**Header** — sticky at the top on every page: site name + nav, opaque `--bg`, bottom hairline, no shadow. Nav is plain text links, active route in `--fg` with underline, others `--muted`. The header is the only navigation; pages do not repeat a section list.

## Interaction

- Transitions: `color 150ms ease` and `border-color 150ms ease` (`--transition`).
- Motion is allowed only as feedback for a state change the user triggered (e.g. a `<details>` row opening:
  height + chevron rotation over `--duration-collapse`, 0.25s). Never decorative, never on scroll or load.
- Focus: `outline: 2px solid var(--accent); outline-offset: 2px` on `:focus-visible`. Never remove it.
- Touch targets ≥ 44px tall for nav links.
- `prefers-reduced-motion: reduce` disables all transitions and motion, including the above.

## Anti-patterns

- A second accent color, or using the accent for decoration
- Gradients, shadows, glassmorphism, background images
- More than one heading webfont; any body webfont; a Japanese webfont
- Icons as decoration; emoji as icons
- Content wider than 720px
- Filters, category pills, pagination or "load more" on the blog: it is one list, newest first, scroll to find
