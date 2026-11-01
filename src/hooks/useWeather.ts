import type { Weather } from '../components/WeatherOverlay'

type WeatherResult = {
  weather: Weather
  loading: boolean
}

export function useWeather(): WeatherResult {
  return { weather: 'sunny', loading: false }
}
