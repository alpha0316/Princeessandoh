import { useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import TiltCard from '../../components/TiltCard'
import UzekaDetailsPanel, { type Chapter } from './UzekaDetailsPanel'
import './uzeka.css'

// Each case-study chapter gets its own section id here — the details panel
// reads straight from this list, so adding Design/Engineering/etc. later is
// just appending an entry and giving that section the matching id.
const CHAPTERS: Chapter[] = [{ id: 'uzeka-overview', label: 'Overview' }]

const asset = (path: string) => `/v2-svg/Uzeka/${path}`

const APP_ICON = asset('Other Product Logos/uzeka main logo.svg')
const PRODUCT_ICONS = [
  { src: asset('Other Product Logos/Vendor 2.svg') },
  { src: asset('Other Product Logos/Uzeka_Logo-03 1.svg') },
  // This export has a tiny 19x19 icon sitting inside a 75x75 canvas (a
  // drop-shadow glyph pulled straight from a Figma screenshot) — crop
  // tight to it so it isn't a speck next to the other two full-bleed icons.
  { src: asset('Other Product Logos/Screenshot 2026-03-02 at 5.43.39 PM 1.svg'), crop: true },
]

function BriefcaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path opacity="0.2" d="M17.5 9.24316V15.6252C17.5 15.791 17.4342 15.9499 17.3169 16.0671C17.1997 16.1843 17.0408 16.2502 16.875 16.2502H3.125C2.95924 16.2502 2.80027 16.1843 2.68306 16.0671C2.56585 15.9499 2.5 15.791 2.5 15.6252V9.24316C4.77931 10.5617 7.36677 11.2542 10 11.2502C12.6333 11.2544 15.2208 10.562 17.5 9.24316Z" fill="white" />
      <path d="M8.125 8.75C8.125 8.58424 8.19085 8.42527 8.30806 8.30806C8.42527 8.19085 8.58424 8.125 8.75 8.125H11.25C11.4158 8.125 11.5747 8.19085 11.6919 8.30806C11.8092 8.42527 11.875 8.58424 11.875 8.75C11.875 8.91576 11.8092 9.07473 11.6919 9.19194C11.5747 9.30915 11.4158 9.375 11.25 9.375H8.75C8.58424 9.375 8.42527 9.30915 8.30806 9.19194C8.19085 9.07473 8.125 8.91576 8.125 8.75ZM18.125 5.625V15.625C18.125 15.9565 17.9933 16.2745 17.7589 16.5089C17.5245 16.7433 17.2065 16.875 16.875 16.875H3.125C2.79348 16.875 2.47554 16.7433 2.24112 16.5089C2.0067 16.2745 1.875 15.9565 1.875 15.625V5.625C1.875 5.29348 2.0067 4.97554 2.24112 4.74112C2.47554 4.5067 2.79348 4.375 3.125 4.375H6.25V3.75C6.25 3.25272 6.44754 2.77581 6.79917 2.42417C7.15081 2.07254 7.62772 1.875 8.125 1.875H11.875C12.3723 1.875 12.8492 2.07254 13.2008 2.42417C13.5525 2.77581 13.75 3.25272 13.75 3.75V4.375H16.875C17.2065 4.375 17.5245 4.5067 17.7589 4.74112C17.9933 4.97554 18.125 5.29348 18.125 5.625ZM7.5 4.375H12.5V3.75C12.5 3.58424 12.4342 3.42527 12.3169 3.30806C12.1997 3.19085 12.0408 3.125 11.875 3.125H8.125C7.95924 3.125 7.80027 3.19085 7.68306 3.30806C7.56585 3.42527 7.5 3.58424 7.5 3.75V4.375ZM3.125 5.625V8.87656C5.23471 10.0243 7.59828 10.6254 10 10.625C12.4018 10.6254 14.7655 10.024 16.875 8.87578V5.625H3.125ZM16.875 15.625V10.2836C14.7344 11.3307 12.383 11.8751 10 11.875C7.61708 11.8755 5.26557 11.3314 3.125 10.2844V15.625H16.875Z" fill="white" />
    </svg>
  )
}

