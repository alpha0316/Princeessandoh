import { useEffect, useState } from 'react'
import MobileStatusBar from './MobileStatusBar'
import {
  Bell,
  CalendarBlank,
  CalendarCheck,
  CaretLeft,
  CaretRight,
  Clock,
  Heart,
  House,
  List,
  MapPin,
  MagnifyingGlass,
  Plus,
} from '@phosphor-icons/react'

type Shift = { kind: 'day' | 'night'; times: [string, string] }
type Month = { year: number; month: number; label: string; shifts: Record<number, Shift>; holidays: number[] }

const months: Month[] = [
  {
    year: 2025,
    month: 10,
    label: 'November 2025',
    shifts: {
      5: { kind: 'day', times: ['08:00', '20:00'] },
      6: { kind: 'day', times: ['08:00', '20:00'] },
      7: { kind: 'night', times: ['20:00', '08:00'] },
      8: { kind: 'night', times: ['20:00', '08:00'] },
      12: { kind: 'day', times: ['08:00', '20:00'] },
      13: { kind: 'day', times: ['08:00', '20:00'] },
      19: { kind: 'night', times: ['20:00', '08:00'] },
      20: { kind: 'night', times: ['20:00', '08:00'] },
      21: { kind: 'day', times: ['08:00', '20:00'] },
      24: { kind: 'night', times: ['20:00', '08:00'] },
      25: { kind: 'night', times: ['20:00', '08:00'] },
    },
    holidays: [9, 23],
  },
  {
    year: 2025,
    month: 11,
    label: 'December 2025',
    shifts: {
      1: { kind: 'day', times: ['08:00', '20:00'] },
      2: { kind: 'day', times: ['08:00', '20:00'] },
      4: { kind: 'night', times: ['20:00', '08:00'] },
      5: { kind: 'night', times: ['20:00', '08:00'] },
      10: { kind: 'day', times: ['08:00', '20:00'] },
      11: { kind: 'day', times: ['08:00', '20:00'] },
      16: { kind: 'night', times: ['20:00', '08:00'] },
      17: { kind: 'night', times: ['20:00', '08:00'] },
      22: { kind: 'day', times: ['08:00', '20:00'] },
      23: { kind: 'day', times: ['08:00', '20:00'] },
      29: { kind: 'night', times: ['20:00', '08:00'] },
    },
    holidays: [25],
  },
  {
    year: 2026,
    month: 0,
    label: 'January 2026',
    shifts: {
      2: { kind: 'day', times: ['08:00', '20:00'] },
      3: { kind: 'day', times: ['08:00', '20:00'] },
      7: { kind: 'night', times: ['20:00', '08:00'] },
      8: { kind: 'night', times: ['20:00', '08:00'] },
      13: { kind: 'day', times: ['08:00', '20:00'] },
      14: { kind: 'day', times: ['08:00', '20:00'] },
      20: { kind: 'night', times: ['20:00', '08:00'] },
      21: { kind: 'night', times: ['20:00', '08:00'] },
      27: { kind: 'day', times: ['08:00', '20:00'] },
    },
    holidays: [1],
  },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function makeMonthCells(month: Month) {
  const firstDay = new Date(Date.UTC(month.year, month.month, 1)).getUTCDay()
  const mondayOffset = (firstDay + 6) % 7
  const daysInMonth = new Date(Date.UTC(month.year, month.month + 1, 0)).getUTCDate()
  const cellCount = Math.ceil((mondayOffset + daysInMonth) / 7) * 7
  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - mondayOffset + 1
    const inMonth = day > 0 && day <= daysInMonth
    return { date: inMonth ? day : day <= 0 ? new Date(Date.UTC(month.year, month.month, day)).getUTCDate() : day - daysInMonth, inMonth }
  })
}

