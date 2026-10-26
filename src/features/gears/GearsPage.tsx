import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Briefcase,
  BookmarkSimple,
  Funnel,
  GearFine,
  MagnifyingGlass,
  MapPin,
  MapPinPlus,
  PhoneCall,
  Share,
  Star,
} from '@phosphor-icons/react'
import TiltCard from '../../components/TiltCard'
import { useTheme } from '../../context/ThemeContext'
import { BusinessCarWashIcon, BusinessCartIcon, BusinessFuelIcon, BusinessGearIcon, HeroGearIcon } from './GearsIcons'
import GearsChapterOne from './GearsChapterOne'
import './gears.css'

// Matches `.gears-hero-bg`'s `object-position: center 78%` — kept in sync by
// hand since the fog canvas redraws the same crop with `ctx.drawImage`
// rather than CSS, so the scratch reveal lines up with what's on screen.
const HERO_BG_POSITION_Y = 0.78
const FOG_BLUR_PX = 34
const SCRATCH_RADIUS = 100
// The glass/fog layer is invisible on the hero at rest — it fades in only
// as the page scrolls past this range, so the opening view stays the clear
// photo and the frosted look belongs to the section below it.
const FOG_REVEAL_START_PX = 80
const FOG_REVEAL_END_PX = 520
const WIPE_SOUND_THROTTLE_MS = 130

type WebkitWindow = typeof window & { webkitAudioContext?: typeof AudioContext }

const asset = (path: string) => `/v2-svg/Gears/${path}`

const HERO_BACKGROUND = asset('Hero Background.jpg')
const GEARS_PROGRESS_RING_CIRCUMFERENCE = 2 * Math.PI * 9
const MECHANIC_AVATAR = asset('Mechanic Avatar.png')

type Listing = {
  id: string
  name: string
  address: string
  category: string
  distance: string
  rating: string
  avatar: { type: 'image'; src: string } | { type: 'letter'; letter: string }
}

const LISTINGS: Listing[] = [
  {
    id: 'ik-ad-automobile-works',
    name: 'IK_AD Automobile WORKS',
    address: 'Asafo, Kumasi',
    category: 'General Repairs',
    distance: '1.4Km',
    rating: '4.6',
    avatar: { type: 'image', src: MECHANIC_AVATAR },
  },
  {
    id: 'mr-benjamin',
    name: 'Mr Benjamin',
    address: 'Dome, Accra.',
    category: 'General Repairs',
    distance: '1.4Km',
    rating: '4.6',
    avatar: { type: 'letter', letter: 'I' },
  },
  {
    id: 'unique-jt-auto-engineering',
    name: 'Unique JT Auto Engineering Service',
    address: 'Afienya, Mataheko off Akosombo Rd',
    category: 'General Repairs',
    distance: '1.4Km',
    rating: '4.6',
    avatar: { type: 'letter', letter: 'I' },
  },
  {
    id: 'osei-and-sons-garage',
    name: 'Osei & Sons Garage',
    address: 'Community 1, Tema',
    category: 'Engine Diagnostics',
    distance: '2.1Km',
    rating: '4.8',
    avatar: { type: 'letter', letter: 'O' },
  },
  {
    id: 'kwames-auto-clinic',
    name: "Kwame's Auto Clinic",
    address: 'Spintex Road, Accra',
    category: 'Tyres & Alignment',
    distance: '2.6Km',
    rating: '4.3',
    avatar: { type: 'letter', letter: 'K' },
  },
  {
    id: 'trust-motors',
    name: 'Trust Motors',
    address: 'Ahodwo, Kumasi',
    category: 'General Repairs',
    distance: '3.0Km',
    rating: '4.5',
    avatar: { type: 'letter', letter: 'T' },
  },
]

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="gears-card-item">
      <div className="gears-card-item-top">
        <div className="gears-card-item-header">
          {listing.avatar.type === 'image' ? (
            <img className="gears-card-avatar" src={listing.avatar.src} alt="" />
          ) : (
            <span className="gears-card-avatar gears-card-avatar--letter">{listing.avatar.letter}</span>
          )}

          <div className="gears-card-badges">
            <span className="gears-pill">
              <MapPinPlus size={12} weight="duotone" />
              {listing.distance}
            </span>
            <span className="gears-pill">
              <span className="gears-pill-rating">{listing.rating}</span>
              <Star size={12} weight="duotone" />
            </span>
            <span className="gears-pill gears-pill--open">Open</span>
          </div>
        </div>

        <div className="gears-card-item-body">
          <h3>{listing.name}</h3>
          <p className="gears-card-address">{listing.address}</p>
          <span className="gears-category-pill">
            <GearFine size={14} weight="fill" />
            {listing.category}
          </span>
        </div>
      </div>

      <div className="gears-card-item-actions">
        <div className="gears-card-actions-left">
          <button className="gears-icon-btn" type="button" aria-label="Save">
            <BookmarkSimple size={16} weight="duotone" />
          </button>
          <button className="gears-icon-btn" type="button" aria-label="Rate">
            <Star size={16} weight="duotone" />
          </button>
          <button className="gears-icon-btn" type="button" aria-label="Share">
            <Share size={16} weight="duotone" />
          </button>
        </div>
        <span className="gears-card-actions-divider" aria-hidden="true" />
        <button className="gears-icon-btn" type="button" aria-label="View on map">
          <MapPin size={16} weight="duotone" />
        </button>
        <button className="gears-call-btn" type="button">
          <PhoneCall size={16} weight="duotone" />
          Call
        </button>
      </div>
    </article>
  )
}

