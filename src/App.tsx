import { useState } from 'react'
import './styles/app.css'
import FluidBackground from './components/FluidBackground'
import WeatherOverlay, { type Weather } from './components/WeatherOverlay'
import Profile from './components/Profile'
import { useWeather } from './hooks/useWeather'

const FONT = "'Syne', sans-serif"
const WEATHERS: Weather[] = ['sunny', 'cloudy', 'rain', 'snow']

export default function App() {
  const isDev = import.meta.env.DEV
  const [manualWeather, setManualWeather] = useState<Weather>('sunny')
  const { weather: detectedWeather } = useWeather()
  const weather = isDev ? manualWeather : detectedWeather

  return (
    <>
      <FluidBackground />
      <WeatherOverlay weather={weather} />
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '32px 56px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 20, pointerEvents: 'all',
      }}>
        <div style={{
          fontFamily: FONT, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.32em', color: 'rgba(24,26,72,0.42)',
          textTransform: 'uppercase',
        }}>
          Alpha · Prince Essandoh
        </div>
        <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
          {isDev && WEATHERS.map(w => (
            <button key={w} onClick={() => setManualWeather(w)} style={{
              fontFamily: FONT, fontSize: 9, letterSpacing: '0.16em',
              textTransform: 'uppercase', background: 'none', border: 'none',
              cursor: 'pointer',
              color: manualWeather === w ? 'rgba(24,26,72,0.7)' : 'rgba(24,26,72,0.25)',
              transition: 'color 0.2s',
            }}>{w}</button>
          ))}
          {isDev && <span style={{ width: 1, height: 14, background: 'rgba(24,26,72,0.1)' }} />}
          {['Work', 'About', 'Contact'].map(item => (
            <a key={item} style={{
              fontFamily: FONT, fontSize: 10, letterSpacing: '0.18em',
              color: 'rgba(24,26,72,0.3)', textDecoration: 'none',
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(24,26,72,0.72)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(24,26,72,0.3)')}
            >{item}</a>
          ))}
        </div>
      </nav>
      <Profile />
      <footer style={{
        position: 'fixed', bottom: 32, left: 56, zIndex: 20,
      }}>
        <p style={{
          fontFamily: FONT, fontSize: 9, letterSpacing: '0.16em',
          color: 'rgba(24,26,72,0.22)',
        }}>
          ©2026 ALPHA · ESSANDOH PRINCE TAKYI
        </p>
      </footer>
    </>
  )
}
