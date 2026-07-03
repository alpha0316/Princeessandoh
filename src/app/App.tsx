import { Suspense, lazy, startTransition, useState } from 'react'
import '../styles/app.css'
import avatarImg from '../assets/image 1.png'
import gasAppIcon from '../assets/navbar/gas-app.svg'
import shuttleLogoSrc from '../assets/App Logos/shuttle.svg'
import vendorProLogoSrc from '../assets/App Logos/Vendor Pro.svg'
import uzekaLogoSrc from '../assets/App Logos/Uzeka.png'
import DynamicIsland from '../components/DynamicIsland'
import Navbar from '../components/Navbar'
import VisibilityGate from '../components/VisibilityGate'

const ShuttleDetailPage = lazy(() => import('../features/shuttle/ShuttleDetailPage'))
const MessagesPage = lazy(() => import('../features/messages/MessagesPage'))
const GasAppDetailPage = lazy(() => import('../features/gas-app/GasAppDetailPage'))
const SnapsPage = lazy(() => import('../features/snaps/SnapsPage'))
const VendorProHomePreview = lazy(() => import('../features/vendor-pro/VendorProHomePreview'))
const GasSensorPreview = lazy(() => import('../features/gas-sensor/GasSensorPreview'))
const HomeShuttlePreview = lazy(() => import('../features/home/HomeShuttlePreview'))
const HomeGasPreview = lazy(() => import('../features/home/HomeGasPreview'))
const HomeUzekaPreview = lazy(() => import('../features/home/HomeUzekaPreview'))
const AboutModal = lazy(() => import('../features/about/AboutPage'))

type Page = 'home' | 'shuttle' | 'messages' | 'gas-app' | 'snaps'

type Project = {
  title: string
  subtitle: string
  preview: 'shuttle' | 'vendor-pro' | 'gas-app' | 'gas-sensor' | 'uzeka'
}

const projects: Project[] = [
  {
    title: 'Shuttle App',
    subtitle: 'Track Shuttles, Monitor Orders and Advertise',
    preview: 'shuttle',
  },
  {
    title: 'Vendor Pro',
    subtitle: 'Send Orders, Track Customer Orders, Vendor Management',
    preview: 'vendor-pro',
  },
  {
    title: 'Gas App',
    subtitle: 'Fill Gas, Monitor Consumption, Tracker Deliveries',
    preview: 'gas-app',
  },
  {
    title: 'Gas Volume Sensor',
    subtitle: 'Real Time Updates Of Your Gas Consumption',
    preview: 'gas-sensor',
  },
  {
    title: 'Uzeka',
    subtitle: 'Explore. Create. Purchas Event Tickets',
    preview: 'uzeka',
  },
]

function FullPageLoader() {
  return <div className="page page-enter page-loader">Loading portfolio section...</div>
}

