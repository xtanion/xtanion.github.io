"use client"

import Link from "next/link"
import { useState, type ReactNode } from "react"
import { Github, Linkedin, Mail, MapPin, Twitter, type LucideIcon } from "lucide-react"
import { Guide } from "./guide"
import { SiteFooter } from "./site-footer"
import type { Post } from "../lib/posts"
import type { Project } from "../lib/projects"

interface ClientHomeProps {
  posts: Post[]
  projects: Project[]
}

type Leaf = {
  key: string
  label: string
  meta?: ReactNode
  href?: string
  external?: boolean
  icon?: LucideIcon
}

type Node = {
  id: string
  label: string
  leaves?: Leaf[]
  prose?: ReactNode
}

const EXPERIENCE = [
  { year: "2026", role: "generative ai engineer", company: "kodo (yc'21)" },
  { year: "2024", role: "software development engineer", company: "edra labs" },
  { year: "2023", role: "software development intern", company: "samagra | hcx" },
  { year: "2022", role: "software development intern", company: "python software foundation" },
]

const WHOAMI = (
  <>
    <span className="hl-loud">shivam anand</span> — i build backend systems, generative ai and distributed
    architectures.
    <br />
    currently a generative ai engineer at kodo (yc&apos;21); before that edra labs, samagra and the python software
    foundation.
    <br />
    off the clock i tinker with my home server and chip away at rust.
    <br />
    <span className="tree-status">
      <MapPin size={13} strokeWidth={1.5} aria-hidden="true" />
      mumbai, india
    </span>
    <span className="hl">available for work</span>
  </>
)

const CONTACT: Leaf[] = [
  {
    key: "email",
    label: "anandshivam54321@gmail.com",
    meta: "email",
    href: "mailto:anandshivam54321@gmail.com",
    icon: Mail,
  },
  { key: "github", label: "@xtanion", meta: "github", href: "https://github.com/xtanion", external: true, icon: Github },
  { key: "twitter", label: "@xtanion", meta: "twitter", href: "https://x.com/xtanion", external: true, icon: Twitter },
  {
    key: "linkedin",
    label: "xtanion",
    meta: "linkedin",
    href: "https://linkedin.com/in/xtanion",
    external: true,
    icon: Linkedin,
  },
]

export default function ClientHome({ posts, projects }: ClientHomeProps) {
  const [open, setOpen] = useState<string[]>([])

  const toggle = (id: string) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const nodes: Node[] = [
    { id: "whoami", label: "whoami", prose: WHOAMI },
    {
      id: "exp",
      label: "exp",
      leaves: EXPERIENCE.map((job) => ({
        key: job.year,
        label: `${job.role} @ ${job.company}`,
        meta: job.year,
      })),
    },
    {
      id: "proj",
      label: "proj",
      leaves: projects.map((project) => ({
        key: project.slug,
        label: project.title,
        meta: project.year,
        href: `/projects/${project.slug}`,
      })),
    },
    {
      id: "blogs",
      label: "blogs",
      leaves: posts.map((post) => ({
        key: post.slug,
        label: post.title,
        meta: (
          <>
            {post.date}
            <span className="tree-meta-long"> · {post.readTime}</span>
          </>
        ),
        href: `/thoughts/${post.slug}`,
      })),
    },
    { id: "contact", label: "contact", leaves: CONTACT },
  ]

  return (
    <div className="tree-page">
      <main className="tree">
        <p className="eyebrow tree-eyebrow">index</p>

        <div className="tree-row tree-root">
          <span className="tree-mark">-</span>
          <span className="tree-name">root/</span>
        </div>

        {nodes.map((node, i) => {
          const lastNode = i === nodes.length - 1
          const isOpen = open.includes(node.id)

          return (
            <div key={node.id}>
              <button
                type="button"
                className={`tree-row tree-dir${isOpen ? " open" : ""}`}
                aria-expanded={isOpen}
                onClick={() => toggle(node.id)}
              >
                <Guide kind={lastNode ? "end" : "tee"} />
                <span className="tree-mark">{isOpen ? "-" : "+"}</span>
                <span className="tree-name">{node.label}/</span>
              </button>

              {isOpen && node.prose && (
                <div className="tree-row tree-prose-row">
                  <Guide kind={lastNode ? "blank" : "line"} />
                  <p className="tree-prose">{node.prose}</p>
                </div>
              )}

              {isOpen &&
                node.leaves?.map((leaf, j) => {
                  const Icon = leaf.icon
                  const body = (
                    <>
                      <Guide kind={lastNode ? "blank" : "line"} />
                      <Guide kind={j === (node.leaves?.length ?? 0) - 1 ? "end" : "tee"} />
                      {Icon && <Icon className="tree-ico" size={13} strokeWidth={1.5} aria-hidden="true" />}
                      <span className="tree-name">{leaf.label}</span>
                      <span className="tree-right">
                        {leaf.meta && <span className="tree-meta tnum">{leaf.meta}</span>}
                      </span>
                    </>
                  )

                  if (!leaf.href) {
                    return (
                      <div key={leaf.key} className="tree-row tree-leaf">
                        {body}
                      </div>
                    )
                  }

                  return leaf.external ? (
                    <a
                      key={leaf.key}
                      href={leaf.href}
                      target="_blank"
                      rel="noreferrer"
                      className="tree-row tree-leaf tree-link"
                    >
                      {body}
                    </a>
                  ) : (
                    <Link key={leaf.key} href={leaf.href} className="tree-row tree-leaf tree-link">
                      {body}
                    </Link>
                  )
                })}
            </div>
          )
        })}
      </main>

      <SiteFooter />
    </div>
  )
}
