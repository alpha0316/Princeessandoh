import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

const ORANGE = '#F97316'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const SCREEN_PAD_X = 46
const HOME_BOTTOM_OFFSET = 36
const DESKTOP_FRAME_W = 793
const DESKTOP_FRAME_H = 585  // matches phone mockup rendered height: 474 × (280/227) ≈ 585px

// ── SVG icons (from the actual app code) ──────────────────────────────────────

function ImageSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
      <path d="M14.4534 11.3067L12.3668 6.43334C11.6601 4.78 10.3601 4.71334 9.48678 6.28667L8.22678 8.56C7.58678 9.71334 6.39345 9.81334 5.56678 8.78L5.42011 8.59334C4.56011 7.51334 3.34678 7.64667 2.72678 8.88L1.58011 11.18C0.773447 12.78 1.94011 14.6667 3.72678 14.6667H12.2334C13.9668 14.6667 15.1334 12.9 14.4534 11.3067Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.64648 5.33337C5.75105 5.33337 6.64648 4.43794 6.64648 3.33337C6.64648 2.2288 5.75105 1.33337 4.64648 1.33337C3.54191 1.33337 2.64648 2.2288 2.64648 3.33337C2.64648 4.43794 3.54191 5.33337 4.64648 5.33337Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CopySvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
      <path d="M10.6668 8.60004V11.4C10.6668 13.7334 9.7335 14.6667 7.40016 14.6667H4.60016C2.26683 14.6667 1.3335 13.7334 1.3335 11.4V8.60004C1.3335 6.26671 2.26683 5.33337 4.60016 5.33337H7.40016C9.7335 5.33337 10.6668 6.26671 10.6668 8.60004Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.6668 4.60004V7.40004C14.6668 9.73337 13.7335 10.6667 11.4002 10.6667H10.6668V8.60004C10.6668 6.26671 9.7335 5.33337 7.40016 5.33337H5.3335V4.60004C5.3335 2.26671 6.26683 1.33337 8.60016 1.33337H11.4002C13.7335 1.33337 14.6668 2.26671 14.6668 4.60004Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EditSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
      <path d="M8.84006 2.39994L3.36673 8.19327C3.16006 8.41327 2.96006 8.84661 2.92006 9.14661L2.6734 11.3066C2.58673 12.0866 3.14673 12.6199 3.92006 12.4866L6.06673 12.1199C6.36673 12.0666 6.78673 11.8466 6.9934 11.6199L12.4667 5.82661C13.4134 4.82661 13.8401 3.68661 12.3667 2.29327C10.9001 0.913274 9.78673 1.39994 8.84006 2.39994Z" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.92676 3.3667C8.21342 5.2067 9.70676 6.61337 11.5601 6.80003" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14.6666H14" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Shared UI pieces ───────────────────────────────────────────────────────────

function AppHeader({ initials = 'R' }: { initials?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `24px ${SCREEN_PAD_X}px 0`, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 15 }}>🍴</span>
        <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 18, fontFamily: FONT }}>B</span>
        <span style={{ color: 'rgba(0,0,0,0.4)', fontWeight: 700, fontSize: 18, fontFamily: FONT }}>ites.</span>
      </div>
      <div style={{ minWidth: 34, height: 34, padding: '0 9px', background: '#FB923C', borderRadius: 999, color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        {initials}🍴
      </div>
    </div>
  )
}

function BottomNav({ active }: { active: 'add' | 'history' | 'riders' | 'profile' }) {
  const items: Array<{ id: typeof active; label: string; icon: string }> = [
    { id: 'add',     label: 'Add Orders', icon: '+' },
    { id: 'history', label: 'Order History', icon: '◔' },
    { id: 'riders',  label: 'Your Riders', icon: '🛵' },
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
      margin: `0 auto ${HOME_BOTTOM_OFFSET}px`,
      flexShrink: 0,
    }}>
      {items.map(item => {
        const on = item.id === active
        return (
          <div key={item.id} style={{
            padding: '8px 12px',
            borderRadius: 999,
            border: `1.5px solid ${on ? ORANGE : 'rgba(0,0,0,0.10)'}`,
            color: on ? ORANGE : 'rgba(0,0,0,0.45)',
            fontSize: 11,
            fontWeight: on ? 600 : 500,
            fontFamily: FONT,
            whiteSpace: 'nowrap',
            background: on ? 'rgba(255,255,255,0.96)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: item.id === 'riders' ? 10 : 12, lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </div>
        )
      })}
    </div>
  )
}

