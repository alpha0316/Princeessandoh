import type { ReactNode } from 'react'
import mockupFrame from '../../assets/shuttle/Mockup/mockup.svg'

// Matches the SVG frame used in the shuttle hero (mockup.svg)
// Container: aspect-ratio 464/912, overflow hidden, elliptical border-radius
// Screen viewport: left 6.7%, top 1.2%, width 87.6%
// Gas screens are designed at 390×844 — scale = (87.6% × width) / 390

const PHONE_ASPECT_W = 464
const PHONE_ASPECT_H = 912
const SCREEN_LEFT_PCT = 0.067
const SCREEN_TOP_PCT  = 0.012
const SCREEN_W_PCT    = 0.876
const DESIGN_W = 390
const DESIGN_H = 844

export function GasPhoneMockup({
  width = 300,
  children,
}: {
  width?: number
  children: ReactNode
}) {
  const height      = width * (PHONE_ASPECT_H / PHONE_ASPECT_W)
  const screenLeft  = width  * SCREEN_LEFT_PCT
  const screenTop   = height * SCREEN_TOP_PCT
  const screenW     = width  * SCREEN_W_PCT
  const screenH     = height - screenTop
  const scale       = Math.min(screenW / DESIGN_W, screenH / DESIGN_H)

  return (
    <div style={{
      position:     'relative',
      width,
      height,
      flexShrink:   0,
      borderRadius: '22% / 5.96%',
      overflow:     'hidden',
    }}>
      <div style={{
        position:     'absolute',
        top:          screenTop,
        left:         screenLeft,
        width:        screenW,
        height:       screenH,
        borderRadius: 36 * (width / 300),
        overflow:     'hidden',
      }}>
        <div style={{
          width:           DESIGN_W,
          height:          DESIGN_H,
          transformOrigin: 'top left',
          transform:       `scale(${scale})`,
        }}>
          {children}
        </div>
      </div>

      <img
        src={mockupFrame}
        alt=""
        aria-hidden
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          objectFit:     'fill',
          pointerEvents: 'none',
          zIndex:        1,
          display:       'block',
        }}
      />
    </div>
  )
}
