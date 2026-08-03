# clpr — Design System

A single-source spec for the clpr visual language, written so the look can be
rebuilt in any stack (plain CSS, Tailwind, a design tool). Everything here is
derived from `app/app/globals.css` — that file is the implementation of record;
this document is the intent behind it.

---

## 1. Design philosophy

**Terminal, not dashboard.** The interface reads like a code editor or a TTY:
near-black canvas, one monospace family, square corners, hairline borders, and a
single electric-green accent that appears *only* where there is real work or
progress. Nothing decorative is colored.

Five rules that keep it coherent:

1. **Monochrome base, one accent.** The whole UI is grayscale except green.
   Green means "the work" — done, active, earned, live. If something isn't
   progress or a primary action, it is not green.
2. **Brightness is meaning.** Severity/emphasis is expressed by *how light* the
   text is (`muted → text → loud`), not by hue. There is no blue "info" or
   amber "warning" — just tiers of gray, plus green for good.
3. **Square everything.** `border-radius: 0` almost everywhere. Corners are
   sharp; the few rounded things (pips, avatars-as-fallback) are deliberate
   exceptions.
4. **Hairlines, not boxes.** Structure comes from 1px `#171717` lines and grid
   gaps, not filled cards or shadows. There are effectively no drop shadows.
5. **One font, nothing big.** A single monospace family at small sizes. Nothing
   in the type scale goes above 16px except one hero title (22px in the gist
   reader). Weight (400/600) and color carry hierarchy instead of size.

Single theme only — this is a dark-only design. There is no light mode.

---

## 2. Color tokens

Define these as CSS custom properties on `:root`. Names are the contract; reuse
them rather than raw hex.

### Base — warm-neutral near-black

| Token       | Hex       | Role |
|-------------|-----------|------|
| `--void`    | `#0a0a0a` | Page background, panel background, "knockout" text on green |
| `--panel`   | `#0a0a0a` | Alias of void (panels are not lighter than the page) |
| `--text`    | `#d4d4d4` | Default body text |
| `--muted`   | `#737373` | Secondary text, labels, captions, inactive |
| `--loud`    | `#e5e7eb` | Bright text — attention/emphasis states only |
| `--grid`    | `#171717` | Structural hairlines, grid-gap fill |
| `--line`    | `#171717` | Borders on buttons, tags, inputs, nav |
| `--subtle`  | `#171717` | Internal dividers between rows/items |
| `--frame`   | `#1f1f1f` | The single outer frame border |
| `--focus`   | `#737373` | Border color on hover/focus (a11y brighten) |

`--grid`, `--line`, and `--subtle` are the same value (`#171717`) but kept as
three names by *intent* — structural frame vs. control border vs. row divider —
so any one can be retuned independently later.

### Accent — green ("the work")

| Token          | Value | Role |
|----------------|-------|------|
| `--green`      | `#0ae448` | Vivid primary green — hover target, summit, strongest state |
| `--light-green`| `#abff84` | The workhorse accent — checks, active nav, links in prose, XP, done state |
| `--grad-green` | `linear-gradient(114.41deg, #0ae448 20.74%, #abff84 65.5%)` | Nav brand dot, avatar fallback, summit node, active-tab underline |

Green usage in practice: completed checkboxes/topics, earned XP numbers, the
active nav underline, quiz "pass" results, the "you" leaderboard row tint, the
heatmap high-activity cells, primary/affirmative buttons (`.btn-grad`).

### Severity scale (monochrome + green)

Severity is a brightness ramp, never new hues:

| Token          | Maps to        |
|----------------|----------------|
| `--sev-dim`    | `--muted`      |
| `--sev-note`   | `--muted`      |
| `--sev-info`   | `--text`       |
| `--sev-ok`     | `--light-green`|
| `--sev-accent` | `--loud`       |
| `--sev-warn`   | `--loud`       |
| `--sev-crit`   | `--loud`       |

Note that warn/crit/accent all resolve to `--loud` (bright white-ish). The
design intentionally does **not** use red/amber for severity. The only warm
color in the entire UI is a single muted terracotta used for the destructive
"leave quiz" affordance:

| Purpose | Hex | Hover |
|---------|-----|-------|
| Destructive / abandon action | `#c77a74` | `#dd938d` |

### Incidental grays

A few one-off values appear inline (all in the same near-black family). Prefer
promoting these to tokens if you rebuild:

| Value | Where used |
|-------|-----------|
| `#141414` | Empty heatmap cell, locked panel bg, 3D board ground |
| `#121212` | Code block (`pre`) background |
| `#171717` | Inline `code` background, `kbd` background |
| `#1c1c1c` / `#2c2c2c` | Rating segment default / hover |
| `#262626` / `#2e2e2e` | Avatar border / nav separator |
| `#2f2f2f` | Disabled arrow/pager text |
| `#3f3f3f` | Tree prefix glyphs |

