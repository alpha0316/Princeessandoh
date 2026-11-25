import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { CodeSimple, DeviceMobile, Monitor } from '@phosphor-icons/react'
import ProjectCard from './ProjectCard'
import ProjectOverlay from './ProjectOverlay'
import DockNav from './DockNav'
import { projects } from '../data/projects'
import type { Project } from '../types/project'
import { ImagesDuotone } from './nav-icons/ImagesDuotone'
import '../styles/profile.css'

// Heavy, so split out and fetched one tab ahead (see the prefetch effect)
// rather than with the home page.
const loadComponents = () => import('../features/components/ComponentsPage')
const loadStore = () => import('../features/store/StorePreviews')
const ComponentsGrid = lazy(() => loadComponents().then((m) => ({ default: m.ComponentsGrid })))
// Screenshots tab = App Store / Play Store preview images per app.
const StorePreviews = lazy(loadStore)

type Tab = 'mobile' | 'web' | 'components' | 'snaps'
// Top-bar order; scrolling past the end of one tab slides to the next.
const TAB_ORDER: Tab[] = ['mobile', 'web', 'components', 'snaps']
const TAB_LABEL: Record<Tab, string> = {
  mobile: 'Mobile Apps',
  web: 'Web Apps',
  components: 'Components',
  snaps: 'Screenshots',
}
const SLIDE_OUT_MS = 320
const SLIDE_IN_MS = 520
// Extra downward wheel travel needed at the very bottom before it counts
// as "keep going to the next section" rather than scroll momentum.
const OVERSCROLL_WHEEL_PX = 100
const OVERSCROLL_TOUCH_PX = 80

const nextTabOf = (t: Tab): Tab | undefined => TAB_ORDER[TAB_ORDER.indexOf(t) + 1]

