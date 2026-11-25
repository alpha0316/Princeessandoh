import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createCurlRenderer, loadImage } from './pageCurl'

const FLIP_MS = 1150

type Flip = { from: number; to: number; dir: 1 | -1; key: number }

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

/**
 * Renders one page turn on a WebGL2 canvas over the sheet, then calls
 * `onDone`. Forward turns curl the current page away; backward turns play
 * the same curl in reverse with the target page landing back on top.
 * Falls back to a cross-fade (via `onFallback`) when WebGL2 is missing or
 * the user prefers reduced motion.
 */
function CurlCanvas({
  from,
  to,
  dir,
  position,
  onDone,
  onFallback,
}: {
  from: string
  to: string
  dir: 1 | -1
  position: string
  onDone: () => void
  onFallback: () => void
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const done = useRef(onDone)
  const fallback = useRef(onFallback)
  useEffect(() => {
    done.current = onDone
    fallback.current = onFallback
  })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fallback.current()
      return
    }
    const renderer = createCurlRenderer(canvas, position)
    if (!renderer) {
      fallback.current()
      return
    }

    let raf = 0
    let cancelled = false
    // Forward: front = current page curling away. Backward: front = target
    // page, un-curling from fully turned back to flat.
    const [frontSrc, backSrc] = dir === 1 ? [from, to] : [to, from]

    Promise.all([loadImage(frontSrc), loadImage(backSrc)])
      .then(([front, back]) => {
        if (cancelled) return
        const start = performance.now()
        const tick = (now: number) => {
          if (cancelled) return
          const x = Math.min(1, (now - start) / FLIP_MS)
          const eased = easeInOutCubic(x)
          renderer.draw({ front, back, progress: dir === 1 ? eased : 1 - eased })
          canvas.style.opacity = '1'
          if (x < 1) raf = requestAnimationFrame(tick)
          else done.current()
        }
        raf = requestAnimationFrame(tick)
      })
      .catch(() => {
        if (!cancelled) done.current()
      })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      renderer.dispose()
    }
  }, [from, to, dir, position])

  return <canvas ref={ref} className="flip-canvas" aria-hidden="true" />
}

/**
 * Screenshot "sheets" that turn like paper pages instead of sliding.
 * `index` is controlled by the parent; this only animates between
 * successive values.
 */
export default function FlipStack({
  images,
  index,
  alt,
  imagePosition,
}: {
  images: string[]
  index: number
  alt: string
  imagePosition?: string
}) {
  const len = images.length
  const [shown, setShown] = useState(index)
  const [flip, setFlip] = useState<Flip | null>(null)
  const [fade, setFade] = useState(false)
  // Aspect ratio of the screenshot on show; the sheet is sized to it so
  // nothing gets cropped.
  const [aspect, setAspect] = useState<number | null>(null)
  const keyRef = useRef(0)

  useEffect(() => {
    setFlip((prev) => {
      const from = prev ? prev.to : shown
      if (from === index) return prev
      const forward = (index - from + len) % len
      const dir: 1 | -1 = forward <= len / 2 ? 1 : -1
      return { from, to: index, dir, key: ++keyRef.current }
    })
    // `shown` is read but intentionally not a dependency: only index
    // changes start a new turn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, len])

  // Warm the cache for the neighbours so a turn never waits on the network.
  useEffect(() => {
    if (len < 2) return
    loadImage(images[(shown + 1) % len]).catch(() => {})
    loadImage(images[(shown - 1 + len) % len]).catch(() => {})
  }, [images, shown, len])

  useEffect(() => {
    let cancelled = false
    loadImage(images[shown])
      .then((img) => {
        if (!cancelled && img.naturalWidth && img.naturalHeight) setAspect(img.naturalWidth / img.naturalHeight)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [images, shown])

  const settle = () => {
    if (!flip) return
    setShown(flip.to)
    setFlip(null)
    setFade(false)
  }

  const imgStyle = imagePosition ? { objectPosition: imagePosition } : undefined

  return (
    <div className="flip-stack" style={aspect ? ({ '--shot-ar': aspect } as CSSProperties) : undefined}>
      <div className="flip-page">
        <img src={images[flip ? flip.from : shown]} alt={alt} decoding="async" draggable={false} style={imgStyle} />
        {flip && fade && (
          <img
            className="flip-fade"
            src={images[flip.to]}
            alt=""
            draggable={false}
            style={imgStyle}
            onAnimationEnd={settle}
          />
        )}
        {flip && !fade && (
          <CurlCanvas
            key={flip.key}
            from={images[flip.from]}
            to={images[flip.to]}
            dir={flip.dir}
            position={imagePosition ?? 'top'}
            onDone={settle}
            onFallback={() => setFade(true)}
          />
        )}
      </div>
    </div>
  )
}
