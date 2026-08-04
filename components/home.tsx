import { CONTACT, EXPERIENCE, WHOAMI, type TreeLeaf, type TreeNode } from "../lib/site"
import type { Post, Project } from "../lib/content"
import { SiteFooter } from "./site-footer"
import { Tree } from "./tree/tree"

interface HomeProps {
  posts: Post[]
  projects: Project[]
}

/* The index shows the three most recent; the listing page has the rest. The
   link is always present, since it is the only route to that page. */
const INLINE = 3

function withOverflow(leaves: TreeLeaf[], total: number, href: string): TreeLeaf[] {
  return [...leaves, { key: "all", label: "view all...", meta: `${total} total`, href, dim: true }]
}

export function Home({ posts, projects }: HomeProps) {
  const nodes: TreeNode[] = [
    { id: "whoami", label: "whoami", prose: WHOAMI },
    {
      id: "exp",
      label: "exp",
      leaves: EXPERIENCE.map((job) => ({
        key: job.year,
        label: `${job.role} @ ${job.company}`,
        meta: job.year,
      })),
    },
    {
      id: "proj",
      label: "proj",
      leaves: withOverflow(
        projects.slice(0, INLINE).map((project) => ({
          key: project.slug,
          label: project.title,
          meta: project.year,
          href: `/projects/${project.slug}`,
        })),
        projects.length,
        "/projects",
      ),
    },
    {
      id: "blogs",
      label: "blogs",
      leaves: withOverflow(
        posts.slice(0, INLINE).map((post) => ({
          key: post.slug,
          label: post.title,
          meta: (
            <>
              {post.date}
              <span className="tree-meta-long"> · {post.readTime}</span>
            </>
          ),
          href: `/thoughts/${post.slug}`,
        })),
        posts.length,
        "/thoughts",
      ),
    },
    { id: "contact", label: "contact", leaves: CONTACT },
  ]

  return (
    <div className="tree-page">
      <main className="tree">
        <p className="eyebrow tree-eyebrow">index</p>
        <Tree nodes={nodes} initialOpen={["whoami"]} />
      </main>

      <SiteFooter />
    </div>
  )
}
