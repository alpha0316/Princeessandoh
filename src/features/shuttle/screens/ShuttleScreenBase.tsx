import React from 'react'
import '../../../styles/app.css'
import ShuttleMap from './ShuttleMap'
import type { MockRoute } from '../../../data/mockRoutes'

type ShuttleScreenBaseProps = {
  title: string
  subtitle?: string
  actionLabel?: string
  highlight?: string
  showPanel?: boolean
  splashLabel?: string
  inputContent?: React.ReactNode
  panelClassName?: string
  topToast?: React.ReactNode
  overlayContent?: React.ReactNode
  hideStatusBar?: boolean
  routeCoords?: [number, number][]
  routeColor?: string
  focusOnBus?: boolean
  focusBusId?: string
  focusZoom?: number
  visibleBusIds?: string[]
  skipRouteFitBounds?: boolean
  initialCenter?: [number, number]
  initialZoom?: number
  zoomOutOnReveal?: boolean
  focusDelayMs?: number
  busRoutes?: MockRoute[]
  flyToCoord?: [number, number]
  flyToZoom?: number
  flyToOffset?: [number, number]
  dropPoints?: [number, number][]
}

export default function ShuttleScreenBase({
  title,
  subtitle,
  actionLabel,
  highlight,
  showPanel = true,
  splashLabel,
  inputContent,
  panelClassName,
  topToast,
  overlayContent,
  hideStatusBar = false,
  routeCoords,
  routeColor,
  focusOnBus,
  focusBusId,
  focusZoom,
  visibleBusIds,
  skipRouteFitBounds,
  initialCenter,
  initialZoom,
  zoomOutOnReveal,
  focusDelayMs,
  busRoutes,
  flyToCoord,
  flyToZoom,
  flyToOffset,
  dropPoints,
}: ShuttleScreenBaseProps) {
  return (
    <div className={`shuttle-screen${hideStatusBar ? ' shuttle-screen--flat' : ''}`}>
      <ShuttleMap
        routeCoords={routeCoords}
        routeColor={routeColor}
        focusOnBus={focusOnBus}
        focusBusId={focusBusId}
        focusZoom={focusZoom}
        visibleBusIds={visibleBusIds}
        skipRouteFitBounds={skipRouteFitBounds}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        zoomOutOnReveal={zoomOutOnReveal}
        focusDelayMs={focusDelayMs}
        busRoutes={busRoutes}
        flyToCoord={flyToCoord}
        flyToZoom={flyToZoom}
        flyToOffset={flyToOffset}
        dropPoints={dropPoints}
      />
      {topToast && <div className="shuttle-toast">{topToast}</div>}
      {!hideStatusBar && <div className="status-bar">
        <span className='text-[19px] '>9:41</span>
        <div className="status-icons">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 18 12" fill="none">
            <path d="M10 3C10 2.44772 10.4477 2 11 2H12C12.5523 2 13 2.44772 13 3V11C13 11.5523 12.5523 12 12 12H11C10.4477 12 10 11.5523 10 11V3Z" fill="black" />
            <path d="M15 1C15 0.447715 15.4477 0 16 0H17C17.5523 0 18 0.447715 18 1V11C18 11.5523 17.5523 12 17 12H16C15.4477 12 15 11.5523 15 11V1Z" fill="black" />
            <path d="M5 6.5C5 5.94772 5.44772 5.5 6 5.5H7C7.55228 5.5 8 5.94772 8 6.5V11C8 11.5523 7.55228 12 7 12H6C5.44772 12 5 11.5523 5 11V6.5Z" fill="black" />
            <path d="M0 9C0 8.44772 0.447715 8 1 8H2C2.55228 8 3 8.44772 3 9V11C3 11.5523 2.55228 12 2 12H1C0.447715 12 0 11.5523 0 11V9Z" fill="black" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="12" viewBox="0 0 17 12" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.11524 8.91875C7.53496 7.69319 9.61439 7.69332 11.0342 8.91875C11.1056 8.98468 11.1475 9.07827 11.1494 9.17656C11.1514 9.2748 11.1136 9.36943 11.0449 9.43828L8.82129 11.7283C8.75619 11.7956 8.66781 11.8337 8.5752 11.8338C8.48249 11.8338 8.3933 11.7956 8.32813 11.7283L6.1045 9.43828C6.03589 9.3694 5.998 9.27476 6 9.17656C6.00204 9.07827 6.04375 8.98463 6.11524 8.91875ZM3.10938 6.17851C6.16846 3.27392 10.9058 3.27392 13.9648 6.17851C14.0339 6.24662 14.0732 6.34029 14.0742 6.43828C14.0751 6.53616 14.0373 6.63055 13.9697 6.7L12.6846 8.02519C12.5521 8.16047 12.338 8.16378 12.2022 8.03203C11.1977 7.10361 9.89123 6.58961 8.53614 6.58964C7.18182 6.59022 5.87597 7.10412 4.87208 8.03203C4.7362 8.16378 4.52209 8.16054 4.38965 8.02519L3.1045 6.7C3.03674 6.63064 2.99918 6.53621 3.00001 6.43828C3.00091 6.34031 3.04039 6.24661 3.10938 6.17851ZM0.107427 3.44218C4.79928 -1.14743 12.2007 -1.14736 16.8926 3.44218C16.9605 3.51037 16.9994 3.60373 17 3.70097C17.0005 3.79806 16.9625 3.89184 16.8955 3.96074L15.6094 5.28593C15.4769 5.42191 15.2616 5.42362 15.127 5.28984C13.3393 3.55507 10.9666 2.5878 8.5 2.58769C6.03337 2.58781 3.66078 3.55507 1.87305 5.28984C1.73851 5.42373 1.52304 5.42208 1.39063 5.28593L0.103521 3.96074C0.0365511 3.89181 -0.000494197 3.79803 4.97989e-06 3.70097C0.0006317 3.60373 0.0394613 3.51032 0.107427 3.44218Z" fill="black" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="13" viewBox="0 0 28 13" fill="none">
            <path opacity="0.35" d="M4 0.527344H21C22.9178 0.527344 24.4727 2.08222 24.4727 4V9C24.4727 10.9178 22.9178 12.4727 21 12.4727H4C2.08222 12.4727 0.527344 10.9178 0.527344 9V4C0.527344 2.08222 2.08222 0.527344 4 0.527344Z" stroke="black" stroke-width="1.05509" />
            <path opacity="0.4" d="M26 5V9.22034C26.8491 8.86291 27.4012 8.0314 27.4012 7.11017C27.4012 6.18894 26.8491 5.35744 26 5Z" fill="black" />
            <path d="M2 4C2 2.89543 2.89543 2 4 2H21C22.1046 2 23 2.89543 23 4V9C23 10.1046 22.1046 11 21 11H4C2.89543 11 2 10.1046 2 9V4Z" fill="black" />
          </svg>
        </div>
      </div>}
      {splashLabel && (
        <div className="shuttle-splash">
          <div className="shuttle-splash-badge">Shuttle</div>
          <div className="shuttle-splash-title">{splashLabel}</div>
        </div>
      )}
      {showPanel && (
        <div className={`shuttle-panel${panelClassName ? ` ${panelClassName}` : ''}`}>
          <div className="shuttle-panel-header">
            <p className="shuttle-title">
              {title} {highlight && <span className="shuttle-highlight">{highlight}</span>}
            </p>
            <span className="shuttle-chevron" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 16 10" fill="none">
                <path d="M2 2L8 8L14 2" stroke="#111111" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          {inputContent ? (
            inputContent
          ) : (
            <>
              {subtitle && <p className="shuttle-subtitle">{subtitle}</p>}
              <div className="shuttle-input">
                <span className="shuttle-dot" />
                <span className="shuttle-placeholder">select pickup stop</span>
                <span className="shuttle-close">×</span>
              </div>
            </>
          )}
          <div className="shuttle-list">
            <div className="shuttle-list-item">
              <span className="shuttle-list-icon" />
              <div className="shuttle-list-text">
                <p>Medical Village</p>
                <span>Campus</span>
              </div>
            </div>
            <div className="shuttle-list-item">
              <span className="shuttle-list-icon" />
              <div className="shuttle-list-text">
                <p>KSB</p>
                <span>Campus</span>
              </div>
            </div>
            <div className="shuttle-list-item">
              <span className="shuttle-list-icon" />
              <div className="shuttle-list-text">
                <p>Conti Bus Stop</p>
                <span>Campus</span>
              </div>
            </div>
            <div className="shuttle-list-item">
              <span className="shuttle-list-icon" />
              <div className="shuttle-list-text">
                <p>Brunei</p>
                <span>Complex, Katanga</span>
              </div>
            </div>
          </div>
          {actionLabel && <button className="shuttle-action">{actionLabel}</button>}
        </div>
      )}
      {overlayContent}
    </div>
  )
}
