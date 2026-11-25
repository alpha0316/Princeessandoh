import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'
import DockNav from '../../components/DockNav'
import TiltCard from '../../components/TiltCard'
import { playPaperSound } from './paperSound'
import './about.css'

type PaperId = 'overview' | 'work' | 'journey' | 'academics' | 'tools'

const GREETINGS = ['Hello', 'Hola', 'Bonjour', 'Hallo', 'Ciao', 'こんにちは', 'مرحبا']

function AnimatedGreeting() {
  const [text, setText] = useState('')
  const [greetIdx, setGreetIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')

  useEffect(() => {
    const current = GREETINGS[greetIdx]
    let id: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (text.length < current.length) {
        id = setTimeout(() => setText(current.slice(0, text.length + 1)), 60)
      } else {
        id = setTimeout(() => setPhase('pause'), 2000)
      }
    } else if (phase === 'pause') {
      id = setTimeout(() => setPhase('deleting'), 2000)
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        id = setTimeout(() => setText(text.slice(0, -1)), 35)
      } else {
        setGreetIdx((greetIdx + 1) % GREETINGS.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(id)
  }, [text, phase, greetIdx])

  return <span style={{ minWidth: 120, display: 'inline-block', textAlign: 'right' }}>{text}<span style={{ opacity: 0.6 }}>|</span></span>
}

const PAPERS: { id: PaperId; label: string; src: string; alt: string }[] = [
  { id: 'overview', label: 'Overview', src: '/About/Myself.svg', alt: 'Hi, I’m Prince Essandoh — Product Designer (Engineer)' },
  { id: 'work', label: 'Work', src: '/About/Work%20Experience.svg', alt: 'Work experience' },
  { id: 'journey', label: 'Journey', src: '/About/Personality.svg', alt: 'My journey into design' },
  { id: 'academics', label: 'Academics', src: '/About/Academic.svg', alt: 'Academics' },
  { id: 'tools', label: 'Tools', src: '/About/Myself-1.svg', alt: 'Tools I’m familiar with' },
]

const INITIAL_STACK: PaperId[] = ['overview', 'work', 'journey', 'academics', 'tools']

const OVERVIEW_LINKS = [
  { label: 'X', href: 'https://x.com/pr_alphaa', className: 'about-social-link--x' },
  { label: 'GitHub', href: 'https://github.com/alpha0316', className: 'about-social-link--github' },
  { label: 'WhatsApp', href: 'https://wa.me/233559488201', className: 'about-social-link--whatsapp' },
]

// Paper SVGs are 543×564. The box renders at its Figma size (380×494)
// so the whole pack nests inside it with the box edges visible around.
const BOX_W = 480
const BOX_H = Math.round((BOX_W * 494) / 384)
const PAPER_W = 290
const PAPER_H = Math.round((PAPER_W * 564) / 543)
const STAGE_W = 590
const STAGE_H = 640

// Resting pose per stack position (0 = front/top of the pack). Each deeper
// sheet peeks a little further up the box so all five stay clickable, but
// every sheet stays within the box's outer edges.
const POSES = [
  { x: 0, y: 208, rot: -2 },
  { x: 14, y: 186, rot: 4 },
  { x: -17, y: 165, rot: -7 },
  { x: 21, y: 145, rot: 8 },
  { x: -24, y: 126, rot: -10 },
]

type Jitter = { x: number; y: number; rot: number }

const makeJitter = (): Jitter => ({
  x: (Math.random() - 0.5) * 28,
  y: (Math.random() - 0.5) * 16,
  rot: (Math.random() - 0.5) * 8,
})

type AboutPageProps = {
  onNavigate: (page: string) => void
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const [stack, setStack] = useState<PaperId[]>(INITIAL_STACK)
  const [landed, setLanded] = useState<Set<PaperId>>(() => new Set())
  const [jitters, setJitters] = useState<Record<PaperId, Jitter>>(() =>
    Object.fromEntries(INITIAL_STACK.map(id => [id, makeJitter()])) as Record<PaperId, Jitter>,
  )
  const [lifting, setLifting] = useState<PaperId | null>(null)
  const [openId, setOpenId] = useState<PaperId | null>(null)
  const [closing, setClosing] = useState(false)
  const [fallTransform, setFallTransform] = useState<string | null>(null)

  const stageRef = useRef<HTMLDivElement>(null)
  const modalPaperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const activeStrokeRef = useRef<string>('')
  const activePointerRef = useRef<number | null>(null)
  const [ink, setInk] = useState<string[]>([])
  const [activeStroke, setActiveStroke] = useState('')
  const [noteStatus, setNoteStatus] = useState('')
  const timers = useRef<number[]>([])

  const getInkPoint = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = Math.max(0, Math.min(1000, ((event.clientX - rect.left) / rect.width) * 1000))
    const y = Math.max(0, Math.min(1000, ((event.clientY - rect.top) / rect.height) * 1000))
    return `${x.toFixed(1)} ${y.toFixed(1)}`
  }

  const startInk = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || openId || event.button !== 0) return
    const point = getInkPoint(event)
    if (!point) return
    event.preventDefault()
    activePointerRef.current = event.pointerId
    activeStrokeRef.current = `M ${point}`
    setActiveStroke(activeStrokeRef.current)
    setNoteStatus('')
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const continueInk = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== event.pointerId) return
    const point = getInkPoint(event)
    if (!point) return
    activeStrokeRef.current += ` L ${point}`
    setActiveStroke(activeStrokeRef.current)
  }

  const finishInk = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== event.pointerId) return
    if (activeStrokeRef.current) setInk(paths => [...paths, activeStrokeRef.current])
    activePointerRef.current = null
    activeStrokeRef.current = ''
    setActiveStroke('')
  }

  const clearInk = () => {
    setInk([])
    setActiveStroke('')
    activeStrokeRef.current = ''
    setNoteStatus('')
  }

  const sendInk = async () => {
    if (!panelRef.current || ink.length === 0) return
    const exportWidth = 1200
    const exportHeight = Math.round(exportWidth * panelRef.current.clientHeight / panelRef.current.clientWidth)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 1000 1000" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#fff"/>${ink.map(path => `<path d="${path}" fill="none" stroke="#17171a" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
    const image = new Image()
    const whatsappUrl = 'https://wa.me/233559488201?text=I%20left%20you%20a%20handwritten%20note'
    let noteBlob: Blob | null = null
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    try {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('Could not prepare note'))
        image.src = svgUrl
      })
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = exportHeight
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      noteBlob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(result => result ? resolve(result) : reject(new Error('Could not export note')), 'image/png'),
      )
      if (navigator.clipboard?.write && 'ClipboardItem' in window) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': noteBlob })])
        setNoteStatus('Copied. Paste your note into WhatsApp to send it.')
      } else {
        const downloadUrl = URL.createObjectURL(noteBlob)
        const download = document.createElement('a')
        download.href = downloadUrl
        download.download = 'handwritten-note.png'
        download.click()
        URL.revokeObjectURL(downloadUrl)
        setNoteStatus('Your note downloaded. Attach it in WhatsApp to send it.')
      }
    } catch {
        const fallbackBlob = noteBlob ?? new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
        const fallbackUrl = URL.createObjectURL(fallbackBlob)
        const download = document.createElement('a')
        download.href = fallbackUrl
        download.download = noteBlob ? 'handwritten-note.png' : 'handwritten-note.svg'
        download.click()
        URL.revokeObjectURL(fallbackUrl)
        setNoteStatus('Your note downloaded. Attach it in WhatsApp to send it.')
    } finally {
      URL.revokeObjectURL(svgUrl)
    }
  }

  // ── Load-in: papers drop into the box one by one, 5th to 1st ──────
  useEffect(() => {
    const dropOrder = [...INITIAL_STACK].reverse()
    dropOrder.forEach((id, i) => {
      timers.current.push(window.setTimeout(() => {
        setLanded(prev => {
          const next = new Set(prev)
          next.add(id)
          return next
        })
        playPaperSound()
      }, 450 + i * 300))
    })
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  // ── Tap a lower sheet: lift it out, then re-stack it on top ───────
  const promote = useCallback((id: PaperId) => {
    if (openId || lifting) return
    if (stack[0] === id) {
      setOpenId(id)
      return
    }
    setLifting(id)
    timers.current.push(window.setTimeout(() => {
      setStack(s => [id, ...s.filter(p => p !== id)])
      setJitters(j => ({ ...j, [id]: makeJitter() }))
      playPaperSound()
      setLifting(null)
    }, 240))
  }, [openId, lifting, stack])

  // ── Close the modal: the paper falls back into the box, landing at
  // a random-but-plausible spot on top of the pack ──────────────────
  const requestClose = useCallback(() => {
    if (!openId || closing) return
    const jit = makeJitter()
    const stage = stageRef.current
    const paperEl = modalPaperRef.current
    let transform = `translateY(58vh) scale(0.38) rotate(${jit.rot * 2}deg)`
    if (stage && paperEl) {
      const s = stage.getBoundingClientRect()
      const pose = POSES[0]
      // The stage may be CSS-scaled on short viewports — derive the
      // factor from its rendered width so the fall lands on target.
      const k = s.width / STAGE_W
      const targetCx = s.left + s.width / 2 + (pose.x + jit.x) * k
      const targetCy = s.top + (pose.y + jit.y + PAPER_H / 2) * k
      const scale = (PAPER_W * k) / paperEl.offsetWidth
      const dx = targetCx - window.innerWidth / 2
      const dy = targetCy - window.innerHeight / 2
      transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${pose.rot + jit.rot}deg)`
    }
    setFallTransform(transform)
    setClosing(true)
    const id = openId
    timers.current.push(window.setTimeout(() => {
      setJitters(j => ({ ...j, [id]: jit }))
      setOpenId(null)
      setClosing(false)
      setFallTransform(null)
      playPaperSound()
    }, 640))
  }, [openId, closing])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') requestClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  const openPaper = openId ? PAPERS.find(p => p.id === openId)! : null

  return (
    <div className="about-shell">
      <div
        ref={panelRef}
        className={`about-panel ${activeStroke ? 'is-writing' : ''}`}
        onPointerDown={startInk}
        onPointerMove={continueInk}
        onPointerUp={finishInk}
        onPointerCancel={finishInk}
      >
        <svg className="about-ink-layer" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          {ink.map((path, index) => <path key={index} d={path} />)}
          {activeStroke && <path d={activeStroke} />}
        </svg>
        <div className="about-note-hint">
          <span>{ink.length ? 'Your handwritten note' : 'Write a note anywhere on the blank page'}</span>
          {ink.length > 0 && <button type="button" onClick={clearInk}>Clear</button>}
          {ink.length > 0 && <button type="button" className="about-note-send" onClick={sendInk}>Send note ↗</button>}
          {noteStatus && <span className="about-note-status" role="status">{noteStatus}</span>}
        </div>
        <div className="about-head">
          <h1><AnimatedGreeting /> 👋🏾</h1>
          <p>about me <strong>Essandoh</strong></p>
        </div>

        <div className="about-stage" ref={stageRef} style={{ width: STAGE_W, height: STAGE_H }}>
          <img
            className="about-box"
            src="/About/Box.svg"
            alt=""
            draggable={false}
            style={{ width: BOX_W, height: BOX_H }}
          />
          {PAPERS.map(paper => {
            const pos = stack.indexOf(paper.id)
            const pose = POSES[pos]
            const jit = jitters[paper.id]
            const isLanded = landed.has(paper.id)
            const isLifting = lifting === paper.id
            const transform = !isLanded
              ? `translate(${pose.x}px, -560px) rotate(${pose.rot * 2.5}deg)`
              : isLifting
                ? `translate(${pose.x + jit.x}px, ${pose.y + jit.y - 90}px) rotate(${(pose.rot + jit.rot) * 0.4}deg) scale(1.05)`
                : `translate(${pose.x + jit.x}px, ${pose.y + jit.y}px) rotate(${pose.rot + jit.rot}deg)`
            return (
              <button
                key={paper.id}
                type="button"
                className="about-paper"
                aria-label={pos === 0 ? `Open ${paper.label}` : `Bring ${paper.label} to the top`}
                onClick={() => promote(paper.id)}
                style={{
                  width: PAPER_W,
                  marginLeft: -PAPER_W / 2,
                  transform,
                  zIndex: isLifting ? 40 : 15 - pos,
                  visibility: openId === paper.id ? 'hidden' : 'visible',
                }}
              >
                <img src={paper.src} alt={paper.alt} draggable={false} />
              </button>
            )
          })}
        </div>

        <div className="about-tabs" role="tablist" aria-label="About sections">
          {PAPERS.map(paper => (
            <button
              key={paper.id}
              type="button"
              role="tab"
              aria-selected={stack[0] === paper.id}
              className={`about-tab ${stack[0] === paper.id ? 'is-active' : ''}`}
              onClick={() => { if (stack[0] !== paper.id) promote(paper.id) }}
            >
              {paper.label}
            </button>
          ))}
        </div>
      </div>

      {openPaper && (
        <div
          className={`about-modal ${closing ? 'is-closing' : ''}`}
          onClick={requestClose}
          role="dialog"
          aria-modal="true"
          aria-label={openPaper.label}
        >
          <button
            type="button"
            className="about-modal-close"
            aria-label="Close"
            onClick={e => { e.stopPropagation(); requestClose() }}
          >
            <X size={20} weight="bold" />
          </button>
          <div
            ref={modalPaperRef}
            className={`about-modal-paper-wrap ${closing ? 'is-falling' : ''}`}
            onClick={e => e.stopPropagation()}
            style={closing && fallTransform ? { transform: fallTransform } : undefined}
          >
            <TiltCard className="about-modal-paper-tilt">
              <img className="about-modal-paper" src={openPaper.src} alt={openPaper.alt} draggable={false} />
              {openPaper.id === 'overview' && !closing && OVERVIEW_LINKS.map(link => (
                <a
                  key={link.label}
                  className={`about-social-link ${link.className}`}
                  href={link.href}
                  aria-label={`Connect on ${link.label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                />
              ))}
            </TiltCard>
          </div>
        </div>
      )}

      <DockNav activeLabel="Profile" onNavigate={onNavigate} />
    </div>
  )
}
