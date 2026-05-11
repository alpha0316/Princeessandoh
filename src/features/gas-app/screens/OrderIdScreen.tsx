import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import GasStatusBar from '../components/GasStatusBar'

type OrderIdScreenProps = {
  onStartOrdering?: () => void
}

type Stage = 'hidden' | 'visible'

const ORDER_ID = 'GA - 007'

const SCREEN_STYLE = `
  @keyframes gasAppCelebrateDrop {
    from {
      opacity: 0;
      transform: translateY(-28px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

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

  @keyframes gasAppConfettiFloat {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-5px) rotate(4deg);
    }
    100% {
      transform: translateY(0) rotate(-2deg);
    }
  }
`

export default function OrderIdScreen({ onStartOrdering }: OrderIdScreenProps) {
  const [stage, setStage] = useState<Stage>('hidden')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setStage('visible'), 180)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1400)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(ORDER_ID)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div style={styles.screen}>
      <style>{SCREEN_STYLE}</style>
      <GasStatusBar />

      <div style={{ ...styles.hero, ...reveal(0, stage, 850, 'gasAppCelebrateDrop') }}>
        <div style={styles.confettiLayer} aria-hidden="true">
          {CONFETTI.map((piece) => (
            <span
              key={piece.id}
              style={{
                ...styles.confettiPiece,
                left: piece.left,
                top: piece.top,
                width: piece.width,
                height: piece.height,
                background: piece.background,
                borderRadius: piece.radius,
                transform: piece.rotate,
                animation: `gasAppConfettiFloat ${piece.duration}ms ease-in-out ${piece.delay}ms infinite`,
              }}
            />
          ))}
        </div>

        <div style={styles.sparkles} aria-hidden="true">
          <span style={{ ...styles.sparkle, left: '14%', top: '18%', color: '#7A72F3' }}>✦</span>
          <span style={{ ...styles.sparkle, left: '72%', top: '16%', color: '#52B922' }}>✦</span>
          <span style={{ ...styles.sparkle, left: '31%', top: '39%', color: '#A66BF4' }}>✦</span>
          <span style={{ ...styles.sparkle, left: '82%', top: '48%', color: '#52B922' }}>✦</span>
        </div>

        <div style={styles.heroBadge}>Account Approved</div>
      </div>

      <div style={styles.cardsStack}>
        <div style={{ ...styles.stackShell, ...reveal(120, stage, 820) }}>
          <div style={styles.backCardFar}>
            <GhostCard />
          </div>
        </div>

        <div style={{ ...styles.stackShell, ...reveal(260, stage, 820) }}>
          <div style={styles.backCardNear}>
            <GhostCard />
          </div>
        </div>

        <div style={{ ...styles.stackShell, ...reveal(420, stage, 860) }}>
          <div style={styles.primaryCard}>
            <div style={styles.userBlock}>
              <div style={styles.avatar}>
                <span style={styles.avatarInitials}>EP</span>
              </div>

              <div style={styles.userMeta}>
                <span style={styles.userName}>Prince Essandoh Takyi</span>
                <span style={styles.userIdMuted}>{ORDER_ID}</span>
              </div>
            </div>

            <CheckmarkIcon />
          </div>
        </div>
      </div>

      <div style={{ ...styles.content, ...reveal(560, stage, 860) }}>
        <h1 style={styles.title}>Your GasApp Account Has Been Created Successfully</h1>
        <p style={styles.subtitle}>Use this ID to track your orders</p>

        <button
          type="button"
          onClick={handleCopyId}
          style={{
            ...styles.idPill,
            background: copied ? 'rgba(82, 185, 34, 0.08)' : '#FAFAFA',
            borderColor: copied ? 'rgba(82, 185, 34, 0.22)' : 'rgba(0,0,0,0.10)',
          }}
        >
          <span style={styles.idText}>{ORDER_ID}</span>
          <CopyIcon />
        </button>

        <div style={styles.copyHint}>{copied ? 'Copied to clipboard' : 'Tap to copy your order ID'}</div>

        <div style={styles.ctaWrap}>
          <PrimaryButton title="Start Ordering" onPress={onStartOrdering} />
        </div>
      </div>
    </div>
  )
}

function reveal(delay: number, stage: Stage, duration = 800, animationName = 'gasAppFadeUp') {
  if (stage === 'hidden') {
    return {
      opacity: 0,
      transform: animationName === 'gasAppCelebrateDrop' ? 'translateY(-28px)' : 'translateY(26px)',
    }
  }

  return {
    opacity: 1,
    transform: 'translateY(0)',
    animation: `${animationName} ${duration}ms ease ${delay}ms both`,
  }
}