// ── Fanned order cards ─────────────────────────────────────────────────────────

const CARDS = [
  { name: 'Rashida M.🧕🏽', emoji: '🧕🏽', bg: '#16A34A', food: 'Shawarma', price: 'GHC 65', phone: '055 414 4611', loc: 'Hall 7',  top: 46, left: 120, rotate: 0,   z: 3 },
  { name: 'Kwame Freira',   emoji: '',      bg: '#C89C08', food: 'Rice',     price: 'GHC 65', phone: '050 281 3321', loc: 'Tesco',  top: 34, left: 184, rotate: 12,  z: 2 },
  { name: 'Suad M.',        emoji: '',      bg: '#F5C4C8', food: 'Waakye',   price: 'GHC 45', phone: '054 991 8181', loc: 'Hall 3',  top: 18, left: 68,  rotate: -14, z: 1 },
]

function OrderCard({ card }: { card: typeof CARDS[0] }) {
  return (
    <div style={{
      position: 'absolute', top: card.top, left: card.left, zIndex: card.z,
      width: 138,
      padding: '14px 12px',
      background: '#F4F4F4',
      borderRadius: 16,
      outline: '3px solid #fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      transform: `rotate(${card.rotate}deg)`,
    }}>
      <div style={{ width: 50, height: 50, borderRadius: '50%', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, overflow: 'hidden' }}>
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

function FannedCards() {
  return (
    <div style={{ position: 'relative', width: 360, height: 248, margin: '0 auto', flexShrink: 0 }}>
      {CARDS.map((card, i) => <OrderCard key={i} card={card} />)}
    </div>
  )
}

// ── Screen 1: Home (empty state) ───────────────────────────────────────────────

function HomeContent() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 24px 0' }}>
        <FannedCards />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, marginTop: 22, padding: '0 24px' }}>
          <p style={{ margin: 0, fontSize: 31, fontWeight: 500, color: '#000', fontFamily: FONT, textAlign: 'center', letterSpacing: '-0.04em' }}>
          Hiii Akosuaa ✨👩🏽‍🍳
          </p>
          <p style={{ margin: 0, maxWidth: 320, fontSize: 12, color: 'rgba(0,0,0,0.52)', fontFamily: FONT, textAlign: 'center', lineHeight: 1.35 }}>
            You have not uploaded any order for this week yet 💁🏽‍♀️
          </p>
          <div style={{ marginTop: 20, padding: '14px 20px', background: '#FB923C', color: '#fff', borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 26px rgba(249, 115, 22, 0.22)' }}>
            🍴
            <span>Add Orders</span>
          </div>
        </div>
      </div>
      <BottomNav active="add" />
    </div>
  )
}

function HomeScreen() {
  return <HomeContent />
}

// ── Screen 2: Add Orders modal ─────────────────────────────────────────────────

const MODAL_OPTIONS = [
  { icon: <ImageSvg />, title: 'Upload Screenshots',    desc: "Snap or upload your order screenshots — we'll automatically extract and organize the details for you." },
  { icon: <CopySvg />,  title: 'Copy And Paste Orders', desc: "Simply paste your order text, and we'll sort everything neatly in seconds." },
  { icon: <EditSvg />,  title: 'Type your orders',      desc: 'Prefer manual entry? Add your order details one step at a time, quickly and accurately.' },
]

function ModalScreen() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Dimmed home behind */}
      <div style={{ position: 'absolute', inset: 0, filter: 'grayscale(0.05) brightness(0.76)' }}>
        <HomeContent />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(24, 24, 27, 0.30)' }} />

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 70 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '16px 16px 14px', width: '72%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)' }}>
          {MODAL_OPTIONS.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 14px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.09)', background: '#fff' }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>{opt.icon}</div>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#111827', fontFamily: FONT }}>{opt.title}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(0,0,0,0.46)', fontFamily: FONT, lineHeight: 1.42 }}>{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Screen 3: Screenshots Upload + extracted orders ────────────────────────────

