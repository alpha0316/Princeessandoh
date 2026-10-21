import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CaretRight,
  Clock,
  MapPin,
  MagnifyingGlass,
  Minus,
  Plus,
} from '@phosphor-icons/react'
import { Cylinder, TapCursor, cylinderInfo, locations } from './gasShared'
import GasMap from './GasMap'
import MobileStatusBar from './MobileStatusBar'
import './gas-order-preview.css'

// Keep the rider's destination marker in the upper portion of the phone, as in
// the supplied Figma frames, while the map itself continues behind each state.
const MAP_CENTER: [number, number] = [6.6765, -1.6244]
const MAP_MARKER: [number, number] = [6.6885, -1.6244]

type Focus = 'sizes' | 'schedule' | 'location'

export default function GasSizesPreview({ isPaused = false }: { isPaused?: boolean }) {
  const [focus, setFocus] = useState<Focus>('sizes')
  const [quantities, setQuantities] = useState([0, 0, 0])
  const [time, setTime] = useState('Now')
  const [location, setLocation] = useState(locations[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const elapsedRef = useRef(0)

  useEffect(() => {
    if (isPaused) return
    const cycleLength = 16000
    const startOffset = elapsedRef.current
    const startedAt = performance.now()
    let cycleIndex = Math.floor(startOffset / cycleLength)
    let hasSelectedSecond = false
    let hasSelectedThird = false
    let hasSelectedTime = false
    let lastQueryLength = -1
    const simulatedQuery = 'Kumasi'
    const timer = window.setInterval(() => {
      const totalElapsed = startOffset + performance.now() - startedAt
      elapsedRef.current = totalElapsed
      const elapsed = totalElapsed % cycleLength
      const nextCycle = Math.floor(totalElapsed / cycleLength)
      if (cycleIndex !== nextCycle) {
        cycleIndex = nextCycle
        hasSelectedSecond = false
        hasSelectedThird = false
        hasSelectedTime = false
        setFocus('sizes')
        setQuantities([1, 0, 0])
        setTime('Now')
        setSearchQuery('')
        setOrderPlaced(false)
        lastQueryLength = -1
      }

      if (elapsed >= 650 && elapsed < 850 && !hasSelectedSecond) { hasSelectedSecond = true; setQuantities([1, 1, 0]) }
      if (elapsed >= 1550 && elapsed < 1750 && !hasSelectedThird) { hasSelectedThird = true; setQuantities([1, 1, 1]) }
      if (elapsed >= 3600 && elapsed < 6500) setFocus('schedule')
      if (elapsed >= 4850 && elapsed < 5050 && !hasSelectedTime) { hasSelectedTime = true; setTime('Tomorrow') }
      if (elapsed >= 6500 && elapsed < 8300) setFocus('sizes')
      if (elapsed >= 8300) setFocus('location')
      if (elapsed >= 9300 && elapsed < 12000) {
        const queryLength = Math.min(simulatedQuery.length, Math.floor((elapsed - 9300) / 380) + 1)
        if (queryLength !== lastQueryLength) {
          lastQueryLength = queryLength
          setSearchQuery(simulatedQuery.slice(0, queryLength))
        }
      }
    }, 200)
    return () => {
      elapsedRef.current = startOffset + performance.now() - startedAt
      window.clearInterval(timer)
    }
  }, [isPaused])

  const total = quantities.reduce((sum, quantity, index) => sum + quantity * [3, 5, 7][index], 0)
  const totalCount = quantities.reduce((sum, quantity) => sum + quantity, 0)
  const matchingLocations = locations.filter((place) => place.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  const cursorPosition = focus === 'sizes'
    ? { left: '82%', top: quantities[1] === 0 ? '63%' : quantities[2] === 0 ? '69%' : '75%' }
    : focus === 'schedule'
      ? { left: '70%', top: '76%' }
      : searchQuery.length >= 6
        ? { left: '52%', top: '29%' }
        : { left: '52%', top: '14%' }

  return (
    <div className={`gas-order-phone gas-order-phone--${focus}`} aria-label="Animated LPG refill order preview">
      <div className="gas-order-screen">
        <GasMap center={MAP_CENTER} marker={MAP_MARKER} />
        <MobileStatusBar />

        <div className="gas-order-stack" aria-hidden={focus !== 'sizes'}>
          <section className="gas-order-intro">
            <div className="gas-order-title-line">
              <h2>Your Hassle-Free Solution <span>For Convenient LPG Refill</span></h2>
              <button className={`gas-order-schedule-icon${focus === 'schedule' ? ' is-active' : ''}`} aria-label="Schedule delivery" tabIndex={-1}><Clock size={16} /></button>
            </div>
            <button className={`gas-order-location${focus === 'location' ? ' is-active' : ''}`} aria-label="Search delivery location" tabIndex={-1}>
              <span className="gas-location-marker"><MapPin size={15} weight="bold" /></span>
              <span className="gas-location-copy"><small>Your Location</small><strong>{location}</strong></span>
              {focus === 'location' ? <MagnifyingGlass size={14} /> : <CaretRight size={14} />}
            </button>
          </section>

          <section className="gas-order-sizes">
            <h3>Cylinder Size</h3>
            <div className="gas-cylinder-list">
              {cylinderInfo.map((cylinder, index) => <div className="gas-cylinder-row" key={`${cylinder.amount}-${index}`}>
                <span className="gas-cylinder-image"><Cylinder color={cylinder.color} shade={cylinder.shade} /></span>
                <span className="gas-cylinder-label"><strong>{cylinder.name}</strong><small>{cylinder.amount}</small></span>
                <span className="gas-cylinder-stepper"><button aria-label={`Remove ${cylinder.name}`} tabIndex={-1}><Minus size={11} /></button><b>{quantities[index]}</b><button className="is-plus" aria-label={`Add ${cylinder.name}`} tabIndex={-1}><Plus size={12} /></button></span>
              </div>)}
            </div>
            {totalCount > 0 && <div className="gas-order-summary"><span>{totalCount} cylinders selected</span><strong>GH {total.toFixed(2)}</strong></div>}
            <button className={`gas-order-submit${orderPlaced ? ' is-placed' : ''}`} aria-label="Log in order" tabIndex={-1}>{orderPlaced ? 'Order placed ✓' : 'Log In Order'}</button>
          </section>
        </div>

        <section className="gas-schedule-page" aria-label="Schedule pick up" aria-hidden={focus !== 'schedule'}>
          <header><h2>Schedule Pick Up</h2><button tabIndex={-1}>Save</button></header>
          <div className="gas-schedule-options">
            {['Instantly', 'Tomorrow', 'Pick Date'].map((option) => <button key={option} className={time === option || (option === 'Instantly' && time === 'Now') ? 'is-selected' : ''} tabIndex={-1}>{option}</button>)}
          </div>
          <button className={`gas-order-submit${orderPlaced ? ' is-placed' : ''}`} tabIndex={-1}>{orderPlaced ? 'Order placed ✓' : 'Log In Order'}</button>
        </section>

        <section className="gas-location-screen" aria-label="Search for a delivery location" aria-hidden={focus !== 'location'}>
          <div className="gas-location-input-row">
            <span className="gas-location-marker"><MapPin size={16} weight="bold" /></span>
            <input aria-label="Search location" value={searchQuery} placeholder={location} readOnly tabIndex={-1} />
            <button aria-label="Clear search" tabIndex={-1}>×</button>
          </div>
          <div className="gas-location-recent">
            <strong>Recent</strong>
            <span><Clock size={10} /> {searchQuery || 'Quay Street'}</span>
          </div>
          <button className="gas-current-location" tabIndex={-1}><span>Your Current Location</span><ArrowRight size={14} /></button>
          <div className="gas-location-matches">
            {matchingLocations.length > 0 ? matchingLocations.map((place) => <button key={place} className={place === location ? 'is-selected' : ''} tabIndex={-1}><MapPin size={14} /><span>{place}</span><ArrowRight size={14} /></button>) : <p>No matching locations</p>}
          </div>
        </section>
        <div className="gas-visual-keyboard" aria-hidden="true">
          <div className="gas-keyboard-suggestions">
            <span>“{searchQuery || 'Search'}”</span>
            <span>{searchQuery || 'the'}</span>
            <span>to</span>
          </div>
          <div className="gas-key-row">{Array.from('qwertyuiop').map((letter) => <span className="gas-key" key={letter}>{letter}</span>)}</div>
          <div className="gas-key-row gas-key-row--inset">{Array.from('asdfghjkl').map((letter) => <span className="gas-key" key={letter}>{letter}</span>)}</div>
          <div className="gas-key-row">
            <span className="gas-key gas-key--shift">⇧</span>
            {Array.from('zxcvbnm').map((letter) => <span className="gas-key" key={letter}>{letter}</span>)}
            <span className="gas-key gas-key--delete">⌫</span>
          </div>
          <div className="gas-key-row gas-key-row--bottom">
            <span className="gas-key gas-key--123">123</span>
            <span className="gas-key gas-key--globe">🌐</span>
            <span className="gas-key gas-key--space">English (US)</span>
            <span className="gas-key gas-key--return">return</span>
          </div>
        </div>

        <div className="gas-order-home-indicator" aria-hidden="true" />
        <TapCursor style={cursorPosition} />
      </div>
    </div>
  )
}
