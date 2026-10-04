import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import ProjectLinkIcon, { getProjectLinkTooltip } from '../../components/ProjectLinkIcon'
import { projects } from '../../data/projects'

export type Chapter = { id: string; label: string }

const uzekaProject = projects.find((p) => p.id === 'uzeka')!

export default function UzekaDetailsPanel({ chapters, appIcon }: { chapters: Chapter[]; appIcon: string }) {
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
          aria-label={open ? 'Hide product details' : 'Show product details'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={16} weight="bold" /> : <span className="uzeka-status-dot" />}
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
