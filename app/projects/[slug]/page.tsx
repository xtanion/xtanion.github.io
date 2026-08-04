import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { extractHeadings, getAllProjects, getProjectBySlug } from "../../../lib/content"
import { mdxComponents } from "../../../components/mdx-components"
import { ArticleShell } from "../../../components/article-shell"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug)
  if (!project) return {}
  return { title: `${project.title} — Shivam Anand`, description: project.description }
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
