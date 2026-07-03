import exploreIcon from '../assets/navbar/Explore.svg'
import gasAppIcon from '../assets/navbar/gas-app.svg'
import shuttleIcon from '../assets/navbar/Shuttle.svg'
import snapsIcon from '../assets/navbar/snaps.svg'
import profileIcon from '../assets/navbar/profile.svg'
import { useEffect, useRef, useState } from 'react'
import '../styles/app.css'

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const BehanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
  </svg>
)

const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
)

const VendorProIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)

type NavItemConfig = {
  id: string
  label: string
  action: 'navigate' | 'link' | 'coming-soon'
  href?: string
  iconSrc?: string
  iconEl?: React.ReactNode
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'explore',     label: 'Explore',     action: 'navigate',     iconSrc: exploreIcon },
  { id: 'shuttle',     label: 'Shuttle',     action: 'navigate',     iconSrc: shuttleIcon },
  { id: 'vendor-pro',  label: 'Vendor Pro',  action: 'coming-soon',  iconEl: <VendorProIcon /> },
  { id: 'gas-app',     label: 'Gas App',     action: 'navigate',     iconSrc: gasAppIcon },
  { id: 'snaps',       label: 'Snaps',       action: 'coming-soon',  iconSrc: snapsIcon },
  { id: 'x',           label: 'X / Twitter', action: 'link',         href: 'https://x.com/pr_alphaa',                   iconEl: <XIcon /> },
  { id: 'behance',    label: 'Behance',    action: 'link',         href: 'https://www.behance.net/princeessandoh1',  iconEl: <BehanceIcon /> },
  { id: 'pinterest',   label: 'Pinterest',   action: 'link',         href: 'https://pin.it/40FtwCncU',                  iconEl: <PinterestIcon /> },
  { id: 'about',       label: 'About',       action: 'navigate',     iconSrc: profileIcon },
]

type NavbarProps = {
  activePage?: string
  onNavigate?: (id: string) => void
}

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const scrollingDown = currentY > lastScrollY.current
      const nearTop = currentY < 12
      if (nearTop) setIsHidden(false)
      else if (scrollingDown) setIsHidden(true)
      else setIsHidden(false)
      lastScrollY.current = currentY
    }
    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (item: NavItemConfig) => {
    if (item.action === 'navigate') {
      onNavigate?.(item.id)
    } else if (item.action === 'link' && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <nav
      className={`nav-dock${isHidden ? ' nav-dock--hidden' : ''}`}
      aria-label="Primary"
    >
      <div className="nav-dock__inner">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id
          const isComingSoon = item.action === 'coming-soon'
          return (
            <div key={item.id} className="nav-dock__item-wrap">
              <button
                className={`nav-dock__item${isActive ? ' nav-dock__item--active' : ''}${isComingSoon ? ' nav-dock__item--soon' : ''}`}
                type="button"
                data-label={isComingSoon ? 'Coming soon' : item.label}
                aria-label={item.label}
                onClick={() => handleClick(item)}
              >
                {item.iconSrc ? (
                  <img className={`nav-dock__icon${isComingSoon ? ' nav-dock__icon--soon' : ''}`} src={item.iconSrc} alt="" />
                ) : item.iconEl ? (
                  <span className="nav-dock__icon-el">{item.iconEl}</span>
                ) : (
                  <span className="nav-dock__glyph">{item.label[0]}</span>
                )}
              </button>
              <div className={`nav-dock__dot${isActive ? ' nav-dock__dot--active' : ''}`} />
            </div>
          )
        })}
      </div>
    </nav>
  )
}
