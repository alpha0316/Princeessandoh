import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './gas-app-detail.css'
import gasAppNavIcon from '../../assets/navbar/gas-app.svg'
import { GasPhoneMockup } from './GasPhoneMockup'
import CaseStudyNavbar from '../../components/CaseStudyNavbar'
import GasDesignSection from './GasDesignSection'
import GasEngineeringSection from './GasEngineeringSection'
import ShuttleMap from '../shuttle/screens/ShuttleMap'
import { GasRiderMarker, GasStationMarker } from './components/GasMapMarkers'
import {
  GasAppLockScreen,
  GasAppAmountScreen,
  GasAppSelectCylinderScreen,
  GasHomeFlowSimulation,
  GasAppTrackingScreen,
} from './screens'

type Tab = 'product' | 'design' | 'engineering'
type TabDir = 'forward' | 'backward'

const TAB_ORDER: Tab[] = ['product', 'design', 'engineering']

const SCROLL_SECTIONS = [
  {
    text: 'The platform begins with a clear overview of available options, allowing users to quickly understand different refill categories.',
    suffix: '⚡ ✅ 🪣',
  },
  {
    text: 'Users choose their LPG cylinder size and proceed through a structured selection process, supported by visual cues and minimal steps.',
    suffix: '🛢️',
  },
  {
    text: 'The system also introduces a flexible cost interaction model, where users can adjust quantities dynamically and instantly see pricing updates.',
    suffix: '💡',
  },
]

const DELIVERY_SECTIONS = [
  {
    title: 'Pickup in Progress',
    text: 'Rider is on the way to collect your gas cylinder and proceed to the filling station.',
  },
  {
    title: 'Live Tracking',
    text: 'Monitor the entire process in real-time on the map.',
  },
  {
    title: 'Refill Completed',
    text: 'Your cylinder has been filled and is on its way back to you.',
  },
]

const ALL_SECTIONS = [...SCROLL_SECTIONS, ...DELIVERY_SECTIONS]

const CARD_W = 460
const CARD_H = 580
const DELIVERY_FRAME_W = 542
const DELIVERY_FRAME_H = 538
const PHONE_DESIGN_W = 390
const PHONE_DESIGN_H = 844
const PHONE_IN_RECT_W = 285
const PRODUCT_RECT_W = 542
const PRODUCT_RECT_H = 538

const FALLBACK_USER_POINT: [number, number] = [-1.5719, 6.6735]
const FILLING_STATION_POINT: [number, number] = [-1.5679, 6.6752]

const PICKUP_TO_STATION_STEPS = [
  {
    icon: 'scooter' as const,
    title: 'Rider is on the way to collect your cylinder',
    subtitle: 'En route to your location',
    subtitleTone: 'muted' as const,
    progress: 0.6,
    iconStyle: 'solid' as const,
  },
  {
    icon: 'pump' as const,
    title: 'Cylinder picked, heading to filling station',
    subtitle: 'On the way',
    subtitleTone: 'pill' as const,
    progress: 0.28,
    iconStyle: 'ghost' as const,
  },
  {
    icon: 'check' as const,
    title: 'Filling Process',
    subtitle: 'Pending',
    subtitleTone: 'muted' as const,
    iconStyle: 'ghost' as const,
  },
]

const RETURN_TO_USER_STEPS = [
  {
    icon: 'scooter' as const,
    title: 'Rider has completed filling your gas',
    subtitle: 'Completed',
    subtitleTone: 'success' as const,
    progress: 1,
    iconStyle: 'solid' as const,
  },
  {
    icon: 'pump' as const,
    title: 'Filling Process',
    subtitle: 'Completed',
    subtitleTone: 'pill' as const,
    iconStyle: 'solid' as const,
  },
  {
    icon: 'check' as const,
    title: 'Rider is returning to your location',
    subtitle: 'ETA 5 minutes',
    subtitleTone: 'muted' as const,
    progress: 0.52,
    iconStyle: 'ghost' as const,
  },
]

