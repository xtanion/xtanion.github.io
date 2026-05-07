import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getProjectBySlug, getAllProjects } from "../../../lib/projects"
import { mdxComponents } from "../../../components/mdx-components"
import { BackButton } from "../../../components/back-button"
import { ThemeToggle } from "../../../components/theme-toggle"
import { TableOfContents } from "../../../components/table-of-contents"

type PageProps = {
  params: Promise<{ slug: string }>
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} — Shivam Anand`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return notFound()

  const headings = extractHeadings(project.content)

  return (
    <div className="relative">
      <TableOfContents headings={headings} />
      <main className="max-w-4xl mx-auto px-8 lg:px-16 py-24">
      <nav className="mb-8 flex items-center justify-between">
        <BackButton />
        <ThemeToggle />
      </nav>

      <header className="space-y-4 mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>{project.year}</span>
          <span className="px-2 py-1 bg-muted/30 rounded-md">{project.status}</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-balance">{project.title}</h1>
        <p className="text-muted-foreground leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-0.5 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </header>

      <article role="article" className="space-y-6">
        <MDXRemote source={project.content} components={mdxComponents} />
      </article>
    </main>
    </div>
  )
}
