import { useEffect, useState } from 'react'

const USERNAME = 'alpha0316'
const PROFILE_URL = `https://github.com/${USERNAME}`
// Public, CORS-enabled mirror of the GitHub contributions calendar.
const API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`
// Half a year fits the sidebar at a readable cell size.
const WEEKS = 26
const CELL = 10
const GAP = 2.5

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
type Calendar = { total: number; weeks: (Day | null)[][] }

// Group the flat day list into Sunday-first week columns, keeping the
// most recent WEEKS columns.
function toWeeks(days: Day[]): (Day | null)[][] {
  if (!days.length) return []
  const weeks: (Day | null)[][] = []
  const lead = new Date(days[0].date + 'T00:00:00').getDay()
  let week: (Day | null)[] = Array(lead).fill(null)
  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) weeks.push(week)
  return weeks.slice(-WEEKS)
}

export default function GithubHeatmap() {
  const [cal, setCal] = useState<Calendar | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(API_URL, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { total: Record<string, number>; contributions: Day[] }) => {
        const today = new Date().toISOString().slice(0, 10)
        const days = data.contributions.filter((d) => d.date <= today)
        setCal({ total: data.total.lastYear ?? 0, weeks: toWeeks(days) })
      })
      .catch((err) => {
        if (!ctrl.signal.aborted) {
          console.warn('GitHub heatmap unavailable', err)
          setFailed(true)
        }
      })
    return () => ctrl.abort()
  }, [])

  if (failed) return null

  const width = WEEKS * (CELL + GAP) - GAP
  const height = 7 * (CELL + GAP) - GAP

  return (
    <a className="gh-heatmap" href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
      <svg
        className="gh-heatmap-grid"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={cal ? `${cal.total} GitHub contributions in the last year` : 'Loading GitHub contributions'}
      >
        {cal
          ? cal.weeks.map((week, x) =>
              week.map((day, y) =>
                day ? (
                  <rect
                    key={day.date}
                    className={`gh-l${day.level}`}
                    x={x * (CELL + GAP)}
                    y={y * (CELL + GAP)}
                    width={CELL}
                    height={CELL}
                    rx={2.5}
                  >
                    <title>{`${day.count} contribution${day.count === 1 ? '' : 's'} · ${day.date}`}</title>
                  </rect>
                ) : null,
              ),
            )
          : Array.from({ length: WEEKS * 7 }, (_, i) => (
              <rect
                key={i}
                className="gh-l0 gh-skeleton"
                x={Math.floor(i / 7) * (CELL + GAP)}
                y={(i % 7) * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2.5}
              />
            ))}
      </svg>
      <span className="gh-heatmap-caption">
        {cal ? `${cal.total} contributions in the last year` : 'GitHub activity'}
        <span aria-hidden="true">↗</span>
      </span>
    </a>
  )
}
