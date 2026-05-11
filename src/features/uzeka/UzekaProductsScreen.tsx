import { useEffect, useRef, useState } from 'react'

const PINK  = '#f43f5e'
const BLUE  = '#3B82F6'
const DARK  = '#111111'
const SUB   = '#8b8fa3'
const GREEN = '#22c55e'

type Phase = 0 | 1 | 2 | 3 | 4

const DURATIONS: number[] = [3000, 2500, 1500, 2000, 3500]

// ── Shared status bar ──────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 20px 0', fontSize: 13, fontWeight: 700, color: DARK,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 11 }}>
        <span>●●●</span><span>▲</span><span>▋</span>
      </div>
    </div>
  )
}

// ── Shared page header ─────────────────────────────────────────────────────
function PageHeader({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 20px 10px',
    }}>
      <span style={{ fontSize: 20, fontWeight: 900, color: DARK }}>{title}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
          background: 'linear-gradient(135deg, #4a2b0f, #8b5e2e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
        }}>🎵</div>
        <span style={{ fontSize: 12, fontWeight: 600, color: DARK, whiteSpace: 'nowrap' }}>AfroBeats Takeover</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  )
}

// ── Product image placeholder ──────────────────────────────────────────────
type ImgType = 'shirt1' | 'shirt2' | 'cola' | 'pepsi' | 'food1' | 'food2'
function ProductImg({ type, small }: { type: ImgType; small?: boolean }) {
  const map: Record<ImgType, { bg: string; emoji: string }> = {
    shirt1: { bg: 'linear-gradient(145deg, #f0f0f0, #e2e2e2)', emoji: '👔' },
    shirt2: { bg: 'linear-gradient(145deg, #e4e4e4, #d0d0d0)', emoji: '👔' },
    cola:   { bg: 'linear-gradient(145deg, #b91c1c, #ef4444)', emoji: '🥤' },
    pepsi:  { bg: 'linear-gradient(145deg, #1d4ed8, #3b82f6)', emoji: '🥛' },
    food1:  { bg: 'linear-gradient(145deg, #92400e, #d97706)', emoji: '🍲' },
    food2:  { bg: 'linear-gradient(145deg, #78350f, #b45309)', emoji: '🍗' },
  }
  const { bg, emoji } = map[type]
  const size = small ? 56 : undefined
  return (
    <div style={{
      width: size ?? '100%', height: size, aspectRatio: size ? undefined : '1',
      background: bg, borderRadius: small ? 10 : 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: small ? 28 : 38, flexShrink: 0,
    }}>
      {emoji}
    </div>
  )
}

// ── Product grid card ──────────────────────────────────────────────────────
function ProductCard({ type, qty, name, price, selected }: {
  type: ImgType; qty: number; name: string; price: string; selected?: boolean
}) {
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden', background: '#fff',
      border: `1.5px solid ${selected ? BLUE : '#e5e7eb'}`,
      boxShadow: selected ? `0 0 0 3px ${BLUE}22` : 'none',
    }}>
      <div style={{ position: 'relative' }}>
        <ProductImg type={type} />
        <div style={{
          position: 'absolute', top: 6, right: 6,
          background: 'rgba(0,0,0,0.6)', borderRadius: 6,
          padding: '2px 6px', fontSize: 9, fontWeight: 700, color: '#fff',
        }}>
          Qty: {qty}
        </div>
      </div>
      <div style={{ padding: '8px 8px 10px' }}>
        <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 600, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
        <p style={{ margin: '0 0 8px', fontSize: 11, color: SUB }}>{price} Kz</p>
        {selected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              background: '#f3f4f6', border: '1.5px solid #e5e7eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#555',
            }}>−</div>
            <span style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 700, color: DARK }}>1</span>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', background: BLUE, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff',
            }}>+</div>
          </div>
        ) : (
          <div style={{
            padding: '6px', border: '1.5px solid #e5e7eb',
            borderRadius: 8, background: '#fff', fontSize: 11,
            fontWeight: 600, color: DARK, textAlign: 'center',
          }}>Add To Cart</div>
        )}
      </div>
    </div>
  )
}

// ── Products bottom nav ────────────────────────────────────────────────────
function BottomNav() {
  const items: { label: string; active?: boolean }[] = [
    { label: 'Overview' }, { label: 'Tickets' },
    { label: 'Products', active: true }, { label: 'Team' }, { label: 'Settings' },
  ]
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #f0f1f3',
      padding: '8px 0 20px', display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map(({ label, active }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {active ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          ) : label === 'Overview' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          ) : label === 'Tickets' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
            </svg>
          ) : label === 'Team' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="1.8" strokeLinecap="round">
              <circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              <circle cx="19" cy="7" r="2"/><path d="M22 21v-2a3 3 0 0 0-2-2.83"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          )}
          <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? PINK : SUB }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Products view ──────────────────────────────────────────────────────────
