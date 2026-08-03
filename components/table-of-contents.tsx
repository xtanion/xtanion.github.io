"use client"

import { useEffect, useState, useRef } from "react"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
}

const TOC_ITEM_REM = 1.5

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 1500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const activeIndex = headings.findIndex((heading) => heading.id === activeId)

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className={`fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block transition-opacity duration-300 ${
      isScrolling ? "opacity-100" : "opacity-0"
    }`}>
      <div className="relative flex flex-col">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
        <div
          className={`absolute left-0 w-0.5 bg-grad-green transition-all duration-500 ${
            activeIndex < 0 ? "opacity-0" : "opacity-100"
          }`}
          style={{
            height: `${TOC_ITEM_REM}rem`,
            transform: `translateY(${Math.max(activeIndex, 0) * TOC_ITEM_REM}rem)`,
          }}
        />
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className="group flex h-6 items-center pl-4"
            aria-label={`Navigate to ${heading.text}`}
          >
            <span className={`text-xs font-mono transition-colors duration-500 max-w-[120px] truncate ${
              activeId === heading.id ? "text-foreground" : "text-muted-foreground/40 group-hover:text-foreground"
            } ${heading.level === 3 ? "ml-2" : ""}`}>
              {heading.text}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
