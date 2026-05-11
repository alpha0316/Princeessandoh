import { Fragment, useEffect, useRef } from 'react'
import './flow-section.css'
import coverBg          from '../../assets/shuttle/flowchart/CoverUserJourney.png'
// arrow1.svg replaced by inline <DownArrow /> component below
import connectorLine    from '../../assets/shuttle/flowchart/Connector line1.png'
import availToBusArrow  from '../../assets/shuttle/flowchart/AvailablleToClosesBus.svg'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — space in filename is intentional (asset filename)
import availToNoBusArrow from '../../assets/shuttle/flowchart/AvailableToNoBus Arrow.svg'

// ── Schema data ───────────────────────────────────────────────────────────────

const SCHEMAS = [
  {
    title: 'Pick Up Bus Stop',
    nodeTop: 80,
    arrowAfter: true,           // connector to next schema
    fields: [
      { name: 'id',          type: 'PK'          },
      { name: 'name',        type: 'string'      },
      { name: 'description', type: 'string'      },
      { name: 'latitude',    type: 'number'      },
      { name: 'longitude',   type: 'number'      },
      { name: 'dropPoints',  type: 'DropPoint[]' },
    ],
  },
  {
    title: 'DropPoint []',
    nodeTop: 460,
    arrowAfter: false,          // no connector between DropPoint and Bus
    fields: [
      { name: 'name',      type: 'string'  },
      { name: 'latitude',  type: 'number'  },
      { name: 'longitude', type: 'number'  },
      { name: 'hidden?',   type: 'boolean' },
    ],
  },
  {
    title: 'Bus',
    nodeTop: 720,
    arrowAfter: true,
    fields: [
      { name: 'driverID',    type: 'PK'          },
      { name: 'deviceId',    type: 'FK'          },
      { name: 'firstName',   type: 'string'      },
      { name: 'lastName',    type: 'string'      },
      { name: 'phoneNumber', type: 'string'      },
      { name: 'active',      type: 'Boolean'     },
      { name: 'BusRoute',    type: 'Array'       },
      { name: 'coords',      type: 'Coordinates' },
    ],
  },
  {
    title: 'Coordinates',
    nodeTop: 1160,
    arrowAfter: false,
    fields: [
      { name: 'latitude',  type: 'number' },
      { name: 'longitude', type: 'number' },
      { name: 'speed',     type: 'number' },
      { name: 'timestamp', type: 'number' },
      { name: 'heading',   type: 'number' },
    ],
  },
]

// ── Flow data ─────────────────────────────────────────────────────────────────

type StepNode = {
  kind: 'step'
  id: string
  title: string
  bullets?: string[]
  variant: 'green' | 'yellow'
  top: number
  left: number
}

type DecisionNode = {
  kind: 'decision'
  id: string
  question: string
  noBranch: { title: string; variant: 'error' | 'info' | 'green'; top: number; left: number; hideConnector?: boolean; bullets?: string[] }
  yesBusConnector?: boolean                                                          // d1: horizontal arrow → Bus schema
  yesConnectorToSchema?: boolean                                                     // d2: flipped L-arrow → schema rail
  yesCard?: { title: string; variant: 'green' | 'yellow'; top: number; left: number; bullets?: string[] }  // d2: card below-right
  top: number
  left: number
}

type FlowNode = StepNode | DecisionNode

