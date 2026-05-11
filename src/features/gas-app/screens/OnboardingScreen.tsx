import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import GasStatusBar from '../components/GasStatusBar'

type OnboardingScreenProps = {
  onGetStarted?: () => void
}

type Stage = 'hidden' | 'visible'

const SCREEN_STYLE = `
  @keyframes gasAppFadeUp {
    from {
      opacity: 0;
      transform: translateY(26px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gasAppWordmarkDrop {
    from {
      opacity: 0;
      transform: translateY(-22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: #8B8B8B;
    border: 3px solid #D9D9D9;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    cursor: pointer;
  }

  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: #8B8B8B;
    border: 3px solid #D9D9D9;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    cursor: pointer;
  }
`

export default function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  const [sliderValue, setSliderValue] = useState(0.36)
  const [stage, setStage] = useState<Stage>('hidden')

  useEffect(() => {
    const frame = requestAnimationFrame(() => setStage('visible'))
    return () => cancelAnimationFrame(frame)
  }, [])

  const selectedKg = useMemo(() => 2 + Math.round(sliderValue * 22), [sliderValue])
  const totalAmount = useMemo(() => (selectedKg * 5).toFixed(2), [selectedKg])
  const sliderPercent = sliderValue * 100

  return (
    <div style={styles.screen}>
      <style>{SCREEN_STYLE}</style>
      <GasStatusBar />

      <div
        style={{
          ...styles.wordmark,
          animation: stage === 'visible' ? 'gasAppWordmarkDrop 700ms ease forwards' : undefined,
        }}
      >
        Gas
        <span style={{ color: 'rgba(0,0,0,0.45)' }}>App</span>
      </div>

      <section style={{ ...styles.card, ...styles.offerCard, ...reveal(130, stage, 760) }}>
        <div style={styles.offerHeader}>
          <CheckCircleIcon />
          <span style={styles.offerPill}>
            Affordable <span style={{ color: '#000000' }}>Refill🚀</span>
          </span>
        </div>

        <div style={styles.offerBody}>
          <div style={styles.offerTitleRow}>
            <span style={styles.offerTitle}>Regular Offer</span>
            <span style={styles.offerTime}>(2pm to 4pm)</span>
          </div>
          <div style={{ ...styles.placeholderBar, width: '78%' }} />
          <div style={{ ...styles.placeholderBar, width: '92%' }} />
        </div>
      </section>

      <section style={{ ...styles.card, ...styles.sliderCard, ...reveal(250, stage, 860) }}>
        <div style={styles.sliderHeader}>
          <span style={styles.sliderTitle}>Slider</span>
          <div style={styles.sliderMeta}>
            <span style={styles.amountBadge}>GHC {totalAmount}</span>
            <span style={styles.kgBadge}>{selectedKg}Kg</span>
            <span style={styles.sliderAmount}>GHC {totalAmount}</span>
          </div>
        </div>

        <div style={styles.sliderWrap}>
          <div style={styles.sliderTrack}>
            <div style={{ ...styles.sliderFill, width: `${sliderPercent}%` }} />
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={sliderValue}
            onChange={(event) => setSliderValue(Number(event.target.value))}
            aria-label="Gas refill quantity"
            style={{
              ...styles.sliderInput,
              background: `linear-gradient(to right, #787878 0%, #787878 ${sliderPercent}%, rgba(0,0,0,0.08) ${sliderPercent}%, rgba(0,0,0,0.08) 100%)`,
            }}
          />
        </div>

        <div style={{ ...styles.placeholderBar, width: '77%', marginTop: 18 }} />
      </section>

      <div style={{ ...styles.connectorSolid, ...reveal(360, stage, 820) }} />

      <section style={{ ...styles.statusRow, ...reveal(420, stage, 900) }}>
        <div style={styles.statusIconSolid}>
          <GasIcon />
        </div>
        <span style={styles.statusTitle}>Filling Process</span>
        <span style={styles.completedPill}>Completed</span>
      </section>

      <div style={{ ...styles.connectorDashed, ...reveal(520, stage, 920) }} />

      <section style={{ ...styles.statusRow, ...styles.statusRowLast, ...reveal(620, stage, 980) }}>
        <div style={styles.statusIconDashed}>
          <CheckIcon />
        </div>

        <div style={styles.statusContent}>
          <span style={styles.statusTitle}>Refill Completed</span>
          <span style={styles.statusHelper}>Rider will arrive in 5 minutes</span>
          <div style={styles.progressTrack}>
            <div style={styles.progressFill} />
          </div>
        </div>
      </section>

      <h1 style={{ ...styles.headline, ...reveal(760, stage, 980) }}>
        Your Hassle-Free Solution for
        <span style={styles.headlineMuted}> convenient LPG refills</span>
      </h1>

      <div style={{ ...styles.ctaWrap, ...reveal(890, stage, 980) }}>
        <PrimaryButton title="Get Started" onPress={onGetStarted} />
      </div>
    </div>
  )
}

