import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import GasStatusBar from '../components/GasStatusBar'

type AmountScreenProps = {
  offerName?: string
  offerPrice?: number
  cylinderName?: string
  cylinderPrice?: number
  autoSlide?: boolean
  embedded?: boolean
  onBack?: () => void
  onContinue?: (payload: {
    amount: string
    selectedKg: number
    totalCost: number
  }) => void
}

type Stage = 'hidden' | 'visible'

const SCREEN_STYLE = `
  @keyframes gasAppFadeUp {
    from {
      opacity: 0;
      transform: translateY(24px);
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
    background: #111111;
    border: 4px solid #BDBDBD;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    cursor: pointer;
  }

  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: #111111;
    border: 4px solid #BDBDBD;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    cursor: pointer;
  }
`

export default function AmountScreen({
  offerName = 'Emergency Offer',
  offerPrice = 12,
  cylinderName: _cylinderName = 'Small Size',
  cylinderPrice = 3,
  autoSlide = false,
  embedded = false,
  onBack,
  onContinue,
}: AmountScreenProps) {
  const [stage, setStage] = useState<Stage>('hidden')
  const [amount, setAmount] = useState('50.00')
  const [sliderValue, setSliderValue] = useState(0.36)

  useEffect(() => {
    const timer = window.setTimeout(() => setStage('visible'), 120)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!autoSlide) return
    let raf: number
    const PERIOD = 5200
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = ((t - t0) % PERIOD) / PERIOD
      const e = (1 - Math.cos(2 * Math.PI * p)) / 2
      const val = 0.05 + 0.82 * e
      const kg = 2 + Math.round(val * 22)
      setSliderValue(val)
      setAmount((kg * 5).toFixed(2))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [autoSlide])

  const selectedKg = useMemo(() => 2 + Math.round(sliderValue * 22), [sliderValue])

  const totalCost = useMemo(() => {
    const amountNum = parseFloat(amount) || 0
    return offerPrice + cylinderPrice + amountNum
  }, [amount, offerPrice, cylinderPrice])

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
    const kg = 2 + Math.round(value * 22)
    const calculatedPrice = kg * 5
    setAmount(calculatedPrice.toFixed(2))
  }

  const handleAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      const numeric = parseFloat(value)
      if (!Number.isNaN(numeric)) {
        const kg = Math.max(2, Math.min(24, Math.round(numeric / 5)))
        setSliderValue((kg - 2) / 22)
      }
    }
  }

  const handleContinue = () => {
    if (!amount || amount === '0') return
    onContinue?.({
      amount,
      selectedKg,
      totalCost,
    })
  }

  const sliderPercent = sliderValue * 100
  const isButtonDisabled = !amount || parseFloat(amount) <= 0

  return (
    <div style={{ ...styles.screen, ...(embedded ? styles.screenEmbedded : null) }}>
      <style>{SCREEN_STYLE}</style>
      {!embedded && <GasStatusBar />}

      {!embedded && (
        <header style={{ ...styles.header, ...reveal(0, stage, 760) }}>
          <button type="button" onClick={onBack} style={styles.backButton} aria-label="Back">
            <BackChevronIcon />
          </button>
          <div style={styles.headerTitle}>Amount</div>
          <div style={styles.headerSpacer} aria-hidden="true" />
        </header>
      )}

      <section style={{ ...styles.entryBlock, ...(embedded ? styles.entryBlockEmbedded : null), ...reveal(110, stage, 780) }}>
        <label htmlFor="gas-amount" style={styles.entryLabel}>Enter Amount You Want To Buy</label>
        <input
          id="gas-amount"
          type="text"
          inputMode="decimal"
          placeholder="GHC"
          value={amount}
          onChange={(event) => handleAmountChange(event.target.value)}
          style={styles.entryInput}
        />
      </section>

      {!embedded && (
        <div style={{ ...styles.orRow, ...reveal(180, stage, 780) }}>
          <div style={styles.orLine} />
          <span style={styles.orText}>OR</span>
          <div style={styles.orLine} />
        </div>
      )}

      <section style={{ ...styles.sliderCard, ...(embedded ? styles.sliderCardEmbedded : null), ...reveal(260, stage, 840) }}>
        <div style={styles.sliderHeader}>
          <span style={styles.sliderTitle}>Slider</span>

          <div style={styles.sliderMeta}>
            {!embedded && <span style={styles.amountPill}>GH 50.00</span>}
            <span style={styles.kgPill}>{selectedKg}Kg</span>
            <span style={styles.sliderAmount}>GHC {amount || '0.00'}</span>
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
            onChange={(event) => handleSliderChange(Number(event.target.value))}
            aria-label="Gas refill amount"
            style={{
              ...styles.sliderInput,
              background: `linear-gradient(to right, #111111 0%, #111111 ${sliderPercent}%, rgba(0,0,0,0.08) ${sliderPercent}%, rgba(0,0,0,0.08) 100%)`,
            }}
          />
        </div>

        <div style={styles.sliderScale}>
          <span style={styles.scaleText}>Min <span style={styles.scaleStrong}>(2Kg)</span></span>
          <span style={styles.scaleText}>Max <span style={styles.scaleStrong}>(24Kg)</span></span>
        </div>

        <p style={styles.sliderHelper}>
          Use the slider below to select the amount you&apos;d like to fill your gas cylinder
        </p>
      </section>

      {embedded ? (
        <div style={{ ...styles.sliderShadowStack, ...reveal(330, stage, 820) }} aria-hidden="true">
          <div style={{ ...styles.sliderShadowCard, ...styles.sliderShadowCardMiddle }} />
          <div style={{ ...styles.sliderShadowCard, ...styles.sliderShadowCardBack }} />
        </div>
      ) : (
        <aside style={{ ...styles.summaryPanel, ...reveal(410, stage, 860) }}>
          <div style={styles.summaryTitle}>Cost Summary</div>

          <SummaryRow label={offerName} value={`GH${offerPrice.toFixed(2)}`} />
          <SummaryRow label="Cylinder Size" value={`GH ${cylinderPrice.toFixed(2)}`} />
          <SummaryRow label="Amount You Want To Buy" value={amount ? `GH ${amount}` : 'n/a'} />

          <div style={styles.summaryDivider} />

          <SummaryRow label="Total Cost" value={`GH${totalCost.toFixed(2)}`} strong />

          <div style={styles.summaryButtonWrap}>
            <PrimaryButton title="Make Payment" onPress={handleContinue} disabled={isButtonDisabled} />
          </div>
        </aside>
      )}
    </div>
  )
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={styles.summaryRow}>
      <span style={{ ...styles.summaryLabel, color: strong ? '#4F4F4F' : 'rgba(0,0,0,0.50)' }}>{label}</span>
      <span style={{ ...styles.summaryValue, fontWeight: strong ? 600 : 400 }}>{value}</span>
    </div>
  )
}

function BackChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6667 15L6.66669 10L11.6667 5" stroke="#4F4F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function reveal(delay: number, stage: Stage, duration = 800) {
  if (stage === 'hidden') {
    return {
      opacity: 0,
      transform: 'translateY(24px)',
    }
  }

  return {
    opacity: 1,
    transform: 'translateY(0)',
    animation: `gasAppFadeUp ${duration}ms ease ${delay}ms both`,
  }
}

const styles: Record<string, CSSProperties> = {
  screen: {
    minHeight: '100%',
    width: '100%',
    background: '#FFFFFF',
    padding: '52px 16px 18px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#000000',
    overflowY: 'auto',
  },
  screenEmbedded: {
    background: '#F7F7F3',
    padding: '46px 48px 40px',
    overflow: 'hidden',
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 40px',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottom: '1px solid rgba(0,0,0,0.10)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.06)',
    background: '#FAFAFA',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    cursor: 'pointer',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 700,
    color: '#111111',
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  entryBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingTop: 16,
  },
  entryBlockEmbedded: {
    paddingTop: 0,
    gap: 12,
    marginBottom: 40,
  },
  entryLabel: {
    fontSize: 16,
    color: '#4F4F4F',
    lineHeight: 1.3,
  },
  entryInput: {
    height: 48,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.10)',
    background: '#FAFAFA',
    padding: '0 14px',
    fontSize: 16,
    color: '#111111',
    outline: 'none',
  },
  orRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 0 10px',
  },
  orLine: {
    flex: 1,
    height: 1,
    background: 'rgba(0,0,0,0.10)',
  },
  orText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.45)',
  },
  sliderCard: {
    borderRadius: 16,
    border: '1px solid rgba(0,0,0,0.10)',
    background: '#FFFFFF',
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sliderCardEmbedded: {
    position: 'relative',
    zIndex: 3,
    borderRadius: 18,
    padding: 18,
    gap: 18,
    boxShadow: '0 10px 28px rgba(0,0,0,0.03)',
  },
  sliderHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111111',
  },
  sliderMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  amountPill: {
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#FAFAFA',
    padding: '8px 10px',
    fontSize: 12,
    color: '#4F4F4F',
    lineHeight: 1,
  },
  kgPill: {
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#FAFAFA',
    padding: '8px 10px',
    fontSize: 12,
    color: 'rgba(0,0,0,0.40)',
    lineHeight: 1,
  },
  sliderAmount: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111111',
  },
  sliderWrap: {
    position: 'relative',
    height: 20,
    display: 'flex',
    alignItems: 'center',
  },
  sliderTrack: {
    position: 'absolute',
    inset: '50% 0 auto 0',
    transform: 'translateY(-50%)',
    height: 4,
    borderRadius: 999,
    background: 'rgba(0,0,0,0.08)',
    pointerEvents: 'none',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 999,
    background: '#111111',
  },
  sliderInput: {
    position: 'relative',
    width: '100%',
    appearance: 'none',
    WebkitAppearance: 'none',
    height: 4,
    borderRadius: 999,
    outline: 'none',
    backgroundColor: 'transparent',
  },
  sliderScale: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  scaleText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.50)',
  },
  scaleStrong: {
    color: '#4F4F4F',
  },
  sliderHelper: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.35,
    color: 'rgba(0,0,0,0.50)',
  },
  summaryPanel: {
    marginTop: 'auto',
    background: '#FFFFFF',
    borderRadius: '22px 22px 0 0',
    border: '1px solid rgba(0,0,0,0.10)',
    padding: '20px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: '0 -8px 24px rgba(0,0,0,0.04)',
    marginLeft: -16,
    marginRight: -16,
  },
  sliderShadowStack: {
    position: 'relative',
    marginTop: -10,
    height: 34,
    pointerEvents: 'none',
  },
  sliderShadowCard: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: 18,
    border: '1px solid rgba(0,0,0,0.10)',
    background: '#F7F7F3',
    boxShadow: '0 10px 18px rgba(0,0,0,0.02)',
  },
  sliderShadowCardMiddle: {
    top: 0,
    width: '92%',
    height: 24,
  },
  sliderShadowCardBack: {
    top: 10,
    width: '84%',
    height: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111111',
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 14,
    lineHeight: 1.4,
  },
  summaryValue: {
    fontSize: 14,
    color: '#111111',
    lineHeight: 1.4,
  },
  summaryDivider: {
    height: 1,
    background: 'rgba(0,0,0,0.10)',
    width: '100%',
  },
  summaryButtonWrap: {
    paddingTop: 4,
  },
}