function AngolaFlagIcon() {
  return (
    <svg className="uzeka-cover-meta-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 19.375C15.1875 19.375 19.375 15.1875 19.375 10H0.625C0.625 15.1875 4.8125 19.375 10 19.375Z" fill="#3E4347" />
      <path d="M10 0.625C4.8125 0.625 0.625 4.8125 0.625 10H19.375C19.375 4.8125 15.1875 0.625 10 0.625Z" fill="#ED4C5C" />
      <path d="M8.59375 7.65625L8.1875 8.90625L9.25 8.125L10.3437 8.90625L9.9375 7.65625L11 6.875H9.65625L9.25 5.59375L8.84375 6.875H7.5L8.59375 7.65625ZM15 15.1875C14.8437 14.9375 14.6562 14.75 14.4062 14.5312C14.1562 14.3125 13.8125 14.0625 13.5312 13.8125L13.0312 14.375C13 14.4062 13.0312 14.4688 13.0312 14.4688C13.5937 14.5625 13.75 14.75 13.9687 14.9375C14.2812 15.25 14.375 15.5938 14.5937 15.75C14.9687 15.9688 15.25 15.5625 15 15.1875ZM10.5625 13.0313C10.0312 13.2188 9.4375 13.2812 8.84375 13.2188C8.0625 13.125 7.34375 12.8438 6.75 12.3438L6.15625 13.0625C6.40625 13.2812 6.6875 13.4375 6.9375 13.5938L6.75 13.9688C7.0625 14.125 7.375 14.2812 7.71875 14.375L7.84375 14C8.15625 14.0938 8.46875 14.1563 8.78125 14.1875L8.75 14.5625C9.09375 14.5938 9.4375 14.5938 9.78125 14.5625L9.75 14.1562C10.0625 14.125 10.375 14.0625 10.6875 13.9688L10.8125 14.3438C10.9687 14.2813 11.125 14.25 11.3125 14.1562L11.0937 13.3125L10.5625 13.0313Z" fill="#FFE62E" />
      <path d="M13.2188 9.6875C13.0938 10.75 12.5938 11.6563 11.8438 12.3125L12.9688 13.0938C13.125 12.9375 13.25 12.8125 13.375 12.6562L13.0625 12.4062C13.2813 12.1562 13.4375 11.875 13.5938 11.625L13.9688 11.8125C14.125 11.5 14.2813 11.1875 14.375 10.8438L14 10.7188C14.0938 10.4062 14.1563 10.0938 14.1875 9.78125L14.5938 9.8125C14.625 9.46875 14.625 9.125 14.5938 8.78125L14.1875 8.8125C14.1563 8.5 14.0938 8.1875 14 7.875L14.375 7.75C14.2813 7.40625 14.1563 7.09375 13.9688 6.78125L13.5938 6.96875C13.4375 6.6875 13.2813 6.40625 13.0625 6.15625L13.375 5.90625C13.1563 5.625 12.9063 5.40625 12.625 5.15625L12.375 5.46875C12.125 5.25 11.875 5.09375 11.5938 4.9375L11.7813 4.5625C11.4688 4.40625 11.1563 4.25 10.8125 4.15625L10.6875 4.5625C10.4063 4.46875 10.0938 4.40625 9.78126 4.375L9.68751 5.3125C11.8438 5.53125 13.4375 7.5 13.2188 9.6875ZM11.6563 12.875C10.5938 12.125 9.53126 11.375 8.59376 10.5L8.65626 10.4375C9.56251 11.2813 10.6563 12.0625 11.6875 12.7813C12.2188 13.1563 12.75 13.5312 13.25 13.9062L13.4375 13.75C11.6875 12.5 7.56251 9.625 7.50001 8.59375C6.68751 10.1875 7.71876 11.125 8.37501 11.5313C10.0625 12.5 11.1875 13.125 12.9688 14.3125L13.2188 14.0313C12.7188 13.5938 12.1875 13.2188 11.6563 12.875Z" fill="#FFE62E" />
    </svg>
  )
}

// Ratio = natural width / height of each letter's SVG. Each letter's flex
// width is proportional to its own ratio (flex-basis: 0), which keeps every
// letter at the same rendered height while guaranteeing the whole word fits
// inside .uzeka-wordmark's width — nothing can ever clip off the ends.
const WORDMARK_LETTERS = [
  { id: 'U', src: asset('UZEKA/U.svg'), ratio: 246 / 184 },
  { id: 'Z', src: asset('UZEKA/Z.svg'), ratio: 238 / 184 },
  { id: 'E', src: asset('UZEKA/E.svg'), ratio: 242 / 184 },
  { id: 'K', src: asset('UZEKA/K.svg'), ratio: 241 / 184 },
  { id: 'A', src: asset('UZEKA/A.svg'), ratio: 287 / 186 },
]

type Screen = { id: string; src: string; className: string }

