import { useState } from 'react'
import type { CSSProperties } from 'react'
import GasStatusBar from '../components/GasStatusBar'

type RatingStep = {
  icon: 'scooter' | 'pump' | 'check'
  title: string
  subtitle: string
  progress: number
  progressColor: string
  iconColor: string
  statusTone: 'muted' | 'success' | 'pill'
}

const RATING_STEPS: RatingStep[] = [
  {
    icon: 'scooter',
    title: 'Rider has arrived at the filling Station',
    subtitle: 'Completed',
    progress: 0.99,
    progressColor: '#57B52B',
    iconColor: '#57B52B',
    statusTone: 'muted',
  },
  {
    icon: 'pump',
    title: 'Filling Process',
    subtitle: 'Completed',
    progress: 0,
    progressColor: '#1577E5',
    iconColor: '#1577E5',
    statusTone: 'pill',
  },
  {
    icon: 'check',
    title: 'Refill Completion',
    subtitle: 'Arriving in 5 minutes',
    progress: 1,
    progressColor: '#1577E5',
    iconColor: '#1577E5',
    statusTone: 'muted',
  },
]

type GasRatingScreenProps = {
  orderId?: string
  onSubmit?: (stars: number) => void
}

export default function GasRatingScreen({
  orderId = '3',
  onSubmit,
}: GasRatingScreenProps) {
  const [selectedStars, setSelectedStars] = useState(0)

  return (
    <div style={styles.screen}>
      <GasStatusBar style={styles.statusBar} />

      <div style={styles.backdrop} />

      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.avatar}>
            <AvatarIcon />
          </div>
          <div style={styles.headerText}>
            <div style={styles.headerTitle}>Hello Chris 👋</div>
            <p style={styles.headerSubtitle}>
              Let&apos;s fill your LPG cylinder for you in less that 20 minutes
            </p>
          </div>
          <button type="button" style={styles.bellButton} aria-label="Notifications">
            <BellIcon />
          </button>
        </header>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Track All Activities Here</h2>
          <p style={styles.sectionSubtitle}>
            Enjoy real time track system as your Gas cylinder get filled
          </p>
        </section>

        <section style={styles.timeline}>
          {RATING_STEPS.map((step, index) => (
            <RatingTimelineRow
              key={step.title}
              step={step}
              isLast={index === RATING_STEPS.length - 1}
            />
          ))}
        </section>

        <div style={styles.sheetSpacer} />

        <section style={styles.sheet}>
          <div style={styles.sheetHandle} />

          <div style={styles.sheetTitleRow}>
            <h3 style={styles.sheetTitle}>Delivery Confirmation</h3>
            <span style={styles.sheetOrder}>(Order #{orderId})</span>
          </div>

          <p style={styles.sheetSubtitle}>Tap To Rate Our Service</p>

          <div style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                style={styles.starButton}
                onClick={() => setSelectedStars(star)}
                aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
              >
                <StarIcon active={star <= selectedStars} />
              </button>
            ))}
            <span style={styles.scoreValue}>{selectedStars.toFixed(1)}</span>
          </div>

          <p style={styles.hint}>Tap on the button to complete delivery</p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => onSubmit?.(selectedStars)}
          >
            Complete Delivery
          </button>
        </section>

        <div style={styles.homeIndicator} />
      </div>
    </div>
  )
}

