import type { Metadata } from "next"
import { getAllPosts } from "../../lib/content"
import { Listing } from "../../components/listing"

export const metadata: Metadata = {
  title: "blogs",
  description: "Writing on backend systems, self hosting and generative AI.",
}

export default function BlogsPage() {
  const leaves = getAllPosts().map((post) => ({
    key: post.slug,
    label: post.title,
    meta: (
      <>
        {post.date}
        <span className="tree-meta-long"> · {post.readTime}</span>
      </>
    ),
    href: `/thoughts/${post.slug}`,
  }))

  return <Listing section="blogs" eyebrow="writing" leaves={leaves} empty="nothing here yet" />
}
