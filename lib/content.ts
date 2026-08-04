import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

export type Project = {
  slug: string
  title: string
  description: string
  year: string
  status: string
  tech: string[]
  content: string
}

export type Heading = {
  id: string
  text: string
  level: number
}

function read<T>(dir: string, slug: string): T | undefined {
  try {
    const file = fs.readFileSync(path.join(process.cwd(), dir, `${slug}.mdx`), "utf8")
    const { data, content } = matter(file)
    return { slug, ...data, content } as T
  } catch {
    return undefined
  }
}

function readAll<T>(dir: string): T[] {
  return fs
    .readdirSync(path.join(process.cwd(), dir))
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => read<T>(dir, name.replace(/\.mdx$/, "")))
    .filter((entry): entry is T => entry !== undefined)
}

export function getAllPosts(): Post[] {
  return readAll<Post>("blogs").sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export function getPostBySlug(slug: string) {
  return read<Post>("blogs", slug)
}

export function getAllProjects(): Project[] {
  return readAll<Project>("projects").sort((a, b) => parseInt(b.year) - parseInt(a.year))
}

export function getProjectBySlug(slug: string) {
  return read<Project>("projects", slug)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
}

/* Headings are parsed from the raw mdx rather than the rendered output — the
   contents block is built on the server, before any of it reaches the dom. */
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  const pattern = /^(#{2,3})\s+(.+)$/gm
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    const text = match[2].trim()
    headings.push({ id: slugify(text), text, level: match[1].length })
  }

  return headings
}