const EDGE_SCREENS: Screen[] = [
  { id: 'edge-onboarding', src: asset('Onboarding.svg'), className: 'uzeka-edge--onboarding' },
  { id: 'edge-vendor', src: asset('Vendor.png'), className: 'uzeka-edge--vendor' },
  { id: 'edge-event', src: asset('Event Details.svg'), className: 'uzeka-edge--event' },
  { id: 'edge-web', src: asset('Web App.svg'), className: 'uzeka-edge--web' },
]

export default function UzekaPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [canHover] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const pageRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  const updateSpot = (clientX: number, clientY: number) => {
    if (!revealRef.current) return
    const rect = revealRef.current.getBoundingClientRect()
    revealRef.current.style.setProperty('--spot-x', `${clientX - rect.left}px`)
    revealRef.current.style.setProperty('--spot-y', `${clientY - rect.top}px`)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (canHover) updateSpot(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) updateSpot(touch.clientX, touch.clientY)
  }

  return (
    <div
      className="uzeka-page"
      ref={pageRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
    >
      <button className="uzeka-back uzeka-glass-btn" aria-label="Back to projects" onClick={() => onNavigate?.('home')}>
        <ArrowLeft size={18} weight="bold" />
      </button>
      <UzekaDetailsPanel chapters={CHAPTERS} appIcon={APP_ICON} />

      <div className="uzeka-hero-screen" id="uzeka-overview">
        <div className="uzeka-edge-screens uzeka-edge-screens--flashlight" ref={revealRef} aria-hidden="true">
          {EDGE_SCREENS.map((screen) => (
            <TiltCard key={screen.id} className={`uzeka-edge-screen ${screen.className}`}>
              <img src={screen.src} alt="" draggable={false} />
            </TiltCard>
          ))}

          <div className="uzeka-wordmark uzeka-wordmark--bright" aria-hidden="true">
            {WORDMARK_LETTERS.map((letter) => (
              <TiltCard
                key={letter.id}
                className="uzeka-wordmark-letter"
                style={{ '--ratio': letter.ratio } as React.CSSProperties}
              >
                <img src={letter.src} alt="" />
              </TiltCard>
            ))}
          </div>
        </div>
        <p className="uzeka-flashlight-hint">
          {canHover ? 'Move your cursor to light up the product' : 'Touch and drag to light up the product'}
        </p>

        <div className="uzeka-cover-content">
          <TiltCard className="uzeka-cover-icon">
            <img src={APP_ICON} alt="Uzeka" />
          </TiltCard>

          <div className="uzeka-cover-copy">
            <h1 className="uzeka-cover-title">Uzeka</h1>
            <p className="uzeka-cover-subtitle">
              Designing the money layer of an event commerce ecosystem
            </p>

            <div className="uzeka-cover-meta">
              <span className="uzeka-cover-meta-item">
                <BriefcaseIcon />
                Product Design
              </span>
              <span className="uzeka-cover-meta-dot" />
              <span className="uzeka-cover-meta-item">
                <AngolaFlagIcon />
                Uzeka
              </span>
              <span className="uzeka-cover-meta-dot" />
              <span className="uzeka-cover-meta-item">
                <span className="uzeka-cover-meta-stack">
                  {PRODUCT_ICONS.map((icon, i) =>
                    icon.crop ? (
                      <span key={i} className="uzeka-cover-meta-icon uzeka-cover-meta-icon--stacked uzeka-cover-meta-icon--crop">
                        <img src={icon.src} alt="" />
                      </span>
                    ) : (
                      <img key={i} className="uzeka-cover-meta-icon uzeka-cover-meta-icon--stacked" src={icon.src} alt="" />
                    ),
                  )}
                </span>
                <span><b>Four</b> <span className="uzeka-cover-meta-muted">connected products</span></span>
              </span>
            </div>
          </div>

          <div className="uzeka-scroll-cue">
            <span>Scroll To Read More</span>
            <span className="uzeka-scroll-chevrons" aria-hidden="true">
              <i />
              <i />
            </span>
          </div>
        </div>

        <div className="uzeka-wordmark uzeka-wordmark--dim" aria-hidden="true">
          <div className="uzeka-wordmark-track">
            {/* Rendered twice back-to-back — the mobile marquee animation
                slides this strip exactly -50%, so the second copy seamlessly
                picks up where the first left off instead of jump-cutting. */}
            {[0, 1].map((copy) =>
              WORDMARK_LETTERS.map((letter) => (
                <img
                  key={`${copy}-${letter.id}`}
                  className={copy === 1 ? 'uzeka-wordmark-letter--dup' : undefined}
                  src={letter.src}
                  alt={copy === 0 ? '' : undefined}
                  aria-hidden={copy === 1 ? true : undefined}
                  style={{ '--ratio': letter.ratio } as React.CSSProperties}
                />
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
