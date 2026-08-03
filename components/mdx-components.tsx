import type * as React from "react"

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

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
