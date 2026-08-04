import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { extractHeadings, getAllPosts, getPostBySlug } from "../../../lib/content"
import { mdxComponents } from "../../../components/mdx-components"
import { ArticleShell } from "../../../components/article-shell"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPostBySlug((await params).slug)
  if (!post) return {}
  return { title: `${post.title} — Shivam Anand`, description: post.excerpt }
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
