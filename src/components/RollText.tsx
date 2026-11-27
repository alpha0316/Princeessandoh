import type { CSSProperties } from 'react'

/** Text that rolls on hover/focus of its parent link: each letter slides
 * up and out while a copy rises in from below, staggered like the rotating
 * tagline. Screen readers read the plain text once. */
export default function RollText({ children }: { children: string }) {
  return (
    <span className="roll" aria-label={children}>
      {[...children].map((ch, i) => (
        <span key={i} className="roll-char" style={{ '--i': i } as CSSProperties} aria-hidden="true">
          <span className="roll-top">{ch === ' ' ? ' ' : ch}</span>
          <span className="roll-bottom">{ch === ' ' ? ' ' : ch}</span>
        </span>
      ))}
    </span>
  )
}
