import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getProjectBySlug, getAllProjects } from "../../../lib/projects"
import { mdxComponents } from "../../../components/mdx-components"
import { SiteNav } from "../../../components/site-nav"
import { TableOfContents } from "../../../components/table-of-contents"

type PageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: { id: string; text: string; level: number }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')

    headings.push({ id, text, level })
  }

  return headings
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProjectBySlug(params.slug)
  if (!project) return {}
  return {
    title: `${project.title} — Shivam Anand`,
    description: project.description,
  }
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug)
  if (!project) return notFound()

  const headings = extractHeadings(project.content)

  return (
    <div className="shell">
      <SiteNav />
      <TableOfContents headings={headings} />

      <main className="main article-shell">
        <div className="frame">
          <Link href="/#projects" className="btn-ghost arrow-link" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            <span className="arrow-ico" aria-hidden="true">←</span>
            index
          </Link>

          <header className="article-head" style={{ marginTop: "20px" }}>
            <div className="article-meta">
              <span className="eyebrow" style={{ margin: 0 }}>project</span>
              <span className="tnum">{project.year} · {project.status}</span>
            </div>
            <h1 className="article-title">{project.title}</h1>
            <p className="lead">{project.description}</p>
            <div className="tag-row">
              {project.tech.map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
            </div>
          </header>

          <article role="article" className="md">
            <MDXRemote source={project.content} components={mdxComponents} />
          </article>
        </div>
      </main>
    </div>
  )
}