### Heatmap activity ramp

A 4-step green ramp for GitHub-style contribution density:

| Level | Hex |
|-------|-----|
| empty | `#141414` |
| l1    | `#2c3a2e` |
| l2    | `#3f6a45` |
| l3    | `#63b96f` |
| l4    | `var(--light-green)` (`#abff84`) |

---

## 3. Typography

**One family, monospace, everywhere.**

```css
--font:      'Commit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
--font-mono: var(--font);
```

- Loaded via `@fontsource/commit-mono` at weights **400** and **600** only.
  Those are the only two weights in the system.
- Base body: `14px`, `line-height: 1.5`, `letter-spacing: 0`,
  `-webkit-font-smoothing: antialiased`.

### Type scale

Nothing exceeds 16px except the single gist hero (22px). Hierarchy is
weight + color, not size.

| Class / element | Size | Weight | Color |
|-----------------|------|--------|-------|
| `.gist-page-title` (hero, sole exception) | 22px | 600 | `--loud` |
| `.t-title`, `.display`, headings, `.week-no`, `.genre-name`, `.obj-label` | 16px | 600 | `--text` |
| `.h-sm`, `.stage-title`, most section titles | 14px | 600 | `--text` |
| Body / `.t-sub` / `.topic-label` | 13–14px | 400 | `--text` |
| `.lead` (intro paragraph) | 14px | 400 | `--muted`, `max-width: 76ch` |
| `.muted`, captions | 12–13px | 400 | `--muted` |
| `.eyebrow`, `.kicker`, `.stat .k`, table headers, labels | 11px | 400 | `--muted`, often `text-transform: uppercase` |
| `.mono-xs`, legends, hints | 11px | 400 | `--muted` |

### Typographic conventions

- **Eyebrows** prefix with a code comment: `.eyebrow::before { content: "// "; }`
  (also `.proj-eyebrow`). This is a signature move — small uppercase-muted
  labels that read like source comments.
- **Uppercase** is reserved for the smallest labels (11px): eyebrows, stat keys,
  field labels, table heads, kickers. Body text is never uppercased.
- **Tabular numbers** via `.tnum { font-variant-numeric: tabular-nums; }` for any
  aligned figures (stats, times, XP).

---

## 4. Layout & spacing

- **Content max width:** `--max: 780px`. The primary reading column
  (`.frame`, `.wrap`, nav, footer) all cap at this.
- **Inner gutter:** `.wrap` uses `padding: 0 56px` (28px at ≤720px).
- **Page shell:** a column flex — fixed nav, `flex: 1` main, footer pinned
  to bottom (`min-height: 100dvh`).
- **Main padding:** `92px 16px 28px` (top clears the fixed nav).
- **Frame:** `.frame` centers content, `max-width: var(--max)`,
  `padding: 44px 0 76px`.
- **Sections:** `section { padding: 40px 0; }`, dropping to `32px` on mobile.

### Grid patterns

Filled grids use a **hairline-gap** technique: set the container background to
`--grid` and give children a `1px` gap plus solid `--void` backgrounds, so the
grid lines are the show-through:

```css
.genres {              /* also .weeks, .artifacts, .race-grid */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px 0;
  background: var(--grid);
  border-top: 1px solid var(--grid);
  border-bottom: 1px solid var(--grid);
}
.genre { background: var(--void); padding: 18px; }
```

Common column counts: genres/artifacts/race = 2, weeks = 4 (→ 2 → 1 responsive),
stats = flex-wrap with `gap: 56px`.

---

## 5. Borders, corners, shadows

- **Radius:** `0` almost everywhere. Exceptions: `.pip` and `.avatar` fallback
  (`50%` circles), a couple of 4–5px chips in the gist reader.
- **Border width:** `1px` standard, `1.5px` for checkboxes/pips, `2px` for
  active/focus rings and timeline nodes.
- **Shadows:** none as elevation. `box-shadow` is used only as an *inset* ring
  (e.g. `.b-today`, `.pip.on-out`) — never a soft drop shadow. The design has no
  z-elevation; depth comes only from the literal 3D CSS-transform boards.

---

## 6. Motion

Deliberately minimal and fast.

- **Standard transition:** `.16s ease` on `color` / `border-color`. Interactive
  hover feedback is almost always a color/border shift, not movement.
- **Micro-interactions:** `.12s–.14s ease` for checks, rating blocks, tree rows.
- **Arrow links** nudge on hover: `.arrow-link:hover .arrow-ico { transform: translateX(3px); }`.
- **Buttons** press down: `.btn:active { transform: translateY(1px); }`.
- **Pop animations** are tiny and spring-like:
  `@keyframes qpop { 0% { transform: scale(0); } 100% { transform: scale(1); } }`
  with `cubic-bezier(.2, 1.4, .4, 1)` for check confirmations.
