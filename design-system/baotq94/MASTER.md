# baotq94 — Design System (MASTER)

Global source of truth. Page-specific overrides go in `pages/<page>.md` and win over this file.

## Origin

Generated with ui-ux-pro-max (`"personal blog minimal editorial" --design-system --variance 2 --motion 2 --density 2`),
then deliberately cut down. What was dropped and why:

| Generated | Decision |
|---|---|
| Style: Minimalism & Swiss | **Kept** — the core direction |
| Pattern: scroll-triggered storytelling | **Dropped** — a reading site, not a narrative landing page |
| Accent pink `#EC4899` | **Replaced** — 3.5:1 on light fails AA for text; one muted rust instead |
| Libre Bodoni + Public Sans (Google Fonts) | **Replaced** — system serif + system sans, zero font requests |
| Card surface, muted surface, secondary, destructive | **Dropped** — background + hairline border is enough |
| GSAP scroll reveal | **Dropped** — no motion beyond color transitions |

## Principles

1. Content first. Everything that is not text or navigation has to earn its place.
2. Monochrome base, **one** accent. The accent means "interactive" — links, hover, focus. Nothing else.
3. No gradients. No shadows. Separation comes from whitespace, then a 1px hairline.
4. One column, max 720px wide.

## Color tokens

Defined once in `src/styles.scss` on `:root`; dark values swap in under `prefers-color-scheme: dark`.
Components use tokens only — never raw hex.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FAFAF9` | `#111110` | Page background |
| `--fg` | `#1C1917` | `#E7E5E4` | Body text, headings |
| `--muted` | `#57534E` | `#A8A29E` | Meta text: dates, captions |
| `--line` | `#E7E5E4` | `#292524` | Hairline borders, dividers |
| `--accent` | `#B4441C` | `#E8845C` | Links, hover, focus ring |

Contrast (against `--bg`): `--fg` ≥ 15:1, `--muted` ≥ 7:1, `--accent` ≥ 5.5:1 in both modes — all pass WCAG AA for body text.

## Typography

| Token | Stack | Use |
|---|---|---|
| `--font-serif` | `"Iowan Old Style", "Charter", "Sitka Text", Cambria, Georgia, serif` | Headings, site name |
| `--font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | Body, UI, meta |

Scale (rem, base 16px): `--text-sm 0.875` · `--text-base 1` · `--text-lg 1.25` · `--text-xl 1.75` · `--text-2xl 2.25`

- Body line-height 1.6; headings 1.2, weight 600, serif.
- Meta text: `--text-sm`, `--muted`, `tabular-nums` for dates.
- No uppercase tracking tricks, no italics for decoration.

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

**Nav** — plain text links, active route in `--fg` with underline, others `--muted`.

## Interaction

- Transitions: `color 150ms ease` and `border-color 150ms ease` only.
- Focus: `outline: 2px solid var(--accent); outline-offset: 2px` on `:focus-visible`. Never remove it.
- Touch targets ≥ 44px tall for nav links.
- `prefers-reduced-motion: reduce` disables transitions.

## Anti-patterns

- A second accent color, or using the accent for decoration
- Gradients, shadows, glassmorphism, background images
- Web font downloads
- Icons as decoration; emoji as icons
- Content wider than 720px
- Filters, category pills, pagination or "load more" on the blog: it is one list, newest first, scroll to find
