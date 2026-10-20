import { useState } from 'react'
import { ArrowLeft, Bicycle, PencilSimple, FigmaLogo, CodeSimple, Plus, SpeakerSimpleHigh } from '@phosphor-icons/react'
import TiltCard from '../../components/TiltCard'
import './gasapp.css'

const asset = (path: string) => `/v2-svg/Gas App/${path}`

const APP_LOGO = asset('Gas App Logo.png')
const HERO_SCREEN = asset('Process.svg')

const TABS = [
  { id: 'product', label: 'Product', icon: PencilSimple },
  { id: 'experience', label: 'Experience', icon: FigmaLogo },
  { id: 'engineering', label: 'Engineering', icon: CodeSimple },
] as const

type TabId = (typeof TABS)[number]['id']

export default function GasAppPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('product')

  return (
    <div className="gasapp-page">
      <button className="gasapp-back gasapp-glass-btn" aria-label="Back to projects" onClick={() => onNavigate?.('home')}>
        <ArrowLeft size={18} weight="bold" />
      </button>

      <div className="gasapp-topnav" aria-hidden="true">
        <img className="gasapp-topnav-logo" src={APP_LOGO} alt="" />
        <span className="gasapp-topnav-divider" />
        <SpeakerSimpleHigh size={16} weight="fill" />
      </div>

      <div className="gasapp-hero">
        <div className="gasapp-copy">
          <span className="gasapp-badge">
            <Bicycle size={16} weight="bold" />
            Delivery Starts At 2pm
          </span>

          <h1 className="gasapp-title">
            Your Hassle-Free Solution for
            <br />
            <span className="gasapp-title-muted">convenient LPG refills</span> 🚀
          </h1>

          <p className="gasapp-subtitle">
            This system transforms a manual and unpredictable process into a coordinated workflow
            built around orders, assignments, and delivery execution.
          </p>

          <div className="gasapp-meta">
            <span className="gasapp-meta-item">Product Design</span>
            <span className="gasapp-meta-dot" />
            <span className="gasapp-meta-item">Ghana</span>
            <span className="gasapp-meta-dot" />
            <span className="gasapp-meta-item">LPG Delivery</span>
          </div>
        </div>

        <div className="gasapp-phone-wrap">
          <div className="gasapp-phone-shadow" aria-hidden="true" />
          <TiltCard className="gasapp-phone">
            <img src={HERO_SCREEN} alt="GasApp refill screen" draggable={false} />
          </TiltCard>
        </div>
      </div>

      <nav className="gasapp-tabbar" aria-label="Case study sections">
        <button className="gasapp-tabbar-icon" type="button" aria-label="Mute narration">
          <SpeakerSimpleHigh size={16} />
        </button>

        <div className="gasapp-tabbar-tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`gasapp-tab ${activeTab === id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={16} weight={activeTab === id ? 'fill' : 'regular'} />
              {label}
            </button>
          ))}
        </div>

        <button className="gasapp-tabbar-icon" type="button" aria-label="More sections">
          <Plus size={16} />
        </button>
      </nav>
    </div>
  )
}
