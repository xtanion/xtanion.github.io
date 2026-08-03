import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getPostBySlug, getAllPosts } from "../../../lib/posts"
import { mdxComponents } from "../../../components/mdx-components"
import { ArticleShell } from "../../../components/article-shell"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
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
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Shivam Anand`,
    description: post.excerpt,
  }
}

export default async function ThoughtPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return notFound()

  return (
    <ArticleShell
      section="blogs"
      slug={slug}
      title={post.title}
      lead={post.excerpt}
      meta={`${post.date} · ${post.readTime}`}
      tags={post.tags}
      headings={extractHeadings(post.content)}
    >
      <MDXRemote source={post.content} components={mdxComponents} />
    </ArticleShell>
  )
}