const FLOW: FlowNode[] = [
  {
    kind: 'step', id: 'n1', variant: 'green', top: 0, left: 0,
    title: 'User opens App',
    bullets: [
      'User Starts Mobile or WebApp',
      'User is approached with the Map Of KNUST with Active Buses',
    ],
  },
  {
    kind: 'step', id: 'n2', variant: 'yellow', top: 346, left: 0,
    title: 'User selects Pick Up point',
  },
  {
    kind: 'step', id: 'n3', variant: 'green', top: 692, left: 0,
    title: 'User selects Drop Off Bus Stop from the listed drop points',
  },
  {
    kind: 'decision', id: 'd1', top: 1038, left: 0,
    question: 'Available Bus On Route?',
    noBranch: { title: 'Show no available Bus', variant: 'error', top: 80, left: -200 },
    yesBusConnector: true,
  },
  {
    kind: 'decision', id: 'd2', top: 1384, left: 256,
    question: 'Closest Bus To Pick Up Point?',
    noBranch: { title: 'Show Other Distance Buses On Route', variant: 'green', top: 90, left: -160 },
    yesConnectorToSchema: true,
    yesCard: { title: 'Show Closest Active Bus', variant: 'green', top: 110, left: 310 },
  },

]

// ── Sub-components ────────────────────────────────────────────────────────────

function FlowCard({
  title,
  bullets,
  variant,
}: {
  title: string
  bullets?: string[]
  variant: 'green' | 'yellow' | 'error' | 'info'
}) {
  return (
    <div className={`fc-card fc-card--${variant}`}>
      <p className="fc-card__title">{title}</p>
      {bullets && bullets.length > 0 && (
        <ol className="fc-card__list">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ol>
      )}
    </div>
  )
}

function Decision({
  question,
  noBranch,
  yesBusConnector,
  yesConnectorToSchema,
  yesCard,
}: {
  question: string
  noBranch: { title: string; variant: 'error' | 'info' | 'green'; top: number; left: number; hideConnector?: boolean; bullets?: string[] }
  yesBusConnector?: boolean
  yesConnectorToSchema?: boolean
  yesCard?: { title: string; variant: 'green' | 'yellow'; top: number; left: number; bullets?: string[] }
}) {
  const hasYes = yesBusConnector || yesConnectorToSchema || !!yesCard

  return (
    <div className="fc-decision-block">

      {/* ── Row 1: L-arrows + diamond ── */}
      <div className="fc-decision-row">

        {/* Left: No L-arrow with label overlaid on vertical segment */}
        {!noBranch.hideConnector && (
          <div className="fc-branch-no">
            <div>
              <img src={availToNoBusArrow} alt="" aria-hidden="true"
                className="fc-no-lshape" />
              {/* <span className="fc-no-label">No</span> */}
            </div>
          </div>

          
        )}

        

        {/* Centre: Diamond */}
        <div className="fc-diamond">
          <span className="fc-diamond__label">{question}</span>
        </div>

        {/* Right: only rendered when there is a Yes path */}
        {hasYes ? (
          <div className="fc-branch-yes">
            {yesBusConnector && (
              <img src={availToBusArrow} alt="" aria-hidden="true"
                className="fc-yes-bus-connector" />
            )}
            {yesConnectorToSchema && (
              <img src={availToBusArrow} alt="" aria-hidden="true"
                className="fc-yes-schema-connector" />
            )}
          </div>
        ) : (
          /* empty spacer keeps diamond centred when there is no Yes branch */
          
          <div />
        )}

      </div>

      {/* ── Row 2: outcome cards (aligned under respective arrows) ── */}
      <div className="fc-decision-below">
        <div
          className="fc-below-cell fc-below-cell--no"
          style={{ top: noBranch.top, left: noBranch.left }}
        >
          {noBranch.title && (
            <FlowCard title={noBranch.title} variant={noBranch.variant} bullets={noBranch.bullets} />
          )}
        </div>
        <div className="fc-below-cell fc-below-cell--yes"
          style={yesCard ? { top: yesCard.top, left: yesCard.left } : undefined}
        >
          {yesCard && (
            <FlowCard title={yesCard.title} variant={yesCard.variant} bullets={yesCard.bullets} />
          )}
        </div>
      </div>

    </div>
  )
}

/**
 * Straight down-arrow using the same filled-path style as the horizontal
 * AvaiableToBusSchema connector — identical geometry to arrow1.svg but
 * painted in #242424 to match the rest of the flowchart connectors.
 */