export default function Profile({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [tab, setTab] = useState<Tab>('mobile')
  const isProjectTab = tab === 'mobile' || tab === 'web'
  const cardCount = tab === 'mobile' ? 6 : 4
  const tabProjects = isProjectTab ? projects.filter((p) => p.platform === tab) : []
  const emptyCount = Math.max(0, cardCount - tabProjects.length)
  const [dockHidden, setDockHidden] = useState(false)
  const [openProject, setOpenProject] = useState<{ project: Project; index: number } | null>(null)
  const lastScrollY = useRef(0)
  const [slide, setSlide] = useState<{ phase: 'out' | 'in'; dir: 1 | -1 } | null>(null)
  const tabRef = useRef(tab)
  const busyRef = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const tabBarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    tabRef.current = tab
    // Warm the next tab's code so sliding into it never lands on a
    // half-height loading placeholder.
    const next = nextTabOf(tab)
    if (next === 'components') loadComponents()
    if (next === 'snaps') loadStore()
  }, [tab])

  // Slide the current grid out, swap tabs, slide the new one in. When
  // `toTop` is set (arriving from an overscroll), the page jumps back to the
  // top of the grid while it's invisible so the new section starts fresh.
  const switchTab = useCallback((next: Tab, toTop = false) => {
    const current = tabRef.current
    if (next === current || busyRef.current) return
    busyRef.current = true
    const dir: 1 | -1 = TAB_ORDER.indexOf(next) > TAB_ORDER.indexOf(current) ? 1 : -1
    setSlide({ phase: 'out', dir })
    window.setTimeout(() => {
      setTab(next)
      setSlide({ phase: 'in', dir })
      if (toTop) {
        requestAnimationFrame(() => {
          const grid = gridRef.current
          if (!grid) return
          const barH = tabBarRef.current?.offsetHeight ?? 0
          const top = grid.getBoundingClientRect().top + window.scrollY - barH - 40
          window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
        })
      }
      window.setTimeout(() => {
        setSlide(null)
        busyRef.current = false
      }, SLIDE_IN_MS)
    }, SLIDE_OUT_MS)
  }, [])

  // Scrolling past the end of a section continues into the next one.
  useEffect(() => {
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
    let bottomSince = 0
    let lastWheel = 0
    let freshGesture = false
    let acc = 0
    // While the section slides (and briefly after), swallow wheel input so
    // trackpad momentum doesn't immediately scroll the new section away.
    let lockUntil = 0

    const nextTab = () => nextTabOf(tabRef.current)

    const onWheel = (e: WheelEvent) => {
      const now = performance.now()
      const gap = now - lastWheel
      lastWheel = now
      if (now < lockUntil) {
        e.preventDefault()
        return
      }
      if (!nextTab() || busyRef.current || e.deltaY <= 0 || !atBottom()) {
        bottomSince = atBottom() ? bottomSince || now : 0
        freshGesture = false
        acc = 0
        return
      }
      // The first event seen at the bottom is the one that got us here.
      if (!bottomSince) {
        bottomSince = now
        return
      }
      // Ignore the trackpad momentum that carried the page to the bottom:
      // only a new gesture, or one held well after landing, counts.
      if (gap > 180) freshGesture = true
      if (!freshGesture && now - bottomSince < 700) return
      acc += e.deltaY
      if (acc > OVERSCROLL_WHEEL_PX) {
        acc = 0
        freshGesture = false
        lockUntil = now + SLIDE_OUT_MS + SLIDE_IN_MS + 450
        e.preventDefault()
        switchTab(nextTab()!, true)
      }
    }

    let touchStartY = 0
    let touchFromBottom = false
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchFromBottom = atBottom()
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!touchFromBottom || !nextTab() || busyRef.current) return
      if (touchStartY - e.touches[0].clientY > OVERSCROLL_TOUCH_PX) {
        touchFromBottom = false
        switchTab(nextTab()!, true)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [switchTab])
  const dockTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastScrollY.current && currentY > 80) {
        setDockHidden(true)
      } else if (currentY < lastScrollY.current) {
        setDockHidden(false)
      }
      lastScrollY.current = currentY

      clearTimeout(dockTimer.current)
      dockTimer.current = setTimeout(() => setDockHidden(false), 1200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(dockTimer.current)
    }
  }, [])

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img className="profile-avatar" src="/avatar.png" alt="Essandoh Prince Takyi" />
        <h1 className="profile-name">
          Essandoh <span className="squiggle">Prince</span> Takyi
        </h1>
        <p className="profile-tagline">
          Product <b>Design</b> <i>&</i> <b> <span style={{
            fontFamily :'"JetBrains Mono", monospace',
          }}>Engineering</span></b>
        </p>
      </header>

      <nav ref={tabBarRef} className="tab-toggle" aria-label="Portfolio sections">
        <button type="button" aria-pressed={tab === 'mobile'} className={tab === 'mobile' ? 'is-active' : ''} onClick={() => switchTab('mobile')}>
          <DeviceMobile size={16} weight={tab === 'mobile' ? 'fill' : 'regular'} />
          Mobile Apps
        </button>
        <button type="button" aria-pressed={tab === 'web'} className={tab === 'web' ? 'is-active' : ''} onClick={() => switchTab('web')}>
          <Monitor size={16} weight={tab === 'web' ? 'fill' : 'regular'} />
          Web Apps
        </button>
        <button type="button" aria-pressed={tab === 'components'} className={tab === 'components' ? 'is-active' : ''} onClick={() => switchTab('components')}>
          <CodeSimple size={16} weight="bold" />
          Components
        </button>
        <button type="button" aria-pressed={tab === 'snaps'} className={tab === 'snaps' ? 'is-active' : ''} onClick={() => switchTab('snaps')}>
          <ImagesDuotone className="tab-toggle-icon" />
          Screenshots
        </button>
      </nav>

      <div
        ref={gridRef}
        className={`tab-panel ${slide ? `is-slide-${slide.phase}-${slide.dir === 1 ? 'next' : 'prev'}` : ''}`}
      >
        {isProjectTab ? (
          <main className={`project-grid project-grid--${tab}`}>
            {tabProjects.map((project) => (
              <div key={project.id} className="project-card">
                <ProjectCard
                  project={project}
                  onOpen={(index) =>
                    (project.id === 'uzeka' || project.id === 'gas-app' || project.id === 'gears') && onNavigate
                      ? onNavigate(project.id)
                      : setOpenProject({ project, index })
                  }
                />
              </div>
            ))}
            {Array.from({ length: emptyCount }).map((_, i) => (
              <div key={`empty-${i}`} className="project-card project-card--empty" />
            ))}
          </main>
        ) : (
          <Suspense fallback={<div className="tab-panel-loading" />}>
            <div className={`tab-section tab-section--${tab}`}>
              {tab === 'components' ? <ComponentsGrid /> : <StorePreviews />}
            </div>
          </Suspense>
        )}
      </div>

      {nextTabOf(tab) && (
        <button type="button" className="section-next-hint" onClick={() => switchTab(nextTabOf(tab)!, true)}>
          Keep scrolling for {TAB_LABEL[nextTabOf(tab)!]}
          <span aria-hidden="true">↓</span>
        </button>
      )}

      <DockNav className={dockHidden ? 'dock-nav--hidden' : ''} activeLabel="Home" onNavigate={onNavigate} />

      {openProject && (
        <ProjectOverlay
          project={openProject.project}
          initialIndex={openProject.index}
          onClose={() => setOpenProject(null)}
        />
      )}
    </div>
  )
}