const UPLOAD_CARDS = [
  { id: '1', w: 174, h: 136, bubbleW: 150, bubbleH: 108, bubbleAlign: 'right' as const, crop: '0% 0%' },
  { id: '2', w: 174, h: 136, bubbleW: 150, bubbleH: 108, bubbleAlign: 'right' as const, crop: '8% 0%' },
  { id: '3', w: 108, h: 136, bubbleW: 108, bubbleH: 114, bubbleAlign: 'right' as const, crop: '18% 0%' },
  { id: '4', w: 400, h: 136, bubbleW: 152, bubbleH: 108, bubbleAlign: 'right' as const, crop: '0% 0%', received: true },
  { id: '5', w: 174, h: 136, bubbleW: 150, bubbleH: 114, bubbleAlign: 'right' as const, crop: '6% 0%', received: true },
  { id: '6', w: 108, h: 136, bubbleW: 94, bubbleH: 166, bubbleAlign: 'center' as const, crop: '50% 0%' },
  { id: '7', w: 362, h: 136, bubbleW: 150, bubbleH: 114, bubbleAlign: 'right' as const, crop: '0% 0%', received: true },
]

function ScreenshotBubble({
  width,
  height,
  align,
  crop,
}: {
  width: number
  height: number
  align: 'right' | 'center'
  crop: string
}) {
  const messageStyle: CSSProperties = align === 'center'
    ? {
        background: 'linear-gradient(180deg, #57D66A 0%, #39C85A 100%)',
        margin: '0 auto',
      }
    : {
        background: 'linear-gradient(180deg, #4DA2FF 0%, #2F86F3 100%)',
        marginLeft: 'auto',
      }

  return (
    <div style={{
      width,
      height,
      borderRadius: 18,
      overflow: 'hidden',
      background: '#000',
      position: 'relative',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)), radial-gradient(circle at 72% 18%, rgba(255,255,255,0.06), transparent 40%)',
      }} />
      <div style={{
        width: Math.min(width - 12, Math.max(68, width * 0.84)),
        height: Math.min(height - 12, Math.max(86, height * 0.84)),
        borderRadius: 18,
        color: '#fff',
        padding: '10px 12px',
        fontSize: 10,
        lineHeight: 1.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...messageStyle,
        transform: `translate(${crop})`,
      }}>
        {align === 'center' ? (
          <>
            <div>
              <div style={{ fontSize: 8, opacity: 0.95 }}>Hello</div>
              <div style={{ fontSize: 8, opacity: 0.95 }}>I&apos;d like to buy chips</div>
            </div>
            <div style={{ alignSelf: 'flex-end', padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', fontSize: 7 }}>Suncity</div>
            <div style={{ fontSize: 7, opacity: 0.95 }}>Your number is busy</div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.2)' }} />
            <div>
              <div style={{ fontSize: 8, opacity: 0.95 }}>Hello</div>
              <div style={{ fontSize: 8, opacity: 0.95 }}>I&apos;d like to buy chips</div>
              <div style={{ fontSize: 7, opacity: 0.95 }}>Your number is busy</div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div style={{ fontSize: 18, lineHeight: 1.1 }}>Hi</div>
              <div style={{ fontSize: 17, lineHeight: 1.1 }}>Jollof 60 cedis</div>
              <div style={{ fontSize: 15, lineHeight: 1.1 }}>Prince Essandoh</div>
              <div style={{ fontSize: 15, lineHeight: 1.1 }}>Suncity, gaza</div>
              <div style={{ fontSize: 15, lineHeight: 1.1 }}>0559488201</div>
            </div>
            <div style={{
              position: 'absolute',
              right: -7,
              bottom: 0,
              width: 16,
              height: 16,
              borderRadius: '0 0 0 14px',
              background: 'inherit',
            }} />
          </>
        )}
      </div>
    </div>
  )
}