export default function ShiftCalendarPreview({ isPaused = false }: { isPaused?: boolean }) {
  const [monthIndex, setMonthIndex] = useState(0)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const month = months[monthIndex]
  const cells = makeMonthCells(month)

  useEffect(() => {
    if (isPaused) return
    const openTimer = window.setTimeout(() => setIsCalendarOpen(true), 4500)
    let monthTimer: number | undefined
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      monthTimer = window.setInterval(() => setMonthIndex((index) => (index + 1) % months.length), 10500)
    }
    return () => {
      window.clearTimeout(openTimer)
      if (monthTimer !== undefined) window.clearInterval(monthTimer)
    }
  }, [isPaused, isCalendarOpen])

  const showMonth = (step: number) => {
    setMonthIndex((index) => (index + step + months.length) % months.length)
  }

  return (
    <div className="shift-calendar-phone" aria-label="Shifts app calendar preview">
      <MobileStatusBar />

      <div className="shift-calendar-toolbar">
        <button aria-label="Open menu"><List size={15} weight="bold" /></button>
        <span className="shift-calendar-app-icon">S</span>
        <span className="shift-calendar-app-name">Shifts</span>
        <span className="shift-calendar-toolbar-spacer" />
        <button aria-label="Search"><MagnifyingGlass size={14} /></button>
        <button aria-label="Notifications"><Bell size={14} /></button>
        <button className="shift-calendar-add" aria-label="Add shift"><Plus size={15} weight="bold" /></button>
      </div>

      <div className="shift-calendar-range">
        <span><CaretLeft size={12} /> Jul 4 – 10, 2026 <CaretRight size={12} /></span>
        <CalendarBlank size={14} />
      </div>

      <section className="shift-calendar-upcoming" aria-label="Upcoming shifts">
        {[['Day', '24', '08:00–20:00', 'Meadowbrook Care'], ['Night', '25', '20:00–08:00', 'Riverside Lodge']].map(([name, date, hours, location]) => (
          <article className="shift-upcoming-card" key={name}>
            <div className="shift-date-badge"><span>July</span><strong>{date}</strong></div>
            <div className="shift-upcoming-details">
              <div className="shift-upcoming-title"><strong>{name} · Senior Carer</strong><span>Confirmed</span></div>
              <p><Clock size={11} /> {hours}</p>
              <p><MapPin size={11} /> {location}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="shift-calendar-bottom-nav" aria-hidden="true">
        <span><House size={14} />Home</span>
        <span className="is-selected"><CalendarCheck size={14} />Shifts</span>
        <span><CalendarBlank size={14} />Compliance</span>
        <b><Plus size={17} weight="bold" /></b>
      </div>
      <div className="shift-calendar-page-indicator" aria-hidden="true" />

      {isCalendarOpen && <>
        <div className="shift-calendar-dim" />
        <section className="shift-month-sheet" aria-label={`${month.label} shift calendar`}>
          <header className="shift-month-header">
            <button onClick={() => showMonth(-1)} aria-label="Previous month"><CaretLeft size={15} /></button>
            <strong>{month.label}</strong>
            <button onClick={() => showMonth(1)} aria-label="Next month"><CaretRight size={15} /></button>
          </header>

          <div className="shift-month-view" key={monthIndex}>
            <div className="shift-weekdays">
              {weekDays.map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className="shift-days-grid">
              {cells.map(({ date, inMonth }, index) => {
                const shift = inMonth ? month.shifts[date] : undefined
                const holiday = inMonth && month.holidays.includes(date)
                return (
                  <div className={`shift-day-cell${inMonth ? '' : ' is-outside'}`} key={`${index}-${date}`}>
                    <span className="shift-day-number">{String(date).padStart(2, '0')}</span>
                    {shift && <span className={`shift-day-event shift-day-event--${shift.kind}`}>{shift.times.map((time) => <i key={time}>{time}</i>)}</span>}
                    {holiday && <span className="shift-day-holiday"><Heart size={10} weight="fill" /></span>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </>}
    </div>
  )
}
