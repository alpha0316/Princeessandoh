// SelectionBirdViewScreen — second phone on the portfolio home page.
// Bird's-eye KNUST campus map (4+ buses) + static SearchScreen-style selection panel.

import React from 'react'
import { MOCK_ROUTES } from '../../../data/mockRoutes'
import ShuttleScreenBase from './ShuttleScreenBase'
import { MOBILE_BOTTOM_SHEET_LAYOUT } from './bottomSheetStyles'

// ── Static selection panel (mirrors SearchScreen's idle state) ─────────────────

function SelectionPanel() {
  return (
    <div className="shuttle-panel shuttle-panel--search flex flex-col gap-3" style={{ ...MOBILE_BOTTOM_SHEET_LAYOUT, minHeight: 0 }}>

      {/* Header */}
      <div className="shuttle-panel-header">
        <p className="shuttle-title">
          Welcome to KNUST <span className="shuttle-highlight">ShuttleApp</span>
        </p>
        <span className="shuttle-chevron" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 16 10" fill="none">
            <path d="M2 2L8 8L14 2" stroke="#111111" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Starting point input area */}
      <div className="flex flex-col gap-3 p-4 rounded-3xl bg-gray-50">
        <div className="flex flex-col gap-2">
          <p className="m-0 text-[14px] text-[rgba(0,0,0,0.5)]">Starting Point</p>
          <div className="flex items-center gap-2">
            {/* Dashed pin circle */}
            <div className="w-10 h-10 min-w-10 min-h-10 aspect-square flex items-center justify-center rounded-full border border-dashed border-black/80 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20.6201 8.45C19.5701 3.83 15.5401 1.75 12.0001 1.75C11.9901 1.75 8.4601 1.75 3.3701 8.44C2.2001 13.6 5.3601 17.97 8.2201 20.72C9.2801 21.74 10.6401 22.25 12.0001 22.25C13.3601 22.25 14.7201 21.74 15.7701 20.72C18.6301 17.97 21.7901 13.61 20.6201 8.45ZM12.0001 13.46C10.2601 13.46 8.8501 12.05 8.8501 10.31C8.8501 8.57 10.2601 7.16 12.0001 7.16C13.7401 7.16 15.1501 8.57 15.1501 10.31C15.1501 12.05 13.7401 13.46 12.0001 13.46Z" fill="black" />
              </svg>
            </div>
            {/* Search input — static */}
            <div className="flex px-4 py-3 gap-2 bg-white rounded-[16px] items-center border border-black/40 w-[90%]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.031 20.79L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z" fill="black" fillOpacity="0.6" />
              </svg>
              <span className="flex-1 text-[14px] text-black/60">select pickup stop</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill="rgba(0,0,0,0.4)" />
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function SelectionBirdViewScreen({
  overlayOverride,
  hideStatusBar,
  flyToCoord,
  flyToZoom,
  focusBusId,
  focusZoom,
  focusDelayMs,
  dropPoints,
  routeCoords,
  routeColor,
}: {
  overlayOverride?: React.ReactNode
  hideStatusBar?: boolean
  flyToCoord?: [number, number]
  flyToZoom?: number
  focusBusId?: string
  focusZoom?: number
  focusDelayMs?: number
  dropPoints?: [number, number][]
  routeCoords?: [number, number][]
  routeColor?: string
} = {}) {
  return (
    <ShuttleScreenBase
      title="Welcome"
      showPanel={false}
      busRoutes={MOCK_ROUTES}
      skipRouteFitBounds
      initialCenter={[-1.5725, 6.672]}
      initialZoom={14.1}
      overlayContent={overlayOverride ?? <SelectionPanel />}
      hideStatusBar={hideStatusBar}
      flyToCoord={flyToCoord}
      flyToZoom={flyToZoom}
      focusBusId={focusBusId}
      focusZoom={focusZoom}
      focusDelayMs={focusDelayMs}
      dropPoints={dropPoints}
      routeCoords={routeCoords}
      routeColor={routeColor}
    />
  )
}