function ProductsView({ scrolled }: { scrolled: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <PageHeader title="Products" />

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f0f1f3', marginBottom: 10 }}>
        {['Sell Products', 'Sales'].map((tab, i) => (
          <div key={tab} style={{
            flex: 1, textAlign: 'center', padding: '10px 0',
            fontSize: 13, fontWeight: i === 0 ? 700 : 500,
            color: i === 0 ? PINK : SUB,
            borderBottom: i === 0 ? `2.5px solid ${PINK}` : '2.5px solid transparent',
          }}>{tab}</div>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '0 14px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#f5f6f8', borderRadius: 999, padding: '9px 14px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span style={{ fontSize: 13, color: '#c0c4d0' }}>Search Product</span>
        </div>
      </div>

      {/* Scrollable product list */}
      <div style={{
        flex: 1, overflow: 'hidden', padding: '0 14px',
        transform: `translateY(${scrolled ? -110 : 0}px)`,
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Merchandise */}
        <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: DARK }}>Merchandise</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <ProductCard type="shirt1" qty={25} name="Event T-Shirt" price="5,000" selected />
          <ProductCard type="shirt2" qty={20} name="Event T-Shirt" price="5,000" />
        </div>

        {/* Drinks */}
        <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: DARK }}>Drinks</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <ProductCard type="cola"  qty={15} name="Event T-Shirt" price="5,000" />
          <ProductCard type="pepsi" qty={25} name="Pepsi" price="5,000" />
        </div>

        {/* Food */}
        <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: DARK }}>Food</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ProductCard type="food1" qty={12} name="Jollof Rice" price="2,500" />
          <ProductCard type="food2" qty={8}  name="Grilled Chicken" price="3,000" />
        </div>
      </div>

      {/* View Cart button */}
      <div style={{ padding: '10px 14px 6px', background: '#fff' }}>
        <button style={{
          width: '100%', padding: '15px', border: 'none', borderRadius: 999,
          background: BLUE, color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
        }}>
          View Cart (1)
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

// ── Cart item row ──────────────────────────────────────────────────────────
function CartItem({ imgType, name, sub, qty, price }: {
  imgType: ImgType; name: string; sub: string; qty: number; price: string
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 0', borderBottom: '1px solid #f3f4f6',
    }}>
      <ProductImg type={imgType} small />
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: DARK }}>{name}</p>
        <p style={{ margin: '0 0 4px', fontSize: 11, color: SUB }}>{sub}</p>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: DARK }}>{price} Kz</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: '#f3f4f6',
          border: '1.5px solid #e5e7eb', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#555',
        }}>−</div>
        <span style={{ fontSize: 13, fontWeight: 700, color: DARK, minWidth: 14, textAlign: 'center' }}>{qty}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: BLUE,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 700, color: '#fff',
        }}>+</div>
      </div>
    </div>
  )
}

