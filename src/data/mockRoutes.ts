// ─── Types ────────────────────────────────────────────────────────────────────

export interface MockStop { name: string; lat: number; lng: number }

export interface MockRoute {
  id: string
  /** ms for one full closed loop */
  totalMs: number
  /** 0–1 phase offset so buses start spread around the route */
  startFraction: number
  /** Dense [lng, lat] waypoints following actual road geometry */
  path: [number, number][]
}

// ─── Named stops (kept for stop-dot markers) ─────────────────────────────────

export const ALL_STOPS: MockStop[] = [
  { name: 'KSB', lat: 6.669314250173885, lng: -1.567181795001016 },
  { name: 'SRC Busstop', lat: 6.675223889340042, lng: -1.5678831412482812 },
  { name: 'Main Library', lat: 6.675033566213408, lng: -1.5723546778455368 },
  { name: 'Brunei', lat: 6.670465091472612, lng: -1.5741574445526254 },
  { name: 'Pentecost Busstop', lat: 6.674545299373284, lng: -1.5675650457295751 },
  { name: 'Commercial Area', lat: 6.682751297721754, lng: -1.5769726260262382 },
  { name: 'Hall 7', lat: 6.679295619563862, lng: -1.572807677030472 },
  { name: 'Conti Busstop', lat: 6.679644223364716, lng: -1.572967657880401 },
  { name: 'Paa Joe R/A', lat: 6.675187511866504, lng: -1.570775090040308 },
  { name: 'Otumfou R/A', lat: 6.678623435492123, lng: -1.570881024852267 },
  { name: 'Gaza', lat: 6.686603046574587, lng: -1.556854180379707 },
  { name: 'Pharmacy Busstop', lat: 6.67480379472123, lng: -1.5663873751176354 },
  { name: 'Medical Village', lat: 6.6800787890749245, lng: -1.549747261104641 },
]

// ─── Route A — Green  (inner campus loop, no reversal) ───────────────────────
// Brunei → MainLib → PaaJoe → Pentecost → SRC → KSB → [south road west] → Brunei
const ROUTE_A: [number, number][] = [
  [-1.5742164171162012, 6.670507922592401], // Brunei (index 0)
  [-1.5737611530181246, 6.67092393007265],
    [-1.573607727747661, 6.67125699006564],
  // [-1.573607727747661, 6.671286042785905 ],

  [ -1.573558976455006, 6.671489411779522],
  
  [-1.573524415687125,  6.671858438341551],
  [-1.5733787311655045, 6.672672363471345],
  [-1.5723285886459417, 6.673902292173312],
  [-1.5722739569346595, 6.674173599592829],
  [-1.5722739569346595, 6.674680039644518],
  [-1.5722800271226336, 6.674830765749232],
  [ -1.572298551826746, 6.675035628835407],  // Main Library (index 8)
  [-1.5723286243102197,6.675196919427754],
  [ -1.5716519934320663, 6.675211853739181],
  [-1.571345218180021,  6.6752166243662865],
  [ -1.5710204712791234, 6.67520588001466], // PaaJoe R/A (index 11)
  [ -1.5708345184371872 , 6.67529167197754],
  [ -1.5704018337978047, 6.675161698908919],
  [-1.570307215873272,  6.675156333979918],
  [-1.569129599406248,  6.675186479175246],
  [-1.5678831412482812, 6.675223889340042], // SRC (index 16)
  [-1.5673024726906606, 6.674878998091918], // toward Pentecost / KSB
  [-1.567411736074199,  6.674625778234452],
  [-1.5675620228089944, 6.674191637385702 ],
  [-1.56763633303,      6.672931613],
  [-1.5674845783337295, 6.671942845448823],
  [-1.5673935255233908, 6.671466547975146],
  [-1.5671464720548514, 6.670087031506275],
  [-1.567182,           6.669314],          // KSB (index 24)
  // ── Return west via the southern campus road (no reversal) ──
  // [-1.5675000,          6.669340],
  // [-1.5685000,          6.669370],
  // [-1.5695000,          6.669420],
  // [-1.5705000,          6.669490],
  // [-1.5715000,          6.669580],
  // [-1.5725000,          6.669760],
  // [-1.5735000,          6.669960],
  // [-1.5742164171162012, 6.670507922592401], // Brunei (close loop, index 32)
]