function GhostCard() {
  return (
    <div style={styles.ghostCardInner}>
      <div style={styles.ghostUser}>
        <div style={styles.ghostAvatar} />
        <div style={styles.ghostMeta}>
          <div style={{ ...styles.ghostLine, width: '62%' }} />
          <div style={{ ...styles.ghostLine, width: '34%', height: 10 }} />
        </div>
      </div>
      <div style={styles.ghostBadge} />
    </div>
  )
}

function CheckmarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17.9667 8.94997L16.8333 7.6333C16.6167 7.3833 16.4417 6.91663 16.4417 6.5833L16.4417 5.16663C16.4417 4.2833 15.7167 3.5583 14.8333 3.5583L13.4167 3.5583C13.0917 3.5583 12.6167 3.3833 12.3667 3.16663L11.05 2.0333C10.475 1.54163 9.53334 1.54163 8.95 2.0333L7.64167 3.17497C7.39167 3.3833 6.91667 3.5583 6.59167 3.5583L5.15 3.5583C4.26667 3.5583 3.54167 4.2833 3.54167 5.16663L3.54167 6.59163C3.54167 6.91663 3.36667 7.3833 3.15834 7.6333L2.03334 8.9583C1.55 9.5333 1.55 10.4666 2.03334 11.0416L3.15834 12.3666C3.36667 12.6166 3.54167 13.0833 3.54167 13.4083L3.54167 14.8333C3.54167 15.7166 4.26667 16.4416 5.15 16.4416L6.59167 16.4416C6.91667 16.4416 7.39167 16.6166 7.64167 16.8333L8.95834 17.9666C9.53334 18.4583 10.475 18.4583 11.0583 17.9666L12.375 16.8333C12.625 16.6166 13.0917 16.4416 13.425 16.4416L14.8417 16.4416C15.725 16.4416 16.45 15.7166 16.45 14.8333L16.45 13.4166C16.45 13.0916 16.625 12.6166 16.8417 12.3666L17.975 11.05C18.4583 10.475 18.4583 9.52497 17.9667 8.94997ZM13.4667 8.42497L9.44167 12.45C9.325 12.5666 9.16667 12.6333 9 12.6333C8.83334 12.6333 8.67501 12.5666 8.55834 12.45L6.54167 10.4333C6.3 10.1916 6.3 9.79163 6.54167 9.54997C6.78334 9.3083 7.18334 9.3083 7.425 9.54997L9 11.125L12.5833 7.54163C12.825 7.29997 13.225 7.29997 13.4667 7.54163C13.7083 7.7833 13.7083 8.1833 13.4667 8.42497Z" fill="#52B922" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10.6666 8.60004V11.4C10.6666 13.7334 9.73331 14.6667 7.39998 14.6667H4.59998C2.26665 14.6667 1.33331 13.7334 1.33331 11.4V8.60004C1.33331 6.26671 2.26665 5.33337 4.59998 5.33337H7.39998C9.73331 5.33337 10.6666 6.26671 10.6666 8.60004Z" fill="#00000060" />
      <path d="M11.4 1.33337H8.60003C6.67933 1.33337 5.7117 1.97031 5.42926 3.49264C5.32767 4.04021 5.79502 4.50004 6.35193 4.50004H7.40003C10.2 4.50004 11.5 5.80004 11.5 8.60004V9.64814C11.5 10.205 11.9599 10.6724 12.5074 10.5708C14.0298 10.2884 14.6667 9.32074 14.6667 7.40004V4.60004C14.6667 2.26671 13.7334 1.33337 11.4 1.33337Z" fill="#00000060" />
    </svg>
  )
}