function UploadCard({
  card,
}: {
  card: typeof UPLOAD_CARDS[number]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <ScreenshotBubble width={card.w} height={card.h} align={card.bubbleAlign} crop={card.crop} />
      {card.received ? (
        <div style={{ width: 100, padding: '6px 12px', borderRadius: 999, background: 'rgba(39, 39, 42, 0.92)', color: '#fff', fontSize: 11, fontFamily: FONT }}>
          Received
        </div>
      ) : null}
    </div>
  )
}

function UploadFlowScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />

      <div style={{ padding: `22px ${SCREEN_PAD_X + 40}px 14px ${SCREEN_PAD_X + 112}px`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 13L5 8L10 3" stroke="rgba(0,0,0,0.62)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#000', fontFamily: FONT }}>
            Orders <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>(7)</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 22, height: 22, borderRadius: 999, background: '#FFF1E8', color: '#FB923C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1 }}>+</div>
          <div style={{ padding: '14px 18px', background: '#FB923C', color: '#fff', borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 14px 30px rgba(249, 115, 22, 0.22)' }}>
            <span>🍴</span>
            <span>Prepare Order List</span>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: `0 ${SCREEN_PAD_X + 40}px 12px ${SCREEN_PAD_X + 112}px`,
        display: 'grid',
        gridTemplateColumns: '174px 174px 108px 400px',
        gridAutoRows: 'min-content',
        gap: '12px 14px',
        alignContent: 'start',
      }}>
        {UPLOAD_CARDS.map(card => (
          <UploadCard key={card.id} card={card} />
        ))}
      </div>

      <BottomNav active="add" />
    </div>
  )
}

// ── Screen 4: Prepared List ────────────────────────────────────────────────────

const PREPARED_NOTES = [
  { id: '#011', name: 'Prince Essandoh', phone: '0559488201', hall: 'Suncity, gaza', item: 'Jollof Rice', qty: '1', price: 'GHC60.00', color: '#E5F0FF' },
  { id: '#012', name: 'Mike Arthur', phone: '0554144611', hall: 'Hall 7', item: 'Chicken Shawarma', qty: '2', price: 'GHC70.00', color: '#FFF5BF' },
  { id: '#013', name: 'Esi M.', phone: '0248123456', hall: 'Tesco', item: 'Loaded Fries', qty: '1', price: 'GHC65.00', color: '#E8F7CD' },
  { id: '#014', name: 'Suad M.', phone: '0206112234', hall: 'Block C', item: 'Spicy Chicken', qty: '1', price: 'GHC50.00', color: '#FBE6F4' },
]
const ORDER_STATUSES = ['Pending', 'Packaged', 'In Transit', 'Completed', 'Pickup'] as const
const ORDERS_BOARD = [
  { id: '#011', name: 'Essandoh Prince', phone: '055 414 4611', location: 'NYA', item: 'Chicken Shawarma', amount: 'GHC 65', status: 'Pending' as const },
  { id: '#012', name: 'Kwame Boateng', phone: '024 889 1023', location: 'Unity Hall', item: 'Jollof Rice', amount: 'GHC 40', status: 'Packaged' as const },
  { id: '#013', name: 'Akosua Mensah', phone: '020 554 7789', location: 'Ayeduase', item: 'Pizza', amount: 'GHC 90', status: 'In Transit' as const },
  { id: '#014', name: 'Kwabena Osei', phone: '054 123 4567', location: 'Katanga', item: 'Burger', amount: 'GHC 55', status: 'Completed' as const },
  { id: '#015', name: 'Esi Asare', phone: '027 890 1234', location: 'Republic Hall', item: 'Fried Rice', amount: 'GHC 75', status: 'Pickup' as const },
  { id: '#016', name: 'Yaw Boateng', phone: '023 456 7890', location: 'GTUC', item: 'Chicken & Chips', amount: 'GHC 60', status: 'Pending' as const },
]

