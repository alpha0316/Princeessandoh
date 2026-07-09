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
     
        </div>
      </nav>
      <Profile />
  
    </>
  )
}
