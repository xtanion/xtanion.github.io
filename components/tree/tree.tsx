"use client"

import { useEffect, useState } from "react"
import type { TreeNode as Node } from "../../lib/site"
import { TreeNode } from "./tree-node"

const OPEN_KEY = "tree-open"

interface TreeProps {
  nodes: Node[]
  /** open on a first visit; a stored selection wins over this */
  initialOpen?: string[]
}

export function Tree({ nodes, initialOpen = [] }: TreeProps) {
  const [open, setOpen] = useState<string[]>(initialOpen)

  /* Restored after mount, not during render — the prerendered html always
     reflects initialOpen, so reading storage earlier would break hydration. */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(OPEN_KEY)
      if (saved) setOpen(JSON.parse(saved))
    } catch {}
  }, [])

  const toggle = (id: string) => {
    const next = open.includes(id) ? open.filter((x) => x !== id) : [...open, id]
    setOpen(next)
    try {
      sessionStorage.setItem(OPEN_KEY, JSON.stringify(next))
    } catch {}
  }

  return (
    <>
      <div className="tree-row tree-root">
        <span className="tree-mark">-</span>
        <span className="tree-name">root/</span>
      </div>

      {nodes.map((node, i) => (
        <TreeNode
          key={node.id}
          node={node}
          open={open.includes(node.id)}
          last={i === nodes.length - 1}
          onToggle={() => toggle(node.id)}
        />
      ))}
    </>
  )
}
