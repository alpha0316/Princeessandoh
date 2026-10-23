import { useState } from 'react'
import ProjectLinkIcon, { getProjectLinkTooltip } from '../../components/ProjectLinkIcon'
import { projects } from '../../data/projects'
import { LineIcon } from './UzekaIcons'

export type Chapter = { id: string; label: string }

const uzekaProject = projects.find((p) => p.id === 'uzeka')!

export default function UzekaDetailsPanel({ chapters, appIcon, progress }: { chapters: Chapter[]; appIcon: string; progress: number }) {
  const [open, setOpen] = useState(false)

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  return (
    <div className={`uzeka-panel ${open ? 'is-open' : ''}`}>
      <div className="uzeka-panel-head-row">
        {open && <h2 className="uzeka-panel-title">Product Details</h2>}
        <button
          type="button"
          className="uzeka-panel-toggle"
          aria-expanded={open}
          aria-label={open ? 'Hide product details' : `Show product details, ${Math.round(progress * 100)}% case study complete`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <LineIcon name="close" size={16} /> : (
            <svg className="uzeka-progress-ring" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="uzeka-progress-ring-track" cx="12" cy="12" r="9" />
              <circle className="uzeka-progress-ring-value" cx="12" cy="12" r="9" style={{ strokeDashoffset: 56.55 * (1 - progress) }} />
            </svg>
          )}
        </button>
      </div>

      <div className="uzeka-panel-body">
        <div className="uzeka-panel-header">
          <div className="uzeka-panel-head">
            <img className="uzeka-panel-logo" src={appIcon} alt="" />
            <div className="uzeka-panel-text">
              <div className="uzeka-panel-name">{uzekaProject.name}</div>
              <div className="uzeka-panel-desc">{uzekaProject.description}</div>
            </div>
          </div>
        </div>

        <div className="uzeka-panel-chapters">
          <div className="uzeka-panel-section-title">Chapters</div>
          <ul>
            {chapters.map((chapter, i) => (
              <li key={chapter.id}>
                <button type="button" onClick={() => jumpTo(chapter.id)}>
                  <span className="uzeka-panel-chapter-index">{i + 1}</span>
                  {chapter.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {uzekaProject.links.length > 0 && (
          <div className="uzeka-panel-links">
            <div className="uzeka-panel-section-title">Links</div>
            {uzekaProject.links.map((link) => (
              <a key={link.label} className="uzeka-panel-link" href={link.url} target="_blank" rel="noreferrer">
                <ProjectLinkIcon link={link} size={18} />
                {getProjectLinkTooltip(link)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
