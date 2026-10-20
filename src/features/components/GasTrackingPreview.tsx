import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle, MapPin, Package, X } from '@phosphor-icons/react'
import GasTrackingBottomSheet, { type DeliveryPreviewStage } from './GasTrackingBottomSheet'
import GasMap from './GasMap'
import { RiderIcon } from './gasShared'
import MobileStatusBar from './MobileStatusBar'
import './gas-tracking-preview.css'

const STATION: [number, number] = [6.6958, -1.6265]
const CUSTOMER: [number, number] = [6.6992, -1.6151]
const MAP_CENTER: [number, number] = [6.6975, -1.6208]

const stages: { id: DeliveryPreviewStage; title: string; left: string; top: string }[] = [
  { id: 'pickup', title: 'Heading to user location', left: '40%', top: '16%' },
  { id: 'station', title: 'Heading to filling station', left: '32%', top: '39%' },
  { id: 'filling', title: 'Filling process', left: '18%', top: '10%' },
  { id: 'new-order', title: 'Filling process', left: '18%', top: '10%' },
  { id: 'returning', title: 'Heading to user location', left: '58%', top: '22%' },
  { id: 'complete', title: 'Delivery complete', left: '60%', top: '22%' },
]

const stageLength = 4200
const cycleLength = stages.length * stageLength

export default function GasTrackingPreview({ isPaused = false }: { isPaused?: boolean }) {
  const [elapsed, setElapsed] = useState(stageLength)
  const elapsedRef = useRef(stageLength)
  const [collapsed, setCollapsed] = useState(false)
  const [orderDecision, setOrderDecision] = useState<'accepted' | 'declined' | null>(null)
  const [completeDismissed, setCompleteDismissed] = useState(false)
  const cycleElapsed = elapsed % cycleLength
  const timeline = { index: Math.floor(cycleElapsed / stageLength), within: cycleElapsed % stageLength }
  const stage = stages[timeline.index]
  const isFinal = stage.id === 'complete'
  const bottomSheetProgress = stage.id === 'pickup'
    ? (timeline.within / stageLength) * 68
    : stage.id === 'filling' || stage.id === 'new-order'
      ? (timeline.within / stageLength) * 90
      : stage.id === 'returning'
        ? (timeline.within / stageLength) * 100
        : 100

  useEffect(() => {
    if (isPaused) return
    const startOffset = elapsedRef.current
    const startedAt = performance.now()
    const timer = window.setInterval(() => {
      const nextElapsed = startOffset + performance.now() - startedAt
      elapsedRef.current = nextElapsed
      setElapsed(nextElapsed)
    }, 100)
    return () => {
      elapsedRef.current = startOffset + performance.now() - startedAt
      window.clearInterval(timer)
    }
  }, [isPaused])

  useEffect(() => {
    if (stage.id === 'new-order') setOrderDecision(null)
    if (stage.id === 'complete') setCompleteDismissed(false)
  }, [stage.id])

  function dismissComplete() {
    setCompleteDismissed(true)
    const cycleStart = Math.floor(elapsedRef.current / cycleLength) * cycleLength
    elapsedRef.current = cycleStart + cycleLength
    setElapsed(elapsedRef.current)
  }

  return (
    <div className="gas-tracking-phone" aria-label="Rider delivery tracking with animated pickup and refill progress">
      <div className="gas-tracking-screen">
        <div className="gas-tracking-map" aria-hidden="true">
          <GasMap center={MAP_CENTER} zoom={14} markers={[{ position: STATION, color: '#ff8a21' }, { position: CUSTOMER, color: '#31c356' }]} />
          <svg className="gas-map-route" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M18 9 C 24 18, 31 31, 32 39 S 47 27, 60 22" />
          </svg>
          <div className={`gas-map-rider gas-map-rider--${stage.id}`} style={{ left: stage.left, top: stage.top }}><RiderIcon /></div>
        </div>

        <MobileStatusBar />
        <header className="gas-tracking-header">
          <button aria-label="Back" tabIndex={-1}><ArrowLeft size={15} weight="bold" /></button>
          <strong>{stage.title}</strong>
          <span aria-hidden="true" />
        </header>

        <GasTrackingBottomSheet
          stage={stage.id}
          progress={bottomSheetProgress}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />

        {stage.id === 'new-order' && timeline.within < 3300 && orderDecision === null && <div className="gas-tracking-modal-backdrop">
          <section className="gas-tracking-order-modal" aria-label="New order request">
            <button className="gas-tracking-modal-close" onClick={() => setOrderDecision('declined')} aria-label="Close"><X size={13} /></button>
            <h2>New Order Request</h2><p>You can queue this for after your current delivery or decline it.</p>
            <div className="gas-tracking-request-customer"><span><strong>Essandoh Prince Takyi</strong><small>055 414 4611</small></span><b>+ ₵ 15</b></div>
            <div className="gas-tracking-request-info">
              <div className="gas-tracking-request-row"><Package size={13} />Order<b>1 cylinder</b></div>
              <div className="gas-tracking-request-divider" />
              <div className="gas-tracking-request-address">
                <span className="gas-tracking-request-label">Filling Station</span>
                <div className="gas-tracking-request-address-row"><MapPin size={12} />Total — Adum<a className="gas-tracking-request-link" tabIndex={-1}>View Location</a></div>
              </div>
              <div className="gas-tracking-request-divider" />
              <div className="gas-tracking-request-address">
                <span className="gas-tracking-request-label">Deliver To</span>
                <div className="gas-tracking-request-address-row"><MapPin size={12} />Harper Rd · Adum</div>
              </div>
            </div>
            <div className="gas-tracking-request-cylinder"><span>🟡</span>Small Size <b>₵ 120</b></div>
            <div className="gas-tracking-request-actions"><button onClick={() => setOrderDecision('declined')}>Decline</button><button onClick={() => setOrderDecision('accepted')}>Accept</button></div>
          </section>
        </div>}

        {orderDecision && stage.id === 'new-order' && <div className="gas-tracking-queue-toast">{orderDecision === 'accepted' ? 'Order added to queue' : 'Order declined'}</div>}

        {isFinal && !completeDismissed && <div className="gas-tracking-complete-backdrop">
          <section className="gas-tracking-complete-modal" aria-label="Delivery complete">
            <CheckCircle size={30} weight="fill" /><h2>Delivery Complete!</h2><p>Order #LPG-2841 · Essandoh Prince Takyi</p>
            <div className="gas-tracking-earnings"><strong>+ ₵ 10</strong><small>Earned From This Delivery</small><div><span><b>3</b><small>Today</small></span><span><b>₵ 470</b><small>Total Earned</small></span><span><b>4.9★</b><small>Rating</small></span></div></div>
            <button onClick={dismissComplete}>Got it</button>
          </section>
        </div>}

        <div className="gas-tracking-home-indicator" aria-hidden="true" />
      </div>
    </div>
  )
}
