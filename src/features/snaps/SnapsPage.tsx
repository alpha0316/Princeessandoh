import { useRef, useState } from 'react'
import avatarImg from '/avatar.png'
import DockNav from '../../components/DockNav'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

const APP_STORE_PREVIEWS = [
  { file: 'Screen 6.webp', title: 'Make Someone Feel Loved Today' },
  { file: 'Screen 19.webp', title: 'Find The Perfect Gift' },
  { file: 'Screen 16.webp', title: 'Your gift, your way' },
  { file: 'Screen 17.webp', title: 'Curate With Care' },
  { file: 'Screen 18.webp', title: 'Review Your Gift' },
].map((screen) => ({
  ...screen,
  image: `/v2-svg/GiftPal/App%20Store%20Preview/${encodeURIComponent(screen.file)}`,
}))

const TITLES: Record<string, string> = {
  'IMG_1120.PNG': 'Event Poster Exploration',
  'IMG_0759.jpg': 'Fashion Storyboard',
  'IMG_0639.jpg': 'Brand Direction',
  'IMG_0831.jpg': 'Visual Moodboard',
  'IMG_1030.jpg': 'Campaign Concept',
  'IMG_1104.jpg': 'UI Exploration',
  'IMG_0638.jpg': 'Editorial Layout',
  'IMG_0569.jpg': 'Brand Element',
  'IMG_0814.JPG': 'Poster Series',
  'IMG_0058.jpg': 'Fashion Editorial',
  'IMG_0061.jpg': 'Storyboard',
  'IMG_0263.JPG': 'Photography',
  'IMG_0325.JPG': 'Typography',
  'IMG_0562.jpg': 'Color Study',
  'IMG_0636.jpg': 'Layout Grid',
  'IMG_0758.jpg': 'Album Art',
  'IMG_0832.jpg': 'Magazine Spread',
  'IMG_0833.jpg': 'Packaging',
  'IMG_0869.jpg': 'Identity System',
  'IMG_0978.jpg': 'Art Direction',
  'IMG_1032.jpg': 'UI Component',
  'IMG_1038.jpg': 'App Flow',
  'IMG_1153.PNG': 'Cover Design',
  'Image 05-04-2026 at 2.58 PM.PNG': 'Fashion',
  'Image 06-03-2026 at 6.22 PM.PNG': 'Design System',
  'Image 06-03-2026 at 9.40 PM.PNG': 'Product Shot',
  'Image 07-03-2026 at 10.11 PM.PNG': 'Concept Art',
  'Image 10-12-2025 at 8.04 PM.JPG': 'Brand Assets',
  'Image 13-03-2026 at 2.38 AM.PNG': 'Interface',
  'Image 14-03-2026 at 3.39 PM.PNG': 'Wireframe',
  'Image 16-01-2026 at 10.20 PM.JPG': 'Dashboard',
  'Image 16-01-2026 at 10.45 AM.JPG': 'Mobile UI',
  'Image 16-03-2026 at 4.57 PM.PNG': 'Web Layout',
  'Image 18-01-2026 at 10.27 AM.PNG': 'Screenshot',
  'Screenshot 2025-12-12 at 12.39.21 PM.PNG': 'Process',
}

const FILE_NAMES = Object.keys(TITLES)

const snaps = FILE_NAMES.map((name) => ({
  title: TITLES[name],
  image: `/snaps/${encodeURI(name)}`,
  alt: TITLES[name],
}))

type SnapsPageProps = {
  onNavigate: (page: string) => void
}

/** Masonry grid + lightbox on its own — also embedded as the Screenshots
 * tab on the home page (see Profile.tsx). */
