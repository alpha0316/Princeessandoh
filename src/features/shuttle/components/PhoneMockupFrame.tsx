import type { ReactNode } from 'react'
import mockupSvg from '../../../assets/shuttle/Mockup/ExplorePageFrames.svg'

// Native SVG dimensions
const FRAME_W = 227
const FRAME_H = 474

// Screen viewport within the frame at native 1× scale.
// Accounts for the phone bezels and dynamic island area.
const SCREEN_TOP    = 13
const SCREEN_BOTTOM = 10
const SCREEN_SIDE   = 5
const SCREEN_W = FRAME_W - SCREEN_SIDE * 2   // 217
const SCREEN_H = FRAME_H - SCREEN_TOP - SCREEN_BOTTOM // 451
const SCREEN_RADIUS = 38  // inner corner radius at native scale

export function PhoneMockupFrame({
  width = FRAME_W,
  contentWidth  = 390,
  contentHeight = 844,
  children,
}: {
  width?: number
  contentWidth?: number
  contentHeight?: number
  children: ReactNode
}) {
  const scale        = width / FRAME_W
  const height       = FRAME_H * scale
  const screenTop    = SCREEN_TOP    * scale
  const screenLeft   = SCREEN_SIDE   * scale
  const screenW      = SCREEN_W      * scale
  const screenH      = SCREEN_H      * scale
  const screenRadius = SCREEN_RADIUS * scale
  // Fit the full mockup inside the viewport so edges aren't clipped.
  const contentScale = Math.min(screenW / contentWidth, screenH / contentHeight)
  const fittedWidth = contentWidth * contentScale
  const fittedHeight = contentHeight * contentScale
  const offsetX = (screenW - fittedWidth) / 2
  const offsetY = (screenH - fittedHeight) / 2

  return (
    <div className="phone-mockup-frame" style={{ position: 'relative', width, height, flexShrink: 0 }}>
      {/* Live screen content clipped to the screen viewport */}
      <div
        style={{
          position: 'absolute',
          top: screenTop,
          left: screenLeft,
          width: screenW,
          height: screenH,
          overflow: 'hidden',
          borderRadius: screenRadius,
        }}
      >
        <div
          style={{
            width: contentWidth,
            height: contentHeight,
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${contentScale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>

      {/* Phone frame overlay — sits above content, pointer events disabled */}
      <img
        src={mockupSvg}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          display: 'block',
        }}
      />
    </div>
  )
}