function GasCardWindow({ children }: { children: ReactNode }) {
  const scale = CARD_W / PHONE_DESIGN_W

  return (
    <div style={{
      width: DELIVERY_FRAME_W,
      height: DELIVERY_FRAME_H,
      borderRadius: 28,
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
      background: '#F7F7F3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <div style={{
        width: PHONE_DESIGN_W,
        height: 844,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
        borderRadius: 34,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}

function GasTallPhoneStage({
  children,
  topInset = 76,
  phoneHeight = PHONE_DESIGN_H,
}: {
  children: ReactNode
  topInset?: number
  phoneHeight?: number
}) {
  return (
    <div style={{
      width: DELIVERY_FRAME_W,
      height: DELIVERY_FRAME_H,
      borderRadius: 28,
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
      background: '#F7F7F3',
      position: 'relative',
      flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute',
        top: topInset,
        left: '50%',
        width: PHONE_DESIGN_W,
        height: phoneHeight,
        transform: 'translateX(-50%)',
        borderRadius: 34,
        overflow: 'hidden',
        background: '#FFFFFF',
      }}>
        {children}
      </div>
    </div>
  )
}

function createCurvedRoute(
  start: [number, number],
  end: [number, number],
  arcLift = 0.0018,
  steps = 22,
) {
  const [startLng, startLat] = start
  const [endLng, endLat] = end
  const control: [number, number] = [
    (startLng + endLng) / 2 - 0.0009,
    (startLat + endLat) / 2 + arcLift,
  ]

  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps
    const inv = 1 - t
    const lng = inv * inv * startLng + 2 * inv * t * control[0] + t * t * endLng
    const lat = inv * inv * startLat + 2 * inv * t * control[1] + t * t * endLat
    return [lng, lat] as [number, number]
  })
}

function createRoadRouteToUser(userPoint: [number, number]) {
  const [userLng, userLat] = userPoint
  const waypoints: [number, number][] = [
    FILLING_STATION_POINT,
    [-1.5718, 6.6751],
    [-1.5736, 6.6750],
    [-1.5750, 6.6747],
    [-1.5758, 6.6740],
    [-1.5759, 6.6732],
    [-1.5752, 6.6727],
    [-1.5742, 6.6725],
    [-1.5732, 6.6726],
    [-1.5724, 6.6729],
    [userLng, userLat],
  ]

  const path: [number, number][] = []
  waypoints.forEach((point, index) => {
    if (index === 0) {
      path.push(point)
      return
    }
    const prev = waypoints[index - 1]
    const steps = index === waypoints.length - 1 ? 28 : 16
    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps
      path.push([
        prev[0] + (point[0] - prev[0]) * t,
        prev[1] + (point[1] - prev[1]) * t,
      ])
    }
  })
  return path
}

function GasPickupToStationScreen() {
  return (
    <GasAppTrackingScreen
      steps={PICKUP_TO_STATION_STEPS}
      headerSubtitle="Rider has started the trip to your location and will proceed to the station"
    />
  )
}

function GasReturnToUserScreen() {
  return (
    <GasAppTrackingScreen
      steps={RETURN_TO_USER_STEPS}
      headerSubtitle="The refill is done and your rider is returning with the cylinder"
    />
  )
}

function GasRouteMapCard() {
  const [userPoint, setUserPoint] = useState<[number, number]>(FALLBACK_USER_POINT)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPoint([position.coords.longitude, position.coords.latitude])
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 },
    )
  }, [])

  const routePath = useMemo(
    () => createRoadRouteToUser(userPoint),
    [userPoint],
  )

  return (
    <div style={{
      width: DELIVERY_FRAME_W,
      height: DELIVERY_FRAME_H,
      borderRadius: 28,
      overflow: 'hidden',
      position: 'relative',
      background: '#EDF0EC',
      boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
      flexShrink: 0,
    }}>
      <ShuttleMap
        showStopMarkers={false}
        initialCenter={FILLING_STATION_POINT}
        initialZoom={14.5}
        routeCoords={routePath}
        routeColor="#3F8CFF"
        dropPoints={[userPoint, FILLING_STATION_POINT]}
        dropPointIcons={[null, <GasStationMarker />]}
        riderPath={routePath}
        riderIcon={<GasRiderMarker />}
        riderDurationMs={14000}
        followRider
        riderFollowZoom={16.7}
        riderFollowPitch={52}
        riderFollowBearing
        busRoutes={[]}
      />
    </div>
  )
}

