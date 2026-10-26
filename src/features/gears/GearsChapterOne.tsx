import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookmarkSimple,
  Clock,
  Gear,
  MapPin,
  PhoneCall,
  SealCheck,
  SealQuestion,
  Star,
  X,
} from '@phosphor-icons/react'
import { BusinessCartIcon, BusinessCarWashIcon, BusinessFuelIcon, BusinessGearIcon } from './GearsIcons'

const asset = (path: string) => `/v2-svg/Gears/Chapter 1/${path}`
const gearsAsset = (path: string) => `/v2-svg/Gears/${path}`

const TWEET_BALDWIN = asset('tweet-baldwin.png')
const TWEET_PHILIP = asset('tweet-philip.png')
const TWEET_CHIEF = asset('tweet-chief.png')
const TIKTOK_ICON = asset('tiktok-icon.svg')
const MAPS_ICON = asset('maps-icon.svg')
const SEAL_CHECK = asset('seal-check.svg')
const CAR_ILLUSTRATION = asset('car-illustration.png')
const BATTERY_ILLUSTRATION = asset('battery-illustration.png')
const WHEEL_ILLUSTRATION = asset('steering-wheel-illustration.png')
const ALTERNATOR_ILLUSTRATION = asset('alternator-illustration.png')
const HOME_SCREEN = gearsAsset('Home.png')
const BUSINESS_DETAILS_SCREEN = gearsAsset('Business Details.png')

const TAG_LABELS = ['Quality Service', 'On Time', 'Affordable', 'Safe', 'Excellent Job']

// What "Satisfied" reads as for each star count, so the label tracks
// whichever rating is currently picked instead of sitting fixed.
const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Satisfied',
  4: 'Good',
  5: 'Excellent',
}

const RECENT_SEARCHES = ['Brake Fluid', 'Details In Adenta', 'Electrician']

// Reuses the same four icons as the hero's "connected businesses" row
// (GearsIcons.tsx) so a mechanic/gas-station/car-wash reads the same way
// everywhere on the page, instead of a second, unrelated icon set.
const SEARCH_RESULTS = [
  { icon: <BusinessFuelIcon className="gears-directory-result-icon" />, name: 'Goil Ahodwo' },
  { icon: <MapPin size={18} className="gears-directory-result-icon" />, name: 'Ahodwo, Kumasi' },
  { icon: <BusinessCarWashIcon className="gears-directory-result-icon" />, name: 'Royal Shine Detailing' },
  { icon: <BusinessGearIcon className="gears-directory-result-icon" />, name: 'Automobile works' },
  { icon: <BusinessGearIcon className="gears-directory-result-icon" />, name: 'Electric Fault Finding' },
]

// Queries the search field types itself out before a visitor takes over —
// a mix of what's actually searchable above, so the autoplay demo's own
// results land on screen instead of always coming up empty.
const DEMO_QUERIES = ['Ahodwo', 'detailing', 'Electric', 'fuel', 'works']

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Picks a believable default rating/tag selection on mount so the card
// doesn't always open on the exact same "3 stars, two tags" demo state —
// a visitor who hovers in takes it over from whatever it landed on.
function randomRating() {
  return 2 + Math.floor(Math.random() * 4) // 2–5
}

function randomTags() {
  const shuffled = [...TAG_LABELS].sort(() => Math.random() - 0.5)
  return new Set(shuffled.slice(0, 1 + Math.floor(Math.random() * 3)))
}

