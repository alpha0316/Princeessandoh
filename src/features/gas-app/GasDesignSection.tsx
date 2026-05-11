import { useEffect, useState } from 'react'
import gasAppNavIcon from '../../assets/navbar/gas-app.svg'
import { GasPhoneMockup } from './GasPhoneMockup'
import {
  GasAppLockScreen,
  GasAppIOSHomeScreen,
  GasAppSplashScreen,
  GasAppOnboardingScreen,
  GasAppHomeScreen,
  GasAppLocationSearchDemo,
  GasHomeFlowSimulation,
  GasCylinderSelectSimulation,
  GasAmountAutoSlide,
  GasRiderEnRouteScreen,
  GasAppRatingScreen,
} from './screens'

type IntroStep = 'lockscreen' | 'ioshome' | 'splash' | 'onboarding'
type HomeLocationStep = 'home' | 'location'

const INTRO_TIMINGS: Record<IntroStep, number> = {
  lockscreen: 5200,
  ioshome: 2600,
  splash: 2600,
  onboarding: 3600,
}

const INTRO_NEXT: Record<IntroStep, IntroStep> = {
  lockscreen: 'ioshome',
  ioshome: 'splash',
  splash: 'onboarding',
  onboarding: 'lockscreen',
}

const HOME_LOCATION_TIMINGS: Record<HomeLocationStep, number> = {
  home: 2600,
  location: 6200,
}

const HOME_LOCATION_NEXT: Record<HomeLocationStep, HomeLocationStep> = {
  home: 'location',
  location: 'home',
}

function GasIntroFrameCycler() {
  const [step, setStep] = useState<IntroStep>('lockscreen')

  useEffect(() => {
    const timer = window.setTimeout(() => setStep(INTRO_NEXT[step]), INTRO_TIMINGS[step])
    return () => window.clearTimeout(timer)
  }, [step])

  return (
    <>
      {step === 'lockscreen' && <GasAppLockScreen />}
      {step === 'ioshome' && <GasAppIOSHomeScreen />}
      {step === 'splash' && <GasAppSplashScreen />}
      {step === 'onboarding' && <GasAppOnboardingScreen />}
    </>
  )
}

function GasHomeLocationCycler() {
  const [step, setStep] = useState<HomeLocationStep>('home')

  useEffect(() => {
    const timer = window.setTimeout(() => setStep(HOME_LOCATION_NEXT[step]), HOME_LOCATION_TIMINGS[step])
    return () => window.clearTimeout(timer)
  }, [step])

  return (
    <>
      {step === 'home' && <GasAppHomeScreen />}
      {step === 'location' && <GasAppLocationSearchDemo />}
    </>
  )
}

const PAGES = [
  {
    label: 'Onboarding',
    left: <GasIntroFrameCycler />,
    right: <GasHomeLocationCycler />,
  },
  {
    label: 'Home',
    left: <GasAppHomeScreen />,
    right: <GasHomeFlowSimulation />,
  },
  {
    label: 'Order Flow',
    left: <GasCylinderSelectSimulation />,
    right: <GasAmountAutoSlide />,
  },
  {
    label: 'Delivery & Rating',
    left: <GasRiderEnRouteScreen />,
    right: <GasAppRatingScreen />,
  },
]

function usePhoneWidth() {
  const [phoneW, setPhoneW] = useState(270)
  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight
      const available = vh - 160
      const h = available * 0.9
      const w = h * (464 / 912)
      setPhoneW(Math.min(Math.max(200, Math.floor(w)), 290))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])
  return phoneW
}

