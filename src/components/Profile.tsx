import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'
import ProjectOverlay from './ProjectOverlay'
import DockNav from './DockNav'
import { WORK_TABS, isWorkTab, type WorkTab } from './navTabs'
import GithubHeatmap from './GithubHeatmap'
import SidebarContact from './SidebarContact'
import Toolkit from './Toolkit'
import RotatingTagline from './RotatingTagline'
import { projects } from '../data/projects'
import type { Project } from '../types/project'
import '../styles/profile.css'

// Heavy, so split out of the home bundle; both start loading right after
// the first paint (see the effect below) so they're ready before the reader
// scrolls down to them.
const loadComponents = () => import('../features/components/ComponentsPage')
const loadStore = () => import('../features/store/StorePreviews')
const ComponentsGrid = lazy(() => loadComponents().then((m) => ({ default: m.ComponentsGrid })))
// App Store / Play Store preview images per app.
const StorePreviews = lazy(loadStore)

// Resolves once both lazy sections can render. Section offsets are only
// final after that (the Components grid is much taller than its loading
// placeholder), so every jump waits for it.
let lazyReady: Promise<unknown> | null = null
const whenLazyReady = () => (lazyReady ??= Promise.all([loadComponents(), loadStore()]))
// Two frames: one for Suspense to commit, one for layout.
const afterLayout = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn))

type Tab = WorkTab
const TAB_LABEL: Record<Tab, string> = {
  mobile: 'Mobile Apps',
  web: 'Web Apps',
  components: 'Components',
  store: 'App Store Previews',
}
// Placeholder slots so short grids still read as a full row.
const MIN_CARDS: Record<'mobile' | 'web', number> = { mobile: 6, web: 4 }
// A section counts as "current" once its top passes this share of the
// viewport height.
const SPY_LINE = 0.4
// Gap left above a section heading when jumping to it.
const SCROLL_OFFSET = 32

export default function Profile({
  onNavigate,
  initialTab = 'mobile',
  onTabChange,
}: {
  onNavigate?: (page: string) => void
  initialTab?: Tab
  onTabChange?: (tab: Tab) => void
}) {
  // Only the tab we arrived with matters; afterwards the scroll-spy reports
  // back through onTabChange, which would otherwise re-trigger the jump.
  const [startTab] = useState<Tab>(initialTab)
  const [active, setActive] = useState<Tab>(initialTab)
  const [openProject, setOpenProject] = useState<{ project: Project; index: number } | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const sectionRefs = useRef<Partial<Record<Tab, HTMLElement | null>>>({})

  const scrollToSection = useCallback((tab: Tab, behavior: ScrollBehavior = 'smooth') => {
    whenLazyReady().then(() =>
      afterLayout(() => {
        const el = sectionRefs.current[tab]
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
        window.scrollTo({ top: Math.max(0, top), behavior })
      }),
    )
  }, [])

  useEffect(() => {
    onTabChange?.(active)
  }, [active, onTabChange])

  // Fetch the lazy sections now; arriving from another page with a lower
  // section selected, jump straight to it once they're in.
  useEffect(() => {
    if (startTab !== 'mobile') {
      scrollToSection(startTab, 'instant')
      return
    }
    // Otherwise fetch them once the first screen has settled, so they don't
    // compete with the hero videos and images for bandwidth.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500))
    idle(() => whenLazyReady())
  }, [startTab, scrollToSection])

  // Scroll-spy: the dock highlights whichever section is under the spy line.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * SPY_LINE
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      let current: Tab = WORK_TABS[0]
      for (const tab of WORK_TABS) {
        const el = sectionRefs.current[tab]
        if (el && el.getBoundingClientRect().top <= line) current = tab
      }
      // A short last section may never reach the line; the page bottom
      // means it's the one being read.
      if (atBottom) current = WORK_TABS[WORK_TABS.length - 1]
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const renderProjects = (platform: 'mobile' | 'web') => {
    const list = projects.filter((p) => p.platform === platform)
    const empty = Math.max(0, MIN_CARDS[platform] - list.length)
    return (
      <div className={`project-grid project-grid--${platform}`}>
        {list.map((project, i) => (
          <div key={project.id} className="project-card">
            <ProjectCard
              project={project}
              // The first row of phones is what the splash reveals.
              eager={platform === 'mobile' && i < 2}
              onOpen={(index) =>
                (project.id === 'uzeka' || project.id === 'gas-app' || project.id === 'gears') && onNavigate
                  ? onNavigate(project.id)
                  : setOpenProject({ project, index })
              }
            />
          </div>
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <div key={`empty-${i}`} className="project-card project-card--empty" />
        ))}
      </div>
    )
  }

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <header className="profile-header">
          <img className="profile-avatar" src="/avatar.png" alt="Essandoh Prince Takyi" />
          <h1 className="profile-name">
            Essandoh <span className="squiggle">Prince</span> Takyi
          </h1>
          <RotatingTagline />
          <p className="profile-bio">
            <mark style={{
              color:'black'
            }}>I design and ship mobile &amp; web products</mark>, from first sketch to production code.
          </p>
          {/* On phones this part folds away behind "Show more"; on desktop the
              toggle is hidden and it always shows. */}
          <div id="profile-more" className={`profile-more ${moreOpen ? 'is-open' : ''}`}>
            <div className="profile-more-inner">
              <SidebarContact />
              <Toolkit />
            </div>
          </div>
          <button
            type="button"
            className="profile-more-toggle"
            aria-expanded={moreOpen}
            aria-controls="profile-more"
            onClick={() => setMoreOpen((o) => !o)}
          >
            {moreOpen ? 'Show less' : 'Show more'}
          </button>
        </header>
        <GithubHeatmap />
      </aside>

      <main className="works">
        {WORK_TABS.map((tab) => (
          <section
            key={tab}
            id={`work-${tab}`}
            ref={(el) => {
              sectionRefs.current[tab] = el
            }}
            className={`works-section works-section--${tab}`}
            aria-labelledby={`work-${tab}-title`}
          >
            <h2 id={`work-${tab}-title`} className="works-title">{TAB_LABEL[tab]}</h2>
            {tab === 'mobile' || tab === 'web' ? (
              renderProjects(tab)
            ) : (
              <Suspense fallback={<div className="tab-panel-loading" />}>
                <div className={`tab-section tab-section--${tab}`}>
                  {tab === 'components' ? <ComponentsGrid /> : <StorePreviews />}
                </div>
              </Suspense>
            )}
          </section>
        ))}
      </main>

      <DockNav
        active={active}
        onNavigate={(key) => {
          if (isWorkTab(key)) {
            scrollToSection(key)
          } else {
            onNavigate?.(key)
          }
        }}
      />

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
