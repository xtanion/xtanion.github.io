import { createShapeId, toRichText } from 'tldraw'

const FONT = 'draw'

function box(x, y, w, h, text, o = {}) {
  return {
    id: createShapeId(),
    type: 'geo',
    x,
    y,
    props: {
      geo: o.geo ?? 'rectangle',
      w,
      h,
      dash: o.dash ?? 'solid',
      fill: o.fill ?? 'none',
      color: o.color ?? 'black',
      labelColor: o.labelColor ?? o.color ?? 'black',
      size: o.size ?? 's',
      font: FONT,
      align: 'middle',
      verticalAlign: 'middle',
      richText: toRichText(text),
    },
  }
}

function label(x, y, text, o = {}) {
  return {
    id: createShapeId(),
    type: 'text',
    x,
    y,
    props: {
      richText: toRichText(text),
      color: o.color ?? 'black',
      size: o.size ?? 's',
      font: FONT,
      textAlign: o.align ?? 'start',
      autoSize: true,
      scale: 1,
    },
  }
}

function arrow(x1, y1, x2, y2, o = {}) {
  return {
    id: createShapeId(),
    type: 'arrow',
    x: x1,
    y: y1,
    props: {
      start: { x: 0, y: 0 },
      end: { x: x2 - x1, y: y2 - y1 },
      color: o.color ?? 'black',
      size: o.size ?? 's',
      dash: o.dash ?? 'solid',
      arrowheadStart: 'none',
      arrowheadEnd: o.head ?? 'arrow',
      font: FONT,
      kind: o.kind ?? 'arc',
      bend: o.bend ?? 0,
      ...(o.label ? { richText: toRichText(o.label) } : {}),
    },
  }
}

/** Vertical stack of boxes joined by arrows, with optional right-hand notes. */
function chain(x, y, w, h, gap, steps, o = {}) {
  const shapes = []
  steps.forEach((step, i) => {
    const top = y + i * (h + gap)
    const text = typeof step === 'string' ? step : step.text
    const opts = typeof step === 'string' ? {} : step
    shapes.push(box(x, top, w, h, text, { color: opts.color ?? o.color, dash: opts.dash, fill: opts.fill }))
    if (opts.note) {
      shapes.push(label(x + w + 24, top + h / 2 - 12, opts.note, { color: opts.noteColor ?? 'black' }))
    }
    if (i < steps.length - 1) {
      shapes.push(arrow(x + w / 2, top + h, x + w / 2, top + h + gap, { color: o.color }))
    }
  })
  return shapes
}

