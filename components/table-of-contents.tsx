"use client"

import { useEffect, useState } from "react"
import type { Heading } from "../lib/content"
import { Guide } from "./tree/guide"

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [open, setOpen] = useState(false)

  const sections = headings.filter((h) => h.level === 2)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "0px 0px -80% 0px" },
    )

    sections.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sections])

  if (sections.length < 3) return null

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="art-toc" aria-label="On this page">
      <button
        type="button"
        className={`tree-row tree-dir${open ? " open" : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tree-mark">{open ? "-" : "+"}</span>
        <span className="tree-name">contents/</span>
      </button>

      {open &&
        sections.map((heading, i) => (
          <button
            key={heading.id}
            type="button"
            className={`tree-row tree-link${activeId === heading.id ? " active" : ""}`}
            onClick={() => scrollToHeading(heading.id)}
          >
            <Guide kind={i === sections.length - 1 ? "end" : "tee"} />
            <span className="tree-name">{heading.text}</span>
          </button>
        ))}
    </nav>
  )
}
