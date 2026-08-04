import type { TreeNode as Node } from "../../lib/site"
import { Guide } from "./guide"
import { TreeLeaf } from "./tree-leaf"

interface TreeNodeProps {
  node: Node
  open: boolean
  /** the last node closes its branch, so its children hang off blank space */
  last: boolean
  onToggle: () => void
}

export function TreeNode({ node, open, last, onToggle }: TreeNodeProps) {
  const stem = last ? "blank" : "line"

  return (
    <div>
      <button
        type="button"
        className={`tree-row tree-dir${open ? " open" : ""}`}
        aria-expanded={open}
        onClick={onToggle}
      >
        <Guide kind={last ? "end" : "tee"} />
        <span className="tree-mark">{open ? "-" : "+"}</span>
        <span className="tree-name">{node.label}/</span>
      </button>

      {open && node.prose && (
        <div className="tree-row tree-prose-row">
          <Guide kind={stem} />
          <p className="tree-prose">{node.prose}</p>
        </div>
      )}

      {open &&
        node.leaves?.map((leaf, i) => (
          <TreeLeaf key={leaf.key} leaf={leaf} stem={stem} last={i === node.leaves!.length - 1} />
        ))}
    </div>
  )
}
