import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CaretRight, SidebarSimple, X } from '@phosphor-icons/react'
import { useTheme } from '../context/ThemeContext'
import { acquireGlass, releaseGlass } from '../lib/glass'
import type { Project } from '../types/project'

const WHEEL_STEP_COOLDOWN_MS = 700
const WHEEL_THRESHOLD = 12

export default function ProjectOverlay({
  project,
  initialIndex = 0,
  onClose,
}: {
  project: Project
  initialIndex?: number
  onClose: () => void
}) {
  const { theme } = useTheme()
  const [index, setIndex] = useState(initialIndex)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const wheelLockedRef = useRef(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    dotsRef.current?.style.setProperty('--spot-x', `${e.clientX}px`)
    dotsRef.current?.style.setProperty('--spot-y', `${e.clientY}px`)
  }

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(project.images.length - 1, i)))

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, onClose])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    acquireGlass()
    return () => {
      document.body.style.overflow = prevOverflow
      releaseGlass()
    }
  }, [])

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (wheelLockedRef.current || Math.abs(e.deltaY) < WHEEL_THRESHOLD) return

      const count = project.images.length
      const next = (index + (e.deltaY > 0 ? 1 : -1) + count) % count

      wheelLockedRef.current = true
      setIndex(next)
      setTimeout(() => {
        wheelLockedRef.current = false
      }, WHEEL_STEP_COOLDOWN_MS)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [index, project.images.length])

  return createPortal(
    <div
      className={`project-overlay theme-${theme}`}
      ref={overlayRef}
      onClick={onClose}
      onMouseMove={handleMouseMove}
    >
      <div className="project-overlay-dots" ref={dotsRef} />

      <button className="project-overlay-close" onClick={onClose} aria-label="Close">
        <X size={18} weight="bold" />
      </button>

      <div
        className={`project-overlay-panel ${sidebarOpen ? 'is-open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="project-overlay-panel-head-row">
          {sidebarOpen && <h2 className="project-overlay-panel-title">Product Details</h2>}
          <button
            className="project-overlay-panel-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? 'Hide product details' : 'Show product details'}
            aria-expanded={sidebarOpen}
          >
            <SidebarSimple size={16} weight="bold" />
          </button>
        </div>

        <div className="project-overlay-panel-body">
          <div className="project-overlay-panel-header">
            <div className="project-overlay-panel-head">
              {project.logo && <img className="project-overlay-logo" src={project.logo} alt="" />}
              <div className="project-overlay-panel-text">
                <div className="project-overlay-panel-name">{project.name}</div>
                <div className="project-overlay-panel-desc">{project.description}</div>
              </div>
            </div>
          </div>

          {project.features && project.features.length > 0 && (
            <div className="project-overlay-features">
              <div className="project-overlay-features-title">Features</div>
              <ul>
                {project.features.map((feature) => (
                  <li key={feature}>
                    <CaretRight size={10} weight="bold" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div
        className={`project-overlay-stage ${project.platform === 'web' ? 'project-overlay-stage--web' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={index}
          className="project-overlay-media"
          src={project.images[index]}
          alt={`${project.name} screenshot ${index + 1}`}
          style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
        />
      </div>

      {project.images.length > 1 && (
        <div className="project-overlay-indicators" onClick={(e) => e.stopPropagation()}>
          {project.images.map((_, i) => (
            <button
              key={i}
              className={`project-overlay-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Show screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}