function reveal(delay: number, stage: Stage, duration = 800) {
  if (stage === 'hidden') {
    return {
      opacity: 0,
      transform: 'translateY(26px)',
    }
  }

  return {
    opacity: 1,
    transform: 'translateY(0)',
    animation: `gasAppFadeUp ${duration}ms ease ${delay}ms both`,
  }
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path d="M21.56 11.24L20.2 9.66C19.94 9.36 19.73 8.8 19.73 8.4V6.7C19.73 5.64 18.86 4.77 17.8 4.77H16.1C15.71 4.77 15.14 4.56 14.84 4.3L13.26 2.94C12.57 2.35 11.44 2.35 10.74 2.94L9.17 4.31C8.87 4.56 8.3 4.77 7.91 4.77H6.18C5.12 4.77 4.25 5.64 4.25 6.7V8.41C4.25 8.8 4.04 9.36 3.79 9.66L2.44 11.25C1.86 11.94 1.86 13.06 2.44 13.75L3.79 15.34C4.04 15.64 4.25 16.2 4.25 16.59V18.3C4.25 19.36 5.12 20.23 6.18 20.23H7.91C8.3 20.23 8.87 20.44 9.17 20.7L10.75 22.06C11.44 22.65 12.57 22.65 13.27 22.06L14.85 20.7C15.15 20.44 15.71 20.23 16.11 20.23H17.81C18.87 20.23 19.74 19.36 19.74 18.3V16.6C19.74 16.21 19.95 15.64 20.21 15.34L21.57 13.76C22.15 13.07 22.15 11.93 21.56 11.24ZM16.16 10.61L11.33 15.44C11.19 15.58 11 15.66 10.8 15.66C10.6 15.66 10.41 15.58 10.27 15.44L7.85 13.02C7.56 12.73 7.56 12.25 7.85 11.96C8.14 11.67 8.62 11.67 8.91 11.96L10.8 13.85L15.1 9.55C15.39 9.26 15.87 9.26 16.16 9.55C16.45 9.84 16.45 10.32 16.16 10.61Z" fill="#9BD772" />
    </svg>
  )
}

function GasIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14.8933 6.22L13.56 5.55334C13.3133 5.43334 13.0067 5.52667 12.8867 5.77334C12.76 6.02667 12.86 6.32667 13.1067 6.44667L14.1667 6.97334V10.1667L11.6667 10.1733V3.33334C11.6667 2 10.7733 1.33334 9.66668 1.33334H4.33334C3.22668 1.33334 2.33334 2 2.33334 3.33334V14.1667H1.33334C1.06001 14.1667 0.833344 14.3933 0.833344 14.6667C0.833344 14.94 1.06001 15.1667 1.33334 15.1667H12.6667C12.94 15.1667 13.1667 14.94 13.1667 14.6667C13.1667 14.3933 12.94 14.1667 12.6667 14.1667H11.6667V11.1733L14.6667 11.1667C14.9467 11.1667 15.1667 10.94 15.1667 10.6667V6.66667C15.1667 6.48 15.06 6.30667 14.8933 6.22ZM4.00001 4.59334C4.00001 3.66667 4.56668 3.33334 5.26001 3.33334H8.74668C9.43334 3.33334 10 3.66667 10 4.59334V5.41334C10 6.33334 9.43334 6.66667 8.74001 6.66667H5.26001C4.56668 6.66667 4.00001 6.33334 4.00001 5.40667V4.59334ZM4.33334 8.16667H6.33334C6.60668 8.16667 6.83334 8.39334 6.83334 8.66667C6.83334 8.94 6.60668 9.16667 6.33334 9.16667H4.33334C4.06001 9.16667 3.83334 8.94 3.83334 8.66667C3.83334 8.39334 4.06001 8.16667 4.33334 8.16667Z" fill="white" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14.3733 7.16L13.4667 6.10667C13.2933 5.90667 13.1533 5.53333 13.1533 5.26667V4.13333C13.1533 3.42667 12.5733 2.84666 11.8667 2.84666H10.7333C10.4733 2.84666 10.0933 2.70667 9.89334 2.53333L8.84 1.62667C8.38 1.23333 7.62667 1.23333 7.16 1.62667L6.11334 2.54C5.91334 2.70667 5.53334 2.84666 5.27334 2.84666H4.12C3.41334 2.84666 2.83334 3.42667 2.83334 4.13333V5.27333C2.83334 5.53333 2.69334 5.90667 2.52667 6.10667L1.62667 7.16666C1.24 7.62666 1.24 8.37333 1.62667 8.83333L2.52667 9.89333C2.69334 10.0933 2.83334 10.4667 2.83334 10.7267V11.8667C2.83334 12.5733 3.41334 13.1533 4.12 13.1533H5.27334C5.53334 13.1533 5.91334 13.2933 6.11334 13.4667L7.16667 14.3733C7.62667 14.7667 8.38 14.7667 8.84667 14.3733L9.9 13.4667C10.1 13.2933 10.4733 13.1533 10.74 13.1533H11.8733C12.58 13.1533 13.16 12.5733 13.16 11.8667V10.7333C13.16 10.4733 13.3 10.0933 13.4733 9.89333L14.38 8.84C14.7667 8.38 14.7667 7.62 14.3733 7.16ZM10.7733 6.74L7.55334 9.96C7.46 10.0533 7.33334 10.1067 7.2 10.1067C7.06667 10.1067 6.94 10.0533 6.84667 9.96L5.23334 8.34667C5.04 8.15333 5.04 7.83333 5.23334 7.64C5.42667 7.44666 5.74667 7.44666 5.94 7.64L7.2 8.9L10.0667 6.03333C10.26 5.84 10.58 5.84 10.7733 6.03333C10.9667 6.22667 10.9667 6.54666 10.7733 6.74Z" fill="black" />
    </svg>
  )
}

