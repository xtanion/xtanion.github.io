import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getPostBySlug, getAllPosts } from "../../../lib/posts"
import { mdxComponents } from "../../../components/mdx-components"
import { SiteNav } from "../../../components/site-nav"
import { TableOfContents } from "../../../components/table-of-contents"

type PageProps = {
  params: { slug: string }
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

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Shivam Anand`,
    description: post.excerpt,
  }
}

export default function ThoughtPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug)
  if (!post) return notFound()

  const headings = extractHeadings(post.content)

  return (
    <div className="shell">
      <SiteNav />
      <TableOfContents headings={headings} />

      <main className="main article-shell">
        <div className="frame">
          <Link href="/#thoughts" className="btn-ghost arrow-link" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            <span className="arrow-ico" aria-hidden="true">←</span>
            index
          </Link>

          <header className="article-head" style={{ marginTop: "20px" }}>
            <div className="article-meta">
              <span className="eyebrow" style={{ margin: 0 }}>writing</span>
              <span className="tnum">{post.date} · {post.readTime}</span>
            </div>
            <h1 className="article-title">{post.title}</h1>
            <p className="lead">{post.excerpt}</p>
            <div className="tag-row">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <article role="article" className="md">
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>
        </div>
      </main>
    </div>
  )
}
