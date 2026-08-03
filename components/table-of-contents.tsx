"use client"

import { useEffect, useState } from "react"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "0px 0px -80% 0px" },
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="rail" aria-label="On this page">
      {headings.map((heading) => (
        <button
          key={heading.id}
          onClick={() => scrollToHeading(heading.id)}
          className={`rail-item${heading.level === 3 ? " rail-l3" : ""}${activeId === heading.id ? " active" : ""}`}
          aria-label={`Navigate to ${heading.text}`}
        >
          <span className="rail-bar" aria-hidden="true" />
          <span className="rail-label">{heading.text}</span>
        </button>
      ))}
    </nav>
  )
}
