// SplashScreen — shown after the HomeScreen tap animation.
// Plays a 5-second brand intro (green bg + logo + pulse) with no dependencies
// on the old HomeScreen.svg.  JS in ProductView transitions to SearchScreen
// after 5 000 ms.

import splashIcon from '../../../assets/shuttle/splashIcon.svg'

export default function SplashScreen() {
  return (
    <div
      className="shuttle-screen"
      style={{ background: '#34c759', overflow: 'hidden', position: 'relative' }}
    >
      {/* Pulse ring that expands outward from the logo */}
      <div className="splash-solo-pulse" />

      {/* Logo container — fades in then holds */}
      <div className="splash-solo-logo">
        <img className="shuttle-splash-icon" src={splashIcon} alt="ShuttleApp" />
      </div>
    </div>
  )
}