export function SnapsGrid() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
    <div style={{
      columns: '4 240px', columnGap: 16, maxWidth: 1200, margin: '0 auto',
    }}>
      {snaps.map((snap, i) => (
        <div
          key={i}
          onClick={() => setSelected(snap.image)}
          style={{
            breakInside: 'avoid', marginBottom: 16, cursor: 'pointer',
            borderRadius: 16, overflow: 'hidden', position: 'relative',
            background: 'var(--card-bg, #fff)',
            boxShadow: '0 4px 16px var(--card-shadow, rgba(0,0,0,0.04))',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          <img src={snap.image} alt={snap.alt} style={{
            width: '100%', display: 'block',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '32px 12px 10px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
            color: '#fff', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.02em', opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
          >{snap.title}</div>
        </div>
      ))}
    </div>

    {selected && (
      <div onClick={() => setSelected(null)} style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 24,
      }}>
        <img src={selected} alt="" style={{
          maxWidth: '90%', maxHeight: '90vh', objectFit: 'contain',
          borderRadius: 8,
        }} />
        <button onClick={() => setSelected(null)} style={{
          position: 'absolute', top: 24, right: 24,
          width: 40, height: 40, borderRadius: '50%', border: 'none',
          background: 'rgba(255,255,255,0.2)', color: '#fff',
          cursor: 'pointer', fontSize: 20, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>×</button>
      </div>
    )}    </>
  )
}

export default function SnapsPage({ onNavigate }: SnapsPageProps) {
  const [activeTab, setActiveTab] = useState<'snaps' | 'app-store'>('snaps')
  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollCarousel = (direction: -1 | 1) => {
    const track = carouselRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.72, behavior: 'smooth' })
  }

  return (
    <div style={{
      position: 'relative', zIndex: 1, minHeight: '100vh',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      padding: '56px 32px 100px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 30, paddingTop: 20 }}>
        <img src={avatarImg} alt="" style={{
          width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
          marginBottom: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }} />
        <h1 style={{
          fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em',
          color: 'var(--text, #000)', margin: '0 0 6px',
        }}>{activeTab === 'snaps' ? 'design snaps' : 'App Store Screenshots'}</h1>
        <p style={{
          fontSize: 14, color: 'var(--text-muted, #888)', margin: 0,
          fontWeight: 500,
        }}>{activeTab === 'snaps' ? 'Visual explorations & creative snippets' : 'GiftPal · App Store preview carousel'}</p>
      </div>

      <div role="tablist" aria-label="Screenshot collections" style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '0 auto 32px' }}>
        {([
          ['snaps', 'Design Snaps'],
          ['app-store', 'App Store Screenshots'],
        ] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} style={{
            border: activeTab === id ? '1px solid #a50091' : '1px solid var(--border, #e8e5eb)',
            borderRadius: 999, padding: '10px 18px', cursor: 'pointer',
            color: activeTab === id ? '#a50091' : 'var(--text-muted, #888)',
            background: activeTab === id ? 'rgba(165,0,145,.08)' : 'var(--card-bg, #fff)',
            font: 'inherit', fontSize: 13, fontWeight: 650,
          }}>{label}</button>
        ))}
      </div>

      {activeTab === 'snaps' ? <SnapsGrid /> : (
        <section aria-label="GiftPal App Store screenshots" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
            <button aria-label="Previous screenshots" onClick={() => scrollCarousel(-1)} style={carouselArrowStyle}><CaretLeft size={20} /></button>
            <button aria-label="Next screenshots" onClick={() => scrollCarousel(1)} style={carouselArrowStyle}><CaretRight size={20} /></button>
          </div>
          <div ref={carouselRef} style={{ display: 'flex', gap: 18, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', padding: '2px 2px 18px' }}>
            {APP_STORE_PREVIEWS.map((screen, index) => (
              <figure key={screen.file} style={{ flex: '0 0 clamp(210px, 27vw, 300px)', margin: 0, scrollSnapAlign: 'start' }}>
                <img src={screen.image} alt={screen.title} loading={index < 3 ? 'eager' : 'lazy'} style={{ width: '100%', display: 'block', borderRadius: 22, boxShadow: '0 8px 28px rgba(28, 10, 32, .12)' }} />
                <figcaption style={{ color: 'var(--text-muted, #888)', fontSize: 13, marginTop: 10, textAlign: 'center' }}>{screen.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <DockNav activeLabel="Images" onNavigate={onNavigate} />
    </div>
  )
}

const carouselArrowStyle: React.CSSProperties = {
  width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--border, #e8e5eb)',
  background: 'var(--card-bg, #fff)', color: 'var(--text, #222)', display: 'grid',
  placeItems: 'center', cursor: 'pointer',
}
