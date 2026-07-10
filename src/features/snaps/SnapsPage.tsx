import { useState } from 'react'
import avatarImg from '/avatar.png'
import DockNav from '../../components/DockNav'

type SnapItem = {
  title: string
  image: string
  alt: string
}

const imageModules = import.meta.glob('../../assets/Work/*.*', { eager: true, query: '?url', import: 'default' })

const images: Record<string, string> = {}
for (const [key, val] of Object.entries(imageModules)) {
  if (typeof val === 'string' && /\.(jpg|jpeg|png)$/i.test(key)) {
    const name = key.split('/').pop() || ''
    images[name] = val
  }
}

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

const snaps: SnapItem[] = Object.entries(images).map(([name, src]) => {
  return {
    title: TITLES[name] || name.replace(/\.[^.]+$/, ''),
    image: src as string,
    alt: TITLES[name] || 'Design work',
  }
})

type SnapsPageProps = {
  onNavigate: (page: string) => void
}

export default function SnapsPage({ onNavigate }: SnapsPageProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{
      position: 'relative', zIndex: 1, minHeight: '100vh',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      padding: '56px 32px 100px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 20 }}>
        <img src={avatarImg} alt="" style={{
          width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
          marginBottom: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }} />
        <h1 style={{
          fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em',
          color: 'var(--text, #000)', margin: '0 0 6px',
        }}>design snaps</h1>
        <p style={{
          fontSize: 14, color: 'var(--text-muted, #888)', margin: 0,
          fontWeight: 500,
        }}>Visual explorations &amp; creative snippets</p>
      </div>

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
      )}

      <DockNav activeLabel="Images" onNavigate={onNavigate} />
    </div>
  )
}
