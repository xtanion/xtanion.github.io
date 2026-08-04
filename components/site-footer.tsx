"use client"

import { useEffect, useState } from "react"
import { REPO } from "../lib/site"

const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

export function SiteFooter() {
  const [time, setTime] = useState<{ hour: string; minute: string } | null>(null)

  useEffect(() => {
    const tick = () => {
      const parts = clock.formatToParts(new Date())
      setTime({
        hour: parts.find((p) => p.type === "hour")?.value ?? "",
        minute: parts.find((p) => p.type === "minute")?.value ?? "",
      })
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="tree-foot">
      <a
        href={`https://${REPO}`}
        target="_blank"
        rel="noreferrer"
        className="tree-brand"
        aria-label="source on github"
      >
        <span className="tree-brand-dot" aria-hidden="true" />
        xtanion
      </a>

      <span className="tree-foot-time tnum">
        {time && (
          <>
            mumbai {time.hour}
            <span className="tree-foot-beat">:</span>
            {time.minute} ist
          </>
        )}
      </span>
    </footer>
  )
}
