"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Github, Twitter, Linkedin } from "lucide-react"
import { SiteNav } from "./site-nav"
import type { Post } from "../lib/posts"
import type { Project } from "../lib/projects"

interface ClientHomeProps {
  posts: Post[]
  projects: Project[]
}

const RAIL = [
  { id: "intro", label: "intro" },
  { id: "work", label: "work" },
  { id: "projects", label: "projects" },
  { id: "thoughts", label: "blog" },
  { id: "connect", label: "connect" },
]

const EXPERIENCE = [
  {
    year: "2026",
    role: "Generative AI Engineer",
    company: "Kodo (YC'21)",
    description: "Working on the Reporting Agent, data pipelines and treasury.",
    tech: ["Python", "Langsmith", "Langchain", "Debezium", "Redis", "RabbitMQ"],
  },
  {
    year: "2024",
    role: "Software Development Engineer",
    company: "Edra Labs — a BrowserStack venture",
    description:
      "Led backend for AI-driven content systems: RAG platforms at 98% retrieval precision and autonomous SEO optimization.",
    tech: ["Python", "TypeScript", "Langchain", "EKS", "PostgreSQL"],
  },
  {
    year: "2023",
    role: "Software Development Intern",
    company: "Samagra | HCX",
    description: "Implemented JWT auth with RSA encryption and FHIR JSON validation for healthcare APIs.",
    tech: ["JWT", "RSA", "Google Cloud", "FHIR"],
  },
  {
    year: "2022",
    role: "Software Development Intern",
    company: "Python Software Foundation",
    description: "Enhanced the FURY renderer with glTF support, keyframe animations, and spline interpolation.",
    tech: ["Python", "OpenGL", "glTF", "Graphics"],
  },
]

const SOCIALS = [
  { name: "GitHub", handle: "@xtanion", url: "https://github.com/xtanion", icon: Github },
  { name: "Twitter", handle: "@xtanion", url: "https://x.com/xtanion", icon: Twitter },
  { name: "LinkedIn", handle: "xtanion", url: "https://linkedin.com/in/xtanion", icon: Linkedin },
]

const FOCUS = ["Rust", "Python", "C++", "Redis", "RabbitMQ", "AWS", "Docker"]

export default function ClientHome({ posts, projects }: ClientHomeProps) {
  const [active, setActive] = useState("intro")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.2, rootMargin: "-40% 0px -40% 0px" },
    )
    sectionsRef.current.forEach((s) => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const setRef = (i: number) => (el: HTMLElement | null) => {
    sectionsRef.current[i] = el
  }

  return (
    <div className="shell">
      <SiteNav home />

      <nav className="rail" aria-label="Sections">
        {RAIL.map((s) => (
          <button
            key={s.id}
            className={`rail-item${active === s.id ? " active" : ""}`}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
            aria-label={`Go to ${s.label}`}
          >
            <span className="rail-bar" aria-hidden="true" />
            <span className="rail-label">{s.label}</span>
          </button>
        ))}
      </nav>

      <main className="main">
        <div className="frame">
          <section id="intro" ref={setRef(0)}>
            <div className="stack-24">
              <div className="stack-12">
                <span className="eyebrow">hi, i am</span>
                <h1 className="hero-title">Shivam Anand</h1>
                <p className="lead">
                  I build <span className="hl">backend systems</span>, <span className="hl">generative AI</span>, and{" "}
                  <span className="hl">distributed architectures</span>. Off the clock I tinker with my home server
                  and chip away at Rust.
                </p>
              </div>

              <div className="status">
                <span className="live">
                  <span className="pip" aria-hidden="true" />
                  available for work
                </span>
                <span>Mumbai, India</span>
              </div>

              <div className="cells cells-2">
                <div className="cell">
                  <div className="def-k">currently</div>
                  <div className="stack-4">
                    <span className="loud">Generative AI Engineer</span>
                    <span className="muted">@ Kodo (YC'21)</span>
                    <span className="mono-xs tnum">Jan 2026 — Present</span>
                  </div>
                </div>
                <div className="cell">
                  <div className="def-k">focus</div>
                  <div className="tag-row">
                    {FOCUS.map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="work" ref={setRef(1)}>
            <div className="section-head">
              <h2 className="t-title">Work</h2>
              <span className="mono-xs tnum">2022 — 2026</span>
            </div>

            <div className="rows">
              {EXPERIENCE.map((job) => (
                <div key={job.year} className="row">
                  <div className="row-year">{job.year}</div>
                  <div className="row-body">
                    <div className="row-title-line">
                      <span className="h-sm">{job.role}</span>
                      <span className="muted mono-xs">{job.company}</span>
                    </div>
                    <p className="lead">{job.description}</p>
                    <div className="tag-row">
                      {job.tech.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="projects" ref={setRef(2)}>
            <div className="section-head">
              <h2 className="t-title">Projects</h2>
              <span className="mono-xs">{projects.length} shipped</span>
            </div>

            <div className="cells cells-2">
              {projects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="cell" aria-label={project.title}>
                  <div className="cell-head">
                    <span className="tnum">{project.year}</span>
                    <span className="cell-arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <span className="h-sm">{project.title}</span>
                  <p className="lead">{project.description}</p>
                  <div className="tag-row" style={{ marginTop: "auto" }}>
                    {project.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="thoughts" ref={setRef(3)}>
            <div className="section-head">
              <h2 className="t-title">Writing</h2>
              <span className="mono-xs">{posts.length} posts</span>
            </div>

            <div className="cells cells-2">
              {posts.map((post) => (
                <Link key={post.slug} href={`/thoughts/${post.slug}`} className="cell" aria-label={post.title}>
                  <div className="cell-head">
                    <span className="tnum">{post.date}</span>
                    <span className="tnum">{post.readTime}</span>
                  </div>
                  <span className="h-sm">{post.title}</span>
                  <p className="lead">{post.excerpt}</p>
                  <div className="tag-row" style={{ marginTop: "auto" }}>
                    {post.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="connect" ref={setRef(4)}>
            <div className="stack-24">
              <div className="stack-12">
                <span className="eyebrow">say hi</span>
                <h2 className="t-title">Let's connect</h2>
                <p className="lead">
                  Always up for new opportunities, collaborations, and conversations about systems and AI.
                </p>
                <Link href="mailto:anandshivam54321@gmail.com" className="btn btn-grad arrow-link" style={{ alignSelf: "flex-start" }}>
                  anandshivam54321@gmail.com
                  <span className="arrow-ico" aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="stack-12">
                <span className="def-k">elsewhere</span>
                <div className="cells cells-2">
                  {SOCIALS.map((s) => {
                    const Icon = s.icon
                    return (
                      <Link key={s.name} href={s.url} className="cell social-cell" target="_blank" rel="noreferrer">
                        <div className="row-title-line">
                          <Icon className="w-4 h-4" width={16} height={16} />
                          <span className="h-sm">{s.name}</span>
                        </div>
                        <span className="mono-xs">{s.handle}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="foot">
        <div className="foot-inner">
          <span>© 2026 Shivam Anand</span>
          <span className="mono-xs">built terminal-style · monospace · one green</span>
        </div>
      </footer>
    </div>
  )
}
