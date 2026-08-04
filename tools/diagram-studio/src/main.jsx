import { StrictMode, useCallback, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { diagrams } from './diagrams'

const EXPORT_OPTS = {
  format: 'svg',
  background: true,
  darkMode: false,
  padding: 24,
  scale: 1,
}

function Studio() {
  const editorRef = useRef(null)
  const [current, setCurrent] = useState(0)
  const [status, setStatus] = useState('')

  const load = useCallback((index) => {
    const editor = editorRef.current
    if (!editor) return
    const existing = [...editor.getCurrentPageShapeIds()]
    if (existing.length) editor.deleteShapes(existing)
    editor.createShapes(diagrams[index].build())
    editor.selectNone()
    editor.zoomToFit({ animation: { duration: 0 } })
    setCurrent(index)
  }, [])

  const onMount = useCallback(
    (editor) => {
      editorRef.current = editor
      editor.user.updateUserPreferences({ colorScheme: 'light' })
      load(0)
    },
    [load]
  )

  const exportOne = useCallback(async (index) => {
    const editor = editorRef.current
    const ids = [...editor.getCurrentPageShapeIds()]
    if (!ids.length) return
    const { blob } = await editor.toImage(ids, EXPORT_OPTS)
    const svg = await blob.text()
    const name = `${diagrams[index].name}.svg`
    const res = await fetch(`/__save?name=${name}`, { method: 'POST', body: svg })
    if (!res.ok) throw new Error(`${name}: ${await res.text()}`)
    return name
  }, [])

  const exportCurrent = useCallback(async () => {
    setStatus('exporting...')
    try {
      const name = await exportOne(current)
      setStatus(`saved public/diagrams/${name}`)
    } catch (err) {
      setStatus(String(err))
    }
  }, [current, exportOne])

  const exportAll = useCallback(async () => {
    setStatus('exporting all...')
    try {
      for (let i = 0; i < diagrams.length; i++) {
        load(i)
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
        await exportOne(i)
      }
      setStatus(`saved ${diagrams.length} files to public/diagrams/`)
    } catch (err) {
      setStatus(String(err))
    }
  }, [exportOne, load])

  return (
    <>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Tldraw onMount={onMount} />
      </div>
      <div style={panel}>
        <strong style={{ color: '#e5e7eb' }}>diagram studio</strong>
        {diagrams.map((d, i) => (
          <button key={d.name} onClick={() => load(i)} style={i === current ? btnOn : btn}>
            {d.name}
            <span style={{ opacity: 0.5, marginLeft: 8 }}>{d.page.slice(0, 12)}</span>
          </button>
        ))}
        <hr style={{ border: 0, borderTop: '1px solid #333', width: '100%', margin: '4px 0' }} />
        <button onClick={exportCurrent} style={btn}>export current</button>
        <button onClick={exportAll} style={btn}>export all</button>
        <span style={{ color: '#0ae448', minHeight: 16 }}>{status}</span>
      </div>
    </>
  )
}

const panel = {
  position: 'fixed',
  zIndex: 1000,
  top: 12,
  right: 12,
  width: 260,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: 12,
  background: '#0a0a0a',
  border: '1px solid #333',
  color: '#d4d4d4',
  font: '12px ui-monospace, Menlo, monospace',
}

const btn = {
  background: '#141414',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#333',
  color: '#d4d4d4',
  padding: '6px 8px',
  textAlign: 'left',
  cursor: 'pointer',
  font: 'inherit',
}

const btnOn = { ...btn, borderColor: '#0ae448', color: '#0ae448' }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Studio />
  </StrictMode>
)
