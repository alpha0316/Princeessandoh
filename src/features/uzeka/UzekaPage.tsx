import { useEffect, useRef, useState } from 'react'
import TiltCard from '../../components/TiltCard'
import UzekaDetailsPanel, { type Chapter } from './UzekaDetailsPanel'
import { LineIcon, TicketGlyph } from './UzekaIcons'
import './uzeka.css'

// Each case-study chapter gets its own section id here — the details panel
// reads straight from this list, so adding Design/Engineering/etc. later is
// just appending an entry and giving that section the matching id.
const CHAPTERS: Chapter[] = [
  { id: 'uzeka-overview', label: 'Overview' },
  { id: 'uzeka-shape', label: 'The shape of it' },
  { id: 'uzeka-traction', label: 'Traction' },
  { id: 'uzeka-ground-conditions', label: 'Ground conditions' },
]

const asset = (path: string) => `/v2-svg/Uzeka/${path}`

const APP_ICON = asset('Other Product Logos/uzeka main logo.svg')
const PRODUCT_SHOWCASE = [
  {
    id: 'events',
    name: 'Events app',
    audience: 'Consumer · iOS & Android',
    description: 'Discovery, checkout, tickets and transfers. Where someone decides where to spend their Saturday night.',
    logo: APP_ICON,
    logoCrop: false,
    src: asset('Web App.svg'),
    alt: 'Uzeka Events app case study, showing event discovery and ticket booking',
  },
  {
    id: 'scanner',
    name: 'Scanner app',
    audience: 'Gate staff · Access control',
    description: 'Four outcomes, under a second each, often on a borrowed phone with patchy signal.',
    logo: asset('Other Product Logos/Screenshot 2026-03-02 at 5.43.39 PM 1.svg'),
    logoCrop: true,
    src: asset('Scanner.png'),
    alt: 'Uzeka Scanner app case study, showing event access and product stock controls',
  },
  {
    id: 'vendor',
    name: 'Vendor app',
    audience: 'Agents · At the gate',
    description: 'Selling tickets and products face to face, standing up, often at night, with a queue building.',
    logo: asset('Other Product Logos/Uzeka_Logo-03 1.svg'),
    logoCrop: false,
    src: asset('Vendor.png'),
    alt: 'Uzeka Vendor app case study, showing mobile product sales controls',
  },
  {
    id: 'web',
    name: 'Web platform',
    audience: 'Organisers & admin',
    description: 'Settlement, selling points, advertising and the operational view behind all three apps.',
    logo: asset('Other Product Logos/Vendor 2.svg'),
    logoCrop: false,
    src: asset('Webapp.svg'),
    alt: 'Uzeka Web platform case study, showing event organiser dashboard',
  },
]
const PRODUCT_ICONS = [
  { src: asset('Other Product Logos/Vendor 2.svg') },
  { src: asset('Other Product Logos/Uzeka_Logo-03 1.svg') },
  // This export has a tiny 19x19 icon sitting inside a 75x75 canvas (a
  // drop-shadow glyph pulled straight from a Figma screenshot) — crop
  // tight to it so it isn't a speck next to the other two full-bleed icons.
  { src: asset('Other Product Logos/Screenshot 2026-03-02 at 5.43.39 PM 1.svg'), crop: true },
]

