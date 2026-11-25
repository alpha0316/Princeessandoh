import { useEffect, useState } from 'react'
import ProjectLinkIcon from '../../components/ProjectLinkIcon'
import { storeListings } from '../../data/storeListings'
import './store-previews.css'

/**
 * Screenshots tab: each app's App Store / Play Store preview images laid
 * out like a store listing — one card per app with its icon, name and
 * category above the screenshots in listing order. Click to enlarge.
 */
export default function StorePreviews() {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="store-previews">
      {storeListings.map((app) => (
        <section key={app.id} className="store-card" aria-label={`${app.name} store screenshots`}>
          <header className="store-card-header">
            <img className="store-card-logo" src={app.logo} alt="" />
            <div className="store-card-meta">
              <h2 className="store-card-name">{app.name}</h2>
              <p className="store-card-category">{app.category}</p>
            </div>
            {app.links.length > 0 && (
              <nav className="store-card-links" aria-label={`${app.name} store links`}>
                {app.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="store-card-link">
                    <ProjectLinkIcon link={link} size={20} />
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </header>

          <ul className="store-card-shots">
            {app.screenshots.map((shot) => (
              <li key={shot.src}>
                <button type="button" className="store-card-shot" onClick={() => setOpen(shot)}>
                  <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" draggable={false} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {open && (
        <div className="store-lightbox" role="dialog" aria-label={open.alt} onClick={() => setOpen(null)}>
          <img src={open.src} alt={open.alt} />
          <button type="button" className="store-lightbox-close" aria-label="Close" onClick={() => setOpen(null)}>
            ×
          </button>
        </div>
      )}
    </div>
  )
}
