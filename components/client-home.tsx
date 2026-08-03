"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Github, Twitter, Linkedin } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import type { Post } from "../lib/posts"
import type { Project } from "../lib/projects"

interface ClientHomeProps {
  posts: Post[]
  projects: Project[]
}

const NAV_SECTIONS = [
  { id: "intro", label: "Hi !" },
  { id: "work", label: "Exp." },
  { id: "projects", label: "Proj" },
  { id: "thoughts", label: "Blog" },
  { id: "connect", label: "Dial" },
]

const NAV_ITEM_REM = 2

export default function ClientHome({ posts, projects }: ClientHomeProps) {
  const [activeSection, setActiveSection] = useState("")
  const [isScrolling, setIsScrolling] = useState(false)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

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


  const activeIndex = NAV_SECTIONS.findIndex((section) => section.id === activeSection)

  return (
    <div className="min-h-screen bg-background text-foreground relative">
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
              height: `${NAV_ITEM_REM}rem`,
              transform: `translateY(${Math.max(activeIndex, 0) * NAV_ITEM_REM}rem)`,
            }}
          />
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
              className="group flex h-8 items-center pl-4"
              aria-label={`Navigate to ${section.id}`}
            >
              <span className={`text-sm font-mono transition-colors duration-500 ${
                activeSection === section.id ? "text-foreground" : "text-muted-foreground/40 group-hover:text-foreground"
              }`}>
                {section.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 lg:px-16">
        <header
          id="intro"
          ref={(el) => { sectionsRef.current[0] = el }}
          className="min-h-screen flex items-center opacity-0"
        >
          <div className="grid lg:grid-cols-5 gap-16 w-full">
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">Hi, I am</div>
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight">
                  Shivam
                  <br />
                  <span className="text-muted-foreground">Anand</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  I work on <span className="text-foreground">backend systems</span>, <span className="text-foreground">generative AI</span>, and <span className="text-foreground">distributed architectures</span>. In my free time, I like to tinker with my home server or learning Rust.
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                    Available for work
                  </div>
                  <div>Mumbai, India</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-8">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">CURRENTLY</div>
                <div className="space-y-2">
                  <div className="text-foreground">Software Development Engineer</div>
                  <div className="text-muted-foreground">@ Kodo (YC'21)</div>
                  <div className="text-xs text-muted-foreground">Jan 2026 — Present</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                <div className="flex flex-wrap gap-2">
                  {["Rust", "Python", "C++", "Redis", "RabbitMq", "AWS", "Docker"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs font-mono rounded-full bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="work" ref={(el) => { sectionsRef.current[1] = el }} className="min-h-screen py-32 opacity-0">
          <div className="space-y-16">
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-light">Work</h2>
              <div className="text-sm text-muted-foreground font-mono">2019 — 2025</div>
            </div>

            <div className="space-y-12">
              {[
                {
                  year: "2026",
                  role: "Generative AI Engineer",
                  company: "Kodo",
                  description: "Working on Reporting Agent, Data Pipelines and Tresury.",
                  tech: ["Python", "Langsmith", "Langchain", "Debezium", "Redis", "RabbitMQ"],
                },
                {
                  year: "2024",
                  role: "Software Development Engineer",
                  company: "Edra Labs - BrowserStack Venture",
                  description: "Leading backend development for AI-driven content systems with RAG platforms achieving 98% retrieval precision and autonomous SEO optimization.",
                  tech: ["Python", "TypeScript", "Langchain", "Langsmith", "EKS", "AC2", "PostgreSQL"],
                },
                {
                  year: "2023",
                  role: "Software Development Intern",
                  company: "Samagra | HCX",
                  description: "Implemented JWT authentication with RSA encryption and FHIR JSON validation for healthcare APIs.",
                  tech: ["JWT", "RSA Encryption", "Google Cloud", "FHIR"],
                },
                {
                  year: "2022",
                  role: "Software Development Intern",
                  company: "Python Software Foundation",
                  description: "Enhanced FURY renderer with glTF support, keyframe animations, and spline interpolation techniques.",
                  tech: ["Python", "OpenGL", "glTF", "Computer Graphics"],
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-8 py-8 px-4 -mx-4 border-b border-border/50 hover:border-accent-edge hover:bg-accent-tint transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-xl font-medium">{job.role}</h3>
                      <div className="text-muted-foreground">{job.company}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{job.description}</p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 h-max text-xs font-mono rounded-full bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" ref={(el) => { sectionsRef.current[2] = el }} className="min-h-screen py-32 opacity-0">
          <div className="space-y-16">
            <h2 className="text-4xl font-light">Some Projects</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block group h-full"
                  aria-label={`View ${project.title} details`}
                >
                  <div className="group glow-accent h-full flex flex-col p-8 border border-border transition-all duration-500 cursor-pointer">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>{project.year}</span>
                        <span className="px-2 py-1 rounded-full bg-muted/40">{project.status}</span>
                      </div>

                      <h3 className="text-xl font-medium group-hover:text-foreground transition-colors duration-300">
                        {project.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">{project.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs font-mono rounded-full bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="thoughts" ref={(el) => { sectionsRef.current[3] = el }} className="min-h-screen py-32 opacity-0">
          <div className="space-y-16">
            <h2 className="text-4xl font-light">Recent Thoughts</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/thoughts/${post.slug}`}
                  className="block group h-full"
                  aria-label={`Read ${post.title}`}
                >
                  <article className="group glow-accent h-full flex flex-col p-8 border border-border transition-all duration-500 cursor-pointer">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3
                        id={`post-${post.slug}-title`}
                        className="text-xl font-medium group-hover:text-foreground transition-colors duration-300"
                      >
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-mono rounded-full bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="connect" ref={(el) => { sectionsRef.current[4] = el }} className="py-32 opacity-0">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Always interested in new opportunities, collaborations, and conversations about technology and design.
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:anandshivam54321@gmail.com"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-lg">Reach out to me @</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "GitHub", handle: "@xtanion", url: "https://github.com/xtanion", icon: Github },
                  { name: "Twitter", handle: "@xtanion", url: "https://x.com/xtanion", icon: Twitter },
                  { name: "LinkedIn", handle: "xtanion", url: "https://linkedin.com/in/xtanion", icon: Linkedin },
                ].map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      href={social.url}
                      className="group glow-accent p-4 border border-border transition-all duration-300"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                          <div className="text-foreground">
                            {social.name}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{social.handle}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <footer className="py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">© 2026 Shivam Anand.</div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
