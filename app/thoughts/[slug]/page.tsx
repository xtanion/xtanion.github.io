import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getPostBySlug, getAllPosts } from "../../../lib/posts"
import { mdxComponents } from "../../../components/mdx-components"
import { BackButton } from "../../../components/back-button"
import { ThemeToggle } from "../../../components/theme-toggle"
import { TableOfContents } from "../../../components/table-of-contents"

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
    title: `${post.title} — Jordan Chen`,
    description: post.excerpt,
  }
}

export default async function ThoughtPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return notFound()

  const headings = extractHeadings(post.content)

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
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-balance">{post.title}</h1>
        <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-0.5 text-xs font-mono rounded-full bg-muted/40 text-muted-foreground hover:bg-green/15 hover:text-accent-ink transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <article role="article" className="space-y-6">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>
    </main>
    </div>
  )
}