// ── Cart view ──────────────────────────────────────────────────────────────
function CartView({ phase, countdown }: { phase: Phase; countdown: number }) {
  const searching = phase === 2
  const found     = phase >= 3

  const hh = String(Math.floor(countdown / 3600)).padStart(2, '0')
  const mm = String(Math.floor((countdown % 3600) / 60)).padStart(2, '0')
  const ss = String(countdown % 60).padStart(2, '0')

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <PageHeader title="Cart" />

      {/* Search user section */}
      <div style={{ padding: '0 16px 10px', borderBottom: '1px solid #f0f1f3' }}>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: DARK }}>Search User</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            borderRadius: 12, padding: '10px 12px',
            border: (searching || found) ? '1.5px solid #e5e7eb' : '1.5px solid transparent',
            background: (searching || found) ? '#fff' : '#f5f6f8',
          }}>
            <span style={{ fontSize: 12, color: (searching || found) ? DARK : '#c0c4d0', flex: 1 }}>
              {(searching || found) ? 'joaoapera@gmail.com' : 'Search by Email or phone number'}
            </span>
            {(searching || found) && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            )}
            {!searching && !found && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            )}
          </div>
          {(searching || found) && (
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: BLUE,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          )}
        </div>

        {/* Status below search */}
        <div style={{
          marginTop: 8,
          opacity: (!searching && !found) ? 1 : 0,
          position: (!searching && !found) ? 'relative' : 'absolute',
          height: (!searching && !found) ? 'auto' : 0, overflow: 'hidden',
          transition: 'opacity 0.25s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <line x1="17" y1="11" x2="23" y2="11" stroke="none"/>
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: PINK }}>Non Uzeka User</span>
          </div>
        </div>

        {/* Searching spinner */}
        <div style={{
          marginTop: 8,
          opacity: searching ? 1 : 0,
          maxHeight: searching ? 28 : 0, overflow: 'hidden',
          transition: 'opacity 0.25s ease, max-height 0.25s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="2.5" strokeLinecap="round"
              style={{ animation: 'uzeka-spin-btn 0.8s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            <span style={{ fontSize: 12, color: SUB }}>Searching For User</span>
          </div>
        </div>

        {/* Found user chip */}
        <div style={{
          marginTop: 8,
          opacity: found ? 1 : 0,
          maxHeight: found ? 52 : 0, overflow: 'hidden',
          transition: 'opacity 0.3s ease, max-height 0.3s ease',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#EFF6FF', borderRadius: 12, padding: '10px 12px',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: GREEN,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0,
            }}>J</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: DARK }}>João Pereira</p>
              <p style={{ margin: 0, fontSize: 11, color: SUB }}>joaoapera@gmail.com</p>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Cart items */}
      <div style={{ flex: 1, padding: '0 16px', overflow: 'hidden' }}>
        <CartItem imgType="shirt1" name="Event T-Shirt" sub="Size : XL" qty={2} price="10,000" />
        <CartItem imgType="pepsi"  name="Pepsi"         sub="Medium"   qty={3} price="1,500"  />
      </div>

      {/* Checkout section */}
      <div style={{
        padding: '14px 16px 24px', borderTop: '1px solid #f0f1f3',
        background: '#fff',
      }}>
        <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 800, color: DARK }}>Check Out</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: SUB }}>Event T-Shirt (2)</span>
          <span style={{ fontSize: 12, color: DARK, fontWeight: 600 }}>10,000 Kz</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: SUB }}>Soft Drink (3)</span>
          <span style={{ fontSize: 12, color: DARK, fontWeight: 600 }}>1,500 Kz</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, borderTop: '1px solid #f0f1f3', paddingTop: 10 }}>
          <span style={{ fontSize: 12, color: DARK, fontWeight: 600 }}>Total Cost</span>
          <span style={{ fontSize: 12, color: DARK, fontWeight: 800 }}>Kz 5,050.00</span>
        </div>
        <button style={{
          width: '100%', padding: '15px', border: 'none', borderRadius: 999,
          background: BLUE, color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
        }}>
          Complete Sale
        </button>
      </div>

      {/* Success overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        opacity: phase === 4 ? 1 : 0,
        pointerEvents: phase === 4 ? 'auto' : 'none',
        transition: 'opacity 0.35s ease',
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div style={{
          width: '100%', background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '10px 20px 36px',
          transform: phase === 4 ? 'translateY(0)' : 'translateY(40px)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        }}>
          {/* Handle */}
          <div style={{ width: 36, height: 4, borderRadius: 999, background: '#e0e2e8', margin: '0 auto 20px' }} />

          {/* Checkmark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: GREEN,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>

          <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 800, color: DARK, textAlign: 'center' }}>
            Ticket Sold Successfully
          </h2>

          {/* Info card */}
          <div style={{ background: '#f9fafb', borderRadius: 14, padding: '16px', marginBottom: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, color: SUB }}>Reference Code</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>6789654567</p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="2" strokeLinecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, color: SUB }}>Amount to be paid</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: DARK }}>Kz 25 000,00</p>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: SUB }}>Status</p>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#d97706',
                background: '#fef3c7', borderRadius: 999, padding: '3px 10px',
              }}>Pending</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444" stroke="none">
                <circle cx="12" cy="12" r="10"/>
                <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">!</text>
              </svg>
              <span style={{ fontSize: 11, color: '#6b7280' }}>
                This reference expires on{' '}
                <span style={{ color: BLUE, fontWeight: 700 }}>{hh}:{mm}:{ss}</span>
              </span>
            </div>
          </div>

          <button style={{
            width: '100%', padding: '15px', border: 'none', borderRadius: 999,
            background: BLUE, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export function UzekaProductsScreen() {
  const [phase, setPhase] = useState<Phase>(0)
  const [countdown, setCountdown] = useState(9251)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cdRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPhase(p => ((p + 1) % 5) as Phase)
    }, DURATIONS[phase])
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase])

  useEffect(() => {
    if (phase === 4) {
      setCountdown(9251)
      cdRef.current = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    } else {
      if (cdRef.current) { clearInterval(cdRef.current); cdRef.current = null }
    }
    return () => { if (cdRef.current) clearInterval(cdRef.current) }
  }, [phase])

  const showProducts = phase === 0
  const showCart     = phase >= 1

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      background: '#fff',
    }}>
      <style>{`
        @keyframes uzeka-spin-btn {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        position: 'absolute', inset: 0,
        opacity: showProducts ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: showProducts ? 'auto' : 'none',
      }}>
        <ProductsView scrolled={false} />
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        opacity: showCart ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: showCart ? 'auto' : 'none',
      }}>
        <CartView phase={phase} countdown={countdown} />
      </div>
    </div>
  )
}