function PreparedNote({ note }: { note: typeof PREPARED_NOTES[number] }) {
  return (
    <article style={{
      position: 'relative',
      minHeight: 178,
      borderRadius: 22,
      background: note.color,
      boxShadow: '0 10px 26px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 12, bottom: 12, width: 20, height: 20, background: 'rgba(0,0,0,0.12)', clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
      <div style={{ padding: '18px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#000', fontFamily: FONT }}>{note.name}</p>
            <p style={{ margin: '3px 0 0', fontSize: 11, color: 'rgba(0,0,0,0.5)', fontFamily: FONT }}>{note.phone} | {note.hall}</p>
          </div>
          <div style={{ width: 14, height: 14, borderRadius: 4, border: '1.4px solid rgba(249, 115, 22, 0.8)', background: '#fff' }} />
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.08)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8.37 1.17H5.63c-.61 0-1.1.49-1.1 1.09v.55c0 .6.49 1.09 1.1 1.09h2.74c.61 0 1.1-.49 1.1-1.09v-.55c0-.6-.49-1.09-1.1-1.09Z" fill="rgba(0,0,0,0.38)" />
            <path d="M10.06 2.81c0 .93-.76 1.69-1.69 1.69H5.63c-.93 0-1.69-.76-1.69-1.69 0-.33-.35-.53-.64-.38-.82.44-1.37 1.31-1.37 2.3v5.49c0 1.44 1.17 2.61 2.61 2.61h4.95c1.44 0 2.61-1.17 2.61-2.61V4.74c0-1-.56-1.87-1.38-2.3-.29-.15-.64.05-.64.37Z" fill="rgba(0,0,0,0.38)" />
          </svg>
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.42)', fontWeight: 600, fontFamily: FONT }}>Orders</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 24px auto', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#111827', fontFamily: FONT }}>{note.item}</span>
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.48)', textAlign: 'center', fontFamily: FONT }}>{note.qty}</span>
            <span style={{ fontSize: 13, color: '#111827', fontWeight: 600, fontFamily: FONT }}>{note.price}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function PreparedListScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />

      <div style={{ padding: `22px ${SCREEN_PAD_X + 36}px 10px ${SCREEN_PAD_X + 96}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 13L5 8L10 3" stroke="rgba(0,0,0,0.62)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#000', fontFamily: FONT }}>
            Prepared Order List <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>(4)</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: '10px 16px', borderRadius: 999, background: '#F0FDF4', color: '#15803D', fontSize: 12, fontWeight: 600, fontFamily: FONT }}>Assign Rider</div>
          <div style={{ padding: '10px 16px', borderRadius: 999, background: '#FFF7ED', color: '#F97316', fontSize: 12, fontWeight: 600, fontFamily: FONT }}>Save</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: `0 ${SCREEN_PAD_X + 36}px 12px ${SCREEN_PAD_X + 96}px`, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18, alignContent: 'start' }}>
        {PREPARED_NOTES.map(note => <PreparedNote key={note.id} note={note} />)}
      </div>

      <BottomNav active="add" />
    </div>
  )
}

// ── Screen 5: Loading / Extracting ────────────────────────────────────────────

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, padding: '0 80px' }}>
        <div style={{ fontSize: 44, lineHeight: 1 }}>🍴</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#000', fontFamily: FONT, textAlign: 'center' }}>Extracting Orders...</p>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.48)', fontFamily: FONT, textAlign: 'center' }}>Analysing your screenshots</p>
          <div style={{ height: 7, background: '#F3F3F3', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: ORANGE, borderRadius: 999, transition: 'width 0.08s linear' }} />
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: ORANGE, fontFamily: FONT, textAlign: 'right' }}>{Math.round(progress)}%</p>
        </div>
      </div>
      <BottomNav active="add" />
    </div>
  )
}

function OrdersBoardCard({ order }: { order: typeof ORDERS_BOARD[number] }) {
  const colorMap: Record<string, string> = {
    Pending: '#FFF8A7',
    Packaged: '#DFF4FF',
    'In Transit': '#FBE5FF',
    Completed: '#E7F9C7',
    Pickup: '#FFECC2',
  }

  return (
    <article style={{
      minHeight: 136,
      borderRadius: 18,
      padding: '12px 12px 14px',
      background: colorMap[order.status],
      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#000', fontFamily: FONT }}>{order.name}</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(0,0,0,0.5)', fontFamily: FONT }}>{order.phone} | {order.location}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: FONT }}>{order.amount}</p>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(0,0,0,0.45)', fontFamily: FONT }}>1 Item</p>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.58)', fontFamily: FONT }}>{order.item}</span>
        {order.status === 'In Transit' ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: '#15803D', fontFamily: FONT }}>Track Order</span>
        ) : null}
      </div>
    </article>
  )
}

function OrdersBoardScreen({ boardOrders = ORDERS_BOARD }: { boardOrders?: typeof ORDERS_BOARD }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />

      <div style={{ padding: `20px ${SCREEN_PAD_X}px 10px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#000', fontFamily: FONT }}>
          Your Orders Today <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>({boardOrders.length})</span>
        </p>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 16px' }}>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '152px', gap: 14, overflowX: 'auto', overflowY: 'hidden', height: '100%', scrollbarWidth: 'none' }}>
          {ORDER_STATUSES.map((status) => {
            const orders = boardOrders.filter((order) => order.status === status)
            return (
              <section key={status} style={{ background: '#FAFAFA', borderRadius: 20, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#000', fontFamily: FONT }}>{status}</p>
                  <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.42)', fontFamily: FONT }}>{orders.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', paddingRight: 2 }}>
                  {orders.length > 0 ? orders.map((order) => (
                    <OrdersBoardCard key={order.id} order={order} />
                  )) : (
                    <div style={{ minHeight: 136, borderRadius: 18, border: '1px dashed rgba(0,0,0,0.10)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontFamily: FONT }}>No orders</span>
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      <BottomNav active="history" />
    </div>
  )
}

// ── Cursor indicator ──────────────────────────────────────────────────────────

function CursorSvg({ uid }: { uid: number }) {
  const filterId = `cursor_filter_${uid}`
  const clipId   = `cursor_clip_${uid}`
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g clipPath={`url(#${clipId})`}>
        <g filter={`url(#${filterId})`}>
          <path d="M4.0369 4.6879C3.99743 4.59682 3.98626 4.49597 4.00484 4.39846C4.02342 4.30094 4.07088 4.21127 4.14108 4.14108C4.21127 4.07088 4.30094 4.02342 4.39846 4.00484C4.49597 3.98626 4.59682 3.99743 4.6879 4.0369L20.6879 10.5369C20.7852 10.5765 20.8675 10.6458 20.9232 10.7349C20.9789 10.824 21.0051 10.9283 20.9981 11.0331C20.9912 11.138 20.9514 11.2379 20.8844 11.3188C20.8174 11.3997 20.7266 11.4575 20.6249 11.4839L14.5009 13.0639C14.1549 13.1529 13.839 13.3329 13.5861 13.5852C13.3332 13.8376 13.1526 14.1531 13.0629 14.4989L11.4839 20.6249C11.4575 20.7266 11.3997 20.8174 11.3188 20.8844C11.2379 20.9514 11.138 20.9912 11.0331 20.9981C10.9283 21.0051 10.824 20.9789 10.7349 20.9232C10.6458 20.8675 10.5765 20.7852 10.5369 20.6879L4.0369 4.6879Z" fill="black" />
          <path d="M4.0369 4.6879C3.99743 4.59682 3.98626 4.49597 4.00484 4.39846C4.02342 4.30094 4.07088 4.21127 4.14108 4.14108C4.21127 4.07088 4.30094 4.02342 4.39846 4.00484C4.49597 3.98626 4.59682 3.99743 4.6879 4.0369L20.6879 10.5369C20.7852 10.5765 20.8675 10.6458 20.9232 10.7349C20.9789 10.824 21.0051 10.9283 20.9981 11.0331C20.9912 11.138 20.9514 11.2379 20.8844 11.3188C20.8174 11.3997 20.7266 11.4575 20.6249 11.4839L14.5009 13.0639C14.1549 13.1529 13.839 13.3329 13.5861 13.5852C13.3332 13.8376 13.1526 14.1531 13.0629 14.4989L11.4839 20.6249C11.4575 20.7266 11.3997 20.8174 11.3188 20.8844C11.2379 20.9514 11.138 20.9912 11.0331 20.9981C10.9283 21.0051 10.824 20.9789 10.7349 20.9232C10.6458 20.8675 10.5765 20.7852 10.5369 20.6879L4.0369 4.6879Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <defs>
        <filter id={filterId} x="-25.0039" y="-9.00391" width="75.0039" height="75.0039" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.047 0 0 0 0 0.047 0 0 0 0 0.051 0 0 0 0.05 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow" />
          <feOffset dy="16" />
          <feGaussianBlur stdDeviation="16" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.047 0 0 0 0 0.047 0 0 0 0 0.051 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="effect1_dropShadow" result="shape" />
        </filter>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

// ── Animation helper ───────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ── Animated cursor ────────────────────────────────────────────────────────────

function AnimatedCursor({ uid, x, y, clicking }: { uid: number; x: number; y: number; clicking: boolean }) {
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      pointerEvents: 'none',
      zIndex: 10,
      transform: clicking ? 'scale(0.78)' : 'scale(1)',
      transformOrigin: '4px 4px',
      transition: 'left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.12s ease',
    }}>
      <CursorSvg uid={uid} />
    </div>
  )
}

// ── Frame 1: Home → click "Add Orders" → Modal → loop ─────────────────────────

function Frame1() {
  const [showModal, setShowModal] = useState(false)
  const [cx, setCx] = useState(60)
  const [cy, setCy] = useState(60)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    let alive = true
    // "Add Orders" button center in 793×585 frame (horizontally centered, near bottom of content)
    const BTN_X = 390, BTN_Y = 460

    const run = async () => {
      while (alive) {
        setShowModal(false); setCx(60); setCy(60)
        await delay(4000); if (!alive) break

        setCx(BTN_X); setCy(BTN_Y)
        await delay(700); if (!alive) break

        setClicking(true)
        await delay(150); if (!alive) break
        setClicking(false)
        await delay(300); if (!alive) break

        setShowModal(true)
        await delay(4000); if (!alive) break

        setShowModal(false)
        await delay(600)
      }
    }

    run()
    return () => { alive = false }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: showModal ? 0 : 1, transition: 'opacity 0.45s ease' }}>
        <HomeScreen />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: showModal ? 1 : 0, transition: 'opacity 0.45s ease' }}>
        <ModalScreen />
      </div>
      <AnimatedCursor uid={1} x={cx} y={cy} clicking={clicking} />
    </div>
  )
}

// ── Frame 2: Modal → Upload → Extract (0–100%) → Prepared List → loop ─────────

function Frame2() {
  type F2Phase = 'modal' | 'upload' | 'loading' | 'prepared'
  const [phase, setPhase] = useState<F2Phase>('modal')
  const [progress, setProgress] = useState(0)
  const [cx, setCx] = useState(200)
  const [cy, setCy] = useState(310)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    let alive = true
    // "Upload Screenshots" option center in modal (~72% wide modal, first option)
    const UPLOAD_X = 200, UPLOAD_Y = 310
    // "Prepare Order List" button top-right of UploadFlowScreen
    const PREPARE_X = 580, PREPARE_Y = 100

    const run = async () => {
      while (alive) {
        setPhase('modal'); setCx(UPLOAD_X); setCy(UPLOAD_Y)
        await delay(900); if (!alive) break

        setClicking(true)
        await delay(150); if (!alive) break
        setClicking(false)
        await delay(300); if (!alive) break

        setPhase('upload'); setCx(120); setCy(200)
        await delay(4000); if (!alive) break

        setCx(PREPARE_X); setCy(PREPARE_Y)
        await delay(700); if (!alive) break

        setClicking(true)
        await delay(150); if (!alive) break
        setClicking(false)
        await delay(200); if (!alive) break

        // Loading: 0→100% over 3 s
        setPhase('loading'); setProgress(0)
        await new Promise<void>(resolve => {
          const start = Date.now()
          const id = setInterval(() => {
            if (!alive) { clearInterval(id); resolve(); return }
            const pct = Math.min(100, ((Date.now() - start) / 3000) * 100)
            setProgress(pct)
            if (pct >= 100) { clearInterval(id); resolve() }
          }, 50)
        })
        if (!alive) break

        setPhase('prepared'); setCx(100); setCy(100)
        await delay(5000); if (!alive) break

        await delay(400)
      }
    }

    run()
    return () => { alive = false }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: phase === 'modal' ? 1 : 0, transition: 'opacity 0.45s ease' }}>
        <ModalScreen />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: phase === 'upload' ? 1 : 0, transition: 'opacity 0.45s ease' }}>
        <UploadFlowScreen />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: phase === 'loading' ? 1 : 0, transition: 'opacity 0.45s ease' }}>
        <LoadingScreen progress={progress} />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: phase === 'prepared' ? 1 : 0, transition: 'opacity 0.45s ease' }}>
        <PreparedListScreen />
      </div>
      <AnimatedCursor uid={2} x={cx} y={cy} clicking={clicking} />
    </div>
  )
}

