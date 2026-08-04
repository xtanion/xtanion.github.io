import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const dir = '/Users/xtanion/portfolio/public/diagrams'
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()

const parts = files.map((f) => {
  const b64 = Buffer.from(fs.readFileSync(path.join(dir, f), 'utf8')).toString('base64')
  return `<div style="padding:10px 16px;color:#0ae448;font:13px monospace">${f}</div>
   <img src="data:image/svg+xml;base64,${b64}" style="max-width:760px;display:block;margin:0 16px 28px;outline:1px dashed #333">`
})

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 820, height: 1000 } })
await page.setContent(`<body style="margin:0;background:#0a0a0a">${parts.join('')}</body>`)
await page.waitForTimeout(2000)
await page.screenshot({ path: process.argv[2], fullPage: true })
await browser.close()
console.log('wrote', process.argv[2])