function AnimatedNumber({ target, decimals = 0, started }: { target: number; decimals?: number; started: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!started) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    const startTime = performance.now()
    let frame = 0
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 1500, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [started, target])

  return <>{value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>
}

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
  const [activeProduct, setActiveProduct] = useState(0)
  const [showcasePaused, setShowcasePaused] = useState(false)
  const [inspectedProduct, setInspectedProduct] = useState<string | null>(null)
  const [carouselRestart, setCarouselRestart] = useState(0)
  const [tractionStarted, setTractionStarted] = useState(false)
  const [lightChapterOnScreen, setLightChapterOnScreen] = useState(false)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const pageRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const tractionRef = useRef<HTMLElement>(null)
  const groundConditionsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = [tractionRef.current, groundConditionsRef.current].filter((section): section is HTMLElement => Boolean(section))
    if (!sections.length) return
    if (!('IntersectionObserver' in window)) {
      setTractionStarted(true)
      setLightChapterOnScreen(true)
      return
    }

    const visibleSections = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target)
        else visibleSections.delete(entry.target)
      })
      const visible = visibleSections.size > 0
      setLightChapterOnScreen(visible)
      if (visibleSections.has(tractionRef.current as HTMLElement)) setTractionStarted(true)
    }, { threshold: 0.18 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (showcasePaused || reducedMotion) return
    const timeout = window.setTimeout(() => {
      setActiveProduct((current) => (current + 1) % PRODUCT_SHOWCASE.length)
      setInspectedProduct(null)
    }, 7000)
    return () => window.clearTimeout(timeout)
  }, [activeProduct, showcasePaused, reducedMotion, carouselRestart])

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
      className={`uzeka-page${lightChapterOnScreen ? ' is-traction-active' : ''}`}
      ref={pageRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
    >
      <button className="uzeka-back uzeka-glass-btn" aria-label="Back to projects" onClick={() => onNavigate?.('home')}>
        <LineIcon name="arrow-left" size={18} />
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
          {/* {canHover ? 'Move your cursor to light up the product' : 'Touch and drag to light up the product'} */}
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
                <LineIcon name="briefcase" size={20} className="uzeka-cover-meta-icon" />
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

      <section className="uzeka-chapter" id="uzeka-shape" aria-labelledby="uzeka-shape-title">
        <div className="uzeka-chapter-inner">
          <header className="uzeka-chapter-intro">
            <p className="uzeka-chapter-kicker"><span>01</span> The shape of it</p>
            <h2 id="uzeka-shape-title">Four products asking the same question</h2>
            <p className="uzeka-chapter-lede">
              Uzeka sells event tickets in Angola. By the time I joined it had grown into four separate products,
              built at different times, that no longer agreed with each other about the one thing that mattered most.
            </p>
            <p className="uzeka-chapter-secondary">
              Each surface puts a different person in a different place. Someone at home on a Thursday choosing what
              to do on Saturday. An agent at the gate with a queue in front of them. An organiser the next morning,
              working out what they actually earned.
            </p>
          </header>

          <div
            className={`uzeka-showcase${showcasePaused ? ' is-paused' : ''}`}
            onMouseEnter={() => canHover && setShowcasePaused(true)}
            onMouseLeave={() => setShowcasePaused(false)}
            onFocus={() => setShowcasePaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setShowcasePaused(false)
            }}
            aria-label="Four Uzeka products"
          >
            <div className="uzeka-showcase-content" aria-live="polite">
              {PRODUCT_SHOWCASE.map((product, index) => (
                <article className={`uzeka-product-slide${activeProduct === index ? ' is-active' : ''}`} key={product.id} aria-hidden={activeProduct !== index}>
                  <div className="uzeka-product-copy">
                    {product.logoCrop ? (
                      <span className="uzeka-product-brand uzeka-product-brand--crop" aria-hidden="true">
                        <img src={product.logo} alt="" />
                      </span>
                    ) : (
                      <img className="uzeka-product-brand" src={product.logo} alt="" />
                    )}
                    <div className="uzeka-product-copy-text">
                      <h3>{product.name}</h3>
                      <p className="uzeka-product-audience">{product.audience}</p>
                      <p className="uzeka-product-description">{product.description}</p>
                    </div>
                  </div>
                  <div className={`uzeka-product-visual uzeka-product-visual--${product.id}${inspectedProduct === product.id ? ' is-inspected' : ''}`}>
                    <img src={product.src} alt={product.alt} draggable={false} />
                    {(product.id === 'events' || product.id === 'vendor') && (
                      <button
                        className="uzeka-product-inspect"
                        type="button"
                        aria-pressed={inspectedProduct === product.id}
                        onClick={() => setInspectedProduct((current) => current === product.id ? null : product.id)}
                      >
                        {inspectedProduct === product.id ? 'Reset view' : 'Explore screen'}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <nav className="uzeka-product-controls" aria-label="Choose a Uzeka product">
              {PRODUCT_SHOWCASE.map((product, index) => (
                <button
                  key={`${product.id}-${activeProduct === index ? carouselRestart : 0}`}
                  type="button"
                  className={activeProduct === index ? 'is-active' : ''}
                  aria-pressed={activeProduct === index}
                  onClick={() => {
                    setActiveProduct(index)
                    setInspectedProduct(null)
                    setCarouselRestart((current) => current + 1)
                  }}
                >
                  <span className="uzeka-product-control-index">0{index + 1}</span>
                  <span>{product.name}</span>
                </button>
              ))}
            </nav>

          </div>
        </div>
      </section>

      <section
        className="uzeka-chapter uzeka-chapter--traction"
        id="uzeka-traction"
        aria-labelledby="uzeka-traction-title"
        ref={tractionRef}
      >
        <div className="uzeka-chapter-inner uzeka-traction-inner">
          <header className="uzeka-chapter-intro uzeka-traction-intro">
            <p className="uzeka-chapter-kicker"><span>02</span> Traction</p>
            <h2 id="uzeka-traction-title">What the platform has already done</h2>
            <p className="uzeka-chapter-lede">
              This is not a concept piece. Uzeka was live and processing real money before any of this work started —
              which set the constraint for all of it: nothing could break what was already running.
            </p>
          </header>

          <div className="uzeka-traction-total" aria-label="2.0 billion kwanzas gross volume">
            <strong><AnimatedNumber target={2} decimals={1} started={tractionStarted} /></strong>
            <span>bn Kz</span>
          </div>
          <p className="uzeka-traction-caption">
            Gross volume processed to date, across <AnimatedNumber target={56363} started={tractionStarted} /> tickets issued
          </p>

          <div className="uzeka-traction-grid">
            <article className="uzeka-traction-card uzeka-traction-card--blue">
              <span className="uzeka-traction-icon"><TicketGlyph size={16} /></span>
              <div><p>Tickets issued</p><strong><AnimatedNumber target={56363} started={tractionStarted} /></strong></div>
            </article>
            <article className="uzeka-traction-card uzeka-traction-card--green">
              <span className="uzeka-traction-icon"><LineIcon name="credit-card" size={16} /></span>
              <div><p>Last 12 months</p><strong><AnimatedNumber target={933} started={tractionStarted} /><small>M Kz</small></strong></div>
            </article>
            <article className="uzeka-traction-card uzeka-traction-card--orange">
              <span className="uzeka-traction-icon"><LineIcon name="pin" size={16} /></span>
              <div><p>Last 30 days</p><strong><AnimatedNumber target={39.6} decimals={1} started={tractionStarted} /><small>M Kz</small></strong></div>
            </article>
            <article className="uzeka-traction-card uzeka-traction-card--pink">
              <span className="uzeka-traction-icon"><LineIcon name="users" size={16} /></span>
              <div><p>New users</p><strong><AnimatedNumber target={1297} started={tractionStarted} /></strong></div>
            </article>
          </div>

          <p className="uzeka-traction-note">
            The spikes are the shape of the business. Two days — 2 September and 11 September — account for more than a
            quarter of the month’s volume between them. Event commerce arrives in bursts tied to specific nights, which
            is exactly why a settlement screen cannot assume a steady trickle, and why a notification system has to group
            hundreds of sales into one message.
          </p>
        </div>
      </section>

      <section
        className="uzeka-chapter uzeka-chapter--ground"
        id="uzeka-ground-conditions"
        aria-labelledby="uzeka-ground-title"
        ref={groundConditionsRef}
      >
        <div className="uzeka-chapter-inner uzeka-ground-inner">
          <header className="uzeka-chapter-intro uzeka-ground-intro">
            <p className="uzeka-chapter-kicker"><span>03</span> Ground conditions</p>
            <h2 id="uzeka-ground-title">Three facts about Angola that shaped everything</h2>
            <p className="uzeka-chapter-lede">
              Most ticketing products are designed where card payments are instant and cash is an edge case. In Luanda neither is true, and pretending otherwise produces a product that works in a demo and fails at a gate.
            </p>
          </header>

          <div className="uzeka-ground-layout">
            <div className="uzeka-ground-facts">
              <article className="uzeka-ground-fact">
                <span className="uzeka-ground-fact-icon is-blue"><LineIcon name="bank" size={18} /></span>
                <div><h3>Cash is normal, not an exception</h3><p>A street market or a door-sales party may take almost nothing electronically. Any model that treats cash as a rounding error will mis-state what half of the events on the platform actually earned.</p></div>
              </article>
              <article className="uzeka-ground-fact">
                <span className="uzeka-ground-fact-icon is-pink"><LineIcon name="clock" size={18} /></span>
                <div><h3>Paying is not instant</h3><p>Alongside Multicaixa Express, people pay by reference — taking a code to an ATM or banking app, sometimes an hour later, sometimes never. The gap between “order placed” and “money arrived” is the longest unmanaged stretch in the entire product.</p></div>
              </article>
              <article className="uzeka-ground-fact">
                <span className="uzeka-ground-fact-icon is-green"><LineIcon name="translate" size={18} /></span>
                <div><h3>Everything is in Portuguese</h3><p>Words run roughly 20% longer than in English. Tight line heights and narrow buttons that survive an English mockup break on contact with real copy — which is why push titles here never lead with the event name.</p></div>
              </article>
            </div>

            <div className="uzeka-ground-visual" role="img" aria-label="Luanda at dusk, representing the conditions that shaped Uzeka">
              <div className="uzeka-ground-visual-top"><span>LUANDA, ANGOLA</span><span>08°50′S 13°14′E</span></div>
              <div className="uzeka-ground-insight">
                <span className="uzeka-ground-insight-icon"><LineIcon name="credit-card" size={17} /></span>
                <p>Sales this week</p><strong>Kz 721,000</strong><span className="uzeka-ground-sparkline" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></span>
              </div>
              <div className="uzeka-ground-stock">
                <span className="uzeka-ground-stock-thumb">₳</span>
                <div><strong>Coca Cola</strong><small>Kz 1,500 · Drinks</small></div>
                <b>12</b>
              </div>
              <span className="uzeka-ground-caption">Built for the way events actually work.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