// ── Frame 3: Kanban drag Pending → Packaged → In Transit → loop ────────────────

function Frame3() {
  const [boardOrders, setBoardOrders] = useState<typeof ORDERS_BOARD>(() => ORDERS_BOARD.map(o => ({ ...o })))
  const [cx, setCx] = useState(60)
  const [cy, setCy] = useState(60)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    let alive = true
    // Column center X: padding-left 20px + col * (152px + 14px gap) + 76px half-col
    const PEND_X = 96, PACK_X = 262, TRANSIT_X = 428
    // First card center Y: header ~108px + col-padding 12 + col-header ~22 + gap 12 + half-card 68
    const Y1 = 222

    const run = async () => {
      while (alive) {
        setBoardOrders(ORDERS_BOARD.map(o => ({ ...o })))
        setCx(60); setCy(60)
        await delay(1000); if (!alive) break

        // Move to first card in Pending (#011)
        setCx(PEND_X); setCy(Y1)
        await delay(700); if (!alive) break

        // Grab
        setClicking(true)
        await delay(250); if (!alive) break

        // Drag to Packaged
        setCx(PACK_X); setCy(Y1)
        await delay(900); if (!alive) break

        // Drop → #011 now first in Packaged (precedes #012 in array order)
        setClicking(false)
        setBoardOrders(prev => prev.map(o => o.id === '#011' ? { ...o, status: 'Packaged' as const } : o))
        await delay(1200); if (!alive) break

        // Grab #011 from Packaged (cursor already at PACK_X, Y1)
        setClicking(true)
        await delay(250); if (!alive) break

        // Drag to In Transit
        setCx(TRANSIT_X); setCy(Y1)
        await delay(900); if (!alive) break

        // Drop → #011 now first in In Transit
        setClicking(false)
        setBoardOrders(prev => prev.map(o => o.id === '#011' ? { ...o, status: 'In Transit' as const } : o))
        await delay(2000); if (!alive) break

        await delay(500)
      }
    }

    run()
    return () => { alive = false }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <OrdersBoardScreen boardOrders={boardOrders} />
      <AnimatedCursor uid={3} x={cx} y={cy} clicking={clicking} />
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function VendorProHomePreview() {
  return (
    <div style={f.scroller}>
      <div style={f.card}><Frame1 /></div>
      <div style={f.card}><Frame2 /></div>
      <div style={f.card}><Frame3 /></div>
    </div>
  )
}

const f = {
  scroller: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    gap: 40,
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const,
    height: DESKTOP_FRAME_H,
    scrollSnapType: 'x proximity',
    scrollbarWidth: 'none' as const,
  },
  card: {
    position: 'relative' as const,
    width: DESKTOP_FRAME_W,
    height: DESKTOP_FRAME_H,
    borderRadius: 20,
    background: '#fff',
    overflow: 'hidden' as const,
    flexShrink: 0,
    scrollSnapAlign: 'start',
  },
}