function DirectoryRatingCard() {
  const [rating, setRating] = useState(randomRating)
  const [selectedTags, setSelectedTags] = useState(randomTags)

  const toggleTag = (label: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className="gears-rating-card">
      <h4>Rate IK_AD Automobile WORKS</h4>
      <div className="gears-rating-stars" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="gears-rating-star-btn"
            role="radio"
            aria-checked={n === rating}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => setRating(n)}
          >
            <Star size={24} weight={n <= rating ? 'fill' : 'regular'} color={n <= rating ? '#ff8d28' : 'rgba(0, 0, 0, 0.2)'} />
          </button>
        ))}
      </div>
      <p className="gears-rating-label">{RATING_LABELS[rating]}</p>
      <div className="gears-rating-tags">
        {TAG_LABELS.map((label) => (
          <button
            key={label}
            type="button"
            className={`gears-rating-tag${selectedTags.has(label) ? ' is-selected' : ''}`}
            aria-pressed={selectedTags.has(label)}
            onClick={() => toggleTag(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

const TIER_ROWS = [
  { tier: 1, label: 'Gears Verified', meaning: 'Contacted and confirmed by us', treatment: 'Solid badge, ranked first', isVerified: true },
  { tier: 2, label: 'Claimed', meaning: 'Business registered itself', treatment: 'Outline badge, ranked second', isVerified: false },
  { tier: 3, label: 'Not yet verified', meaning: 'Imported, unconfirmed', treatment: 'Ranked last, with a claim prompt', isVerified: false },
]

function TierTable() {
  return (
    <div className="gears-tier-table">
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Label</th>
            <th>What it means</th>
            <th>Treatment</th>
          </tr>
        </thead>
        <tbody>
          {TIER_ROWS.map((row) => (
            <tr key={row.tier} className={row.isVerified ? 'is-verified' : undefined}>
              <td>{row.tier}</td>
              <td className="gears-tier-label">{row.label}</td>
              <td>{row.meaning}</td>
              <td>{row.treatment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const BADGES = [
  {
    key: 'verified',
    icon: <img className="gears-verified-icon" src={SEAL_CHECK} alt="" />,
    title: 'Verified By Gears',
    body: "Our team personally confirmed this business. We called or visited them, checked their contact details, and verified.",
  },
  {
    key: 'claimed',
    icon: <SealCheck className="gears-verified-icon" weight="regular" color="rgba(0, 0, 0, 0.3)" />,
    title: 'Profile Claimed',
    body: "This business claimed and set up their own profile on Gears. We haven't independently confirmed every detail yet, but the owner is actively managing this listing.",
  },
  {
    key: 'unverified',
    icon: <SealQuestion className="gears-verified-icon" weight="regular" color="rgba(0, 0, 0, 0.2)" />,
    title: 'Not Yet Verified',
    body: "This listing was found online but hasn't been confirmed by Gears yet.",
  },
]

function TrustBadges() {
  return (
    <div className="gears-badges-panel">
      {BADGES.map((badge) => (
        <div className="gears-verified-card" key={badge.key}>
          {badge.icon}
          <div className="gears-verified-copy">
            <h4>{badge.title}</h4>
            <p>{badge.body}</p>
          </div>
          <div className="gears-verified-footer">
            <button type="button" className="gears-verified-btn">Got it</button>
          </div>
        </div>
      ))}
    </div>
  )
}

const PLAYERS_ICONS = [
  { key: 'mechanic', icon: <BusinessGearIcon /> },
  { key: 'parts', icon: <BusinessCartIcon /> },
  { key: 'detailer', icon: <BusinessCarWashIcon /> },
  { key: 'fuel', icon: <BusinessFuelIcon /> },
]

// Only the mechanic screen exists so far — the other three are shown as
// labeled placeholders until their screenshots are ready to drop in.
const PLAYERS = [
  { key: 'mechanic', label: 'Mechanic', icon: <BusinessGearIcon />, screen: HOME_SCREEN },
  { key: 'parts', label: 'Auto parts dealer', icon: <BusinessCartIcon />, screen: null },
  { key: 'detailer', label: 'Detailer', icon: <BusinessCarWashIcon />, screen: null },
  { key: 'fuel', label: 'Filling station', icon: <BusinessFuelIcon />, screen: null },
]

function PlayersSection() {
  return (
    <section className="gears-chapter" id="gears-one-app-four-businesses">
      <div className="gears-chapter-inner">
        <header className="gears-chapter-intro">
          <p className="gears-chapter-kicker"><span>04</span> Players</p>
          <h2>One app, four kinds of business</h2>
        </header>

        <div className="gears-players-intro-row">
          <div className="gears-quote-card gears-players-quote">
            <div className="gears-quote-card-inner">
              <p>
                <span className="is-muted">
                  Gears covers mechanics, auto parts dealers, detailers and filling stations. They share a map, a
                  search, and a trust system. They do not share much else.
                </span>
              </p>
              <p>
                A mechanic sells services at negotiated prices. A parts dealer sells products with fixed prices
                and stock. A detailer sells packages at tiers. A filling station sells a commodity where the only
                variable is today&rsquo;s price per litre. Forcing one template onto all four produces a page that
                fits none of them.
              </p>
            </div>
          </div>

          <div className="gears-players-icon-outer">
            <div className="gears-players-icon-card">
              <div className="gears-players-icon-grid">
                {PLAYERS_ICONS.map(({ key, icon }) => (
                  <span key={key} className="gears-players-icon">{icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="gears-players-grid">
          {PLAYERS.map(({ key, label, icon, screen }) => (
            <div key={key} className="gears-players-phone">
              {screen ? (
                <img className="gears-players-phone-shot" src={screen} alt={`${label} screen in Gears`} />
              ) : (
                <div className="gears-players-phone-placeholder">
                  <span className="gears-players-placeholder-icon">{icon}</span>
                  <p>{label}</p>
                  <span className="gears-players-placeholder-tag">Screenshot coming soon</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type DecorKey = 'car' | 'wheel' | 'battery' | 'alternator'

const DECOR_ITEMS: { key: DecorKey; src: string; className: string }[] = [
  { key: 'car', src: CAR_ILLUSTRATION, className: 'gears-chapter-decor-car' },
  { key: 'wheel', src: WHEEL_ILLUSTRATION, className: 'gears-chapter-decor-wheel' },
  { key: 'battery', src: BATTERY_ILLUSTRATION, className: 'gears-chapter-decor-battery' },
  { key: 'alternator', src: ALTERNATOR_ILLUSTRATION, className: 'gears-chapter-decor-alternator' },
]

// Lets a visitor pick up any of the floating car parts and drop it
// somewhere else on screen — once dropped, it leaves the sticky column for
// good and stays pinned at that screen position, like a sticker moved off
// its original spot. `boundaryRef` is the chapter `<section>` itself: a
// dropped part uses `position: fixed`, so without this check it would keep
// floating at that screen spot — including over the hero — as the visitor
// scrolls back up past where the chapters start. The set otherwise keeps
// running the whole way through chapters 1–3, passing behind the Directory
// and Badges panels (both z-indexed above it) rather than stopping for them.
function DraggableDecor({ boundaryRef }: { boundaryRef: React.RefObject<HTMLElement | null> }) {
  const [dropped, setDropped] = useState<Partial<Record<DecorKey, { x: number; y: number }>>>({})
  const [withinChapters, setWithinChapters] = useState(false)
  const dragRef = useRef<{ key: DecorKey; pointerId: number; grabX: number; grabY: number } | null>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = boundaryRef.current
      setWithinChapters(el ? el.getBoundingClientRect().top <= 0 : false)
    }
    update()
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [boundaryRef])

  const handlePointerDown = (key: DecorKey) => (event: React.PointerEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    dragRef.current = {
      key,
      pointerId: event.pointerId,
      grabX: event.clientX - rect.left,
      grabY: event.clientY - rect.top,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    setDropped((prev) => ({
      ...prev,
      [drag.key]: { x: event.clientX - drag.grabX, y: event.clientY - drag.grabY },
    }))
  }

  const endDrag = (event: React.PointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    dragRef.current = null
  }

  return (
    <>
      {/* In-flow sticky stack — a normal document-flow descendant of this
         chapter's own `<section>`, so it can never render above the hero
         regardless of `withinChapters`; no gating needed here. */}
      <div className="gears-chapter-decor" aria-hidden="true">
        {DECOR_ITEMS.filter(({ key }) => !dropped[key]).map(({ key, src, className }) => (
          <img
            key={key}
            className={`gears-chapter-decor-item ${className}`}
            src={src}
            alt=""
            draggable={false}
            onPointerDown={handlePointerDown(key)}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        ))}
      </div>

      {/* Dropped parts use `position: fixed`, so only these need the
         boundary check — otherwise one dropped near the top would keep
         floating over the hero when scrolled back up past it. */}
      {withinChapters && DECOR_ITEMS.filter(({ key }) => dropped[key]).map(({ key, src, className }) => {
        const pos = dropped[key]!
        return (
          <img
            key={key}
            className={`gears-chapter-decor-item ${className} is-dropped`}
            style={{ left: pos.x, top: pos.y }}
            src={src}
            alt=""
            draggable={false}
            onPointerDown={handlePointerDown(key)}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        )
      })}
    </>
  )
}

function DirectorySearchPanel() {
  const [query, setQuery] = useState('')
  const [isUserControlled, setIsUserControlled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Types a demo query out, holds, deletes it, and moves to the next —
  // stops for good the moment a visitor's cursor enters the panel, at
  // which point it's a plain controlled input.
  useEffect(() => {
    if (isUserControlled) return
    let cancelled = false

    const run = async () => {
      let i = 0
      while (!cancelled) {
        const target = DEMO_QUERIES[i % DEMO_QUERIES.length]
        for (let c = 1; c <= target.length && !cancelled; c++) {
          setQuery(target.slice(0, c))
          await wait(65 + Math.random() * 55)
        }
        if (cancelled) break
        await wait(1000)
        for (let c = target.length; c >= 0 && !cancelled; c--) {
          setQuery(target.slice(0, c))
          await wait(30)
        }
        await wait(400)
        i++
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [isUserControlled])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SEARCH_RESULTS
    return SEARCH_RESULTS.filter((result) => result.name.toLowerCase().includes(q))
  }, [query])

  const takeOver = () => setIsUserControlled(true)

  return (
    <div className="gears-directory-search-panel" onMouseEnter={takeOver}>
      <div className="gears-directory-search-bar">
        <ArrowLeft size={18} />
        <input
          ref={inputRef}
          className="gears-directory-search-input"
          value={query}
          onFocus={takeOver}
          onChange={(event) => {
            setIsUserControlled(true)
            setQuery(event.target.value)
          }}
          placeholder="Search"
          aria-label="Search for a mechanic, part, or place"
        />
        <button
          type="button"
          className="gears-directory-search-clear-btn"
          aria-label="Clear search"
          onClick={() => {
            takeOver()
            setQuery('')
            inputRef.current?.focus()
          }}
        >
          <X size={16} className="gears-directory-search-clear" />
        </button>
      </div>
      <p className="gears-directory-search-label">Recent</p>
      <div className="gears-directory-search-chips">
        {RECENT_SEARCHES.map((chip) => (
          <span key={chip} className="gears-directory-chip"><Clock size={11} /> {chip}</span>
        ))}
      </div>
      <div className="gears-directory-search-results">
        {results.length ? (
          results.map(({ icon, name }) => (
            <div key={name} className="gears-directory-result">
              {icon}
              <span>{name}</span>
              <ArrowRight size={14} className="gears-directory-result-arrow" />
            </div>
          ))
        ) : (
          <p className="gears-directory-no-results">No results for &ldquo;{query}&rdquo;</p>
        )}
      </div>
    </div>
  )
}

// Chapters 1–3, plus the Directory and Badges breakout panels between/after
// them, all live inside one `.gears-chapter-layout` and share a single
// sticky decor stack (car/wheel/battery/alternator) — the Directory and
// Badges panels are flex items with `flex-basis: 100%` so they wrap onto
// their own full-width rows without breaking the decor out of that shared
// flex container, which is what lets the one set of floating parts keep
// running the whole way through, passing behind both panels (z-index),
// instead of resetting at each chapter boundary or stopping for them.
export default function GearsChapterOne() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <>
    <section ref={sectionRef} className="gears-chapter" id="gears-how-it-started">
      <div className="gears-chapter-inner">
        <div className="gears-chapter-layout">
          <div className="gears-chapter-main">
            <header className="gears-chapter-intro">
              <p className="gears-chapter-kicker"><span>01</span> A question posted to a timeline</p>
              <h2>How Did It Start?</h2>
            </header>

            <div className="gears-quote-card">
              <div className="gears-quote-card-inner">
                <p>
                  Someone&rsquo;s <b>car broke down</b> somewhere unfamiliar,{' '}
                  <span className="is-muted">
                    and they asked their followers if anyone knew a mechanic nearby. That post was the brief
                  </span>
                </p>
                <p>
                  The interesting part is not the breakdown. It is that a driver with a phone, in a city full of
                  mechanics, had no better option than asking strangers. Ghana has no shortage of supply.{' '}
                  <b>Suame Magazine</b> in Kumasi is one of the largest concentrations of vehicle artisans in West
                  Africa. <b>Abossey Okai</b> in Accra supplies parts to the whole country.{' '}
                  <span className="is-muted">The problem is not finding a mechanic.</span>{' '}
                  <strong>
                    It is knowing which one will quote fairly, finish on time, and not invent three repairs you did
                    not ask for.
                  </strong>
                </p>
                <p>
                  That knowledge exists, but it lives in people&rsquo;s heads and in WhatsApp threads. It does not
                  survive being far from home.
                </p>
              </div>
            </div>

            <div className="gears-tweet-grid">
              <div className="gears-tweet-col">
                <img
                  className="gears-tweet-shot"
                  src={TWEET_BALDWIN}
                  alt="Tweet from Versatile Baldwin Bezos: Guys I need Autoelectrician who has a specialty in automatic cars. It's quite urgent"
                />
                <img
                  className="gears-tweet-shot"
                  src={TWEET_CHIEF}
                  alt="Tweet from Chief: Ma car breakdown for Okponglo, anybody get mechanic for that side? If you fit link me sensible tow truck driver too I go be grateful"
                />
              </div>
              <img
                className="gears-tweet-shot gears-tweet-shot--tall"
                src={TWEET_PHILIP}
                alt="Tweet from Philip Obosi: my mechanic is the greatest async communicator I know. Every time he picks up the car, he sends me progress updates, pictures, receipts, voice notes as he works on things. I rarely have to reach out to know what's going on. Even I suck at this. What a legend!"
              />
            </div>

            <div className="gears-alt-card">
              <div className="gears-alt-card-inner">
                <div className="gears-alt-card-head">
                  <h3>What the alternatives do badly</h3>
                  <div className="gears-alt-card-icons">
                    <img src={TIKTOK_ICON} alt="" />
                    <img src={MAPS_ICON} alt="" />
                  </div>
                </div>
                <p>
                  <span className="is-muted">&nbsp;&nbsp;&nbsp;&nbsp;...Google Maps lists businesses but tells you almost nothing about trust. </span>
                </p>
                <p>
                  Many listings have two or three reviews, no hours, and no phone.{' '}
                  <span className="is-muted">Some of the best-regarded workshops </span>
                  I later researched had thousands of followers on TikTok and a near-empty Maps profile.
                </p>
                <p>Social media has the reputation but no structure, you cannot filter it by distance or service.</p>
              </div>
            </div>

            <div className="gears-chapter-footer-row">
              <div className="gears-question-card">
                <div className="gears-question-card-inner">
                  <h3>The design question</h3>
                  <p className="gears-question-quote">
                    Not how do we list mechanics, <span className="is-solid">anyone can scrape a map</span>. It was:{' '}
                    <span className="is-solid is-underline">
                      how do you make a stranger&rsquo;s competence legible before someone hands over their car?
                    </span>
                  </p>
                </div>
              </div>

              <div className="gears-verified-card">
                <img className="gears-verified-icon" src={SEAL_CHECK} alt="" />
                <div className="gears-verified-copy">
                  <h4>Verified By Gears</h4>
                  <p>
                    Our team personally confirmed this business. We called or visited them, checked their contact
                    details, and verified they&rsquo;re actively operating.
                  </p>
                </div>
                <div className="gears-verified-footer">
                  <button type="button" className="gears-verified-btn">Got it</button>
                </div>
              </div>
            </div>

            {/* ---------- Chapter 2 — "A directory before a marketplace" ----------
               Lives in the same main column as chapter 1 (not its own
               `.gears-chapter-layout`) so the two read at the same width and
               share the one decor stack above. */}
            <div className="gears-chapter-divider" id="gears-directory-response">
              <header className="gears-chapter-intro">
                <p className="gears-chapter-kicker"><span>02</span> What was my response?</p>
                <h2>A directory before a marketplace</h2>
              </header>

              <div className="gears-quote-card">
                <div className="gears-quote-card-inner">
                  <p>
                    The obvious product is an on-demand marketplace: <b>book a mechanic, track the job, pay in the
                    app</b>. I designed for that eventually. I did not build it first, and that was the most
                    consequential decision in the project.
                  </p>
                </div>
              </div>

              <div className="gears-alt-card">
                <div className="gears-alt-card-inner">
                  <div className="gears-alt-card-head">
                    <h3>Why not start there</h3>
                  </div>
                  <p><span className="is-muted">&nbsp;&nbsp;&nbsp;&nbsp;...A marketplace needs both sides at once.</span></p>
                  <p>A driver who opens a booking app and finds four mechanics in their city does not come back.</p>
                  <p className="is-accent">
                    A mechanic who signs up and gets no jobs stops answering. Bridging that gap normally takes
                    capital, you subsidise both sides until the network holds on its own.
                  </p>
                  <p>
                    <span className="is-muted">That capital is thin here.</span> Ghana&rsquo;s startup funding fell
                    sharply while I was scoping this, and the median time to a first round is longer than in Nigeria
                    or Kenya, where the comparable companies raised.{' '}
                    <span className="is-muted">The regional competitors solving this same problem — </span>
                    <span className="is-link">Mecho Autotech</span>
                    <span className="is-muted">, </span>
                    <span className="is-link">Carviva</span>
                    <span className="is-muted"> are venture-funded and could hire field teams to reach density fast.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DraggableDecor boundaryRef={sectionRef} />

        {/* ---------- the "Directory" graphical showcase — breaks out wider than the reading column ----------
           Sits right after chapter 2's text, before chapter 3 starts below.
           A flex-basis:100% item, so it wraps onto its own row within the
           same `.gears-chapter-layout` instead of sitting beside the decor
           column — which is what keeps the decor's sticky containing block
           (and so its visible range) spanning the whole way down through
           chapter 3 below. */}
        <div className="gears-directory-panel">
        <div className="gears-directory-header">
          <div>
            <h3 className="gears-directory-title">Directory</h3>
            <span className="gears-directory-phase">PHASE 1 &middot; LIVE</span>
          </div>
          <div className="gears-directory-header-right">
            <p className="gears-directory-stat"><strong>10&ndash;20</strong> claimed profiles</p>
            <p className="gears-directory-stat-sub">Free listings, no sign-up</p>
          </div>
        </div>

        <div className="gears-directory-showcase">
          {/* card stack: rating modal over a peeking listing card */}
          <div className="gears-directory-cards">
            <DirectoryRatingCard />

            <article className="gears-card-item gears-directory-peek-card" aria-hidden="true">
              <div className="gears-card-item-top">
                <div className="gears-card-item-header">
                  <span className="gears-card-avatar is-shimmer" aria-hidden="true" />
                  <div className="gears-card-badges">
                    <span className="gears-pill is-shimmer-pill" aria-hidden="true">
                      <MapPin size={12} weight="duotone" />
                    </span>
                    <span className="gears-pill is-shimmer-pill" aria-hidden="true">
                      <Star size={12} weight="duotone" />
                    </span>
                    <span className="gears-pill gears-pill--open">Open</span>
                  </div>
                </div>
                <div className="gears-card-item-body">
                  <span className="gears-shimmer-bar" aria-hidden="true" />
                  <p className="gears-card-address">Osu, Accra</p>
                  <span className="gears-category-pill">
                    <Gear size={14} weight="fill" />
                    General Repairs
                  </span>
                </div>
              </div>
              <div className="gears-card-item-actions">
                <div className="gears-card-actions-left">
                  <button className="gears-icon-btn" type="button" aria-label="Save" tabIndex={-1}>
                    <BookmarkSimple size={16} weight="duotone" />
                  </button>
                  <button className="gears-icon-btn" type="button" aria-label="Rate" tabIndex={-1}>
                    <Star size={16} weight="duotone" />
                  </button>
                </div>
                <button className="gears-call-btn" type="button" tabIndex={-1}>
                  <PhoneCall size={16} weight="duotone" />
                  Call
                </button>
              </div>
            </article>
          </div>

          {/* phone 1 — map search (real exported screen, not hand-built) */}
          <div className="gears-phone">
            <img
              className="gears-phone-shot"
              src={HOME_SCREEN}
              alt="Gears home screen: a map pinning Muta-Motors with a search sheet listing nearby mechanics"
            />
          </div>

          {/* phone 2 — business profile (real exported screen) */}
          <div className="gears-phone">
            <img
              className="gears-phone-shot"
              src={BUSINESS_DETAILS_SCREEN}
              alt="Sam Don Auto business profile page showing hours, location, and contact details"
            />
          </div>

          {/* search / autocomplete panel */}
          <DirectorySearchPanel />
        </div>
      </div>

        {/* ---------- Chapter 3 — "Designing for trust" ----------
           A second `.gears-chapter-main` on its own wrapped row, below the
           Directory panel — still inside the same `.gears-chapter-layout`
           as chapters 1+2, so the one decor stack above keeps running
           behind both this and the Directory panel instead of stopping. */}
        <div className="gears-chapter-main gears-chapter-main--ch3">
          <header className="gears-chapter-intro">
            <p className="gears-chapter-kicker"><span>03</span> Badges</p>
            <h2>Designing for trust</h2>
          </header>

          <div className="gears-quote-card">
            <div className="gears-quote-card-inner">
              <p>
                <span className="is-muted">
                  Gears mixes data from two very different places. Some listings I imported in bulk from
                  OpenStreetMap and cross-checked against Google Places. Others I verified by calling the
                  business and confirming details myself.
                </span>
              </p>
              <p>
                Shown identically, those two things are a lie. A listing scraped from a map looks exactly as
                authoritative as one I phoned, and the moment a driver drives to a workshop that closed last
                year, the whole product loses credibility. So provenance had to be visible.
              </p>
            </div>
          </div>

          <TierTable />
        </div>

        {/* ---------- chapter 3's "Designing for trust" badge tiers — another wrapped full-width row ---------- */}
        <TrustBadges />
      </div>
      </div>
    </section>

    <PlayersSection />
    </>
  )
}
