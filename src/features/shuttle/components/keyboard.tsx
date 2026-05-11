import React, { useEffect, useRef, useState, useCallback } from 'react'
import './Keyboard.css'

// ── Types ──────────────────────────────────────────────────────────────────

export type KeyId =
  | 'q' | 'w' | 'e' | 'r' | 't' | 'y' | 'u' | 'i' | 'o' | 'p'
  | 'a' | 's' | 'd' | 'f' | 'g' | 'h' | 'j' | 'k' | 'l'
  | 'z' | 'x' | 'c' | 'v' | 'b' | 'n' | 'm'
  | 'shift' | 'delete' | 'space' | 'return' | 'abc' | 'emoji' | 'mic'

export interface TapSequenceItem {
  key: KeyId
  /** delay in ms before this tap fires */
  delay: number
  /** how long the tap highlight lasts (default 120ms) */
  duration?: number
}

export interface KeyboardProps {
  /** keys to animate on mount (or when sequence changes) */
  tapSequence?: TapSequenceItem[]
  /** fires when a real key is pressed */
  onKeyPress?: (key: KeyId) => void
  /** current typed text to show in suggestions */
  suggestions?: [string, string, string]
  className?: string
  style?: React.CSSProperties
  /** whether to loop the tap sequence */
  loop?: boolean
  /** delay between loop iterations in ms */
  loopDelay?: number
}

// ── Keyboard layout ────────────────────────────────────────────────────────

const ROW1: KeyId[] = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const ROW2: KeyId[] = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const ROW3: KeyId[] = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

// ── Component ──────────────────────────────────────────────────────────────

