import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, SealCheck } from '@phosphor-icons/react'
import GasTrackingBottomSheet, { type DeliveryPreviewStage } from './GasTrackingBottomSheet'
import { LocationIcon, OrderIcon } from './gasShared'
import MobileStatusBar from './MobileStatusBar'
import './gas-tracking-preview.css'

const stages: { id: DeliveryPreviewStage; title: string }[] = [
  { id: 'pickup', title: 'Heading to user location' },
  { id: 'station', title: 'Heading to filling station' },
  { id: 'filling', title: 'Filling process' },
  { id: 'new-order', title: 'Filling process' },
  { id: 'returning', title: 'Heading to user location' },
  { id: 'complete', title: 'Delivery complete' },
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
        <div className="gas-tracking-map" aria-hidden="true" />

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
            <h2>New Order Request</h2><p>You can queue this for after your current delivery or decline it.</p>
            <div className="gas-tracking-request-customer"><span><strong>Essandoh Prince Takyi</strong><small>055 414 4611</small></span><b>+ ₵ 15</b></div>
            <div className="gas-tracking-request-info">
              <div className="gas-tracking-request-row"><span className="gas-tracking-request-icon"><OrderIcon /></span>Order<b>1 cylinder</b></div>
              <div className="gas-tracking-request-divider gas-tracking-request-divider--dashed" />
              <div className="gas-tracking-request-address">
                <span className="gas-tracking-request-label">Filling Station</span>
                <div className="gas-tracking-request-address-row"><span className="gas-tracking-request-icon"><LocationIcon /></span>Total — Adum<a className="gas-tracking-request-link" tabIndex={-1}>View Location</a></div>
              </div>
              <div className="gas-tracking-request-divider gas-tracking-request-divider--dashed" />
              <div className="gas-tracking-request-address">
                <span className="gas-tracking-request-label">Deliver To</span>
                <div className="gas-tracking-request-address-row"><span className="gas-tracking-request-icon"><LocationIcon /></span>Harper Rd · Adum</div>
              </div>
            </div>
            <div className="gas-tracking-request-cylinder"><span>🟡</span>Small Size <b>₵ 120</b></div>
            <div className="gas-tracking-request-actions"><button onClick={() => setOrderDecision('declined')}>Decline</button><button onClick={() => setOrderDecision('accepted')}>Accept</button></div>
          </section>
        </div>}

        {orderDecision && stage.id === 'new-order' && <div className="gas-tracking-queue-toast">{orderDecision === 'accepted' ? 'Order added to queue' : 'Order declined'}</div>}

        {isFinal && !completeDismissed && <div className="gas-tracking-complete-backdrop">
          <section className="gas-tracking-complete-modal" aria-label="Delivery complete">
            <SealCheck size={34} weight="regular" /><h2>Delivery Complete!</h2><p>Order #LPG-2841 · Essandoh Prince Takyi</p>
            <div className="gas-tracking-earnings"><strong>+ ₵ 10</strong><small>Earned From This Delivery</small><div><span><b>3</b><small>Today</small></span><span><b>₵ 470</b><small>Total Earned</small></span><span><b>4.9★</b><small>Rating</small></span></div></div>
            <button onClick={dismissComplete}>Got it</button>
          </section>
        </div>}

        <div className="gas-tracking-home-indicator" aria-hidden="true" />
      </div>
    </div>
  )
}
