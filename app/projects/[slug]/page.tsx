import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getProjectBySlug, getAllProjects } from "../../../lib/projects"
import { mdxComponents } from "../../../components/mdx-components"
import { ArticleShell } from "../../../components/article-shell"

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

  return (
    <ArticleShell
      section="proj"
      slug={slug}
      title={project.title}
      lead={project.description}
      meta={`${project.year} · ${project.status}`}
      tags={project.tech}
      headings={extractHeadings(project.content)}
    >
      <MDXRemote source={project.content} components={mdxComponents} />
    </ArticleShell>
  )
}
