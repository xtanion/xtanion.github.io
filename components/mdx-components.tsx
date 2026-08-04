import type * as React from "react"
import { slugify } from "../lib/content"

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children ? slugify(props.children.toString()) : undefined
    return <h2 id={id} {...props} />
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children ? slugify(props.children.toString()) : undefined
    return <h3 id={id} {...props} />
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const external = props.href?.startsWith("http")
    return <a target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} {...props} />
  },
}
