import Link from "next/link"
import type { TreeLeaf as Leaf } from "../lib/site"
import { SiteFooter } from "./site-footer"
import { TreeLeaf } from "./tree/tree-leaf"

interface ListingProps {
  /** the folder name, as it reads in the tree on the index */
  section: string
  eyebrow: string
  leaves: Leaf[]
  empty: string
}

export function Listing({ section, eyebrow, leaves, empty }: ListingProps) {
  return (
    <div className="tree-page">
      <main className="tree">
        <p className="eyebrow tree-eyebrow">{eyebrow}</p>

        <nav className="art-path" aria-label="Breadcrumb">
          <Link href="/" className="art-crumb">
            root
          </Link>
          <span className="art-sep">/</span>
          <span className="art-here">{section}</span>
        </nav>

        <div className="tree-row tree-root">
          <span className="tree-mark">-</span>
          <span className="tree-name">{section}/</span>
        </div>

        {leaves.length === 0 ? (
          <div className="tree-row tree-leaf">
            <span className="tree-name muted">{empty}</span>
          </div>
        ) : (
          leaves.map((leaf, i) => <TreeLeaf key={leaf.key} leaf={leaf} last={i === leaves.length - 1} />)
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
