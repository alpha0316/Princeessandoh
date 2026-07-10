import { Suspense, lazy, useState, useEffect } from 'react'
import './styles/app.css'
import './styles/themes.css'
import FluidBackground from './components/FluidBackground'
import Starfield from './components/Starfield'
import WeatherOverlay, { type Weather } from './components/WeatherOverlay'
import Profile from './components/Profile'
import LoadingScreen from './components/LoadingScreen'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useWeather } from './hooks/useWeather'

const SnapsPage = lazy(() => import('./features/snaps/SnapsPage'))

const FONT = "'Syne', sans-serif"
const WEATHERS: Weather[] = ['sunny', 'cloudy', 'rain', 'snow']

type Page = 'home' | 'snaps'

function AppContent() {
  const isDev = import.meta.env.DEV
  const [page, setPage] = useState<Page>('home')
  const [manualWeather, setManualWeather] = useState<Weather>('sunny')
  const { weather: detectedWeather } = useWeather()
  const weather = isDev ? manualWeather : detectedWeather
  const { theme, toggle } = useTheme()
  const isNight = theme === 'dark'

  useEffect(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
      ;(DeviceOrientationEvent as any).requestPermission().then(() => {})
    }
    if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
      ;(DeviceMotionEvent as any).requestPermission().then(() => {})
    }
  }, [])

  if (page === 'snaps') {
    return (
      <div className={`theme-${theme}`}>
        <FluidBackground />
        <Suspense fallback={null}>
          <SnapsPage onNavigate={(p: string) => setPage(p as Page)} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className={`theme-${theme}`}>
      <FluidBackground />
      {isNight && <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'rgba(5,5,18,0.65)',
      }} />}
      {isNight && <Starfield />}
      <WeatherOverlay weather={weather} />
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '32px 56px',
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
        // pointer-events: none on the full-width band, restored on the
        // button group — otherwise this invisible strip sits above
        // .profile-page (z 20 vs 1) and swallows clicks meant for the
        // sticky tab toggle parked under it while scrolled.
        zIndex: 20, pointerEvents: 'none', gap: 18,
      }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', pointerEvents: 'all' }}>
          {isDev && WEATHERS.filter(w => !(isNight && w === 'sunny')).map(w => (
            <button key={w} onClick={() => setManualWeather(w)} style={{
              fontFamily: FONT, fontSize: 9, letterSpacing: '0.16em',
              textTransform: 'uppercase', background: 'none', border: 'none',
              cursor: 'pointer',
              color: manualWeather === w ? 'var(--text)' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}>{w}</button>
          ))}
          {isDev && <span style={{ width: 1, height: 14, background: 'var(--border)' }} />}
          {isDev && <button onClick={toggle} style={{
            fontFamily: FONT, fontSize: 9, letterSpacing: '0.16em',
            textTransform: 'uppercase', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s',
          }}>
            {isNight ? '☀️ Day' : '🌙 Night'}
          </button>}
        </div>
      </nav>
      <Profile onNavigate={(page: string) => setPage(page as Page)} />
      <LoadingScreen />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