export default function Keyboard({
  tapSequence,
  onKeyPress,
  className,
  style,
  loop = false,
  loopDelay = 800,
}: KeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<KeyId>>(new Set())
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Clear all pending timers
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  // Run one iteration of the tap sequence
  const runSequence = useCallback((seq: TapSequenceItem[]) => {
    clearTimers()
    let maxEnd = 0

    seq.forEach(({ key, delay, duration = 140 }) => {
      const end = delay + duration
      if (end > maxEnd) maxEnd = end

      const t1 = setTimeout(() => {
        setActiveKeys(prev => new Set(prev).add(key))
      }, delay)

      const t2 = setTimeout(() => {
        setActiveKeys(prev => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      }, end)

      timersRef.current.push(t1, t2)
    })

    return maxEnd
  }, [clearTimers])

  // Handle sequence + looping
  useEffect(() => {
    if (!tapSequence?.length) return
    clearTimers()

    let cancelled = false

    function start() {
      if (cancelled) return
      const duration = runSequence(tapSequence!)
      if (loop) {
        const t = setTimeout(() => {
          if (!cancelled) start()
        }, duration + loopDelay)
        timersRef.current.push(t)
      }
    }

    start()
    return () => {
      cancelled = true
      clearTimers()
    }
  }, [tapSequence, loop, loopDelay, runSequence, clearTimers])

  // Programmatic tap (for manual onKeyPress)
  const handlePress = useCallback((key: KeyId) => {
    setActiveKeys(prev => new Set(prev).add(key))
    const t = setTimeout(() => {
      setActiveKeys(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }, 140)
    timersRef.current.push(t)
    onKeyPress?.(key)
  }, [onKeyPress])

  const keyClass = (key: KeyId) =>
    ['kb-key', activeKeys.has(key) ? 'kb-key--active' : ''].filter(Boolean).join(' ')

  return (
    <div className={['kb-root', className].filter(Boolean).join(' ')} style={style} aria-label="Keyboard">

      <div data-mode="Light" className="self-stretch mb-3 h-6 px-5 inline-flex justify-start items-center gap-5">
        <div className="flex-1 self-stretch relative rounded">
          <p className=" w-20 h-6 left-0 top-0 absolute text-center justify-center text-Labels---Vibrant-Primary text-base font-normal leading-5">“The”</p>
        </div>
        <div className="h-6 px-0.5 flex justify-center items-center">
          <div className="w-px self-stretch opacity-10 bg-Fills---Vibrant-Primary" />
        </div>
        <div className="flex-1 self-stretch relative rounded">
          <p className="w-20 h-6 left-0 top-0 absolute text-center justify-center text-Labels---Vibrant-Primary text-base font-normal leading-5">the</p >
        </div>
        <div className="h-6 px-0.5 flex justify-center items-center">
          <div className="w-px self-stretch opacity-10 bg-Fills---Vibrant-Primary" />
        </div>
        <div className="flex-1 self-stretch relative rounded">
          <p className="w-20 h-6 left-0 top-0 absolute text-center justify-center text-Labels---Vibrant-Primary text-base font-normal leading-5">to</p>
        </div>
      </div>

      {/* Row 1 — QWERTY */}
      <div className="kb-row">
        {ROW1.map(k => (
          <button
            key={k}
            className={keyClass(k)}
            data-key={k}
            onPointerDown={() => handlePress(k)}
            aria-label={k}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Row 2 — ASDFGHJKL */}
      <div className="kb-row kb-row--inset">
        {ROW2.map(k => (
          <button
            key={k}
            className={keyClass(k)}
            data-key={k}
            onPointerDown={() => handlePress(k)}
            aria-label={k}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Row 3 — Shift + ZXCVBNM + Delete */}
      <div className="kb-row">
        <button
          className={`${keyClass('shift')} kb-key--fn`}
          onPointerDown={() => handlePress('shift')}
          aria-label="shift"
        >
          <ShiftIcon />
        </button>

        {ROW3.map(k => (
          <button
            key={k}
            className={keyClass(k)}
            data-key={k}
            onPointerDown={() => handlePress(k)}
            aria-label={k}
          >
            {k}
          </button>
        ))}

        <button
          className={`${keyClass('delete')} kb-key--fn`}
          onPointerDown={() => handlePress('delete')}
          aria-label="delete"
        >
          <DeleteIcon />
        </button>
      </div>

      {/* Row 4 — ABC · Space · Return */}
      <div className="kb-row kb-row--bottom">
        <button
          className={`${keyClass('abc')} kb-key--fn kb-key--abc`}
          onPointerDown={() => handlePress('abc')}
          aria-label="ABC"
        >
          ABC
        </button>

        <button
          className={`${keyClass('space')} kb-key--space`}
          onPointerDown={() => handlePress('space')}
          aria-label="space"
        />

        <button
          className={`${keyClass('return')} kb-key--return`}
          onPointerDown={() => handlePress('return')}
          aria-label="return"
        >
          <ReturnIcon />
        </button>
      </div>

      {/* Bottom glyph bar */}
      <div className="self-stretch h-16 pl-9 pr-10 pt-7 pb-3.5 inline-flex justify-between items-start">
        <button
          className={`kb-glyph ${activeKeys.has('emoji') ? 'kb-key--active' : ''}`}
          onPointerDown={() => handlePress('emoji')}
          aria-label="emoji"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
            <path d="M13.45 18.39C11.34 18.39 9.1 18.09 7.06 17.57C6.68 16.99 6.4 16.37 6.27 15.74C8.42 16.35 10.92 16.77 13.46 16.77C16 16.77 18.5 16.35 20.66 15.74C20.51 16.37 20.24 16.99 19.87 17.57C17.83 18.08 15.59 18.39 13.46 18.39H13.45ZM13.45 22.46C17.97 22.46 21.6 19.14 22.1 15.2C22.21 14.41 21.69 14.05 20.99 14.25C18.45 15 16.07 15.42 13.45 15.42C10.83 15.42 8.47 15 5.92 14.25C5.22 14.05 4.71 14.41 4.81 15.2C5.3 19.14 8.92 22.46 13.45 22.46ZM17.35 12.28C18.18 12.28 18.92 11.53 18.92 10.47C18.92 9.41 18.18 8.65 17.35 8.65C16.52 8.65 15.79 9.41 15.79 10.47C15.79 11.53 16.52 12.28 17.35 12.28ZM9.53 12.28C10.37 12.28 11.11 11.53 11.11 10.47C11.11 9.41 10.37 8.65 9.53 8.65C8.69 8.65 7.99 9.41 7.99 10.47C7.99 11.53 8.7 12.28 9.53 12.28ZM13.46 24.63C7.26 24.63 2.29 19.66 2.29 13.45C2.29 7.24 7.25 2.28 13.45 2.28C19.65 2.28 24.64 7.25 24.64 13.46C24.64 19.67 19.67 24.64 13.46 24.64V24.63ZM13.46 26.91C20.82 26.91 26.92 20.81 26.92 13.45C26.92 6.09 20.82 0 13.45 0C6.08 0 0 6.1 0 13.46C0 20.82 6.1 26.92 13.46 26.92V26.91Z" fill="#222B59" fill-opacity="0.63" />
          </svg>
        </button>
        <button
          className={`kb-glyph ${activeKeys.has('mic') ? 'kb-key--active' : ''}`}
          onPointerDown={() => handlePress('mic')}
          aria-label="mic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="29" viewBox="0 0 19 29" fill="none">
            <path d="M0 13.9351V11.2588C0 10.9863 0.0966797 10.7534 0.290039 10.5601C0.483398 10.3667 0.716309 10.27 0.98877 10.27C1.27002 10.27 1.50732 10.3667 1.70068 10.5601C1.89404 10.7534 1.99072 10.9863 1.99072 11.2588V13.856C1.99072 15.3501 2.29834 16.6597 2.91357 17.7847C3.52881 18.9097 4.39453 19.7842 5.51074 20.4082C6.62695 21.0234 7.93652 21.3311 9.43945 21.3311C10.9424 21.3311 12.2476 21.0234 13.355 20.4082C14.4712 19.7842 15.3369 18.9097 15.9521 17.7847C16.5674 16.6597 16.875 15.3501 16.875 13.856V11.2588C16.875 10.9863 16.9717 10.7534 17.165 10.5601C17.3584 10.3667 17.5957 10.27 17.877 10.27C18.1494 10.27 18.3823 10.3667 18.5757 10.5601C18.769 10.7534 18.8657 10.9863 18.8657 11.2588V13.9351C18.8657 15.6577 18.5098 17.187 17.7979 18.5229C17.0947 19.8589 16.1104 20.9312 14.8447 21.7397C13.5791 22.5396 12.1069 23.0098 10.4282 23.1504V26.2222H15.3193C15.6006 26.2222 15.8379 26.3188 16.0312 26.5122C16.2246 26.7056 16.3213 26.9429 16.3213 27.2241C16.3213 27.4966 16.2246 27.7295 16.0312 27.9229C15.8379 28.1162 15.6006 28.2129 15.3193 28.2129H3.54639C3.26514 28.2129 3.02783 28.1162 2.83447 27.9229C2.64111 27.7295 2.54443 27.4966 2.54443 27.2241C2.54443 26.9429 2.64111 26.7056 2.83447 26.5122C3.02783 26.3188 3.26514 26.2222 3.54639 26.2222H8.4375V23.1504C6.75879 23.0098 5.28662 22.5396 4.021 21.7397C2.75537 20.9312 1.7666 19.8589 1.05469 18.5229C0.351562 17.187 0 15.6577 0 13.9351ZM4.64062 13.4604V5.16797C4.64062 4.15723 4.84277 3.26514 5.24707 2.4917C5.65137 1.70947 6.21387 1.09863 6.93457 0.65918C7.65527 0.219727 8.49023 0 9.43945 0C10.3799 0 11.2104 0.219727 11.9312 0.65918C12.6519 1.09863 13.2144 1.70947 13.6187 2.4917C14.0229 3.26514 14.2251 4.15723 14.2251 5.16797V13.4604C14.2251 14.4712 14.0229 15.3677 13.6187 16.1499C13.2144 16.9233 12.6519 17.5298 11.9312 17.9692C11.2104 18.4087 10.3799 18.6284 9.43945 18.6284C8.49023 18.6284 7.65527 18.4087 6.93457 17.9692C6.21387 17.5298 5.65137 16.9233 5.24707 16.1499C4.84277 15.3677 4.64062 14.4712 4.64062 13.4604ZM6.63135 13.4604C6.63135 14.436 6.88623 15.2139 7.396 15.7939C7.91455 16.374 8.5957 16.6641 9.43945 16.6641C10.2832 16.6641 10.96 16.374 11.4697 15.7939C11.9795 15.2139 12.2344 14.436 12.2344 13.4604V5.16797C12.2344 4.19238 11.9795 3.41455 11.4697 2.83447C10.96 2.25439 10.2832 1.96436 9.43945 1.96436C8.5957 1.96436 7.91455 2.25439 7.396 2.83447C6.88623 3.41455 6.63135 4.19238 6.63135 5.16797V13.4604Z" fill="#222B59" fill-opacity="0.63" />
          </svg>
        </button>
      </div>

    </div>
  )
}

// ── Usage example: fire a sequence ────────────────────────────────────────
//
//  const sequence: TapSequenceItem[] = [
//    { key: 'b', delay: 0 },
//    { key: 'r', delay: 200 },
//    { key: 'u', delay: 400 },
//    { key: 'n', delay: 600 },
//    { key: 'e', delay: 800 },
//    { key: 'i', delay: 1000 },
//  ]
//  <Keyboard tapSequence={sequence} loop loopDelay={1200} />
//

// ── Icons (pure SVG, no deps) ──────────────────────────────────────────────

function ShiftIcon() {
  return (
    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" aria-hidden>
      <path
        d="M7.5 1L1 7.5H4.5V13.5H10.5V7.5H14L7.5 1Z"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinejoin="round" fill="none"
      />
      <rect x="4.5" y="14.5" width="6" height="2" rx="0.5" fill="currentColor" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg width="21" height="16" viewBox="0 0 21 16" fill="none" aria-hidden>
      <path
        d="M7.5 1H19.5C20.05 1 20.5 1.45 20.5 2V14C20.5 14.55 20.05 15 19.5 15H7.5L1 8L7.5 1Z"
        stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"
      />
      <path d="M9 5.5L15 10.5M15 5.5L9 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ReturnIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      <path
        d="M16 1V7C16 8.1 15.1 9 14 9H3M3 9L7 5M3 9L7 13"
        stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