function RatingTimelineRow({ step, isLast }: { step: RatingStep; isLast: boolean }) {
  return (
    <div style={styles.timelineRow}>
      <div style={styles.timelineRail}>
        <div
          style={{
            ...styles.iconWrap,
            background: step.iconColor,
          }}
        >
          {step.icon === 'scooter' && <ScooterIcon />}
          {step.icon === 'pump' && <PumpIcon />}
          {step.icon === 'check' && <CheckIcon />}
        </div>
        {!isLast && (
          <div style={styles.connectorTrack}>
            <div
              style={{
                ...styles.connectorDash,
                backgroundImage:
                  step.iconColor === '#57B52B'
                    ? 'linear-gradient(to bottom, #57B52B 0 28%, transparent 28% 42%, #57B52B 42% 70%, transparent 70% 84%, #57B52B 84% 100%)'
                    : 'linear-gradient(to bottom, #1577E5 0 28%, transparent 28% 42%, #1577E5 42% 70%, transparent 70% 84%, #1577E5 84% 100%)',
              }}
            />
          </div>
        )}
      </div>

      <div style={styles.timelineBody}>
        <div style={styles.timelineTitleRow}>
          <span style={styles.timelineTitle}>{step.title}</span>
          {step.statusTone === 'pill' && <span style={styles.statusPill}>{step.subtitle}</span>}
        </div>

        {step.statusTone !== 'pill' && (
          <span
            style={{
              ...styles.timelineSubtitle,
              ...(step.statusTone === 'success' ? styles.timelineSubtitleSuccess : styles.timelineSubtitleMuted),
            }}
          >
            {step.subtitle}
          </span>
        )}

        {step.progress > 0 && (
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${step.progress * 100}%`,
                background: step.progressColor,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function AvatarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#B9DFF7" />
      <circle cx="14" cy="12.3" r="5.1" fill="#E6B083" />
      <path d="M7.6 22.6c1.7-3.4 4.4-5.1 6.4-5.1 2 0 4.7 1.7 6.4 5.1" fill="#355271" />
      <path d="M9.4 10.2c1.1-3 3.8-4.8 6.8-4.8 2.1 0 3.8.8 4.8 2.1-.7.2-1.6.3-2.4.3-3.9 0-6.7-1.2-9.2 2.4Z" fill="#4D4D4D" />
      <circle cx="12.2" cy="12.5" r="0.55" fill="#2F2F2F" />
      <circle cx="16" cy="12.5" r="0.55" fill="#2F2F2F" />
      <path d="M12.4 15.1c.6.4 1.5.4 2.1 0" stroke="#8D5839" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"
        stroke="#7A7A7A"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#7A7A7A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ScooterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="17" r="2.3" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="18" cy="17" r="2.3" stroke="#FFFFFF" strokeWidth="1.8" />
      <path
        d="M8.4 17h5L16 11.5H10.6L8.7 7H5.7l1 3h1.7"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.4 11.5 15.1 13.2" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PumpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14.893 6.22 13.56 5.553c-.247-.12-.554-.027-.674.22-.127.253-.027.553.22.667l1.06.526V10.167l-2.5.006V3.333C11.667 2 10.773 1.333 9.667 1.333H4.333C3.227 1.333 2.333 2 2.333 3.333V14.167H1.333a.5.5 0 0 0 0 1h11.333a.5.5 0 0 0 0-1H11.667V11.173l3-.007c.28 0 .5-.226.5-.5V6.667a.5.5 0 0 0-.274-.447Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6 9 17l-5-5"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarIcon({ active }: { active: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? '#D6A940' : '#D5D9DF'}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

const styles: Record<string, CSSProperties> = {
  screen: {
    width: '100%',
    height: '100%',
    background: '#FFFFFF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },
  statusBar: {
    top: 16,
    left: 16,
    right: 16,
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.20)',
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '58px 0 10px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 14px',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    flexShrink: 0,
  },
  headerText: {
    minWidth: 0,
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    lineHeight: 1.2,
    fontWeight: 700,
    color: '#111111',
    marginBottom: 3,
  },
  headerSubtitle: {
    margin: 0,
    fontSize: 10.5,
    lineHeight: 1.35,
    color: '#767676',
  },
  bellButton: {
    width: 28,
    height: 28,
    border: 'none',
    background: 'transparent',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    flexShrink: 0,
  },
  section: {
    padding: '31px 14px 0',
  },
  sectionTitle: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.15,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#111111',
  },
  sectionSubtitle: {
    margin: '5px 0 0',
    fontSize: 11.5,
    lineHeight: 1.3,
    color: '#757575',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    padding: '22px 14px 0',
  },
  timelineRow: {
    display: 'flex',
    gap: 12,
    minHeight: 76,
  },
  timelineRail: {
    width: 38,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  connectorTrack: {
    width: 10,
    flex: 1,
    marginTop: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  connectorDash: {
    width: 2,
    height: '100%',
  },
  timelineBody: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  timelineTitleRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  timelineTitle: {
    fontSize: 13,
    lineHeight: 1.25,
    fontWeight: 500,
    color: '#111111',
  },
  timelineSubtitle: {
    display: 'inline-block',
    fontSize: 11.5,
    lineHeight: 1.3,
    marginTop: 4,
  },
  timelineSubtitleSuccess: {
    color: '#57B52B',
  },
  timelineSubtitleMuted: {
    color: '#6F6F6F',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 22,
    padding: '0 10px',
    borderRadius: 999,
    background: '#F3F5EF',
    color: '#80BE57',
    fontSize: 10.5,
    lineHeight: 1,
    fontWeight: 500,
  },
  progressTrack: {
    marginTop: 6,
    height: 6,
    width: '100%',
    borderRadius: 999,
    background: '#F0F0F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  sheetSpacer: {
    flex: 1,
    minHeight: 42,
  },
  sheet: {
    background: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: '12px 24px 22px',
    boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
  },
  sheetHandle: {
    width: 58,
    height: 5,
    borderRadius: 999,
    background: '#E7E7E7',
    margin: '0 auto 18px',
  },
  sheetTitleRow: {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
  },
  sheetTitle: {
    margin: 0,
    fontSize: 19,
    lineHeight: 1.15,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#111111',
  },
  sheetOrder: {
    fontSize: 18,
    lineHeight: 1.15,
    fontWeight: 800,
    color: '#1982FF',
  },
  sheetSubtitle: {
    margin: '24px 0 10px',
    fontSize: 17,
    lineHeight: 1.25,
    color: '#5B5B5B',
    fontWeight: 400,
  },
  starsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  starButton: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
  },
  scoreValue: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 1,
    color: '#6F6F6F',
  },
  hint: {
    margin: '18px 0 22px',
    fontSize: 14,
    lineHeight: 1.35,
    color: '#6E6E6E',
  },
  primaryButton: {
    width: '100%',
    height: 44,
    border: 'none',
    borderRadius: 999,
    background: '#050505',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 999,
    background: '#111111',
    alignSelf: 'center',
    marginTop: 12,
    flexShrink: 0,
  },
}
