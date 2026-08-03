"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "thoughts", label: "Blog" },
  { id: "connect", label: "Connect" },
]

interface SiteNavProps {
  home?: boolean
}

export function SiteNav({ home = false }: SiteNavProps) {
  const [active, setActive] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!home) return
    const ids = ["intro", ...SECTIONS.map((s) => s.id)]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.2, rootMargin: "-40% 0px -40% 0px" },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [home])

  const href = (id: string) => (home ? `#${id}` : `/#${id}`)

  return (
    <>
      <nav className="nav" aria-label="Primary">
        <Link href={home ? "#intro" : "/"} className="brand" aria-label="Home">
          <span className="brand-dot" aria-hidden="true" />
          xtanion
        </Link>

        <div className="nav-links">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={href(s.id)}
              className={`nav-link${home && active === s.id ? " active" : ""}`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        <Link href="mailto:anandshivam54321@gmail.com" className="nav-cta">
          <span className="pip" aria-hidden="true" />
          available
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            {open ? (
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            ) : (
              <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      <div className={`nav-mobile${open ? " open" : ""}`}>
        {SECTIONS.map((s) => (
          <Link
            key={s.id}
            href={href(s.id)}
            className="nav-link"
            onClick={() => setOpen(false)}
          >
            {s.label}
          </Link>
        ))}
        <Link href="mailto:anandshivam54321@gmail.com" className="nav-link" onClick={() => setOpen(false)}>
          Connect
        </Link>
      </div>
    </>
  )
}
