import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import GasStatusBar from '../components/GasStatusBar'

type Cylinder = {
  id: string
  name: string
  price: number
  tone: 'yellow' | 'copper'
}

type SelectCylinderScreenProps = {
  offerName?: string
  offerPrice?: number
  simulateSelectId?: string
  autoScroll?: boolean
  controlledSelectedId?: string | null
  onBack?: () => void
  onContinue?: (payload: {
    cylinderId: string
    cylinderName: string
    cylinderPrice: number
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
`

const CYLINDERS: Cylinder[] = [
  { id: '1', name: 'Small Size', price: 3, tone: 'yellow' },
  { id: '2', name: 'Medium Size', price: 5, tone: 'copper' },
]

const SelectCylinderScreen = forwardRef<HTMLDivElement, SelectCylinderScreenProps>(
  function SelectCylinderScreen({
    offerName = 'Emergency Offer',
    offerPrice = 10,
    simulateSelectId,
    autoScroll = false,
    controlledSelectedId,
    onBack,
    onContinue,
  }, ref) {
  const [stage, setStage] = useState<Stage>('hidden')
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId
  const screenRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setStage('visible'), 120)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!simulateSelectId) return
    const timer = window.setTimeout(() => setInternalSelectedId(simulateSelectId), 1400)
    return () => window.clearTimeout(timer)
  }, [simulateSelectId])

  useEffect(() => {
    if (!autoScroll) return
    const timer = window.setTimeout(() => {
      screenRef.current?.scrollTo({ top: 170, behavior: 'smooth' })
    }, 2100)
    return () => window.clearTimeout(timer)
  }, [autoScroll])

  const selectedCylinder = useMemo(
    () => CYLINDERS.find((cylinder) => cylinder.id === selectedId) ?? null,
    [selectedId],
  )

  const totalCost = offerPrice + (selectedCylinder?.price ?? 0)

  const handleSelect = (id: string) => {
    setInternalSelectedId((current) => (current === id ? null : id))
  }

  const handleContinue = () => {
    if (!selectedCylinder) return
    onContinue?.({
      cylinderId: selectedCylinder.id,
      cylinderName: selectedCylinder.name,
      cylinderPrice: selectedCylinder.price,
      totalCost,
    })
  }

  return (
    <div
      ref={(node) => {
        screenRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      style={styles.screen}
    >
      <style>{SCREEN_STYLE}</style>
      <GasStatusBar />

      <header style={{ ...styles.header, ...reveal(0, stage, 760) }}>
        <button type="button" onClick={onBack} style={styles.backButton} aria-label="Back">
          <BackChevronIcon />
        </button>
        <div style={styles.headerTitle}>{offerName}</div>
        <div style={styles.headerSpacer} aria-hidden="true" />
      </header>

      <section style={{ ...styles.sectionHeading, ...reveal(110, stage, 780) }}>
        <h1 style={styles.heading}>Select LPG Cylinder Size</h1>
      </section>

      <section style={styles.cardsList}>
        {CYLINDERS.map((cylinder, index) => {
          const isSelected = selectedId === cylinder.id
          return (
            <article
              key={cylinder.id}
              style={{
                ...styles.cylinderCard,
                ...reveal(220 + index * 120, stage, 820),
                borderColor: isSelected ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.10)',
                background: isSelected ? '#FCFCFC' : '#FFFFFF',
              }}
            >
              <div style={styles.cylinderArtFrame}>
                <CylinderIllustration tone={cylinder.tone} />
              </div>

              <div style={styles.cylinderMeta}>
                <span style={styles.cylinderName}>{cylinder.name}</span>
                <span style={styles.cylinderPrice}>GH {cylinder.price.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={() => handleSelect(cylinder.id)}
                style={{
                  ...styles.selectButton,
                  background: isSelected ? '#000000' : '#F4F4F4',
                  color: isSelected ? '#FFFFFF' : '#111111',
                }}
              >
                {isSelected ? 'Selected' : 'Select'}
              </button>
            </article>
          )
        })}
      </section>

      <aside style={{ ...styles.summaryPanel, ...reveal(410, stage, 860) }}>
        <div style={styles.summaryTitle}>Cost Summary</div>

        <SummaryRow label={offerName} value={`GH${offerPrice.toFixed(2)}`} />
        <SummaryRow label="Cylinder Size" value={selectedCylinder ? `GH ${selectedCylinder.price.toFixed(2)}` : '—'} />

        <div style={styles.summaryDivider} />

        <SummaryRow label="Total Cost" value={`GH${totalCost.toFixed(2)}`} strong />

        <div style={styles.summaryButtonWrap}>
          <PrimaryButton title="Continue" onPress={handleContinue} disabled={!selectedCylinder} />
        </div>
      </aside>
    </div>
  )
})

export default SelectCylinderScreen

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={styles.summaryRow}>
      <span
        style={{
          ...styles.summaryLabel,
          color: strong ? '#4F4F4F' : 'rgba(0,0,0,0.50)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          ...styles.summaryValue,
          fontWeight: strong ? 600 : 400,
        }}
      >
        {value}
      </span>
    </div>
  )
}

function CylinderIllustration({ tone }: { tone: Cylinder['tone'] }) {
  if (tone === 'yellow') {
    return (
      <div style={styles.cylinderWrap}>
        <div style={{ ...styles.cylinderTopCap, background: '#F0B700' }} />
        <div style={{ ...styles.cylinderTopNeck, background: '#FFD12F' }} />
        <div style={{ ...styles.cylinderBody, background: 'linear-gradient(180deg, #FFD937 0%, #F2B400 100%)' }} />
        <div style={{ ...styles.cylinderBase, background: '#D89B00' }} />
      </div>
    )
  }

  return (
    <div style={styles.cylinderWrap}>
      <div style={{ ...styles.cylinderTopCap, background: '#A95A2A' }} />
      <div style={{ ...styles.cylinderTopNeck, background: '#CC7D47' }} />
      <div style={{ ...styles.cylinderBody, background: 'linear-gradient(180deg, #E29B6A 0%, #A95A2A 100%)' }} />
      <div style={{ ...styles.cylinderBase, background: '#8B461F' }} />
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
  sectionHeading: {
    paddingTop: 12,
    paddingBottom: 10,
  },
  heading: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: '#111111',
    lineHeight: 1.3,
  },
  cardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    paddingBottom: 22,
  },
  cylinderCard: {
    borderRadius: 16,
    border: '1px solid rgba(0,0,0,0.10)',
    background: '#FFFFFF',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  cylinderArtFrame: {
    height: 200,
    borderRadius: 12,
    background: '#FAFAFA',
    border: '1px solid rgba(0,0,0,0.03)',
    display: 'grid',
    placeItems: 'center',
    overflow: 'hidden',
  },
  cylinderWrap: {
    width: 118,
    height: 140,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cylinderTopCap: {
    width: 42,
    height: 18,
    borderRadius: '12px 12px 5px 5px',
    marginBottom: -2,
  },
  cylinderTopNeck: {
    width: 54,
    height: 20,
    borderRadius: '10px 10px 8px 8px',
    marginBottom: -4,
    zIndex: 1,
  },
  cylinderBody: {
    width: 104,
    height: 102,
    borderRadius: 26,
    boxShadow: 'inset 0 6px 14px rgba(255,255,255,0.22), inset 0 -8px 12px rgba(0,0,0,0.08)',
  },
  cylinderBase: {
    width: 102,
    height: 16,
    borderRadius: '0 0 20px 20px',
    marginTop: -6,
  },
  cylinderMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  cylinderName: {
    fontSize: 16,
    color: '#111111',
    fontWeight: 400,
  },
  cylinderPrice: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.50)',
  },
  selectButton: {
    width: '100%',
    border: 'none',
    borderRadius: 999,
    padding: '14px 18px',
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1,
    cursor: 'pointer',
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