export default function GearsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { theme } = useTheme()
  const heroBgRef = useRef<HTMLImageElement>(null)
  const fogCanvasRef = useRef<HTMLCanvasElement>(null)
  const scratchWrapRef = useRef<HTMLDivElement>(null)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const noiseBufferRef = useRef<AudioBuffer | null>(null)
  const lastSoundTimeRef = useRef(0)
  const heroRef = useRef<HTMLElement>(null)
  const listCardRef = useRef<HTMLDivElement>(null)
  const [onLightBg, setOnLightBg] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const paintFog = useCallback(() => {
    const img = heroBgRef.current
    const canvas = fogCanvasRef.current
    if (!img || !canvas || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = img.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    if (!width || !height) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    // Replicate `.gears-hero-bg`'s object-fit: cover crop so the blurred
    // copy we draw lines up pixel-for-pixel with the sharp image beneath.
    const naturalW = img.naturalWidth
    const naturalH = img.naturalHeight
    const boxRatio = width / height
    const imgRatio = naturalW / naturalH
    let sWidth: number
    let sHeight: number
    if (imgRatio > boxRatio) {
      sHeight = naturalH
      sWidth = naturalH * boxRatio
    } else {
      sWidth = naturalW
      sHeight = naturalW / boxRatio
    }
    const sx = (naturalW - sWidth) / 2
    const sy = (naturalH - sHeight) * HERO_BG_POSITION_Y

    ctx.save()
    ctx.filter = `blur(${FOG_BLUR_PX}px) saturate(130%)`
    ctx.drawImage(img, sx, sy, sWidth, sHeight, -20, -20, width + 40, height + 40)
    ctx.restore()

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(255,255,255,0.24)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.14)')
    gradient.addColorStop(0.7, 'rgba(255,255,255,0.42)')
    gradient.addColorStop(1, 'rgba(255,255,255,0.76)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    lastPointRef.current = null
  }, [])

  useEffect(() => {
    const img = heroBgRef.current
    const wrap = scratchWrapRef.current
    if (!img || !wrap) return

    if (img.complete) paintFog()
    else img.addEventListener('load', paintFog, { once: true })

    let raf = 0
    const scheduleRepaint = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(paintFog)
    }
    const ro = new ResizeObserver(scheduleRepaint)
    ro.observe(wrap)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      img.removeEventListener('load', paintFog)
    }
  }, [paintFog])

  // The fog is fully transparent at the top of the page — it only fades in
  // as the user scrolls through the hero, so the opening view is the clear
  // photo and the frosted glass belongs to the section further down.
  useEffect(() => {
    const canvas = fogCanvasRef.current
    if (!canvas) return

    let raf = 0
    const updateOpacity = () => {
      const t = (window.scrollY - FOG_REVEAL_START_PX) / (FOG_REVEAL_END_PX - FOG_REVEAL_START_PX)
      canvas.style.opacity = String(Math.min(1, Math.max(0, t)))
    }
    updateOpacity()

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateOpacity)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // The back/refresh buttons are `position: fixed` in the same top-left and
  // top-right corners the whole page through — white glass over the dark
  // hero photo, switching to dark glass once the white chapter sections
  // below have scrolled up underneath them, the same light/dark-aware
  // treatment Uzeka's own back button uses.
  useEffect(() => {
    let raf = 0
    const update = () => {
      const hero = heroRef.current
      setOnLightBg(hero ? hero.getBoundingClientRect().bottom <= 60 : false)
    }
    update()
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Drives the top-action button's ring — the icon's green arc now tracks
  // how far through the page the reader actually is, instead of a frozen
  // ~25% arc baked into the static SVG.
  useEffect(() => {
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    update()
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Pins the listing card near the top of the viewport while the page
  // scrolls through it, releasing right after the last listing scrolls by.
  // This reproduces `position: sticky` by hand via `transform: translateY`
  // — native sticky never actually engages for this element in testing
  // (confirmed empirically: an identical plain div in the same spot sticks
  // fine, so something specific to this subtree defeats it), so instead we
  // track the card's natural (untransformed) document position and the
  // slack space after it (the hero's bottom padding), and clamp the
  // translate so the card holds at `top: 10vh` for exactly that long.
  useEffect(() => {
    const card = listCardRef.current
    const hero = heroRef.current
    if (!card || !hero) return

    let raf = 0
    let naturalTop = 0
    let stickRoom = 0

    const measure = () => {
      const prevTransform = card.style.transform
      card.style.transform = 'none'
      const cardRect = card.getBoundingClientRect()
      const heroRect = hero.getBoundingClientRect()
      naturalTop = cardRect.top + window.scrollY
      stickRoom = Math.max(0, heroRect.bottom - cardRect.bottom)
      card.style.transform = prevTransform
    }

    const update = () => {
      const topOffset = window.innerHeight * 0.1 // matches the intended `top: 10vh`
      const desired = naturalTop - window.scrollY
      const translate = desired < topOffset ? Math.min(topOffset - desired, stickRoom) : 0
      card.style.transform = translate > 0.5 ? `translateY(${translate}px)` : ''
    }

    measure()
    update()

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      update()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(card)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  const getAudioContext = useCallback(() => {
    const Ctx = window.AudioContext || (window as WebkitWindow).webkitAudioContext
    if (!Ctx) return null
    if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume().catch(() => {})
    return audioCtxRef.current
  }, [])

  const getNoiseBuffer = useCallback((ctx: AudioContext) => {
    if (!noiseBufferRef.current) {
      const length = ctx.sampleRate
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
      noiseBufferRef.current = buffer
    }
    return noiseBufferRef.current
  }, [])

  // A short, filtered noise burst standing in for a wiper squeaking across
  // glass — synthesized rather than a sample so there's no audio asset to
  // ship, with the pitch/offset randomized a little each time to avoid an
  // obviously-looping sound while scratching.
  const playWipeSound = useCallback(() => {
    const now = performance.now()
    if (now - lastSoundTimeRef.current < WIPE_SOUND_THROTTLE_MS) return
    lastSoundTimeRef.current = now

    const ctx = getAudioContext()
    if (!ctx) return

    try {
      const buffer = getNoiseBuffer(ctx)
      const offset = Math.random() * Math.max(0, buffer.duration - 0.3)

      const source = ctx.createBufferSource()
      source.buffer = buffer

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      const baseFreq = 900 + Math.random() * 900
      bandpass.frequency.setValueAtTime(baseFreq, ctx.currentTime)
      bandpass.frequency.exponentialRampToValueAtTime(Math.max(200, baseFreq * 0.55), ctx.currentTime + 0.14)
      bandpass.Q.value = 4

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16)

      source.connect(bandpass)
      bandpass.connect(gain)
      gain.connect(ctx.destination)

      source.start(ctx.currentTime, offset, 0.18)
      source.stop(ctx.currentTime + 0.2)
    } catch {
      // Web Audio unavailable or blocked — the scratch effect still works silently.
    }
  }, [getAudioContext, getNoiseBuffer])

  const scratchAt = useCallback((x: number, y: number) => {
    const canvas = fogCanvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const erase = (cx: number, cy: number) => {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, SCRATCH_RADIUS)
      grad.addColorStop(0, 'rgba(0,0,0,0.95)')
      grad.addColorStop(0.7, 'rgba(0,0,0,0.5)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, SCRATCH_RADIUS, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const last = lastPointRef.current
    if (last) {
      const dist = Math.hypot(x - last.x, y - last.y)
      const steps = Math.max(1, Math.floor(dist / 16))
      for (let i = 1; i <= steps; i++) erase(last.x + ((x - last.x) * i) / steps, last.y + ((y - last.y) * i) / steps)
    } else {
      erase(x, y)
    }
    lastPointRef.current = { x, y }
    playWipeSound()
  }, [playWipeSound])

  const handleScratchMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const wrap = scratchWrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      lastPointRef.current = null
      return
    }
    scratchAt(x, y)
  }, [scratchAt])

  const handleScratchLeave = useCallback(() => {
    lastPointRef.current = null
  }, [])

  return (
    <div className={`gears-page gears-page--${theme}${onLightBg ? ' is-on-light-bg' : ''}`}>
      <button className="gears-back gears-glass-btn" aria-label="Back to projects" onClick={() => onNavigate?.('home')}>
        <ArrowLeft size={18} weight="bold" />
      </button>
      <button
        className="gears-top-action gears-glass-btn"
        aria-label={`Back to top (${Math.round(scrollProgress * 100)}% read)`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg
          className="gears-progress-ring"
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="9" stroke="#F4F4F4" strokeOpacity="0.2" strokeWidth="2" />
          <circle
            cx="10.5"
            cy="10.5"
            r="9"
            stroke="#34C759"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={GEARS_PROGRESS_RING_CIRCUMFERENCE}
            strokeDashoffset={GEARS_PROGRESS_RING_CIRCUMFERENCE * (1 - scrollProgress)}
            transform="rotate(-90 10.5 10.5)"
          />
        </svg>
      </button>

      <section className="gears-hero" id="gears-overview" ref={heroRef}>
        <div
          className="gears-hero-scratch"
          ref={scratchWrapRef}
          onPointerMove={handleScratchMove}
          onPointerDown={handleScratchMove}
          onPointerLeave={handleScratchLeave}
        >
          <img ref={heroBgRef} className="gears-hero-fill gears-hero-bg" src={HERO_BACKGROUND} alt="" draggable={false} />
          <canvas className="gears-hero-fill gears-hero-fog" ref={fogCanvasRef} aria-hidden="true" />
        </div>
        <div className="gears-hero-glow" aria-hidden="true" />

        <div className="gears-hero-content">
          <TiltCard className="gears-icon-badge">
            <HeroGearIcon className="gears-icon-spin" />
          </TiltCard>

          <div className="gears-copy">
            <h1 className="gears-title">Gears</h1>
            <p className="gears-subtitle">Designing the money layer of an event commerce ecosystem</p>

            <div className="gears-meta">
              <span className="gears-meta-item">
                <Briefcase size={20} weight="duotone" />
                Design Engineer
              </span>
              <span className="gears-meta-dot" />
              <span className="gears-meta-item">
                <span className="gears-flag" aria-hidden="true">🇬🇭</span>
                Ghana
              </span>
              <span className="gears-meta-dot" />
              <span className="gears-meta-item">
                <span className="gears-meta-icon-stack">
                  <BusinessGearIcon />
                  <BusinessCartIcon />
                  <BusinessCarWashIcon />
                  <BusinessFuelIcon />
                </span>
                <span><b>Four</b> <span className="gears-meta-muted">connected businesses</span></span>
              </span>
            </div>
          </div>
        </div>

        <div className="gears-list-card" ref={listCardRef}>
          <div className="gears-list-card-glow-clip" aria-hidden="true">
            <div className="gears-list-card-glow" />
          </div>
          <div className="gears-list-card-content">
            <div className="gears-list-sticky-head">
              <div className="gears-list-card-head">
                <div className="gears-search">
                  <MagnifyingGlass size={24} weight="regular" />
                  <span>Search Location</span>
                </div>
                <button className="gears-filter-btn" type="button" aria-label="Filter">
                  <Funnel size={24} weight="regular" />
                  <span className="gears-filter-dot" aria-hidden="true" />
                </button>
              </div>

              <div className="gears-list-card-count">
                <p>
                  <b>{LISTINGS.length}</b> <span className="gears-count-muted">MECHANICS</span> <span className="gears-count-faint">· NEAR YOU</span>
                </p>
                <p className="gears-sort">Near You ↓</p>
              </div>
            </div>

            <div className="gears-list-card-items">
              {LISTINGS.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <GearsChapterOne />
    </div>
  )
}