const CONFETTI = [
  { id: 'a', left: '7%', top: '8%', width: 12, height: 20, background: '#726CE8', radius: 999, rotate: 'rotate(-34deg)', duration: 2400, delay: 0 },
  { id: 'b', left: '21%', top: '12%', width: 12, height: 12, background: '#F4E66A', radius: 2, rotate: 'rotate(35deg)', duration: 2100, delay: 250 },
  { id: 'c', left: '55%', top: '8%', width: 26, height: 4, background: '#7FD56B', radius: 999, rotate: 'rotate(84deg)', duration: 2600, delay: 180 },
  { id: 'd', left: '70%', top: '14%', width: 16, height: 16, background: '#6BE0E9', radius: 1, rotate: 'rotate(58deg)', duration: 2300, delay: 320 },
  { id: 'e', left: '86%', top: '16%', width: 16, height: 8, background: '#6FE0BC', radius: 999, rotate: 'rotate(0deg)', duration: 2500, delay: 210 },
  { id: 'f', left: '8%', top: '34%', width: 18, height: 8, background: '#FFBE66', radius: 999, rotate: 'rotate(0deg)', duration: 2200, delay: 410 },
  { id: 'g', left: '28%', top: '22%', width: 18, height: 18, background: '#A56EF2', radius: 1, rotate: 'rotate(28deg)', duration: 2400, delay: 520 },
  { id: 'h', left: '46%', top: '18%', width: 28, height: 4, background: '#F9A65F', radius: 999, rotate: 'rotate(8deg)', duration: 2800, delay: 120 },
  { id: 'i', left: '58%', top: '31%', width: 16, height: 14, background: '#FF7C71', radius: 2, rotate: 'rotate(28deg)', duration: 2500, delay: 610 },
  { id: 'j', left: '74%', top: '27%', width: 34, height: 3, background: '#F4DE67', radius: 999, rotate: 'rotate(46deg)', duration: 2600, delay: 440 },
  { id: 'k', left: '88%', top: '45%', width: 24, height: 3, background: '#726CE8', radius: 999, rotate: 'rotate(-36deg)', duration: 2350, delay: 390 },
  { id: 'l', left: '10%', top: '58%', width: 12, height: 12, background: '#FF7A8B', radius: 1, rotate: 'rotate(14deg)', duration: 2300, delay: 530 },
  { id: 'm', left: '67%', top: '60%', width: 28, height: 3, background: '#F0A04A', radius: 999, rotate: 'rotate(-58deg)', duration: 2900, delay: 160 },
  { id: 'n', left: '82%', top: '63%', width: 10, height: 10, background: '#F9D968', radius: 1, rotate: 'rotate(18deg)', duration: 2150, delay: 470 },
]

const styles: Record<string, CSSProperties> = {
  screen: {
    minHeight: '100%',
    width: '100%',
    background: '#FFFFFF',
    padding: '52px 16px 28px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#000000',
    overflow: 'hidden',
  },
  hero: {
    position: 'relative',
    height: 238,
    marginBottom: 8,
  },
  confettiLayer: {
    position: 'absolute',
    inset: 0,
  },
  confettiPiece: {
    position: 'absolute',
    display: 'block',
  },
  sparkles: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 12,
    lineHeight: 1,
  },
  heroBadge: {
    position: 'absolute',
    left: '50%',
    top: 88,
    transform: 'translateX(-50%)',
    padding: '10px 18px',
    borderRadius: 999,
    background: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 8px 26px rgba(0,0,0,0.05)',
    fontSize: 13,
    fontWeight: 600,
    color: '#52B922',
  },
  cardsStack: {
    position: 'relative',
    height: 120,
    marginTop: -106,
    marginBottom: 12,
  },
  stackShell: {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  primaryCard: {
    width: '100%',
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.06)',
    background: '#FFFFFF',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    padding: '13px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backCardNear: {
    width: '90%',
    transform: 'translateY(19px)',
    opacity: 0.82,
  },
  backCardFar: {
    width: '78%',
    transform: 'translateY(38px)',
    opacity: 0.58,
  },
  ghostCardInner: {
    width: '100%',
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.05)',
    background: '#FFFFFF',
    padding: '13px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ghostUser: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  ghostAvatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    background: '#EEF0F2',
    flexShrink: 0,
  },
  ghostMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
  },
  ghostLine: {
    height: 12,
    borderRadius: 999,
    background: '#EEF0F2',
  },
  ghostBadge: {
    width: 18,
    height: 18,
    borderRadius: 999,
    background: '#EEF0F2',
    flexShrink: 0,
  },
  userBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: 'linear-gradient(180deg, #79B8EA 0%, #4E81C5 100%)',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1,
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  userName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#2A2A2A',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 220,
  },
  userIdMuted: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: '0 8px',
    marginTop: 8,
  },
  title: {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.16,
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: '-0.03em',
    color: '#111111',
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.4,
    color: 'rgba(0,0,0,0.55)',
    textAlign: 'center',
  },
  idPill: {
    marginTop: 10,
    borderRadius: 16,
    border: '1px dashed rgba(0,0,0,0.10)',
    padding: '10px 14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    transition: 'all 180ms ease',
  },
  idText: {
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 700,
    color: '#52B922',
    letterSpacing: '-0.03em',
  },
  copyHint: {
    minHeight: 18,
    fontSize: 12,
    color: 'rgba(0,0,0,0.42)',
    textAlign: 'center',
  },
  ctaWrap: {
    width: '100%',
    marginTop: 18,
  },
}