export const diagrams = [
  {
    name: 'cdc-pipeline',
    title: 'CDC pipeline, end to end',
    page: 'why-a-text-to-sql-agent',
    build: () => [
      ...chain(0, 0, 300, 56, 46, [
        { text: 'Postgres (OLTP)' },
        { text: 'logical decoding', note: 'replication slot holds WAL\nuntil the consumer confirms' },
        { text: 'Debezium', note: '~100k change events / day' },
        { text: 'broker', note: 'at-least-once delivery' },
        { text: 'consumer  [ LSN guard ]', color: 'green', note: 'idempotent upsert,\nstale replays are no-ops' },
        { text: 'denormalized tables', color: 'green', note: 'pre-joined, shaped for reporting' },
        { text: 'reporting agent' },
      ]),
      arrow(150, 668, 150, 714),
      box(0, 714, 300, 56, 'Postgres computes the number', { color: 'green' }),
    ],
  },

  {
    name: 'ordering-bug',
    title: 'The bug that throws no exception',
    page: 'why-a-text-to-sql-agent',
    build: () => [
      label(0, -40, 'committed:  balance 100 -> 200 -> 300'),
      box(0, 0, 150, 52, 'e1\nlsn 1001'),
      box(170, 0, 150, 52, 'e2\nlsn 1002'),
      box(340, 0, 150, 52, 'e3\nlsn 1003'),
      box(530, 0, 170, 52, 'e2 redelivered', { color: 'orange', dash: 'dashed' }),

      arrow(150, 26, 170, 26),
      arrow(320, 26, 340, 26),
      arrow(615, 52, 400, 130, { color: 'orange', dash: 'dashed' }),

      label(0, 150, 'upsert by key alone', { color: 'red' }),
      box(0, 186, 350, 112, 'writes 200 over 300\n0 exceptions, 0 alerts\nthe row is silently stale', {
        color: 'red',
      }),

      label(390, 150, 'upsert with the LSN guard', { color: 'green' }),
      box(390, 186, 350, 112, 'stored 1003, incoming 1002\n1003 < 1002 = false\n0 rows updated, 300 stays', {
        color: 'green',
      }),
    ],
  },

  {
    name: 'agent-pipeline',
    title: 'The reporting agent',
    page: 'why-a-text-to-sql-agent',
    build: () => [
      ...chain(0, 0, 300, 56, 46, [
        { text: 'question' },
        { text: 'embed, find nearest\ngolden query' },
        { text: 'generate SQL', note: 'the only thing the model does' },
        { text: 'LLM judge:\ngenerated vs golden', note: 'shares the generator’s blind spots' },
        { text: 'Postgres executes', color: 'green', note: 'all arithmetic happens here' },
        { text: 'number' },
      ]),
      arrow(300, 130, 430, 130, { color: 'orange', dash: 'dashed' }),
      box(430, 86, 300, 92, 'no near neighbour\nflagged novel\nanswered ungated', {
        color: 'orange',
        dash: 'dashed',
      }),
    ],
  },

  {
    name: 'coverage-vs-correctness',
    title: 'Coverage is not correctness',
    page: 'why-a-text-to-sql-agent',
    build: () => [
      box(0, 0, 320, 264, '', { color: 'grey', dash: 'dashed' }),
      label(24, 20, 'COVERAGE CHECK', { color: 'black' }),
      label(24, 74, 'input:\n  the question'),
      label(24, 164, 'asks:\n  do we have a test\n  for this?'),

      box(400, 0, 320, 264, '', { color: 'grey', dash: 'dashed' }),
      label(424, 20, 'CORRECTNESS', { color: 'black' }),
      label(424, 74, 'input:\n  generated SQL\n  returned number'),
      label(424, 164, 'asks:\n  was this run right?'),

      arrow(330, 132, 390, 132, { color: 'red', head: 'none', dash: 'dotted' }),
      label(180, 292, 'these two never touch each other', { color: 'red' }),
    ],
  },

  {
    name: 'checks-matrix',
    title: 'What each check can and cannot catch',
    page: 'why-a-text-to-sql-agent',
    build: () => {
      const rows = [
        ['LLM judge', 'yes', 'yes', 'have', 'red'],
        ['execute + compare', 'yes', 'no', 'missing', 'green'],
        ['SQL lint rules', 'yes', 'no', 'missing', 'green'],
        ['reconciliation invariants', 'yes', 'no', 'missing', 'green'],
      ]
      const shapes = [
        label(0, 0, 'check', { color: 'black' }),
        label(300, 0, 'catches\ndrift?', { color: 'black' }),
        label(430, 0, 'shares the generator’s\nblind spots?', { color: 'black' }),
        label(700, 0, 'status', { color: 'black' }),
      ]
      rows.forEach(([name, drift, blind, status, color], i) => {
        const y = 80 + i * 46
        shapes.push(label(0, y, name, { color }))
        shapes.push(label(300, y, drift, { color }))
        shapes.push(label(430, y, blind, { color }))
        shapes.push(label(700, y, status, { color }))
      })
      return shapes
    },
  },

  {
    name: 'crawler-phases',
    title: 'Crawler, phase 1 vs phase 2',
    page: 'rag-content-system',
    build: () => [
      label(0, -40, 'PHASE 1   send everything through the model', { color: 'red' }),
      box(0, 0, 200, 60, 'HTML page', { color: 'red' }),
      arrow(200, 30, 250, 30, { color: 'red' }),
      box(250, 0, 200, 60, 'flatten to markdown', { color: 'red' }),
      arrow(450, 30, 500, 30, { color: 'red' }),
      box(500, 0, 220, 60, 'LLM classifies\nevery section', { color: 'red' }),
      label(0, 76, 'lossy  ->  boilerplate outweighs signal  ->  expensive AF', { color: 'red' }),

      label(0, 170, 'PHASE 2  make the expensive stage small', { color: 'green' }),
      box(0, 210, 200, 60, 'HTML page\nDOM preserved', { color: 'green' }),
      arrow(200, 240, 250, 240, { color: 'green' }),
      box(250, 210, 200, 60, 'discovery\nis this worth it?', { color: 'green' }),
      arrow(450, 240, 500, 240, { color: 'green' }),
      box(500, 210, 220, 60, 'structured\nextraction', { color: 'green' }),
      arrow(610, 270, 610, 320, { color: 'green' }),
      box(500, 320, 220, 60, 'semantic chunking', { color: 'green' }),
      arrow(500, 350, 450, 350, { color: 'green' }),
      box(250, 320, 200, 60, 'DBSCAN clustering', { color: 'green', note: '' }),
      arrow(250, 350, 200, 350, { color: 'green' }),
      box(0, 320, 200, 60, 'Qdrant', { color: 'green' }),
      label(250, 396, 'noise label drops boilerplate for free', { color: 'black' }),
    ],
  },
]
