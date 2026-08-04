import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(here, '../../public/diagrams')

/**
 * Writes exported SVGs straight into the site's public/diagrams so there is no
 * download-then-move step. Dev server only; this never runs in the site build.
 */
function saveDiagrams() {
  return {
    name: 'save-diagrams',
    configureServer(server) {
      server.middlewares.use('/__save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('POST only')
        }
        const name = new URL(req.url, 'http://localhost').searchParams.get('name')
        if (!name || !/^[a-z0-9-]+\.svg$/.test(name)) {
          res.statusCode = 400
          return res.end('bad name')
        }
        let body = ''
        req.setEncoding('utf8')
        req.on('data', (c) => (body += c))
        req.on('end', () => {
          fs.mkdirSync(outDir, { recursive: true })
          fs.writeFileSync(path.join(outDir, name), body)
          server.config.logger.info(`  saved public/diagrams/${name}`)
          res.end('ok')
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), saveDiagrams()],
  server: { port: 5199 },
})
