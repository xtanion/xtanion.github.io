import Link from "next/link"
import type { TreeLeaf as Leaf } from "../../lib/site"
import { Guide } from "./guide"

interface TreeLeafProps {
  leaf: Leaf
  /** the parent's column: a continuing stem, or blank when it is the last node.
      Omitted at depth one, where the leaf hangs straight off the root. */
  stem?: "line" | "blank"
  last: boolean
}

export function TreeLeaf({ leaf, stem, last }: TreeLeafProps) {
  const body = (
    <>
      {stem && <Guide kind={stem} />}
      <Guide kind={last ? "end" : "tee"} />
      {leaf.icon}
      <span className={`tree-name${leaf.dim ? " dim" : ""}`}>{leaf.label}</span>
      <span className="tree-right">{leaf.meta && <span className="tree-meta tnum">{leaf.meta}</span>}</span>
    </>
  )

  if (!leaf.href) {
    return <div className="tree-row tree-leaf">{body}</div>
  }

  if (leaf.external) {
    return (
      <a href={leaf.href} target="_blank" rel="noreferrer" className="tree-row tree-leaf tree-link">
        {body}
      </a>
    )
  }

  return (
    <Link href={leaf.href} className="tree-row tree-leaf tree-link">
      {body}
    </Link>
  )
}
