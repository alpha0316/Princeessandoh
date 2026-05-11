import { useEffect } from 'react'
import GasStatusBar from '../components/GasStatusBar'

type SplashScreenProps = {
  onComplete?: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div style={styles.container}>
      <GasStatusBar />
      <span style={styles.text}>Gas</span>
      <span style={{ ...styles.text, color: 'rgba(0, 0, 0, 0.50)' }}>App</span>
    </div>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row' as const,
    position: 'relative' as const,
    height: '100%',
    width: '100%',
  },
  text: {
    fontWeight: '700',
    fontSize: '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
}
