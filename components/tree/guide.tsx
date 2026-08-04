export function Guide({ kind }: { kind: "line" | "blank" | "tee" | "end" }) {
  return <span className={`g g-${kind}`} aria-hidden="true" />
}
