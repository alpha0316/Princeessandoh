import { useEffect, useRef, useState } from 'react'
import ProjectLinkIcon from './ProjectLinkIcon'
import type { Project } from '../types/project'

const AUTO_ADVANCE_MS = 1400
const DOT_LIMIT = 7

export default function ProjectCard({ project }: { project: Project }) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const intervalRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!hovered || project.images.length <= 1) return
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % project.images.length)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(intervalRef.current)
  }, [hovered, project.images.length])

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
                setIndex(i)
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

      <div className="app-card-screen">
        {project.images.length > 0 ? (
          <img src={project.images[index]} alt={`${project.name} screenshot ${index + 1}`} />
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
