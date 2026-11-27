import { useEffect, useState, type CSSProperties } from 'react'

// Each title is a list of styled words, mirroring the original tagline:
// muted plain text, bold, italic ampersand, and bold monospace.
type Style = 'plain' | 'bold' | 'amp' | 'mono'
type Title = { label: string; words: [string, Style][] }

const TITLES: Title[] = [
  { label: 'Product Design & Engineering', words: [['Product', 'plain'], ['Design', 'bold'], ['&', 'amp'], ['Engineering', 'mono']] },
  { label: 'UI/UX Designer', words: [['UI/UX', 'plain'], ['Designer', 'bold']] },
  { label: 'Product Designer', words: [['Product', 'plain'], ['Designer', 'bold']] },
  { label: 'Design Engineer', words: [['Design', 'bold'], ['Engineer', 'mono']] },
  { label: 'Frontend Developer', words: [['Frontend', 'plain'], ['Developer', 'mono']] },
]

const HOLD_MS = 2800 // how long each title stays readable
// Long enough for the last outgoing letter: 28 chars x 12ms stagger + 320ms.
const OUT_MS = 750

function Letters({ title, phase }: { title: Title; phase: 'in' | 'out' }) {
  let i = 0
  return (
    <span className={`tagline-phrase tagline-phrase--${phase}`} aria-hidden="true">
      {title.words.map(([word, style], w) => (
        <span key={w} className={`tagline-word tagline-word--${style}`}>
          {[...word].map((ch, c) => (
            <span key={c} className="tagline-char" style={{ '--i': i++ } as CSSProperties}>
              {ch}
            </span>
          ))}
          {w < title.words.length - 1 && <span className="tagline-space"> </span>}
        </span>
      ))}
    </span>
  )
}

/** The sidebar tagline: cycles through job titles, letter by letter. The
 * outgoing title lifts away (blur + fade) while the next one rises in, both
 * staggered per character. Screen readers get one stable label. */
export default function RotatingTagline() {
  // `step` keys each swap so the outgoing copy always remounts fresh.
  const [state, setState] = useState<{ index: number; leaving: number | null; step: number }>({
    index: 0,
    leaving: null,
    step: 0,
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      // Don't skip titles unseen in a background tab.
      if (document.hidden) return
      setState((s) => ({ index: (s.index + 1) % TITLES.length, leaving: s.index, step: s.step + 1 }))
    }, HOLD_MS)
    return () => window.clearInterval(id)
  }, [])

  // Drop the outgoing copy once its letters have finished leaving.
  useEffect(() => {
    if (state.leaving === null) return
    const id = window.setTimeout(() => setState((s) => ({ ...s, leaving: null })), OUT_MS)
    return () => window.clearTimeout(id)
  }, [state.leaving, state.step])

  const { index, leaving, step } = state

  return (
    <p className="profile-tagline" aria-label={TITLES.map((t) => t.label).join(', ')}>
      <span className="tagline-stage">
        {leaving !== null && <Letters key={`out-${step}`} title={TITLES[leaving]} phase="out" />}
        <Letters key={`in-${step}`} title={TITLES[index]} phase="in" />
      </span>
    </p>
  )
}
