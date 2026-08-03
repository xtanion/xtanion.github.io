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
    return <h2 id={id} className="text-2xl lg:text-3xl font-medium tracking-tight mt-10 mb-4" {...props} />
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children ? slugify(props.children.toString()) : undefined
    return <h3 id={id} className="text-xl lg:text-2xl font-medium mt-8 mb-3" {...props} />
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-muted-foreground leading-relaxed my-4" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-accent-ink underline underline-offset-4 decoration-accent-edge/40 hover:decoration-accent-edge transition-colors duration-300"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-accent-edge pl-4 my-6 italic text-muted-foreground" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-8 border-border" {...props} />,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-secondary/50 text-foreground border border-border p-4 overflow-x-auto my-6"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-secondary px-1.5 py-0.5 text-sm" {...props} />
  ),
}
