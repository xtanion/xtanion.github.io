import { Github, Linkedin, Mail, MapPin, Twitter, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export const REPO = "github.com/xtanion/portfolio"
export const EMAIL = "anandshivam54321@gmail.com"

export type TreeLeaf = {
  key: string
  label: string
  meta?: ReactNode
  href?: string
  external?: boolean
  /* an element, not a component — functions can't cross the server boundary */
  icon?: ReactNode
  /* secondary rows (see-all, counts) sit back at muted */
  dim?: boolean
}

export type TreeNode = {
  id: string
  label: string
  leaves?: TreeLeaf[]
  prose?: ReactNode
}

const ico = (Icon: LucideIcon) => <Icon className="tree-ico" size={13} strokeWidth={1.5} aria-hidden="true" />

export const EXPERIENCE = [
  { year: "2026", role: "generative ai engineer", company: "kodo (yc'21)" },
  { year: "2024", role: "software development engineer", company: "edra labs" },
  { year: "2023", role: "software development intern", company: "samagra | hcx" },
  { year: "2022", role: "software development intern", company: "python software foundation" },
]

export const WHOAMI = (
  <>
    <span className="hl-loud">shivam anand</span> — i build backend systems, generative ai and distributed
    architectures.
    <br />
    currently a generative ai engineer at kodo (yc&apos;21); before that edra labs, samagra and the python software
    foundation.
    <br />
    off the clock i tinker with my home server and chip away at rust.
    <br />
    <span className="tree-status">
      <MapPin size={13} strokeWidth={1.5} aria-hidden="true" />
      mumbai, india
    </span>
    <span className="hl">available for work</span>
  </>
)

export const CONTACT: TreeLeaf[] = [
  { key: "email", label: EMAIL, meta: "email", href: `mailto:${EMAIL}`, icon: ico(Mail) },
  { key: "github", label: "@xtanion", meta: "github", href: "https://github.com/xtanion", external: true, icon: ico(Github) },
  { key: "twitter", label: "@xtanion", meta: "twitter", href: "https://x.com/xtanion", external: true, icon: ico(Twitter) },
  {
    key: "linkedin",
    label: "xtanion",
    meta: "linkedin",
    href: "https://linkedin.com/in/xtanion",
    external: true,
    icon: ico(Linkedin),
  },
]
