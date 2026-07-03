import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import CaseStudyNavbar from '../../components/CaseStudyNavbar'

type Tab = 'product' | 'design' | 'engineering'
type TabDir = 'forward' | 'backward'

const TAB_ORDER: Tab[] = ['product', 'design', 'engineering']

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

function ImageSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
      <path d="M14.4534 11.3067L12.3668 6.43334C11.6601 4.78 10.3601 4.71334 9.48678 6.28667L8.22678 8.56C7.58678 9.71334 6.39345 9.81334 5.56678 8.78L5.42011 8.59334C4.56011 7.51334 3.34678 7.64667 2.72678 8.88L1.58011 11.18C0.773447 12.78 1.94011 14.6667 3.72678 14.6667H12.2334C13.9668 14.6667 15.1334 12.9 14.4534 11.3067Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.64648 5.33337C5.75105 5.33337 6.64648 4.43794 6.64648 3.33337C6.64648 2.2288 5.75105 1.33337 4.64648 1.33337C3.54191 1.33337 2.64648 2.2288 2.64648 3.33337C2.64648 4.43794 3.54191 5.33337 4.64648 5.33337Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CopySvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
      <path d="M10.6668 8.60004V11.4C10.6668 13.7334 9.7335 14.6667 7.40016 14.6667H4.60016C2.26683 14.6667 1.3335 13.7334 1.3335 11.4V8.60004C1.3335 6.26671 2.26683 5.33337 4.60016 5.33337H7.40016C9.7335 5.33337 10.6668 6.26671 10.6668 8.60004Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.6668 4.60004V7.40004C14.6668 9.73337 13.7335 10.6667 11.4002 10.6667H10.6668V8.60004C10.6668 6.26671 9.7335 5.33337 7.40016 5.33337H5.3335V4.60004C5.3335 2.26671 6.26683 1.33337 8.60016 1.33337H11.4002C13.7335 1.33337 14.6668 2.26671 14.6668 4.60004Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EditSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
      <path d="M8.84006 2.39994L3.36673 8.19327C3.16006 8.41327 2.96006 8.84661 2.92006 9.14661L2.6734 11.3066C2.58673 12.0866 3.14673 12.6199 3.92006 12.4866L6.06673 12.1199C6.36673 12.0666 6.78673 11.8466 6.9934 11.6199L12.4667 5.82661C13.4134 4.82661 13.8401 3.68661 12.3667 2.29327C10.9001 0.913274 9.78673 1.39994 8.84006 2.39994Z" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.92676 3.3667C8.21342 5.2067 9.70676 6.61337 11.5601 6.80003" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14.6666H14" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Header() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px 0',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
        <span style={{ fontSize: 20 }}>🍴</span>
        <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 20, fontFamily: FONT }}>B</span>
        <span style={{ color: 'rgba(0,0,0,0.4)', fontWeight: 700, fontSize: 20, fontFamily: FONT }}>ites.</span>
      </div>
      <div style={{
        height: 34,
        padding: '0 12px',
        background: '#FB923C',
        borderRadius: 999,
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: FONT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        R 🍴
      </div>
    </div>
  )
}

function BottomNav() {
  const items = [
    { id: 'add', label: 'Home', icon: '+', active: true },
    { id: 'history', label: 'Order History', icon: '◔' },
    { id: 'riders', label: 'Your Riders', icon: '🛵' },
    { id: 'profile', label: 'Profile', icon: '◌' },
  ]
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 6,
      padding: '7px',
      borderRadius: 999,
      border: '1px solid rgba(0,0,0,0.05)',
      background: 'rgba(255,255,255,0.92)',
      boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
      backdropFilter: 'blur(10px)',
      width: 'fit-content',
      margin: '0 auto 20px',
      flexShrink: 0,
    }}>
      {items.map(item => (
        <div key={item.id} style={{
          padding: '8px 14px',
          borderRadius: 999,
          border: `1.5px solid ${item.active ? '#F97316' : 'rgba(0,0,0,0.10)'}`,
          color: item.active ? '#F97316' : 'rgba(0,0,0,0.45)',
          fontSize: 12,
          fontWeight: item.active ? 600 : 500,
          fontFamily: FONT,
          whiteSpace: 'nowrap',
          background: item.active ? 'rgba(255,255,255,0.96)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{ fontSize: item.id === 'riders' ? 10 : 13 }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  )
}

function OrderCard({ card, style }: { card: { name: string; emoji: string; bg: string; food: string; price: string; phone: string; loc: string }; style?: CSSProperties }) {
  return (
    <div style={{
      padding: '14px 12px',
      background: '#F4F4F4',
      borderRadius: 16,
      outline: '3px solid #fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      width: 138,
      flexShrink: 0,
      ...style,
    }}>
      <div style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: card.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        overflow: 'hidden',
      }}>
        {card.emoji || null}
      </div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 12, color: '#000', fontFamily: FONT, textAlign: 'center' }}>{card.name}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(0,0,0,0.5)', fontFamily: FONT }}>
        <span>{card.food}</span>
        <span>🍴</span>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D1D5DB' }} />
        <span>{card.price}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: FONT }}>
        <span style={{ color: '#000' }}>{card.phone}</span>
        <div style={{ width: 1, height: 10, background: '#9CA3AF' }} />
        <span style={{ color: 'rgba(0,0,0,0.5)' }}>{card.loc}</span>
      </div>
    </div>
  )
}

