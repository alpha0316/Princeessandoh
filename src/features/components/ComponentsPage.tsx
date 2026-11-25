import { useState } from 'react'
import DockNav from '../../components/DockNav'
import ShiftClockPreview from './ShiftClockPreview'
import ShiftCalendarPreview from './ShiftCalendarPreview'
import GasSizesPreview from './GasSizesPreview'
import GasTrackingPreview from './GasTrackingPreview'
import RiderHomePreview from './RiderHomePreview'
import ProductCatalogPreview from './ProductCatalogPreview'
import { componentEntries } from './data'
import './components.css'

/** The previews grid on its own — also embedded as the Components tab on
 * the home page (see Profile.tsx). */
export function ComponentsGrid() {
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)

  return (
    <main className="components-grid" aria-label="Project interaction previews">
      {componentEntries.map((entry) => (
        <figure
          key={entry.id}
          className={`components-card${entry.kind && entry.kind !== 'rider-home' ? ' components-card--live' : ''}${entry.kind === 'shift-calendar' ? ' components-card--shift-calendar' : ''}${entry.kind === 'gas-sizes' ? ' components-card--gas-order' : ''}${entry.kind === 'gas-tracking' ? ' components-card--gas-tracking' : ''}${entry.kind === 'rider-home' ? ' components-card--rider-home' : ''}${entry.kind === 'product-catalog' ? ' components-card--product-catalog' : ''}`}
          aria-label={`${entry.title} — ${entry.project}`}
          onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHoveredEntry(entry.id) }}
          onPointerLeave={() => setHoveredEntry(null)}
        >
          <img className="components-card-background" src={entry.background} alt="" loading="lazy" decoding="async" />
          <div className="components-card-scene">
            {entry.kind === 'shift-clock' ? <ShiftClockPreview isPaused={hoveredEntry === entry.id} />
              : entry.kind === 'shift-calendar' ? <ShiftCalendarPreview isPaused={hoveredEntry === entry.id} />
                : entry.kind === 'gas-sizes' ? <GasSizesPreview isPaused={hoveredEntry === entry.id} />
                  : entry.kind === 'gas-tracking' ? <GasTrackingPreview isPaused={hoveredEntry === entry.id} />
                    : entry.kind === 'rider-home' ? <RiderHomePreview />
                      : entry.kind === 'product-catalog' ? <ProductCatalogPreview isPaused={hoveredEntry === entry.id} />
                : <img src={entry.image} alt={`${entry.title} from ${entry.project}`} loading="lazy" draggable={false} />}
          </div>
        </figure>
      ))}
    </main>
  )
}

export default function ComponentsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <div className="components-page">
      <header className="components-header">
        <img className="components-avatar" src="/avatar.png" alt="" />
        <h1 className="components-title">Interactions playground</h1>
        <p className="components-subtitle">Explorations from ongoing projects</p>
      </header>

      <ComponentsGrid />

      <DockNav activeLabel="Components" onNavigate={onNavigate} />
    </div>
  )
}