function GasProductContent() {
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const introRef = useRef<HTMLElement>(null)
  const [heroExited, setHeroExited] = useState(false)

  // Scroll section observers
  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!els.length) return
    const observers = els.map((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(i) },
        { threshold: 0.5 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Detect when the hero section fully exits the viewport
  useEffect(() => {
    const el = introRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { setHeroExited(!entry.isIntersecting) },
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isTealPhase = activeIdx >= 3
  const deliverySlideIdx = isTealPhase ? activeIdx - 3 : 0

  return (
    <div className="gadp-product">
      {/* ── Hero section ─────────────────────────────────────────────────────── */}
      <section className="gadp-intro" ref={introRef}>
        <div className="gadp-intro__left">
          <div className="gadp-intro__chip">🚲 Delivery Starts At 2pm</div>
          <h1 className="gadp-intro__headline">
            Your Hassle-Free Solution for<br />
            <span className="gadp-intro__headline-muted">convenient LPG 🛢️ refills 🚀</span>
          </h1>
          <p className="gadp-intro__body">
            This system transforms a manual and unpredictable process into a
            coordinated workflow built around orders, assignments, and delivery
            execution.
          </p>
          <div className="gadp-intro__partners">
            <div className="gadp-partner-chip">
              <span className="gadp-partner-chip__circle gadp-partner-chip__circle--goil" />
              <div>
                <div className="gadp-partner-chip__name">GOIL</div>
                <div className="gadp-partner-chip__sub">Good energy</div>
              </div>
            </div>
            <div className="gadp-partner-chip">
              <span className="gadp-partner-chip__circle gadp-partner-chip__circle--shell" />
              <div className="gadp-partner-chip__name">Shell</div>
            </div>
            <div className="gadp-partner-chip">
              <span className="gadp-partner-chip__circle gadp-partner-chip__circle--shell" />
              <div className="gadp-partner-chip__name">Shell</div>
            </div>
          </div>
        </div>
        {/* Right column is an empty spacer — the shared phone renders here via gadp-phone-track */}
        <div className="gadp-intro__phone" aria-hidden="true" />
      </section>

      {/* ── Hero phone — fades out as soon as hero section exits viewport ────── */}
      <div className="gadp-phone-track" aria-hidden="true">
        <div
          className="gadp-phone-track__inner"
          style={{ opacity: heroExited ? 0 : 1, transition: 'opacity 400ms ease' }}
        >
          <GasPhoneMockup width={360}>
            <GasAppLockScreen />
          </GasPhoneMockup>
        </div>
      </div>

      {/* ── Blue / teal scroll section ────────────────────────────────────────── */}
      <div className="gadp-scroll" style={{ background: isTealPhase ? '#2CC8B4' : '#2563EB' }}>
        <div className="gadp-scroll__sticky">
          {/* Left: text entries */}
          <div className="gadp-scroll__panel">
            <div
              className="gadp-scroll__text"
              style={{
                opacity: isTealPhase ? 0 : 1,
                visibility: isTealPhase ? 'hidden' : 'visible',
                transition: 'opacity 400ms ease',
              }}
            >
              {SCROLL_SECTIONS.map((s, i) => (
                <div
                  key={i}
                  className={`gadp-blue__entry${activeIdx === i ? ' gadp-blue__entry--active' : ''}`}
                >
                  <p>
                    {s.text}
                    {' '}
                    <span className="gadp-blue__suffix">{s.suffix}</span>
                  </p>
                </div>
              ))}
            </div>

            <div
              className="gadp-scroll__text gadp-scroll__text--overlay"
              style={{ opacity: isTealPhase ? 1 : 0, transition: 'opacity 400ms ease' }}
            >
              {DELIVERY_SECTIONS.map((s, i) => (
                <div
                  key={i}
                  className={`gadp-teal__entry${activeIdx === i + 3 ? ' gadp-teal__entry--active' : ''}`}
                >
                  <h3 className="gadp-teal__entry-title">{s.title}</h3>
                  <p className="gadp-teal__entry-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: content changes per scroll section */}
          <div className="gadp-scroll__visual-col">
            <div className="gadp-product__visual-stage">
              {/* Section 0: GasPhoneMockup with frame, warm-gray rect */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: PRODUCT_RECT_W, height: PRODUCT_RECT_H, borderRadius: 32, overflow: 'hidden',
                background: '#F6F6F4', boxShadow: '0 20px 56px rgba(0,0,0,0.12)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                opacity: !isTealPhase && heroExited && activeIdx === 0 ? 1 : 0,
                transition: 'opacity 350ms ease',
              }}>
                <GasPhoneMockup width={PHONE_IN_RECT_W}>
                  <GasHomeFlowSimulation />
                </GasPhoneMockup>
              </div>

              {/* Section 1: cylinder — phone with bezel, auto-scrolls to reveal cylinders */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: !isTealPhase && heroExited && activeIdx === 1 ? 1 : 0,
                transition: 'opacity 350ms ease',
                pointerEvents: !isTealPhase && heroExited && activeIdx === 1 ? 'auto' : 'none',
              }}>
                <GasPhoneMockup width={315}>
                  <GasAppSelectCylinderScreen
                    offerName="Emergency Offer"
                    offerPrice={12}
                    simulateSelectId="1"
                    autoScroll
                  />
                </GasPhoneMockup>
              </div>

              {/* Section 2: amount — interactive embedded card inside the shared container */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: PRODUCT_RECT_W, height: PRODUCT_RECT_H, borderRadius: 32, overflow: 'hidden',
                background: '#FFFFFF', boxShadow: '0 20px 56px rgba(0,0,0,0.12)',
                opacity: !isTealPhase && heroExited && activeIdx === 2 ? 1 : 0,
                transition: 'opacity 350ms ease',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                }}>
                  <GasAppAmountScreen autoSlide embedded />
                </div>
              </div>

              {/* Teal delivery cards */}
              <div
                className="gadp-product__card-panel"
                style={{
                  opacity: isTealPhase ? 1 : 0,
                  pointerEvents: isTealPhase ? 'auto' : 'none',
                  transition: 'opacity 400ms ease',
                }}
              >
                <div
                  className="gadp-product__card-track"
                  style={{ transform: `translateX(-${deliverySlideIdx * DELIVERY_FRAME_W}px)` }}
                >
                  <div className={`gadp-product__card-slide${deliverySlideIdx === 0 ? ' gadp-product__card-slide--active' : deliverySlideIdx > 0 ? ' gadp-product__card-slide--prev' : ''}`}>
                    <GasTallPhoneStage><GasPickupToStationScreen /></GasTallPhoneStage>
                  </div>
                  <div className={`gadp-product__card-slide${deliverySlideIdx === 1 ? ' gadp-product__card-slide--active' : deliverySlideIdx > 1 ? ' gadp-product__card-slide--prev' : ' gadp-product__card-slide--next'}`}>
                    <GasRouteMapCard />
                  </div>
                  <div className={`gadp-product__card-slide${deliverySlideIdx === 2 ? ' gadp-product__card-slide--active' : ' gadp-product__card-slide--next'}`}>
                    <GasTallPhoneStage topInset={74} phoneHeight={760}>
                      <GasReturnToUserScreen />
                    </GasTallPhoneStage>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll triggers */}
        <div className="gadp-scroll__track" aria-hidden="true">
          {ALL_SECTIONS.map((_, i) => (
            <div
              key={i}
              ref={el => { sectionRefs.current[i] = el }}
              className="gadp-scroll__trigger"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type GasAppDetailPageProps = {
  onBack?: () => void
  onNext?: () => void
}

export default function GasAppDetailPage({ onBack, onNext }: GasAppDetailPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('product')
  const [tabKey, setTabKey] = useState(0)
  const [tabDir, setTabDir] = useState<TabDir>('forward')

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const dir = TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(activeTab) ? 'forward' : 'backward'
    setTabDir(dir)
    setTabKey(k => k + 1)
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  return (
    <div className="gadp-page">
      <div key={tabKey} className={`gadp-tab-anim gadp-tab-anim--${tabDir}`}>
        {activeTab === 'product' && <GasProductContent />}
        {activeTab === 'design' && <GasDesignSection />}
        {activeTab === 'engineering' && <GasEngineeringSection />}
      </div>
      <CaseStudyNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBack={onBack ?? (() => {})}
        onNext={onNext}
        productIcon={() => (
          <img src={gasAppNavIcon} alt="" width={22} height={22} style={{ borderRadius: 6, display: 'block' }} />
        )}
        tabLabels={{ design: 'Experience' }}
      />
    </div>
  )
}
