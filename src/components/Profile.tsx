import { useState } from 'react'
import { DeviceMobile, Image, Monitor, PaintBrush } from '@phosphor-icons/react'
import { PinterestIcon, XIcon } from './SocialIcons'
import '../styles/profile.css'

type Tab = 'mobile' | 'web'

export default function Profile() {
  const [tab, setTab] = useState<Tab>('mobile')
  const cardCount = tab === 'mobile' ? 6 : 4

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img className="profile-avatar" src="/avatar.png" alt="Essandoh Prince Takyi" />
        <h1 className="profile-name">
          Essandoh <span className="squiggle">Prince</span> Takyi
        </h1>
        <p className="profile-tagline">
          Product <b>Design</b> <i>And</i> Engineering
        </p>

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
      </header>

      <main className={`project-grid project-grid--${tab}`}>
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="project-card project-card--empty" />
        ))}
      </main>

      <footer className="dock">
        <button className="dock-item is-active">
          <PaintBrush size={18} weight="fill" />
        </button>
        <button className="dock-item">
          <XIcon size={15} />
        </button>
        <button className="dock-item">
          <PinterestIcon size={16} />
        </button>
        <button className="dock-item dock-item--text">Bē</button>
        <button className="dock-item">
          <Image size={17} />
        </button>
        <button className="dock-item dock-item--avatar">
          <img src="/avatar.png" alt="Profile" />
        </button>
      </footer>
    </div>
  )
}
