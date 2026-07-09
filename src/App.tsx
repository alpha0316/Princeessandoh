import { useState, useEffect } from 'react'
import './styles/app.css'
import './styles/themes.css'
import FluidBackground from './components/FluidBackground'
import Starfield from './components/Starfield'
import WeatherOverlay, { type Weather } from './components/WeatherOverlay'
import Profile from './components/Profile'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useWeather } from './hooks/useWeather'
import { requestOrientationPermission } from './stores/mouse'

const FONT = "'Syne', sans-serif"
const WEATHERS: Weather[] = ['sunny', 'cloudy', 'rain', 'snow']

function AppContent() {
  const isDev = import.meta.env.DEV
  const [manualWeather, setManualWeather] = useState<Weather>('sunny')
  const { weather: detectedWeather } = useWeather()
  const weather = isDev ? manualWeather : detectedWeather
  const { theme, toggle } = useTheme()
  const isNight = theme === 'dark'
  const [orientationGranted, setOrientationGranted] = useState(false)
  const needsPermission = typeof DeviceOrientationEvent !== 'undefined' &&
    'requestPermission' in DeviceOrientationEvent &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent)

  const handleEnableMotion = async () => {
    const result = await requestOrientationPermission()
    if (result === 'granted') setOrientationGranted(true)
  }

  return (
    <div className={`theme-${theme}`}>
      {needsPermission && !orientationGranted && (
        <button onClick={handleEnableMotion} style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, padding: '10px 20px', borderRadius: 999,
          background: '#0b0b0c', color: '#fff', border: 'none',
          fontFamily: "'Syne', sans-serif", fontSize: 11,
          letterSpacing: '0.1em', cursor: 'pointer',
        }}>
          Enable Motion
        </button>
      )}
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
        zIndex: 20, pointerEvents: 'all', gap: 18,
      }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
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
      <Profile />
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