const CARDS = [
  { name: 'Rashida M. 🧕🏽', emoji: '🧕🏽', bg: '#16A34A', food: 'Shawarma', price: 'GHC 65', phone: '055 414 4611', loc: 'Hall 7', rotate: 0, z: 3 },
  { name: 'Kwame Freira', emoji: '', bg: '#C89C08', food: 'Rice', price: 'GHC 65', phone: '050 281 3321', loc: 'Tesco', rotate: 12, z: 2 },
  { name: 'Suad M.', emoji: '', bg: '#F5C4C8', food: 'Waakye', price: 'GHC 45', phone: '054 991 8181', loc: 'Hall 3', rotate: -14, z: 1 },
]

const MODAL_OPTIONS = [
  { icon: <ImageSvg />, title: 'Upload Screenshots', desc: "Snap or upload your order screenshots — we'll automatically extract and organize the details for you.", key: 'upload' },
  { icon: <CopySvg />, title: 'Copy And Paste Orders', desc: "Simply paste your order text, and we'll sort everything neatly in seconds.", key: 'copy' },
  { icon: <EditSvg />, title: 'Type your orders', desc: 'Prefer manual entry? Add your order details one step at a time, quickly and accurately.', key: 'type' },
]

type AppView = 'home' | 'modal' | 'upload' | 'extracting' | 'prepared'

