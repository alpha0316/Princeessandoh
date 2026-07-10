import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { projects } from '../data/projects'
import '../styles/loading.css'

const SIGNATURE = '@pr_alphaa'
const MIN_TYPE_MS = 1500
const MAX_WAIT_MS = 6000
const ROCKET_DELAY_MS = 300
const EXIT_HOLD_MS = 650
const EXIT_DURATION_MS = 700

// Module-level (not React state) so the splash only ever plays once per
// session — if the app tree remounts (e.g. navigating away and back),
// it skips straight to done instead of replaying.
let hasPlayed = false

export default function LoadingScreen() {
  const [charsShown, setCharsShown] = useState(0)
  const [showRocket, setShowRocket] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(hasPlayed)
  const [avatarStyle, setAvatarStyle] = useState<CSSProperties>({})
  const [rocketShift, setRocketShift] = useState(0)
  const avatarRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    hasPlayed = true
  }, [])

  // Preload every image the page will need (avatar, rocket, all project
  // screenshots) and tie the typewriter's completion to real load progress
  // — it won't finish typing before the assets are actually ready, but a
  // time-based floor keeps the pace feeling natural even when everything
  // loads instantly (e.g. from cache).
  useEffect(() => {
    if (done) return

    const urls = new Set<string>(['/avatar.png', '/rocket.gif'])
    projects.forEach((p) => p.images.forEach((src) => urls.add(src)))
    const list = Array.from(urls)
    const total = list.length
    let loaded = 0

    const settle = () => {
      loaded += 1
    }
    list.forEach((src) => {
      const img = new Image()
      img.onload = settle
      img.onerror = settle
      img.src = src
    })

    const start = performance.now()
    let raf: number
    let cancelled = false

    const tick = () => {
      if (cancelled) return
      const elapsed = performance.now() - start
      const timeProgress = Math.min(1, elapsed / MIN_TYPE_MS)
      const assetsReady = loaded >= total
      const timedOut = elapsed >= MAX_WAIT_MS
      // Require the minimum typing duration to actually elapse before
      // completing, even if assets resolve instantly from cache — a fast
      // local load shouldn't collapse the whole animation into one frame.
      const loadDone = timedOut || (assetsReady && elapsed >= MIN_TYPE_MS)
      const progress = loadDone ? 1 : Math.min(timeProgress, 0.92)

      setCharsShown(Math.floor(progress * SIGNATURE.length))

      if (progress >= 1) {
        setTimeout(() => setShowRocket(true), ROCKET_DELAY_MS)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  // Once fully typed, shift the row left by half the text's width (+ half
  // the gap) so the rocket lands centered instead of getting pushed off
  // the right edge on narrow screens — the CSS only applies this below
  // the mobile breakpoint, so desktop keeps the whole group centered.
  useEffect(() => {
    if (!showRocket) return
    const textEl = textRef.current
    if (textEl) {
      const gap = 14
      setRocketShift(-(textEl.offsetWidth + gap) / 2)
    }
  }, [showRocket])

  useEffect(() => {
    if (!showRocket) return
    const timer = setTimeout(() => {
      const target = document.querySelector('.profile-avatar')
      const source = avatarRef.current
      if (target && source) {
        const t = target.getBoundingClientRect()
        const s = source.getBoundingClientRect()
        const dx = t.left + t.width / 2 - (s.left + s.width / 2)
        const dy = t.top + t.height / 2 - (s.top + s.height / 2)
        const scale = t.width / s.width
        setAvatarStyle({
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          transition: `transform ${EXIT_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        })
      }
      setExiting(true)
    }, EXIT_HOLD_MS)
    return () => clearTimeout(timer)
  }, [showRocket])

  useEffect(() => {
    if (!exiting) return
    const timer = setTimeout(() => setDone(true), EXIT_DURATION_MS + 50)
    return () => clearTimeout(timer)
  }, [exiting])

  if (done) return null

  return (
    <div className={`loading-screen ${exiting ? 'is-exiting' : ''}`} aria-hidden="true">
      <div className="loading-content">
        <img ref={avatarRef} className="loading-avatar" src="/avatar.png" alt="" style={avatarStyle} />
        <div
          className={`loading-signature ${exiting ? 'is-fading' : ''} ${showRocket ? 'is-centering-rocket' : ''}`}
          style={{ '--rocket-shift': `${rocketShift}px` } as CSSProperties}
        >
          <span ref={textRef} className="loading-signature-text">
            {SIGNATURE.slice(0, charsShown)}
            {!showRocket && <span className="loading-cursor" />}
          </span>
          {showRocket && <img className="loading-rocket" src="/rocket.gif" alt="" />}
        </div>
      </div>
    </div>
  )
}
