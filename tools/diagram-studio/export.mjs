/**
 * Headless export. Drives the studio in a real browser and clicks "export all",
 * so diagrams can be regenerated without opening the canvas by hand.
 *
 * Requires the dev server to already be running (npm run dev).
 */
import { chromium } from 'playwright'

const URL = process.env.STUDIO_URL ?? 'http://localhost:5199/'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })

const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))

await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForSelector('.tl-canvas', { timeout: 30_000 })

await page.getByRole('button', { name: 'export all' }).click()
await page.waitForFunction(
  () => /saved \d+ files|Error/.test(document.body.innerText),
  null,
  { timeout: 120_000 }
)

const status = await page.evaluate(() => {
  const m = document.body.innerText.match(/saved .*|Error.*/)
  return m ? m[0] : '(no status)'
})

await browser.close()

console.log('status:', status)
if (errors.length) {
  console.log('\nconsole errors:')
  for (const e of [...new Set(errors)]) console.log(' ', e)
  process.exit(1)
}