// ─── Route B — Blue  (outer campus clockwise loop, no reversal) ───────────────
// Commercial → Hall7 → Conti → Otumfou → PaaJoe → SRC → KSB
//           → [west road north-west] → Commercial
export const ROUTE_B: [number, number][] = [
  [ -1.5770588992277872, 6.682679364968318], // Commercial
  [ -1.5770397794255204, 6.682510829581437],
  [ -1.5768868210073852, 6.682377900221222],
  [ -1.5764764189599356, 6.682154909814075],
  [ -1.5763096840465376, 6.682046515589557],
  [-1.5758761732717028, 6.681880913255713],
  [ -1.574575867642164, 6.680944784560282],
  [ -1.5740767196757406, 6.680462546560459], // Hall 7
  [ -1.5726791053711255, 6.679308778945541],
  [ -1.5719870900714006, 6.678738702800261],
  [ -1.571042952494396, 6.6786534545637775,],
  [-1.570881, 6.678623], // Otumfou
  [-1.570860, 6.677900],
  [-1.570840, 6.677100],
  [-1.570810, 6.676300],
  [-1.570790, 6.675700],
  [-1.570775, 6.675188], // PaaJoe
[ -1.5708345184371872 , 6.67529167197754],
  [ -1.5704018337978047, 6.675161698908919],
  [-1.570307215873272,  6.675156333979918],
  [-1.569129599406248,  6.675186479175246],
  [-1.5678831412482812, 6.675223889340042], // SRC (index 16)
  [-1.5673024726906606, 6.674878998091918], // toward Pentecost / KSB
  [-1.567411736074199,  6.674625778234452],
  [-1.5675620228089944, 6.674191637385702 ],
  [-1.56763633303,      6.672931613],
  [-1.5674845783337295, 6.671942845448823],
  [-1.5673935255233908, 6.671466547975146],
  [-1.5671464720548514, 6.670087031506275],
  [-1.567182,           6.669314],          // KSB (index 24)
  // ── Return north-west via western campus road (no reversal) ──
]

// ─── Route B ping-pong — Commercial → KSB → Commercial (reverses back) ────────
export const ROUTE_B_PINGPONG: [number, number][] = [
  ...ROUTE_B,
  ...ROUTE_B.slice().reverse().slice(1),
]

// ─── Route C — Orange  (Gaza ↔ Medical Village loop, no reversal) ────────────
// Forward (southern arc): Gaza → Medical Village
// Return  (northern arc): Medical Village → Gaza
const ROUTE_C: [number, number][] = [
  [-1.556854, 6.686603], // Gaza
  // ── Outbound: southern arc toward Medical Village ──
  [-1.557600, 6.685400],
  [-1.558700, 6.684000],
  [-1.559800, 6.682400],
  [-1.560700, 6.681000],
  [-1.561600, 6.679700],
  [-1.562400, 6.679000],
  [-1.561500, 6.678600],
  [-1.560000, 6.678400],
  [-1.558400, 6.678600],
  [-1.556500, 6.679100],
  [-1.554500, 6.679600],
  [-1.552500, 6.679900],
  [-1.550500, 6.680050],
  [-1.549747, 6.680079], // Medical Village
  // ── Return: northern arc back to Gaza ──
  [-1.550800, 6.681100],
  [-1.552500, 6.682000],
  [-1.554200, 6.682900],
  [-1.555300, 6.684000],
  [-1.555900, 6.685200],
  [-1.556400, 6.686100],
  [-1.556854, 6.686603], // Gaza (close loop)
]

// ─── 5 buses — two per main route, one off-campus ────────────────────────────

export const MOCK_ROUTES: MockRoute[] = [
  { id: 'bus-1', totalMs: 90_000, startFraction: 0.00, path: ROUTE_A },
  { id: 'bus-2', totalMs: 90_000, startFraction: 0.50, path: ROUTE_A },
  { id: 'bus-3', totalMs: 110_000, startFraction: 0.00, path: ROUTE_B },
  { id: 'bus-4', totalMs: 110_000, startFraction: 0.50, path: ROUTE_B },
  { id: 'bus-5', totalMs: 100_000, startFraction: 0.00, path: ROUTE_C },
]

// Brunei → KSB via northern campus road (indices 0-24) — the path bus-1 physically travels
export const BRUNEI_TO_KSB: [number, number][] = ROUTE_A.slice(0, 25)

// KSB → Brunei via southern road (indices 24-32)
export const KSB_TO_BRUNEI: [number, number][] = ROUTE_A.slice(24)

/** Unique route paths with display colours for map line rendering */
export const ROUTE_PATHS = [
  { id: 'route-a', color: '#34A853', path: ROUTE_A },
  { id: 'route-b', color: '#4285F4', path: ROUTE_B },
  { id: 'route-c', color: '#FB8C00', path: ROUTE_C },
] as const