function AppSimulation() {
  const [view, setView] = useState<AppView>('home')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (view !== 'extracting') return
    let alive = true
    const start = Date.now()
    const tick = () => {
      if (!alive) return
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / 3000) * 100)
      setProgress(pct)
      if (pct < 100) {
        requestAnimationFrame(tick)
      } else {
        setView('prepared')
      }
    }
    requestAnimationFrame(tick)
    return () => { alive = false }
  }, [view])

  const handleModalSelect = (key: string) => {
    if (key === 'upload') {
      setProgress(0)
      setView('extracting')
    } else {
      setView('prepared')
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Header />

      {(view === 'home' || view === 'modal') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 24px', gap: 12 }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 360,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  zIndex: card.z,
                  transform: `rotate(${card.rotate}deg) translateY(${i === 0 ? 6 : i === 1 ? 4 : 12}px)`,
                  transition: 'transform 0.3s ease',
                }}
              >
                <OrderCard card={card} />
              </div>
            ))}
          </div>

          <p style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 500,
            color: '#000',
            fontFamily: FONT,
            textAlign: 'center',
            letterSpacing: '-0.03em',
          }}>
            Hiii Akosuaa ✨👩🏽‍🍳
          </p>
          <p style={{
            margin: 0,
            maxWidth: 300,
            fontSize: 12,
            color: 'rgba(0,0,0,0.52)',
            fontFamily: FONT,
            textAlign: 'center',
            lineHeight: 1.35,
          }}>
            You have not uploaded any order for this week yet 💁🏽‍♀️
          </p>

          <button
            onClick={() => setView('modal')}
            style={{
              marginTop: 16,
              padding: '14px 24px',
              background: '#FB923C',
              color: '#fff',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 26px rgba(249, 115, 22, 0.22)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            🍴 <span>Add Orders</span>
          </button>
        </div>
      )}

      {view === 'modal' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(24, 24, 27, 0.35)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0 16px 70px',
          zIndex: 10,
        }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: '16px',
              width: '100%',
              maxWidth: 400,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)',
              animation: 'slideUp 0.3s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            {MODAL_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleModalSelect(opt.key)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '14px',
                  borderRadius: 16,
                  border: '1px solid rgba(0,0,0,0.09)',
                  background: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'border-color 0.15s ease',
                  fontFamily: FONT,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#F97316')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.09)')}
              >
                <div style={{ flexShrink: 0, marginTop: 2 }}>{opt.icon}</div>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#111827', fontFamily: FONT }}>{opt.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(0,0,0,0.46)', fontFamily: FONT, lineHeight: 1.42 }}>{opt.desc}</p>
                </div>
              </button>
            ))}
            <button
              onClick={() => setView('home')}
              style={{
                padding: '10px',
                borderRadius: 12,
                border: 'none',
                background: '#F5F5F5',
                color: '#666',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {view === 'extracting' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          padding: '0 40px',
        }}>
          <div style={{ fontSize: 44, lineHeight: 1 }}>🍴</div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#000', fontFamily: FONT, textAlign: 'center' }}>
            Extracting Orders...
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.48)', fontFamily: FONT, textAlign: 'center' }}>
            Analysing your screenshots
          </p>
          <div style={{
            width: '100%',
            maxWidth: 280,
            height: 7,
            background: '#F3F3F3',
            borderRadius: 999,
            overflow: 'hidden',
            marginTop: 8,
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: '#FB923C',
              borderRadius: 999,
              transition: 'width 0.1s linear',
            }} />
          </div>
          <p style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: '#F97316',
            fontFamily: FONT,
            textAlign: 'right',
            width: '100%',
            maxWidth: 280,
          }}>
            {Math.round(progress)}%
          </p>
          <button
            onClick={() => setView('home')}
            style={{
              marginTop: 12,
              padding: '10px 20px',
              borderRadius: 999,
              border: '1px solid rgba(0,0,0,0.1)',
              background: '#fff',
              color: '#666',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT,
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {view === 'prepared' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          padding: '0 24px',
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#F0FDF4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}>
            ✅
          </div>
          <p style={{
            margin: 0,
            fontWeight: 700,
            fontSize: 20,
            color: '#000',
            fontFamily: FONT,
            textAlign: 'center',
          }}>
            Orders Ready!
          </p>
          <p style={{
            margin: 0,
            fontSize: 13,
            color: 'rgba(0,0,0,0.48)',
            fontFamily: FONT,
            textAlign: 'center',
            maxWidth: 260,
          }}>
            4 orders have been prepared and are ready for pickup 🎉
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%',
            maxWidth: 300,
            marginTop: 12,
          }}>
            {[
              { name: 'Prince Essandoh', item: 'Jollof Rice', price: 'GHC 60' },
              { name: 'Mike Arthur', item: 'Chicken Shawarma', price: 'GHC 70' },
              { name: 'Esi M.', item: 'Loaded Fries', price: 'GHC 65' },
              { name: 'Suad M.', item: 'Spicy Chicken', price: 'GHC 50' },
            ].map((order, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 12,
                background: '#F9FAFB',
                border: '1px solid #F3F4F6',
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 12, color: '#000', fontFamily: FONT }}>{order.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(0,0,0,0.45)', fontFamily: FONT }}>{order.item}</p>
                </div>
                <span style={{ fontWeight: 600, fontSize: 12, color: '#111827', fontFamily: FONT }}>{order.price}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setView('home')}
            style={{
              marginTop: 8,
              padding: '12px 32px',
              background: '#FB923C',
              color: '#fff',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 26px rgba(249, 115, 22, 0.22)',
            }}
          >
            🍴 Back to Home
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

const PHONE_W = 360
const PHONE_H = 720
const DESKTOP_FRAME_W = 480

function ProductView() {
  const scale = DESKTOP_FRAME_W / PHONE_W

  return (
    <div className="cs-body">
      <section style={{
        background: '#FFFFFF',
        borderRadius: 32,
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.10)',
        maxWidth: DESKTOP_FRAME_W,
        margin: '0 auto',
      }}>
        <div style={{
          width: PHONE_W,
          height: PHONE_H,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}>
          <AppSimulation />
        </div>
      </section>
    </div>
  )
}

function DesignView() {
  return (
    <div className="cs-body">
      <section className="cs-section">
        <h2 className="cs-section__title">Design System</h2>
        <div className="cs-palette">
          {[
            { color: '#FB923C', label: 'Primary' },
            { color: '#DC2626', label: 'Accent' },
            { color: '#16A34A', label: 'Success' },
            { color: '#F4F4F4', label: 'Card BG' },
            { color: '#111827', label: 'Text' },
            { color: '#9CA3AF', label: 'Muted' },
          ].map(swatch => (
            <div key={swatch.label} className="cs-swatch" style={{ background: swatch.color }}>
              <span style={{
                color: ['#F4F4F4'].includes(swatch.color) ? '#000' : '#fff',
                fontWeight: 600,
                fontSize: 12,
              }}>
                {swatch.label}
              </span>
              <span style={{
                color: ['#F4F4F4'].includes(swatch.color) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
                fontSize: 10,
              }}>
                {swatch.color}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="cs-section">
        <h2 className="cs-section__title">Typography</h2>
        <div className="cs-type-scale">
          {[
            { label: 'H1', size: '28px', weight: 500, text: 'Hiii Akosuaa ✨' },
            { label: 'Body', size: '14px', weight: 400, text: 'You have not uploaded any order for this week yet' },
            { label: 'Caption', size: '12px', weight: 400, text: '055 414 4611 | Hall 7' },
            { label: 'Label', size: '10px', weight: 600, text: 'GHC 65' },
          ].map(type => (
            <div key={type.label} className="cs-type-row">
              <span className="cs-type-row__label">{type.label}</span>
              <span style={{ fontSize: type.size, fontWeight: type.weight, color: '#111' }}>{type.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cs-section">
        <h2 className="cs-section__title">Key Screens</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {['Home (Empty State)', 'Add Orders Modal', 'Extracting Orders', 'Prepared List'].map(screen => (
            <div key={screen} style={{
              background: '#fff',
              borderRadius: 16,
              padding: '16px',
              border: '1px solid #F3F4F6',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 600,
              color: '#111',
            }}>
              {screen}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function EngineeringView() {
  return (
    <div className="cs-body">
      <section className="cs-section">
        <h2 className="cs-section__title">Tech Stack</h2>
        <div className="cs-stack-grid">
          {[
            { name: 'React 19', role: 'UI Framework', color: '#61DAFB' },
            { name: 'TypeScript', role: 'Type Safety', color: '#3178C6' },
            { name: 'Tailwind CSS', role: 'Styling', color: '#06B6D4' },
            { name: 'Vite', role: 'Bundler', color: '#646CFF' },
            { name: 'ESLint', role: 'Linting', color: '#4B32C3' },
          ].map(tech => (
            <div key={tech.name} className="cs-stack-card" style={{ background: `${tech.color}15`, border: `1px solid ${tech.color}30` }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{tech.name}</span>
              <span style={{ fontSize: 11, color: '#6B7280' }}>{tech.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cs-section">
        <h2 className="cs-section__title">State Management</h2>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #F3F4F6' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
            The app uses React's built-in <strong style={{ color: '#111' }}>useState</strong> for UI state (modal visibility, view transitions) and
            <strong style={{ color: '#111' }}> useEffect</strong> for simulating async operations like screenshot extraction.
            Order data is managed via local state arrays with no external dependencies.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <h2 className="cs-section__title">Key Features</h2>
        <div className="cs-challenges">
          {[
            { title: 'Screenshot Parsing', desc: 'Simulated OCR extraction of order details from uploaded screenshots.' },
            { title: 'Order List Generation', desc: 'Aggregates parsed data into a structured, vendor-ready order list.' },
            { title: 'Automated Order Flow', desc: 'Demonstrates the complete order lifecycle from submission to preparation.' },
          ].map((feat, i) => (
            <div key={i} className="cs-challenge">
              <span className="cs-challenge__n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h4 className="cs-challenge__title">{feat.title}</h4>
                <p className="cs-challenge__desc">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

type VendorProDetailPageProps = {
  onBack?: () => void
  onNext?: () => void
}

export default function VendorProDetailPage({ onBack }: VendorProDetailPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('product')
  const [tabKey, setTabKey] = useState(0)
  const [tabDir, setTabDir] = useState<TabDir>('forward')

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const dir = TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(activeTab) ? 'forward' : 'backward'
    setTabDir(dir)
    setTabKey(k => k + 1)
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  return (
    <div className="cs-page">
      <div key={tabKey} className={`sdi-tab-anim--${tabDir}`}>
        {activeTab === 'product' && <ProductView />}
        {activeTab === 'design' && <DesignView />}
        {activeTab === 'engineering' && <EngineeringView />}
      </div>
      <CaseStudyNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBack={onBack ?? (() => {})}
      />
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
