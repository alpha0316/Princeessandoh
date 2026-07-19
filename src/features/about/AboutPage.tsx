import DockNav from '../../components/DockNav'

type AboutPageProps = {
  onNavigate: (page: string) => void
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div style={{
      position: 'relative', zIndex: 1, minHeight: '100vh',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      padding: '56px 32px 100px',
    }}>
      <div style={{ textAlign: 'center', paddingTop: 40 }}>
        <h1 style={{
          fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em',
          color: 'var(--text, #000)', margin: '0 0 6px',
        }}>About</h1>
      </div>

      <DockNav activeLabel="Profile" onNavigate={onNavigate} />
    </div>
  )
}