const styles: Record<string, CSSProperties> = {
  screen: {
    minHeight: '100%',
    width: '100%',
    background: '#FFFFFF',
    padding: '52px 16px 24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#000000',
    overflow: 'hidden',
  },
  wordmark: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 28,
    opacity: 0,
  },
  card: {
    borderRadius: 18,
    border: '1px solid rgba(0,0,0,0.06)',
    boxSizing: 'border-box',
  },
  offerCard: {
    background: '#F5F5F5',
    padding: '16px 18px 18px',
    gap: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  offerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerPill: {
    fontSize: 12,
    lineHeight: 1,
    color: 'rgba(0,0,0,0.45)',
    borderRadius: 999,
    padding: '10px 14px',
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#FAFAFA',
  },
  offerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  offerTitleRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#6A6A6A',
  },
  offerTime: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.38)',
  },
  placeholderBar: {
    height: 14,
    borderRadius: 999,
    background: '#E1E3E8',
  },
  sliderCard: {
    background: '#FFFFFF',
    marginTop: 12,
    padding: '12px 16px 18px',
  },
  sliderHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: '#5A5A5A',
  },
  sliderMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  amountBadge: {
    borderRadius: 10,
    border: '1px solid rgba(0,0,0,0.1)',
    padding: '8px 12px',
    fontSize: 14,
    color: '#555555',
    background: '#FFFFFF',
    lineHeight: 1,
  },
  kgBadge: {
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.08)',
    padding: '6px 8px',
    fontSize: 14,
    color: 'rgba(0,0,0,0.35)',
    lineHeight: 1,
  },
  sliderAmount: {
    fontSize: 18,
    fontWeight: 700,
    color: '#606060',
  },
  sliderWrap: {
    position: 'relative',
    height: 24,
    display: 'flex',
    alignItems: 'center',
  },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 999,
    background: 'rgba(0,0,0,0.08)',
    pointerEvents: 'none',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 999,
    background: '#7A7A7A',
  },
  sliderInput: {
    position: 'relative',
    width: '100%',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundColor: 'transparent',
    height: 8,
    borderRadius: 999,
    outline: 'none',
  },
  connectorSolid: {
    width: 1,
    height: 38,
    background: 'rgba(0,0,0,0.15)',
    marginLeft: 37,
    marginTop: -8,
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusRowLast: {
    alignItems: 'flex-start',
    marginTop: -4,
  },
  statusIconSolid: {
    width: 38,
    height: 38,
    borderRadius: 999,
    background: '#454545',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  statusIconDashed: {
    width: 38,
    height: 38,
    borderRadius: 999,
    border: '1px dashed rgba(0,0,0,0.2)',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  statusTitle: {
    fontSize: 14,
    color: '#575757',
  },
  completedPill: {
    padding: '8px 12px',
    borderRadius: 999,
    background: '#FAFAFA',
    color: '#7CCB56',
    fontSize: 12,
    lineHeight: 1,
  },
  connectorDashed: {
    width: 1,
    height: 30,
    marginLeft: 37,
    marginTop: 6,
    borderLeft: '1px dashed #0085FF',
  },
  statusContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingTop: 2,
    minWidth: 0,
    flex: 1,
  },
  statusHelper: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.45)',
  },
  progressTrack: {
    width: '100%',
    maxWidth: 220,
    height: 8,
    borderRadius: 999,
    background: '#E5E6E8',
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: {
    width: '34%',
    height: '100%',
    borderRadius: 999,
    background: '#52B922',
  },
  headline: {
    margin: '58px 0 0',
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 1.15,
    fontWeight: 700,
    letterSpacing: '-0.03em',
    color: '#111111',
  },
  headlineMuted: {
    color: 'rgba(0,0,0,0.55)',
  },
  ctaWrap: {
    marginTop: 36,
  },
}