- **Respect reduced motion:** a global override kills all transitions/animations:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
  }
  ```

---

## 7. Focus & accessibility

- **Never remove focus rings.** Keyboard focus is a square green ring:
  ```css
  :focus-visible { outline: 2px solid var(--light-green); outline-offset: 2px; }
  ```
  Inputs that set `outline: none` on `:focus` still restore the green ring on
  `:focus-visible` (selectors are given extra specificity to win).
- Text-input focus indicates via a **green bottom-border**
  (`border-bottom-color: var(--light-green)`), matching the accent language.
- `prefers-reduced-transparency: reduce` swaps the frosted nav for a solid
  `--void` background.
- Contrast: body `--text` (`#d4d4d4`) on `--void` (`#0a0a0a`) is high-contrast;
  `--muted` is for secondary content only.

---

## 8. Signature components

### Glass pill nav
Fixed, centered, `max-width: 780px`, `height: 54px`, **square** (`border-radius: 0`),
frosted:
```css
background: rgba(10, 10, 10, 0.55);
backdrop-filter: blur(44px) saturate(160%);
```
- Brand mark: text + an 8px `--grad-green` dot.
- Active link: `--loud` text with a 2px `--grad-green` underline bar.
- XP readout: muted text with a green bold number.
- Collapses to a hamburger + solid dropdown at ≤720px.

### Buttons (square terminal)
```css
.btn { border: 1px solid var(--line); border-radius: 0; padding: 10px 16px;
       font: 600 13px var(--font); background: transparent; color: var(--text); }
.btn:hover { border-color: var(--focus); }      /* border brightens, text stays */
.btn:active { transform: translateY(1px); }
```
Variants: `.btn-grad` (green border+text, the primary/affirmative action),
`.btn-ghost` (muted → text on hover), `.btn-sm` (12px).

### Cards
There are effectively **no cards** — `.card` is transparent, borderless,
zero-padding. "Cards" are really grid cells separated by hairlines (§4).

### Checkboxes & progress
- `.check`: 18px square, 1.5px border; when `.on`, fills `--light-green` with a
  knockout `--void` checkmark drawn from borders.
- Timeline `.node`: 14px circle; `partial` = text-color border, `done` =
  light-green fill, `summit` = `--grad-green` fill.
- Progress ticks/bars: `--line` track, `--light-green` fill, `--text` for the
  current step.

### Markdown / prose (`.md`)
- Body 14px, `line-height: 1.75`, `--text`.
- Links: `--light-green`, underlined. `strong`: `--loud`.
- `code`: 13px mono on `#171717`, 1–5px padding, no radius.
- `pre`: `#121212` bg, 1px `--line` border, no radius, horizontal scroll.
- `blockquote`: 2px `--line` left border, muted text.

### Heatmap
Square 12px pixels, 3px gap, 7-row grid, `grid-auto-flow: column`. Uses the
green activity ramp from §2; future cells at `opacity: 0.25`.

---

## 9. Responsive breakpoints

| Breakpoint | Changes |
|------------|---------|
| `≤1024px` | stats → 3 cols, weeks → 2 cols |
| `≤720px`  | wrap/footer/nav gutters → 28px; nav links collapse to dropdown + hamburger; XP hidden; most 2-col grids → 1 col; leaderboard drops the stage column; sections → 32px padding |

Mobile-first is not assumed — the base styles are the desktop layout, with two
max-width overrides narrowing it.

---

## 10. Quick-start token block

Drop this on `:root` to bootstrap the palette anywhere:

```css
:root {
  --void: #0a0a0a;
  --panel: #0a0a0a;
  --text: #d4d4d4;
  --muted: #737373;
  --grid: #171717;
  --line: #171717;
  --subtle: #171717;
  --loud: #e5e7eb;
  --focus: #737373;
  --frame: #1f1f1f;

  --green: #0ae448;
  --light-green: #abff84;
  --grad-green: linear-gradient(114.41deg, #0ae448 20.74%, #abff84 65.5%);

  --sev-info: var(--text);
  --sev-dim: var(--muted);
  --sev-ok: var(--light-green);
  --sev-accent: var(--loud);
  --sev-note: var(--muted);
  --sev-warn: var(--loud);
  --sev-crit: var(--loud);

  --font: 'Commit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-mono: var(--font);
  --max: 780px;
}

body {
  font-family: var(--font);
  background: var(--void);
  color: var(--text);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

**Checklist to stay on-brand:** monospace only · nothing above 16px (bar one
hero) · square corners · 1px `#171717` hairlines instead of cards/shadows ·
grayscale except green · green only for work/progress/primary actions · severity
via brightness · `// ` comment-prefixed eyebrows · square green focus ring, never
removed.
