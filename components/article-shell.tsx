import Link from "next/link"
import type { ReactNode } from "react"
import type { Heading } from "../lib/content"
import { TableOfContents } from "./table-of-contents"
import { SiteFooter } from "./site-footer"

interface ArticleShellProps {
  section: "blogs" | "proj"
  slug: string
  title: string
  lead: string
  meta: string
  tags: string[]
  headings: Heading[]
  children: ReactNode
}

export function ArticleShell({ section, slug, title, lead, meta, tags, headings, children }: ArticleShellProps) {
  return (
    <div className="tree-page">
      <main className="tree">
        <p className="eyebrow tree-eyebrow">{section === "blogs" ? "reading" : "building"}</p>

        <nav className="art-path" aria-label="Breadcrumb">
          <Link href="/" className="art-crumb">
            root
          </Link>
          <span className="art-sep">/</span>
          <Link href="/" className="art-crumb">
            {section}
          </Link>
          <span className="art-sep">/</span>
          <span className="art-here">{slug}</span>
        </nav>

        <header className="art-head">
          <h1 className="art-title">{title}</h1>
          <p className="art-lead">{lead}</p>
          <div className="art-meta">
            <span className="tnum">{meta}</span>
            {tags.length > 0 && <span className="art-tags">{tags.join(" · ")}</span>}
          </div>
        </header>

        <TableOfContents headings={headings} />

        <article className="md">{children}</article>

        <Link href="/" className="art-back">
          <span className="art-back-ico" aria-hidden="true">
            ←
          </span>
          back to index
        </Link>
      </main>

      <SiteFooter />
    </div>
  )
}