function DownArrow({ className }: { className?: string }) {
  return (
    <svg
      width="30" height="82"
      viewBox="0 0 30 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16.728 2C16.728 0.89543 15.8326 0 14.728 0C13.6235 0 12.728 0.89543
           12.728 2H14.728H16.728ZM13.3138 80.9142C14.0949 81.6953 15.3612 81.6953
           16.1422 80.9142L28.8702 68.1863C29.6512 67.4052 29.6512 66.1389 28.8702
           65.3579C28.0891 64.5768 26.8228 64.5768 26.0417 65.3579L14.728 76.6716
           L3.41432 65.3579C2.63327 64.5768 1.36694 64.5768 0.585892 65.3579
           C-0.195157 66.1389 -0.195157 67.4052 0.585892 68.1863L13.3138 80.9142Z
           M14.728 2H12.728V79.5H14.728H16.728V2H14.728Z"
        fill="#242424"
      />
    </svg>
  )
}

function FlowArrow() {
  return <DownArrow className="fc-arrow-down" />
}

function SchemaCard({
  title,
  fields,
}: {
  title: string
  fields: { name: string; type: string }[]
}) {
  return (
    <div className="fc-schema">
      <p className="fc-schema__title">{title}</p>
      <div className="fc-schema__fields">
        {fields.map((f) => (
          <div key={f.name} className="fc-schema__row">
            <span className="fc-schema__chip">{f.name}</span>
            <span className="fc-schema__type">{f.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function FlowSection({ onComplete }: { onComplete?: () => void }) {
  const outerRef    = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    const outer   = outerRef.current
    const content = contentRef.current
    if (!outer || !content) return

    // Extra scroll distance (px) the user must "use up" at the section's
    // entrance and exit before the page moves to the adjacent section.
    // ~450 px feels like about 3 deliberate wheel steps before handing off.
    const BUFFER = 450

    let rafId = 0

    const update = () => {
      const viewH    = window.innerHeight
      const contentH = content.offsetHeight
      const scrollable = Math.max(0, contentH - viewH)

      // Outer height = content + a BUFFER zone on each end.
      // This is what keeps the sticky engaged for those extra 2 scrolls.
      const outerH = Math.max(contentH, viewH) + 2 * BUFFER
      outer.style.height = `${outerH}px`

      const outerTop = outer.getBoundingClientRect().top + window.scrollY
      const scrolled = window.scrollY - outerTop

      // Fire onComplete once the user has consumed the full exit buffer —
      // i.e. scrolled >= outerH - viewH, when the sticky is about to detach.
      if (!completedRef.current && scrolled >= outerH - viewH) {
        completedRef.current = true
        onComplete?.()
      }

      if (scrollable <= 0) {
        content.style.transform = ''
        content.querySelectorAll<HTMLElement>('[data-flow-node]').forEach(el => {
          el.classList.add('fc-node--entered')
        })
        return
      }

      // Phase mapping:
      //   scrolled  0 … BUFFER              → progress = 0  (entrance hold)
      //   scrolled  BUFFER … BUFFER+scrollable → progress 0→1 (content moves)
      //   scrolled  beyond                  → progress = 1  (exit hold)
      const inner    = scrolled - BUFFER
      const progress = Math.max(0, Math.min(1, inner / scrollable))
      content.style.transform = `translateY(${-progress * scrollable}px)`

      // Reveal each node as its top edge scrolls within 80px of the viewport bottom
      const viewBottom = progress * scrollable + viewH
      content.querySelectorAll<HTMLElement>('[data-flow-node]').forEach(el => {
        if (Number(el.dataset.nodeTop) < viewBottom - 80) {
          el.classList.add('fc-node--entered')
        }
      })
    }

    // Auto-snap: when FlowSection is partially entering from below while the
    // user is scrolling down, snap it to fill the viewport immediately —
    // same behaviour as the MessagesPinWrapper above it.
    let lastScrollY = window.scrollY
    let snapLock    = false

    const checkSnap = () => {
      const y   = window.scrollY
      const dir = y > lastScrollY ? 'down' : 'up'
      lastScrollY = y

      if (snapLock || dir !== 'down') return

      const viewH       = window.innerHeight
      const outerTop    = outer.getBoundingClientRect().top + window.scrollY
      const topInView   = outerTop - y   // px below the viewport top

      // Trigger when between 40px and 65% of viewport visible from below
      if (topInView > 40 && topInView < viewH * 0.65) {
        snapLock = true
        window.scrollTo({ top: outerTop, behavior: 'smooth' })
        setTimeout(() => { snapLock = false }, 1200)
      }
    }

    const onScroll = () => {
      checkSnap()
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    // Initial sizing + position
    update()

    // Re-measure whenever content height changes (images load, resize, etc.)
    const ro = new ResizeObserver(update)
    ro.observe(content)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    /* fc-outer: provides the scroll depth the pinned viewport "consumes" */
    <div className="fc-outer" ref={outerRef}>

      {/* fc-pinned: stays fixed to viewport while outer scrolls past */}
      <div className="fc-pinned">

        {/* fc-section: the real content, translated by JS */}
        <div
          className="fc-section"
          ref={contentRef}
          style={{ backgroundImage: `url(${coverBg})` }}
        >
          <div className="fc-canvas">

            {/* ── Left: flow column ── */}
            <div className="fc-flow">
              {FLOW.map((node, i) => {
                const isLast = i === FLOW.length - 1
                return (
                  <div
                    key={node.id}
                    data-flow-node=""
                    data-node-top={node.top}
                    style={{
                      position: 'absolute',
                      top: node.top,
                      left: node.left,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      overflow: 'visible',
                    }}
                  >
                    {node.kind === 'step' && (
                      <FlowCard
                        title={node.title}
                        bullets={node.bullets}
                        variant={node.variant}
                      />
                    )}
                    {node.kind === 'decision' && (
                      <Decision
                        question={node.question}
                        noBranch={node.noBranch}
                        yesBusConnector={node.yesBusConnector}
                        yesConnectorToSchema={node.yesConnectorToSchema}
                        yesCard={node.yesCard}
                      />
                    )}
                    {!isLast && node.kind === 'step' && <FlowArrow />}
                  </div>
                )
              })}
              {/* ── Right-column continuation: "Show Closest Active Bus" → "Is Bus At Pickup Point?" ── */}
              {/* Arrow: centred over yesCard (canvas x≈686, arrow is 30 px wide → left 671) */}
              <div data-flow-node="" data-node-top="1984" style={{ position: 'absolute', top: 1984, left: 671, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DownArrow className="fc-arrow-down" />
              </div>

              {/* Decision node centred at canvas x≈686 (left 516 + half-width 170 = 686) */}
              <div data-flow-node="" data-node-top="2076" style={{ position: 'absolute', top: 2076, left: 516, width: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'visible' }}>
                <Decision
                  question="Is Bus At Pickup Point?"
                  noBranch={{ title: '', variant: 'info', top: 0, left: 0, hideConnector: true }}
                  yesConnectorToSchema
                  yesCard={{ title: 'User Picks Bus', variant: 'green', top: 110, left: 200, bullets: ['Bus Moves From Start To Drop Off Point'] }}
                />
              </div>

              {/* L-connector: "Is Bus At Pickup Point?" No → "Is Bus Moving Towards..."
                  Horizontal: from diamond left edge (fc-flow x=571) leftward to x=270
                  Vertical:   from diamond mid y (2191) down to y=2618 (where DownArrow starts) */}
              <div data-flow-node="" data-node-top="2191" style={{
                position: 'absolute', top: 2191, left: 270,
                width: 301, height: 427,
                borderTop: '2.5px solid #242424',
                borderLeft: '2.5px solid #242424',
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }} />
              <span data-flow-node="" data-node-top="2191" style={{ position: 'absolute', top: 2165, left: 470, fontSize: 14, fontWeight: 700, color: '#555' }}>No</span>
              <div data-flow-node="" data-node-top="2618" style={{ position: 'absolute', top: 2618, left: 255 }}>
                <DownArrow className="fc-arrow-down" />
              </div>

              {/* "Is Bus Moving Towards the Direction Of Start Point?" decision — top=2700, left=100, center x=270
                  No card:  fc-flow x=−120 → 120  (center 0)
                  Yes card: fc-flow x=480  → 720  (center 600)
                  "Bus Reaches" will sit centred between them at fc-flow x=180→420 (center 300) */}
              <div data-flow-node="" data-node-top="2700" style={{ position: 'absolute', top: 2700, left: 100, width: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'visible' }}>
                <Decision
                  question="Is Bus Moving Towards the Direction Of Start Point?"
                  noBranch={{
                    title: 'Meaning Bus Is Heading Away From Start Point',
                    variant: 'green',
                    top: 90,
                    left: -220,
                    bullets: ['Bus Moves On Path till it arrives at a Turning Point (KSB, Brunei & Commercial Area)'],
                  }}
                  yesConnectorToSchema
                  yesCard={{
                    title: 'Meaning Bus Is Heading Towards The Start Point',
                    variant: 'green',
                    top: 110,
                    left: 380,
                    bullets: ['Bus Moves From Turning Point In The Direction Of The Start Point'],
                  }}
                />
              </div>

              {/* Merge connector: No-card and Yes-card both lead to "Bus Reaches The Start Point"
                  SVG origin at fc-flow (−120, 3280) — immediately below both outcome cards.
                  Left L:  no-card  bottom-centre (240, 0)  → down → right → arrowhead at card left edge
                  Right L: yes-card bottom-centre (600, 20) → down → left  → arrowhead at card right edge
                  "Bus Reaches" left edge: fc-flow x=180 → SVG x=300
                  "Bus Reaches" right edge: fc-flow x=420 → SVG x=540
                  Connection y: card centre (top 3400 + half 130 = 3530) → SVG y=250              */}
              <svg
                data-flow-node=""
                data-node-top="3280"
                style={{ position: 'absolute', top: 3280, left: -120, overflow: 'visible', pointerEvents: 'none' }}
                width="840" height="260"
                viewBox="0 0 840 260"
              >
                <polyline points="240,0 240,250 296,250" fill="none" stroke="#242424" strokeWidth="2.5" />
                <polygon points="296,244 310,250 296,256" fill="#242424" />

                <polyline points="600,20 600,250 544,250" fill="none" stroke="#242424" strokeWidth="2.5" />
                <polygon points="544,244 530,250 544,256" fill="#242424" />
              </svg>

              {/* "Bus Reaches The Start Point" — centred between the two outcome cards */}
              <div data-flow-node="" data-node-top="3400" style={{ position: 'absolute', top: 3400, left: 180 }}>
                <FlowCard
                  title="Bus Reaches The Start Point"
                  variant="green"
                  bullets={['User Picks Bus', 'Bus Moves From Start To Drop Off Point']}
                />
              </div>
            </div>

            {/* ── Right: schema column (scrolls with content — not sticky) ── */}
            <div className="fc-rail">
              {/* Cross-connector anchored to rail's left edge */}
              <img src={connectorLine} alt="" aria-hidden="true"
                className="fc-cross-connector" />

              {SCHEMAS.map((s) => (
                <Fragment key={s.title}>
                  <div data-flow-node="" data-node-top={s.nodeTop} style={{ width: '100%' }}>
                    <SchemaCard title={s.title} fields={s.fields} />
                  </div>
                  {s.arrowAfter && (
                    <DownArrow className="fc-rail-arrow" />
                  )}
                </Fragment>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
