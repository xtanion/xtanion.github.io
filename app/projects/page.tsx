import type { Metadata } from "next"
import { getAllProjects } from "../../lib/content"
import { Listing } from "../../components/listing"

export const metadata: Metadata = {
  title: "proj",
  description: "Things I have built — backend systems, graphics and AI tooling.",
}

export default function ProjectsPage() {
  const leaves = getAllProjects().map((project) => ({
    key: project.slug,
    label: project.title,
    meta: (
      <>
        {project.year}
        <span className="tree-meta-long"> · {project.status}</span>
      </>
    ),
    href: `/projects/${project.slug}`,
  }))

  return <Listing section="proj" eyebrow="building" leaves={leaves} empty="nothing here yet" />
}