export default function GasDesignSection() {
  const phoneW = usePhoneWidth()
  const phoneGap = Math.round(phoneW * 0.25)

  return (
    <div className="gads-root">

      {/* ── Static sidebar ──────────────────────────────────────────────────── */}
      <aside className="gads-sidebar">
        <div className="gads-sidebar__logo">
          <img src={gasAppNavIcon} alt="GasApp" width={20} height={20} style={{ borderRadius: 5, display: 'block' }} />
        </div>

        <h2 className="gads-sidebar__heading">User Interfaces</h2>

        <div className="gads-sidebar__body">
          <p>..Around March 2024 when I was in my second year, I had moved out of <strong>Campus</strong> so I actually realized the gravity of this problem.</p>
          <p>People had to carry in their gas cylinders to fill, and the other problems which is the trust between the <strong>delivery guys</strong> and the <strong>student</strong> is what the actual order is what do you feel for them and me myself I could imagine where I have to check my cylinder with the region wall to fuel and personally I would love to pay someone to do that there were people who used to come around to feel, but that accessibility was very hard tracking, and it was very hard with regards to Compass environment so that was when I got the idea to start this project I did per few research and I saw another time. I was only a designer so I was limited with the code. All I could do is explore design and post mostly on Twitter until I learned a bit of react native so I made by late 2024 December I had made a little love for this application the screen of what you're seeing currently at the same time I made landing and in front of my Vincent he made the back but currently on hold because I didn't see taking care of below. Is the Twitter link for most of the designs are explode</p>
        </div>

        <div className="gads-sidebar__socials">
          <a className="gads-social-icon" href="#" aria-label="X / Twitter"><XIcon /></a>
          <a className="gads-social-icon" href="#" aria-label="Behance"><BehanceIcon /></a>
          <a className="gads-social-icon" href="#" aria-label="Website"><GlobeIcon /></a>
          <a className="gads-social-icon" href="#" aria-label="Pinterest"><PinterestIcon /></a>
        </div>
      </aside>

      {/* ── Snap-scroll canvas ──────────────────────────────────────────────── */}
      <div className="gads-canvas">

        {/* Sticky header bar */}
        <div className="gads-header-bar" aria-hidden="true">
          <PhoneOutlineIcon />
          <span>Made With Figma, React Native &amp; a lot of Banana Cakes.</span>
          <WaveformIcon />
        </div>

        {/* Pages — each 100vh, snaps into place */}
        {PAGES.map((page, i) => (
          <div className="gads-page" key={i}>
            <div className="gads-page__phones" style={{ gap: `${phoneGap}px` }}>
              <GasPhoneMockup width={phoneW}>{page.left}</GasPhoneMockup>
              <GasPhoneMockup width={phoneW}>{page.right}</GasPhoneMockup>
            </div>
            <span className="gads-page__label">{page.label}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.836L2.25 2.25H8.08l4.253 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function BehanceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.65.673 1.43.673 2.33 0 .74-.14 1.38-.42 1.92-.28.54-.67.98-1.16 1.32-.49.34-1.05.59-1.69.75-.63.16-1.29.24-1.98.24H0V4.503h6.938Zm-.4 5.765c.583 0 1.06-.14 1.42-.42.36-.28.54-.72.54-1.32 0-.34-.06-.62-.18-.85-.12-.23-.29-.41-.5-.55-.21-.14-.46-.24-.74-.3-.28-.06-.58-.09-.9-.09H3.24v3.53h3.3Zm.18 6.028c.35 0 .68-.03.99-.1.31-.07.58-.19.81-.35.23-.17.41-.39.54-.68.13-.29.2-.66.2-1.1 0-.86-.24-1.48-.72-1.86-.48-.38-1.12-.57-1.92-.57H3.24v4.66h3.478Zm10.685-8.76c-.22-.48-.54-.9-.94-1.24-.4-.34-.87-.6-1.41-.77a5.76 5.76 0 0 0-1.77-.26c-.68 0-1.31.1-1.88.31-.57.21-1.05.52-1.45.92-.4.4-.71.88-.93 1.45-.22.57-.33 1.21-.33 1.93 0 .74.11 1.4.32 1.98.21.58.52 1.07.92 1.47.4.4.88.7 1.45.91.57.21 1.21.31 1.92.31.92 0 1.73-.19 2.43-.57a4.2 4.2 0 0 0 1.68-1.77l-2.1-.9c-.19.43-.46.76-.81.99-.35.23-.76.34-1.22.34-.54 0-1-.16-1.38-.49-.38-.33-.61-.82-.69-1.47h6.27c.02-.18.03-.35.03-.51 0-.72-.11-1.38-.32-1.86Zm-5.84 1.02c.05-.53.24-.96.57-1.28.33-.32.76-.48 1.3-.48.27 0 .52.05.74.15.22.1.41.24.56.42.15.18.26.38.33.6.07.22.1.45.09.59H11.56ZM20.29 7.5h-5.42v1.5h5.42V7.5Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}

function PhoneOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function WaveformIcon() {
  return (
    <svg width="24" height="14" viewBox="0 0 24 14" fill="none" style={{ opacity: 0.4 }}>
      <rect x="0" y="5" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="4" y="3" width="2" height="8" rx="1" fill="currentColor" />
      <rect x="8" y="0" width="2" height="14" rx="1" fill="currentColor" />
      <rect x="12" y="3" width="2" height="8" rx="1" fill="currentColor" />
      <rect x="16" y="1" width="2" height="12" rx="1" fill="currentColor" />
      <rect x="20" y="4" width="2" height="6" rx="1" fill="currentColor" />
    </svg>
  )
}
