import { useEffect, useRef, useState } from 'react'
import { DeviceMobile, Monitor } from '@phosphor-icons/react'
import ProjectCard from './ProjectCard'
import DockNav from './DockNav'
import { projects } from '../data/projects'
import '../styles/profile.css'

type Tab = 'mobile' | 'web'

export default function Profile() {
  const [tab, setTab] = useState<Tab>('mobile')
  const cardCount = tab === 'mobile' ? 6 : 4
  const tabProjects = projects.filter((p) => p.platform === tab)
  const emptyCount = Math.max(0, cardCount - tabProjects.length)
  const [dockHidden, setDockHidden] = useState(false)
  const lastScrollY = useRef(0)
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
          Product <b>Design</b> <i>And</i> <b>Engineering</b>
        </p>
      </header>

      <div className="tab-toggle">
        <button className={tab === 'mobile' ? 'is-active' : ''} onClick={() => setTab('mobile')}>
          <DeviceMobile size={16} weight={tab === 'mobile' ? 'fill' : 'regular'} />
          Mobile Apps
        </button>
        <button className={tab === 'web' ? 'is-active' : ''} onClick={() => setTab('web')}>
          <Monitor size={16} weight={tab === 'web' ? 'fill' : 'regular'} />
          Web Apps
        </button>
      </div>

      <main className={`project-grid project-grid--${tab}`}>
        {tabProjects.map((project) => (
          <div key={project.id} className="project-card">
            <ProjectCard project={project} />
          </div>
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <div key={`empty-${i}`} className="project-card project-card--empty" />
        ))}
      </main>

      <DockNav className={dockHidden ? 'dock-nav--hidden' : ''} />
    </div>
  )
}
