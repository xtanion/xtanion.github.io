# diagram studio

A local tldraw canvas for authoring the diagrams used in `projects/*.mdx`.

This is deliberately a **separate npm project**. It has its own `package.json` and
`node_modules`, so tldraw is never a dependency of the site and never reaches a
reader's browser. For reference, tldraw builds to ~1.9MB of JS (559KB gzipped),
which is several times the weight of an entire article page.

## Use

```
cd tools/diagram-studio
npm run dev
```

Open http://localhost:5199.

The panel in the top right lists every diagram. Click one to load it onto the
canvas, already laid out. Adjust whatever you like, then:

- **export current** writes the selected diagram
- **export all** cycles through every diagram and writes them in one go

Exports land directly in `public/diagrams/` as SVG. There is no download-then-move
step; the dev server writes the file for you.

## Regenerating without opening a browser

With the dev server running:

```
node export.mjs     # headless "export all"
node preview.mjs out.png   # contact sheet of every SVG, for checking layout
```

`export.mjs` drives the studio in headless Chromium and clicks export all, so
diagrams can be rebuilt after editing `src/diagrams.js` without touching the canvas.
`preview.mjs` renders every exported SVG through an `<img>` tag, which is how the
site loads them, so overflowing text and collisions show up the same way a reader
would see them.

## Export settings

Set in `src/main.jsx`:

| option       | value   | why                                                |
| ------------ | ------- | -------------------------------------------------- |
| `format`     | `svg`   | vector, scales, tiny                                |
| `background` | `false` | transparent, so the site's own background shows     |
| `darkMode`   | `true`  | the site is dark-only                               |
| `padding`    | `24`    | breathing room without hand-trimming                |

## Adding or editing a diagram

Everything lives in `src/diagrams.js`. Each entry is `{ name, title, page, build }`,
where `build()` returns an array of tldraw shape records. `name` decides the output
filename, so `name: 'cdc-pipeline'` writes `public/diagrams/cdc-pipeline.svg`.

There are three helpers: `box()`, `label()`, and `arrow()`, plus `chain()` for the
common case of a vertical flow with arrows between each step. All of them default to
the `mono` font so the diagrams match the site's typeface.

Shapes are seeded from code rather than drawn by hand so they can be regenerated and
kept consistent. Once exported, the SVG is the artifact the site uses; the code is
the source you edit when a diagram needs to change.
