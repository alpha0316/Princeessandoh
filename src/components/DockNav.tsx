import type { ReactNode } from 'react'
import frame1000003409 from './nav-icons/frame-1000003409.svg'
import frame1000003410 from './nav-icons/frame-1000003410.svg'
import { ImagesDuotone } from './nav-icons/ImagesDuotone'
import image1 from './nav-icons/image-1.png'
import { MingcutePinterestFill } from './nav-icons/MingcutePinterestFill'
import { PaintBrushDuotone } from './nav-icons/PaintBrushDuotone'

type NavItem =
  | { type: 'active-icon'; label: string; icon: ReactNode }
  | { type: 'image'; label: string; src: string }
  | { type: 'icon'; label: string; icon: ReactNode }

const navItems: NavItem[] = [
  { type: 'active-icon', label: 'Paint Brush', icon: <PaintBrushDuotone className="dock-nav-icon" /> },
  { type: 'image', label: 'X', src: frame1000003409 },
  { type: 'icon', label: 'Pinterest', icon: <MingcutePinterestFill className="dock-nav-icon" /> },
  { type: 'image', label: 'Behance', src: frame1000003410 },
  { type: 'icon', label: 'Images', icon: <ImagesDuotone className="dock-nav-icon" /> },
  {
    type: 'icon',
    label: 'Profile',
    icon: <img className="dock-nav-avatar" alt="" src={image1} />,
  },
]

export default function DockNav({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Creative platform navigation" className={`dock-nav ${className}`}>
      {navItems.map((item, index) => {
        if (item.type === 'image') {
          return (
            <button key={`${item.label}-${index}`} type="button" aria-label={item.label} className="dock-nav-item">
              <img className="dock-nav-icon" alt="" src={item.src} />
            </button>
          )
        }

        return (
          <button
            key={`${item.label}-${index}`}
            type="button"
            aria-label={item.label}
            aria-current={item.type === 'active-icon' ? 'page' : undefined}
            className={`dock-nav-item ${item.type === 'active-icon' ? 'is-active' : ''}`}
          >
            {item.icon}
          </button>
        )
      })}
    </nav>
  )
}
