import { useCallback, useEffect, useRef, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import FlipStack from './FlipStack'
import ProjectLinkIcon, { getProjectLinkTooltip } from './ProjectLinkIcon'
import type { Project } from '../types/project'

/** Muted looping screen recording that only downloads/plays while on screen,
 * so a page full of cards doesn't stream every video at once. */
function DemoVideo({
  src,
  poster,
  className,
  onAspect,
  loop = true,
  onEnded,
}: {
  src: string
  poster?: string
  className?: string
  /** Reports the recording's width / height once its metadata loads. */
  onAspect?: (ratio: number) => void
  loop?: boolean
  onEnded?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      preload="metadata"
      onLoadedMetadata={(e) => {
        const v = e.currentTarget
        if (v.videoWidth && v.videoHeight) onAspect?.(v.videoWidth / v.videoHeight)
      }}
      onEnded={onEnded}
      loop={loop}
      muted
      playsInline
      disablePictureInPicture
      tabIndex={-1}
    />
  )
}

const AUTO_ADVANCE_MS = 45000
// Web cards (page-curl sheets): first turn 3s after the card comes into
// view, then keep turning while it stays on screen.
const WEB_FIRST_FLIP_MS = 3000
const WEB_FLIP_EVERY_MS = 5000
const DOT_LIMIT = 7
const SWIPE_COMMIT_RATIO = 0.22
const AXIS_LOCK_THRESHOLD = 6

let uid = 0

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  /** Desktop-only: opens the full detail overlay at the currently shown screenshot. */
  onOpen?: (initialIndex: number) => void
}) {
  // A recorded walkthrough replaces the screenshot slider entirely.
  const hasVideo = Boolean(project.demoVideo)
  const hasLeadVideo = hasVideo && Boolean(project.demoVideoFirst)
  const displayImages = hasLeadVideo ? project.images.slice(1) : project.images
  const len = displayImages.length + (hasLeadVideo ? 1 : 0)
  const loop = len > 1 && (!hasVideo || hasLeadVideo)

  const [index, setIndex] = useState(0)
  // trackPos tracks the visual slide position. When looping, the track is
  // rendered as [lastClone, ...images, firstClone], so trackPos runs 0..len+1
  // (0 and len+1 are the clones) while trackPos === index + 1 at rest.
  const [trackPos, setTrackPos] = useState(loop ? 1 : 0)
  const [skipTransition, setSkipTransition] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [inView, setInView] = useState(false)
  const [videoAspect, setVideoAspect] = useState<number | null>(null)
  const intervalRef = useRef<number | undefined>(undefined)
  const initDelayRef = useRef((uid++ * 1.3 + Math.random() * 2) % 30 * 1000)
  const cardRef = useRef<HTMLDivElement>(null)

  const screenRef = useRef<HTMLDivElement>(null)
  const [frameWidth, setFrameWidth] = useState(0)
  const frameWidthRef = useRef(0)
  const dragPxRef = useRef(0)
  const [dragPx, setDragPx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const didSwipeRef = useRef(false)

  useEffect(() => {
    const measure = () => {
      const w = screenRef.current?.clientWidth ?? 0
      frameWidthRef.current = w
      setFrameWidth(w)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const moveBy = useCallback(
    (direction: 1 | -1) => {
      setIndex((i) => ((i + direction) % len + len) % len)
      setTrackPos((p) => p + direction)
    },
    [len],
  )

  const goTo = useCallback(
    (i: number) => {
      const nextIndex = ((i % len) + len) % len
      setIndex(nextIndex)
      setTrackPos(loop ? nextIndex + 1 : 0)
    },
    [len, loop],
  )

  // Continuous on-screen tracking (unlike `visible`, which latches).
  useEffect(() => {
    const el = cardRef.current
    if (!el || project.platform !== 'web') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [project.platform])

  useEffect(() => {
    if (project.platform !== 'web' || !loop || !inView || (hasLeadVideo && index === 0)) return
    let interval: number | undefined
    const first = window.setTimeout(() => {
      moveBy(1)
      interval = window.setInterval(() => moveBy(1), WEB_FLIP_EVERY_MS)
    }, WEB_FIRST_FLIP_MS)
    return () => {
      clearTimeout(first)
      clearInterval(interval)
    }
  }, [project.platform, loop, inView, moveBy, hasLeadVideo, index])

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!canHover || !loop || project.platform === 'web') return

    const timer = setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        moveBy(1)
      }, AUTO_ADVANCE_MS)
    }, initDelayRef.current)
    return () => {
      clearTimeout(timer)
      clearInterval(intervalRef.current)
    }
  }, [loop, moveBy, project.platform])

  // Native (non-passive) touch listeners so we can lock the gesture to the
  // horizontal axis and call preventDefault only once that's established —
  // otherwise vertical page scroll and the horizontal drag fight each other.
  useEffect(() => {
    const el = screenRef.current
    if (!el || !loop) return

    let axis: 'x' | 'y' | null = null
    let startX = 0
    let startY = 0

    const handleStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      axis = null
      setDragging(true)
    }

    const handleMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY

      if (axis === null) {
        if (Math.abs(dx) < AXIS_LOCK_THRESHOLD && Math.abs(dy) < AXIS_LOCK_THRESHOLD) return
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
        if (axis === 'y') {
          setDragging(false)
          return
        }
      }

      if (axis === 'x') {
        e.preventDefault()
        dragPxRef.current = dx
        setDragPx(dx)
      }
    }

    const handleEnd = () => {
      if (axis === 'x') {
        const dx = dragPxRef.current
        const swiped = Math.abs(dx) > frameWidthRef.current * SWIPE_COMMIT_RATIO
        if (swiped) {
          didSwipeRef.current = true
          moveBy(dx < 0 ? 1 : -1)
        }
      }
      axis = null
      dragPxRef.current = 0
      setDragPx(0)
      setDragging(false)
    }

    el.addEventListener('touchstart', handleStart, { passive: true })
    el.addEventListener('touchmove', handleMove, { passive: false })
    el.addEventListener('touchend', handleEnd)
    el.addEventListener('touchcancel', handleEnd)

    return () => {
      el.removeEventListener('touchstart', handleStart)
      el.removeEventListener('touchmove', handleMove)
      el.removeEventListener('touchend', handleEnd)
      el.removeEventListener('touchcancel', handleEnd)
    }
  }, [loop, moveBy])

  // After animating onto a clone slide at either end of the track, snap
  // invisibly back to the equivalent real slide so the loop never runs out
  // of clones to animate into.
  useEffect(() => {
    if (!skipTransition) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSkipTransition(false))
    })
    return () => cancelAnimationFrame(id)
  }, [skipTransition])

  const handleTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return
    if (loop && (trackPos === 0 || trackPos === len + 1)) {
      setSkipTransition(true)
      setTrackPos(trackPos === 0 ? len : 1)
    }
  }

  const handleEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHovered(true)
    }
  }

  const handleLeave = () => {
    setHovered(false)
    goTo(0)
  }

  const handleClick = () => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false
      return
    }
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (canHover || project.id === 'uzeka' || project.id === 'gas-app' || project.id === 'gears') {
      onOpen?.(index)
    }
  }

  const showDots = !hasVideo && displayImages.length > 1 && displayImages.length <= DOT_LIMIT
  const showSwipeTrack = !hasVideo && displayImages.length > DOT_LIMIT
  const trackOffset = -trackPos * frameWidth + dragPx
  const slides = loop ? [project.images[len - 1], ...project.images, project.images[0]] : project.images

  // Entrance offset slides the card up from 28px on first reveal, with a
  // gentle overshoot easing for the "bounce".
  const revealOffset = visible ? 0 : 28

  return (
    <div
      ref={cardRef}
      className={`app-card app-card--${project.id} ${visible ? 'app-card--visible' : ''}`}
      style={{
        transform: `translateY(${revealOffset}px)`,
        transition: 'transform 0.5s cubic-bezier(0.22, 1.2, 0.36, 1), opacity 0.6s ease',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {showDots && (
        <div className="app-card-indicators" role="tablist" aria-label="Preview position">
          {project.images.map((_, i) => (
            <button
              key={i}
              className={`app-card-dot ${i === index ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                goTo(i)
              }}
              role="tab"
              aria-selected={i === index}
              aria-label={`Show screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}

      {showSwipeTrack && (
        <div className="app-card-indicators app-card-indicators--swipe">
          {project.images.map((_, i) => (
            <span key={i} className={`app-card-swipe-dot ${i === index ? 'is-active' : ''}`} />
          ))}
        </div>
      )}

      <div className="app-card-screen" ref={screenRef}>
        {hasLeadVideo && project.platform === 'web' && index === 0 ? (
          <div className="app-card-sheet">
            <div
              className="flip-stack"
              style={videoAspect ? ({ '--shot-ar': videoAspect } as React.CSSProperties) : undefined}
            >
              <div className="flip-page">
                <DemoVideo
                  src={project.demoVideo!}
                  poster={project.demoPoster ?? project.images[0]}
                  loop={false}
                  onAspect={setVideoAspect}
                  onEnded={() => moveBy(1)}
                />
              </div>
            </div>
          </div>
        ) : project.demoVideo && project.platform === 'mobile' ? (
          <div className="app-card-phone-wrap">
            <div className="app-card-phone-frame app-card-phone-frame--device">
              <DemoVideo src={project.demoVideo} poster={project.demoPoster ?? project.images[0]} />
            </div>
          </div>
        ) : project.demoVideo && !hasLeadVideo ? (
          // Same fit as the screenshot sheets: the frame takes the
          // recording's own aspect ratio so the whole screen is visible.
          <div className="app-card-sheet">
            <div
              className="flip-stack"
              style={videoAspect ? ({ '--shot-ar': videoAspect } as React.CSSProperties) : undefined}
            >
              <div className="flip-page">
                <DemoVideo src={project.demoVideo} poster={project.demoPoster ?? project.images[0]} onAspect={setVideoAspect} />
              </div>
            </div>
          </div>
        ) : project.platform === 'web' && project.images.length > 0 ? (
          <div className="app-card-sheet">
            <FlipStack
              images={displayImages}
              index={hasLeadVideo ? Math.max(0, index - 1) : index}
              alt={`${project.name} screenshot ${index + 1}`}
              imagePosition={project.imagePosition}
            />
          </div>
        ) : project.images.length > 0 ? (
          <div
            className="app-card-track"
            style={{
              transform: `translateX(${trackOffset}px)`,
              transition: dragging || skipTransition ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {slides.map((src, i) => (
              <div key={i} className="app-card-slide">
                <img
                  src={src}
                  alt={`${project.name} screenshot ${((i - 1 + len) % len) + 1}`}
                  loading={visible && i === trackPos ? 'eager' : 'lazy'}
                  fetchPriority={visible && i === trackPos ? 'high' : 'auto'}
                  decoding="async"
                  style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="app-card-placeholder">{project.name.charAt(0)}</div>
        )}

        {(project.id === 'uzeka' || project.id === 'gas-app' || project.id === 'gears') && (
          <span className={`app-card-case-study-hint ${hovered ? 'is-visible' : ''}`}>View Case Study</span>
        )}
      </div>

      {!hasVideo && project.images.length > 1 && (
        <>
          <button
            type="button"
            className="app-card-arrow app-card-arrow--previous"
            onClick={(e) => {
              e.stopPropagation()
              moveBy(-1)
            }}
            aria-label="Show previous screenshot"
          >
            <CaretLeft size={14} weight="bold" />
          </button>
          <button
            type="button"
            className="app-card-arrow app-card-arrow--next"
            onClick={(e) => {
              e.stopPropagation()
              moveBy(1)
            }}
            aria-label="Show next screenshot"
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </>
      )}

      <div className={`app-card-overlay ${hovered ? 'is-visible' : ''}`} aria-hidden={!hovered}>
        <footer className="app-card-footer">
          <div className="app-card-overlay-head">
            {project.logo && <img className="app-card-logo" src={project.logo} alt="" />}
            <div className="app-card-overlay-text">
              <h3 className="app-card-name">{project.name}</h3>
              <p className="app-card-desc">{project.description}</p>
            </div>
          </div>
          {project.links.length > 0 && (
            <nav className="app-card-links" aria-label="App links">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={getProjectLinkTooltip(link)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="app-card-link-tooltip">{getProjectLinkTooltip(link)}</span>
                  <ProjectLinkIcon link={link} />
                </a>
              ))}
            </nav>
          )}
        </footer>
      </div>
    </div>
  )
}
