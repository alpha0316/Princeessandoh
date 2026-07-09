import { useState, useEffect } from 'react'
import type { Weather } from '../components/WeatherOverlay'

type WeatherResult = {
  weather: Weather
  loading: boolean
}

export function useWeather(): WeatherResult {
  const [weather, setWeather] = useState<Weather>('sunny')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (import.meta.env.DEV) {
      setWeather('sunny')
      setLoading(false)
      return
    }

    let cancelled = false

    const detect = async () => {
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
        )
        const { latitude, longitude } = pos.coords
        const res = await fetch(`https://wttr.in/${latitude},${longitude}?format=%C`)
        const text = await res.text()

        if (cancelled) return

        const lower = text.toLowerCase()
        if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('thunderstorm')) {
          setWeather('rain')
        } else if (lower.includes('snow') || lower.includes('sleet') || lower.includes('blizzard')) {
          setWeather('snow')
        } else if (lower.includes('cloud') || lower.includes('overcast') || lower.includes('fog') || lower.includes('mist')) {
          setWeather('cloudy')
        } else {
          setWeather('sunny')
        }
      } catch {
        if (!cancelled) setWeather('sunny')
      }
      if (!cancelled) setLoading(false)
    }

    detect()
    return () => { cancelled = true }
  }, [])

  return { weather, loading }
}
