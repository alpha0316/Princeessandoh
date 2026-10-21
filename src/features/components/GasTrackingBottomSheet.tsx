import { CaretDown, CheckCircle, Phone } from '@phosphor-icons/react'
import { Cylinder, FuelIcon, RiderIcon } from './gasShared'

export type DeliveryPreviewStage = 'pickup' | 'station' | 'filling' | 'new-order' | 'returning' | 'complete'

const labels: Record<DeliveryPreviewStage, string> = {
  pickup: 'Rider is on the way to pick up your cylinder',
  station: 'Rider has arrived at the filling Station',
  filling: 'Rider has arrived at the filling Station',
  'new-order': 'Rider has arrived at the filling Station',
  returning: 'Rider has arrived at the filling Station',
  complete: 'Rider has arrived at the filling Station',
}

export default function GasTrackingBottomSheet({
  stage,
  progress,
  collapsed,
  onToggle,
}: {
  stage: DeliveryPreviewStage
  progress: number
  collapsed: boolean
  onToggle: () => void
}) {
  const fillingDone = stage === 'station' || stage === 'returning' || stage === 'complete'
  const fillingActive = stage === 'filling' || stage === 'new-order'
  const fillingPositive = fillingActive || fillingDone
  const refillStarted = stage === 'returning' || stage === 'complete'
  const firstDone = stage !== 'pickup'
  const firstProgress = stage === 'pickup' ? Math.max(14, progress * 0.45) : 100
  const refillProgress = stage === 'returning' ? Math.max(10, progress) : stage === 'station' || stage === 'complete' ? 100 : fillingActive ? progress : 0
  const showFirstStep = stage !== 'returning'

  return (
    <section className={`gas-tracking-sheet${collapsed ? ' is-collapsed' : ''}`} aria-label="Delivery status">
      <header className="gas-sheet-customer">
        <div className="gas-sheet-customer-copy"><strong>Essandoh Prince Takyi</strong><small>055 414 4611</small></div>
        <span className="gas-sheet-tip">+ ₵ 10</span>
        <button className="gas-sheet-toggle" onClick={onToggle} aria-label={collapsed ? 'Expand delivery details' : 'Collapse delivery details'} aria-expanded={!collapsed}><CaretDown size={16} /></button>
      </header>

      <div className="gas-sheet-content">
        <div className="gas-sheet-cylinder-row">
          <span className="gas-sheet-cylinder-icon"><Cylinder color="#ffc632" shade="#d9a217" /></span>
          <span>Small Size</span><strong>₵ 120</strong>
        </div>

        {stage === 'returning' && <div className="gas-sheet-contact-row">
          <div className="gas-sheet-customer-copy"><strong>Essandoh Prince Takyi</strong><small>055 414 4611</small></div>
          <button className="gas-sheet-call" aria-label="Call customer" tabIndex={-1}><Phone weight="fill" /></button>
        </div>}

        <div className="gas-sheet-timeline">
          {showFirstStep && <>
            <div className={`gas-sheet-step gas-sheet-step--green${firstDone ? ' is-complete' : ' is-active'}`}>
              <span className="gas-sheet-step-icon"><RiderIcon /></span>
              <div className="gas-sheet-step-copy"><strong>{labels[stage]}</strong><small>{firstDone ? 'Completed' : 'Arriving in 5 minutes'}</small><i className="gas-sheet-progress"><b style={{ width: `${firstProgress}%` }} /></i></div>
            </div>
            <div className="gas-sheet-connector gas-sheet-connector--green" />
          </>}
          <div className={`gas-sheet-step gas-sheet-step--compact${fillingActive ? ' is-active' : fillingDone ? ' is-complete' : ''}`}>
            <span className="gas-sheet-step-icon gas-sheet-step-icon--fuel"><FuelIcon /></span>
            <strong>Filling Process</strong>
            <span className={`gas-sheet-status-pill${fillingPositive ? ' is-active' : ''}`}>{fillingActive ? 'In progress' : fillingDone ? 'Completed' : 'Waiting'}</span>
          </div>
          <div className="gas-sheet-connector gas-sheet-connector--blue" />
          <div className={`gas-sheet-step gas-sheet-step--blue${refillStarted ? ' is-active' : ''}`}>
            <span className="gas-sheet-step-icon"><CheckCircle weight="fill" /></span>
            <div className="gas-sheet-step-copy"><strong>Refill Completion</strong><small>{stage === 'complete' ? 'Delivered to customer' : refillStarted ? 'Arriving in 5 minutes' : fillingActive ? 'In progress' : 'Arriving in 5 minutes'}</small><i className="gas-sheet-progress"><b style={{ width: `${refillProgress}%` }} /></i></div>
          </div>
        </div>
      </div>
    </section>
  )
}
