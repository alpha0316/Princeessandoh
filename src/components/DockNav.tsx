import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AppStoreLogo, CodeSimple, DeviceMobile, Monitor } from '@phosphor-icons/react'
import { ImagesDuotone } from './nav-icons/ImagesDuotone'
import avatar from './nav-icons/image-1.png'

import type { NavKey, WorkTab } from './navTabs'

const WORK_ITEMS: { key: WorkTab; label: string; icon: (active: boolean) => ReactNode }[] = [
  { key: 'mobile', label: 'Apps', icon: (a) => <DeviceMobile weight={a ? 'fill' : 'regular'} /> },
  { key: 'web', label: 'Web', icon: (a) => <Monitor weight={a ? 'fill' : 'regular'} /> },
  { key: 'components', label: 'Components', icon: () => <CodeSimple weight="bold" /> },
  { key: 'store', label: 'App Store', icon: (a) => <AppStoreLogo weight={a ? 'fill' : 'regular'} /> },
]

export default function DockNav({
  active,
  onNavigate,
}: {
  active: NavKey
  onNavigate?: (key: NavKey) => void
}) {
  const groupRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Partial<Record<WorkTab, HTMLButtonElement | null>>>({})
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)

  // One pill slides between tabs (rather than each tab painting its own
  // background), so scrolling through sections reads as continuous motion.
  // Re-measured on resize because tab widths change (phones hide inactive
  // labels).
  useLayoutEffect(() => {
    const group = groupRef.current
    if (!group) return
    const measure = () => {
      const el = (WORK_ITEMS.some((i) => i.key === active) && tabRefs.current[active as WorkTab]) || null
      setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(group)
    return () => ro.disconnect()
  }, [active])

  return (
    <nav aria-label="Portfolio navigation" className="dock-nav">
      <div className="dock-nav-group" ref={groupRef}>
        <span
          className="dock-nav-pill"
          aria-hidden="true"
          style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w } : { opacity: 0 }}
        />
        {WORK_ITEMS.map(({ key, label, icon }) => {
          const isActive = key === active
          return (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[key] = el
              }}
              type="button"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`dock-nav-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate?.(key)}
            >
              <span className="dock-nav-tab-icon">{icon(isActive)}</span>
              <span className="dock-nav-tab-label">{label}</span>
            </button>
          )
        })}
      </div>

      <span className="dock-nav-divider" aria-hidden="true" />

      <button
        type="button"
        aria-label="Pictures"
        aria-current={active === 'snaps' ? 'page' : undefined}
        className={`dock-nav-item ${active === 'snaps' ? 'is-active' : ''}`}
        onClick={() => onNavigate?.('snaps')}
      >
        <span className="dock-nav-tooltip">Pictures</span>
        <ImagesDuotone className="dock-nav-icon" filled={active === 'snaps'} />
      </button>
      <button
        type="button"
        aria-label="About"
        aria-current={active === 'about' ? 'page' : undefined}
        className={`dock-nav-item ${active === 'about' ? 'is-active' : ''}`}
        onClick={() => onNavigate?.('about')}
      >
        <span className="dock-nav-tooltip">About</span>
        <img className="dock-nav-avatar" alt="" src={avatar} />
      </button>
    </nav>
  )
}
