import { useCallback, useEffect, useRef, useState } from 'react'
import ProjectLinkIcon from './ProjectLinkIcon'
import type { Project } from '../types/project'

const AUTO_ADVANCE_MS = 45000
const DOT_LIMIT = 7
const SWIPE_COMMIT_RATIO = 0.22

let uid = 0

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  /** Desktop-only: opens the full detail overlay at the currently shown screenshot. */
  onOpen?: (initialIndex: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const intervalRef = useRef<number | undefined>(undefined)
  const initDelayRef = useRef((uid++ * 1.3 + Math.random() * 2) % 30 * 1000)
  const cardRef = useRef<HTMLDivElement>(null)

  const screenRef = useRef<HTMLDivElement>(null)
  const [frameWidth, setFrameWidth] = useState(0)
  const touchStartX = useRef(0)
  const [dragPx, setDragPx] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const measure = () => setFrameWidth(screenRef.current?.clientWidth ?? 0)
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

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!canHover) return

    const timer = setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % project.images.length)
      }, AUTO_ADVANCE_MS)
    }, initDelayRef.current)
    return () => {
      clearTimeout(timer)
      clearInterval(intervalRef.current)
    }
  }, [project.images.length])

  const goTo = useCallback(
    (i: number) => {
      const len = project.images.length
      setIndex(((i % len) + len) % len)
    },
    [project.images.length],
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const raw = e.touches[0].clientX - touchStartX.current
    setDragPx(raw)
  }

  const handleTouchEnd = () => {
    if (Math.abs(dragPx) > frameWidth * SWIPE_COMMIT_RATIO) {
      goTo(index + (dragPx < 0 ? 1 : -1))
    }
    setDragPx(0)
    setDragging(false)
  }

  const handleEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHovered(true)
    }
  }

  const handleLeave = () => {
    setHovered(false)
    setIndex(0)
  }

  const handleClick = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      onOpen?.(index)
    }
  }

  const showDots = project.images.length > 1 && project.images.length <= DOT_LIMIT
  const showSwipeTrack = project.images.length > DOT_LIMIT
  const trackOffset = -index * frameWidth + dragPx

  // Entrance offset slides the card up from 28px on first reveal, with a
  // gentle overshoot easing for the "bounce".
  const revealOffset = visible ? 0 : 28

  return (
    <div
      ref={cardRef}
      className={`app-card ${visible ? 'app-card--visible' : ''}`}
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

      <div
        className="app-card-screen"
        ref={screenRef}
        onTouchStart={project.images.length > 1 ? handleTouchStart : undefined}
        onTouchMove={project.images.length > 1 ? handleTouchMove : undefined}
        onTouchEnd={project.images.length > 1 ? handleTouchEnd : undefined}
      >
        {project.images.length > 0 ? (
          <div
            className="app-card-track"
            style={{
              transform: `translateX(${trackOffset}px)`,
              transition: dragging ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {project.images.map((src, i) => (
              <div key={i} className="app-card-slide">
                <img
                  src={src}
                  alt={`${project.name} screenshot ${i + 1}`}
                  style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="app-card-placeholder">{project.name.charAt(0)}</div>
        )}
      </div>

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
                  aria-label={link.label}
                  onClick={(e) => e.stopPropagation()}
                >
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
