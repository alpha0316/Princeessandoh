import type { ReactNode } from 'react'
import { CodeSimple, House } from '@phosphor-icons/react'
import frame1000003409 from './nav-icons/frame-1000003409.svg'
import frame1000003410 from './nav-icons/frame-1000003410.svg'
import { ImagesDuotone } from './nav-icons/ImagesDuotone'
import image1 from './nav-icons/image-1.png'
import { MingcutePinterestFill } from './nav-icons/MingcutePinterestFill'

type NavItem =
  | { type: 'active-icon'; label: string; icon: ReactNode; page: string }
  | { type: 'image'; label: string; src: string; href?: string; page?: string }
  | { type: 'icon'; label: string; icon: ReactNode; href?: string; page?: string }

const navItems: (NavItem & { href?: string })[] = [
  { type: 'active-icon', label: 'Home', icon: <House className="dock-nav-icon" weight="bold" />, page: 'home' },
  { type: 'icon', label: 'Components', icon: <CodeSimple className="dock-nav-icon" weight="bold" />, page: 'components' },
  { type: 'image', label: 'X', src: frame1000003409, href: 'https://x.com/pr_alphaa/status/2106354775113539896?s=20' },
  { type: 'icon', label: 'Pinterest', icon: <MingcutePinterestFill className="dock-nav-icon" />, href: 'https://pin.it/40FtwCncU' },
  { type: 'image', label: 'Behance', src: frame1000003410, href: 'https://www.behance.net/princeessandoh1' },
  { type: 'icon', label: 'Images', icon: <ImagesDuotone className="dock-nav-icon" />, page: 'snaps' },
  {
    type: 'icon',
    label: 'Profile',
    icon: <img className="dock-nav-avatar" alt="" src={image1} />,
    page: 'about',
  },
]

export default function DockNav({ className = '', activeLabel = 'Home', onNavigate }: { className?: string; activeLabel?: string; onNavigate?: (page: string) => void }) {
  const handleClick = (item: NavItem & { href?: string }) => {
    if (item.page && onNavigate) {
      onNavigate(item.page)
    } else if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <nav aria-label="Creative platform navigation" className={`dock-nav ${className}`}>
      {navItems.map((item, index) => {
        const isActive = item.label === activeLabel

        if (item.type === 'image') {
          return (
            <button key={`${item.label}-${index}`} type="button" aria-label={item.label} className={`dock-nav-item dock-nav-item--${item.label.toLowerCase()} ${isActive ? 'is-active' : ''}`}
              onClick={() => handleClick(item)}>
              <span className="dock-nav-tooltip">{item.label}</span>
              <img className="dock-nav-icon" alt="" src={item.src} />
            </button>
          )
        }

        const itemIcon = item.icon

        return (
          <button
            key={`${item.label}-${index}`}
            type="button"
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`dock-nav-item dock-nav-item--${item.label.toLowerCase()} ${isActive ? 'is-active' : ''}`}
            onClick={() => handleClick(item)}
          >
            <span className="dock-nav-tooltip">{item.label}</span>
            {item.label === 'Home' ? <House className="dock-nav-icon" weight={isActive ? 'fill' : 'regular'} /> :
             item.label === 'Images' ? <ImagesDuotone className="dock-nav-icon" filled={isActive} /> :
             itemIcon}
          </button>
        )
      })}
    </nav>
  )
}
