import { useCallback, useEffect, useRef, useState } from 'react'
import ProjectLinkIcon from './ProjectLinkIcon'
import type { Project } from '../types/project'

const AUTO_ADVANCE_MS = 1400
const DOT_LIMIT = 7
const SWIPE_THRESHOLD = 40

export default function ProjectCard({ project }: { project: Project }) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const intervalRef = useRef<number | undefined>(undefined)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)
  const [offset, setOffset] = useState(0)
  const [swiping, setSwiping] = useState(false)

  useEffect(() => {
    if (!hovered || project.images.length <= 1) return
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % project.images.length)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(intervalRef.current)
  }, [hovered, project.images.length])

  const goTo = useCallback((i: number) => {
    setIndex(i)
    setOffset(0)
    setSwiping(false)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDelta.current = 0
    setSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current
    setOffset(touchDelta.current)
  }

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > SWIPE_THRESHOLD) {
      if (touchDelta.current > 0 && index > 0) {
        goTo(index - 1)
      } else if (touchDelta.current < 0 && index < project.images.length - 1) {
        goTo(index + 1)
      } else {
        setOffset(0)
        setSwiping(false)
      }
    } else {
      setOffset(0)
      setSwiping(false)
    }
  }

  const handleLeave = () => {
    setHovered(false)
    setIndex(0)
  }

  const showDots = project.images.length > 1 && project.images.length <= DOT_LIMIT
  const showSwipeTrack = project.images.length > DOT_LIMIT

  return (
    <div className="app-card" onMouseEnter={() => setHovered(true)} onMouseLeave={handleLeave}>
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {project.images.length > 0 ? (
          <div className="app-card-track" style={{
            transform: `translateX(${-index * 100 + (swiping ? offset / (project.images[index].includes('v2-svg') ? 2 : 1) : 0)}px)`,
            transition: swiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {project.images.map((src, i) => (
              <div key={i} className="app-card-slide">
                <img src={src} alt={`${project.name} screenshot ${i + 1}`} />
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