function ProjectPreviewSkeleton({ web = false }: { web?: boolean }) {
  if (web) {
    return <div className="project-web-screens project-preview-placeholder project-preview-placeholder--web" />
  }

  return (
    <div className="project-screens project-preview-placeholder">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="mobile-frame" key={index}>
          <div className="mobile-screen">
            <div className="screen-placeholder" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectPreview({ preview }: { preview: Project['preview'] }) {
  const isWeb = preview === 'vendor-pro' || preview === 'gas-sensor'

  return (
    <VisibilityGate
      rootMargin="320px"
      fallback={<ProjectPreviewSkeleton web={isWeb} />}
    >
      <Suspense fallback={<ProjectPreviewSkeleton web={isWeb} />}>
        {preview === 'vendor-pro' ? (
          <div className="project-web-screens">
            <VendorProHomePreview />
          </div>
        ) : preview === 'gas-sensor' ? (
          <div className="project-web-screens">
            <GasSensorPreview />
          </div>
        ) : preview === 'uzeka' ? (
          <HomeUzekaPreview />
        ) : preview === 'gas-app' ? (
          <HomeGasPreview />
        ) : (
          <HomeShuttlePreview />
        )}
      </Suspense>
    </VisibilityGate>
  )
}

const HERO_SOCIALS = [
  {
    id: 'twitter',
    href: 'https://x.com/pr_alphaa',
    tooltip: 'Check out my Twitter',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'pinterest',
    href: 'https://pin.it/40FtwCncU',
    tooltip: 'Check out my Pinterest',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    id: 'behance',
    href: 'https://www.behance.net/princeessandoh1',
    tooltip: 'View my Behance',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
      </svg>
    ),
  },
]

function HeroSocials() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  return (
    <div className="hero-socials">
      {HERO_SOCIALS.map((link) => (
        <div key={link.id} className="hero-social-wrap">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-btn"
            onMouseEnter={() => setActiveTooltip(link.id)}
            onMouseLeave={() => setActiveTooltip(null)}
            aria-label={link.tooltip}
          >
            {link.icon}
          </a>
          {activeTooltip === link.id && (
            <div className="hero-social-tooltip">
              {link.tooltip}
              <div className="hero-social-tooltip__arrow" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [showAbout, setShowAbout] = useState(false)

  const navigate = (nextPage: Page) => {
    startTransition(() => setPage(nextPage))
  }

  if (page === 'shuttle') {
    return (
      <Suspense fallback={<FullPageLoader />}>
        <ShuttleDetailPage onBack={() => navigate('home')} onNext={() => navigate('messages')} />
      </Suspense>
    )
  }
  if (page === 'messages') {
    return (
      <Suspense fallback={<FullPageLoader />}>
        <MessagesPage onBack={() => navigate('shuttle')} />
      </Suspense>
    )
  }
  if (page === 'gas-app') {
    return (
      <Suspense fallback={<FullPageLoader />}>
        <GasAppDetailPage onBack={() => navigate('home')} />
      </Suspense>
    )
  }
  if (page === 'snaps') {
    return (
      <Suspense fallback={<FullPageLoader />}>
        <>
          <SnapsPage
            onNavigate={(id) => {
              if (id === 'explore') navigate('home')
              else if (id === 'shuttle') navigate('shuttle')
              else if (id === 'gas-app') navigate('gas-app')
              else if (id === 'snaps') navigate('snaps')
              else if (id === 'about') setShowAbout(true)
            }}
          />
          <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
        </>
      </Suspense>
    )
  }

  return (
    <div className="page home min-h-screen">
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        background: 'black', color: '#fff', textAlign: 'center',
        fontSize: 16, padding: '4px 0',
      }}>
        Portfolio under development (50% Complete)
      </div>
      <div className="mobile-notice">
        <p className="mobile-notice__title">Best on Desktop</p>
        <p className="mobile-notice__text">
          Hey there! This portfolio is best experienced on a desktop or larger screen.
          Mobile responsive is coming soon. For now, open it on your laptop or desktop for the full experience.
        </p>
      </div>
      <DynamicIsland />
      <Navbar
        activePage={page}
        onNavigate={(id) => {
          if (id === 'explore') navigate('home')
          else if (id === 'shuttle') navigate('shuttle')
          else if (id === 'gas-app') navigate('gas-app')
          else if (id === 'snaps') navigate('snaps')
          else if (id === 'about') setShowAbout(true)
        }}
      />
      <header className="hero">
        <img className="avatar" src={avatarImg} alt="Essandoh Prince Takyi" />
        <p className="name">Essandoh Prince Takyi</p>
        <p className="title"><span className="title-years">4 Years</span> into Product, Design and Engineering</p>
        <HeroSocials />
      </header>

      <section className="project-list">
        {projects.map((project) => {
          const isShuttle = project.preview === 'shuttle'
          const isGasApp = project.preview === 'gas-app'
          const isClickable = isShuttle || isGasApp
          const handleClick = isShuttle ? () => navigate('shuttle') : isGasApp ? () => navigate('gas-app') : undefined

          return (
          <article
            className={`project-card${isClickable ? ' project-card--clickable' : ''}`}
            key={project.title}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-label={isShuttle ? 'Open Shuttle App case study' : isGasApp ? 'Open Gas App case study' : undefined}
            onClick={handleClick}
            onKeyDown={isClickable ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleClick?.()
              }
            } : undefined}
          >
            <ProjectPreview preview={project.preview} />
            <div className="project-footer">
              <div className="project-meta">
                <div className="project-icon" aria-hidden="true">
                  {project.preview === 'shuttle' ? (
                    <img className="project-icon__asset" src={shuttleLogoSrc} alt="" />
                  ) : project.preview === 'vendor-pro' ? (
                    <img className="project-icon__asset" src={vendorProLogoSrc} alt="" style={{ objectFit: 'contain' }} />
                  ) : project.preview === 'uzeka' ? (
                    <img className="project-icon__asset" src={uzekaLogoSrc} alt="" />
                  ) : (
                    <img className="project-icon__asset" src={gasAppIcon} alt="" />
                  )}
                </div>
                <div className="project-meta-text">
                  <p className="project-title">{project.title}</p>
                  <p className="project-subtitle">{project.subtitle}</p>
                  {/* <p className="project-role">{project.role}</p> */}
                </div>
              </div>
              <div className="project-actions">
                <button className="icon-btn" aria-label="Open">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12C16.5 11.32 16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12C20 12.69 19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.9512 17.6683 16.4141 18.932 14.59 19.56ZM14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12C9.5 11.32 9.56 10.65 9.66 10H14.34C14.43 10.65 14.5 11.32 14.5 12C14.5 12.68 14.43 13.34 14.34 14ZM12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96ZM8 8H5.08C6.03864 6.32703 7.57466 5.06124 9.4 4.44C8.8 5.55 8.35 6.75 8 8ZM5.08 16H8C8.35 17.25 8.8 18.45 9.4 19.56C7.57827 18.9323 6.04429 17.6682 5.08 16ZM4.26 14C4.1 13.36 4 12.69 4 12C4 11.31 4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12C7.5 12.68 7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03ZM18.92 8H15.97C15.6565 6.76161 15.1931 5.56611 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8ZM12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" fill="black" />
                  </svg>
                </button>
                <button className="icon-btn" aria-label="X">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <mask id="mask0_29379_2965" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                      <path d="M0 0H20V20H0V0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_29379_2965)">
                      <path d="M15.75 0.937143H18.8171L12.1171 8.61429L20 19.0629H13.8286L8.99143 12.7271L3.46286 19.0629H0.392857L7.55857 10.8486L0 0.938572H6.32857L10.6943 6.72857L15.75 0.937143ZM14.6714 17.2229H16.3714L5.4 2.68143H3.57714L14.6714 17.2229Z" fill="black" />
                    </g>
                  </svg>
                </button>
                <button className="icon-btn" aria-label="Archive">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17C2.73478 17 2.48043 16.8946 2.29289 16.7071C2.10536 16.5196 2 16.2652 2 16C2 15.7348 2.10536 15.4804 2.29289 15.2929C2.48043 15.1053 2.73478 15 3 15H13.5C14.5 15 15.5 17 15 17H3ZM17 17C16.7348 17 16.4804 16.8946 16.2929 16.7071C16.1054 16.5196 16 16.2652 16 16C16 15.7348 16.1054 15.4804 16.2929 15.2929C16.4804 15.1053 16.7348 15 17 15H21C21.2652 15 21.5196 15.1053 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17H17ZM12.633 3.50098C12.7653 3.27104 12.9836 3.10309 13.2398 3.03407C13.496 2.96506 13.7691 3.00064 13.999 3.13298C14.2289 3.26532 14.3969 3.48359 14.4659 3.73977C14.5349 3.99594 14.4993 4.26904 14.367 4.49898L7.46 16.495C7.39454 16.6088 7.30729 16.7087 7.20324 16.7888C7.09918 16.869 6.98037 16.9278 6.85357 16.962C6.72677 16.9963 6.59447 17.0052 6.46423 16.9883C6.33399 16.9713 6.20836 16.9289 6.0945 16.8635C5.98064 16.798 5.8808 16.7108 5.80066 16.6067C5.72052 16.5027 5.66166 16.3838 5.62745 16.257C5.59323 16.1303 5.58432 15.998 5.60123 15.8677C5.61814 15.7375 5.66054 15.6118 5.726 15.498L12.633 3.50098ZM4 18.5C4.5 17.5 7.5 16.5 6.5 18.22C5.95742 19.1477 5.41308 20.0743 4.867 21C4.73466 21.2299 4.51639 21.3979 4.26022 21.4669C4.00404 21.5359 3.73094 21.5003 3.501 21.368C3.27106 21.2356 3.10311 21.0174 3.03409 20.7612C2.96508 20.505 3.00066 20.2319 3.133 20.002L4 18.5ZM9.133 4.49898C9.00066 4.26904 8.96508 3.99594 9.03409 3.73977C9.10311 3.48359 9.27106 3.26532 9.501 3.13298C9.73094 3.00064 10.004 2.96506 10.2602 3.03407C10.5164 3.10309 10.7347 3.27104 10.867 3.50098L12.61 6.52998C12.6776 6.64386 12.7219 6.77004 12.7404 6.90119C12.7588 7.03234 12.751 7.16585 12.7175 7.29396C12.6839 7.42208 12.6252 7.54225 12.5448 7.6475C12.4644 7.75275 12.3639 7.84098 12.2492 7.90708C12.1344 7.97317 12.0077 8.01581 11.8763 8.03252C11.7449 8.04922 11.6115 8.03966 11.4838 8.00439C11.3562 7.96912 11.2368 7.90885 11.1326 7.82707C11.0285 7.74528 10.9416 7.64362 10.877 7.52798L9.133 4.49898ZM13 11.5C12.102 9.99998 13 6.99998 13.716 8.49598L20.366 20C20.4942 20.2295 20.5268 20.5003 20.4568 20.7538C20.3867 21.0072 20.2197 21.2228 19.9919 21.354C19.7641 21.4852 19.4937 21.5214 19.2394 21.4548C18.9851 21.3882 18.7672 21.2241 18.633 20.998L13 11.5Z" fill="black" />
                  </svg>
                </button>
              </div>
            </div>
            {isClickable && (
              <div className="project-overlay">
                <span className="project-overlay__label">Read More &rarr;</span>
              </div>
            )}
          </article>
        )})}
      </section>
      <Suspense fallback={null}>
        <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
      </Suspense>
    </div>
  )
}

export default App
