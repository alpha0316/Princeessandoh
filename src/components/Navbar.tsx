import exploreIcon from '../assets/navbar/Explore.svg'
import gasAppIcon from '../assets/navbar/gas-app.svg'
import shuttleIcon from '../assets/navbar/Shuttle.svg'
import uzekaIcon from '../assets/navbar/uzeka.svg'
import snapsIcon from '../assets/navbar/snaps.svg'
import profileIcon from '../assets/navbar/profile.svg'
import { useEffect, useRef, useState } from 'react'
import '../styles/app.css'

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
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
  { id: 'vendor-pro',  label: 'Vendor Pro',  action: 'coming-soon' },
  { id: 'gas-app',     label: 'Gas App',     action: 'navigate',     iconSrc: gasAppIcon },
  { id: 'uzeka',       label: 'Uzeka',       action: 'coming-soon',  iconSrc: uzekaIcon },
  { id: 'snaps',       label: 'Snaps',       action: 'navigate',     iconSrc: snapsIcon },
  { id: 'x',           label: 'X / Twitter', action: 'link',         href: 'https://x.com/pr_alphaa',                   iconEl: <XIcon /> },
  { id: 'email',       label: 'Email',       action: 'link',         href: 'mailto:princeessandoh316@gmail.com',         iconEl: <MailIcon /> },
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
      if (item.href.startsWith('mailto:')) {
        window.location.href = item.href
      } else {
        window.open(item.href, '_blank', 'noopener,noreferrer')
      }
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
