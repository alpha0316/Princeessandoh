import { useRef, useState } from 'react'
import './gas-engineering.css'

// ── Types ──────────────────────────────────────────────────────────────────────

type SectionId =
  | 'intro'
  | 'auth-phone' | 'auth-id'
  | 'order-offers' | 'order-cylinder' | 'order-state'
  | 'price-slider' | 'price-cost' | 'price-payment'
  | 'loc-hook' | 'loc-geocode' | 'loc-map'
  | 'track-states' | 'track-progress' | 'track-map'
  | 'onboard-anim' | 'onboard-splash'

type BadgeKind = 'auth' | 'order' | 'system' | 'price' | 'algo' | 'engine' | 'rest'

interface NavChild { id: SectionId; label: string; badge: BadgeKind }
interface NavGroup  { id: string; label: string; children: NavChild[] }

// ── Nav structure ──────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  { id: 'auth', label: 'Auth Flow', children: [
    { id: 'auth-phone', label: 'Phone + OTP',        badge: 'auth' },
    { id: 'auth-id',    label: 'User ID Generation', badge: 'auth' },
  ]},
  { id: 'order', label: 'Order Pipeline', children: [
    { id: 'order-offers',   label: 'Offer Selection',    badge: 'order' },
    { id: 'order-cylinder', label: 'Cylinder Selection', badge: 'order' },
    { id: 'order-state',    label: 'Param Accumulation', badge: 'system' },
  ]},
  { id: 'price', label: 'Pricing Engine', children: [
    { id: 'price-slider',  label: 'Slider Formula',    badge: 'price' },
    { id: 'price-cost',    label: 'Cost Accumulation', badge: 'price' },
    { id: 'price-payment', label: 'MoMo Payment',      badge: 'rest' },
  ]},
  { id: 'location', label: 'Location Services', children: [
    { id: 'loc-hook',    label: 'useLocationService', badge: 'algo' },
    { id: 'loc-geocode', label: 'Reverse Geocoding',  badge: 'algo' },
    { id: 'loc-map',     label: 'Google Maps Setup',  badge: 'engine' },
  ]},
  { id: 'tracker', label: 'Delivery Tracker', children: [
    { id: 'track-states',   label: 'Order States',       badge: 'engine' },
    { id: 'track-progress', label: 'Progress Animation', badge: 'engine' },
    { id: 'track-map',      label: 'Rider Map',          badge: 'algo' },
  ]},
  { id: 'onboard', label: 'Onboarding', children: [
    { id: 'onboard-anim',   label: 'Staggered Animations', badge: 'engine' },
    { id: 'onboard-splash', label: 'Splash → Route',       badge: 'system' },
  ]},
]

// ── Order states data ──────────────────────────────────────────────────────────

const ORDER_STATES = [
  { id: 'PENDING',    icon: '⏳', title: 'Order Placed',      desc: 'Awaiting rider assignment. Server holds order in queue.' },
  { id: 'ACCEPTED',   icon: '✅', title: 'Rider Assigned',    desc: 'Rider has accepted and is heading to collect your cylinder.' },
  { id: 'PICKUP',     icon: '🏍️', title: 'Pickup In Progress',desc: 'Rider en route to your address to collect the empty cylinder.' },
  { id: 'FILLING',    icon: '⛽', title: 'At Filling Station', desc: 'Cylinder is being refilled. Progress tracked via rider check-in.' },
  { id: 'DELIVERING', icon: '🚀', title: 'Out For Delivery',  desc: 'Rider returning with the filled cylinder to your location.' },
  { id: 'DELIVERED',  icon: '🎉', title: 'Delivered',         desc: 'Successfully delivered. RatingScreen surfaces automatically.' },
]

// ── Param accumulation steps ───────────────────────────────────────────────────

const PARAM_STEPS = [
  { screen: 'Home', key: 'ps-home',
    display: `{\n  offerName: \x1b'Emergency Offer\x1b',\n  offerPrice: \x1b12\x1b,\n  offerId: \x1b1\x1b,\n}` },
  { screen: 'SelectLocation', key: 'ps-loc',
    display: `{\n  offerName: \x1b'Emergency Offer\x1b', offerPrice: \x1b12\x1b,\n  locationName: \x1b'Tech Junction, Kumasi'\x1b,\n  locationCoordinates: \x1b[-1.57, 6.68]\x1b,\n  locationType: \x1b'poi'\x1b,\n  timestamp: \x1b'2024-03-15T14:22:00Z'\x1b,\n}` },
  { screen: 'SelectCylinder', key: 'ps-cyl',
    display: `{\n  ...prev,\n  price: \x1b'GHC 3.00'\x1b,\n  cylinderName: \x1b'12kg Small'\x1b,\n  totalCost: \x1b15\x1b,\n}` },
  { screen: 'Amount', key: 'ps-amt',
    display: `{\n  ...prev,\n  amount: \x1b'50.00'\x1b,\n  selectedKg: \x1b10\x1b,\n  totalCost: \x1b65\x1b,\n}` },
  { screen: 'Payment', key: 'ps-pay',
    display: `// route.params fully destructured:\nconst { offerName, offerPrice, price,\n        amount, selectedKg, totalCost,\n        locationName, locationCoordinates,\n        ...otherParams } = route.params;` },
]

function renderParamDisplay(raw: string) {
  return raw
    .split('\x1b')
    .map((chunk, i) => i % 2 === 1
      ? `<span style="color:#a5d6ff">${chunk}</span>`
      : `<span style="color:#e2e2e6">${chunk}</span>`,
    )
    .join('')
}

// ── Copy button ────────────────────────────────────────────────────────────────

function CopyBtn({ preRef }: { preRef: React.RefObject<HTMLPreElement | null> }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(preRef.current?.textContent ?? '').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return <button className="geng-copy-btn" onClick={handle}>{copied ? 'Copied!' : 'Copy'}</button>
}

function CodeBlock({ lang, file, html }: { lang: string; file: string; html: string }) {
  const preRef = useRef<HTMLPreElement>(null)
  return (
    <div className="geng-code-block">
      <div className="geng-code-header">
        <span className="geng-code-lang">{lang}</span>
        <span className="geng-code-file">{file}</span>
        <CopyBtn preRef={preRef} />
      </div>
      <div className="geng-code-body">
        <pre ref={preRef} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}

function DecisionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="geng-decision">
      <div className="geng-decision__label">{label}</div>
      <div className="geng-decision__text">{children}</div>
    </div>
  )
}

function Badge({ kind }: { kind: BadgeKind }) {
  const label: Record<BadgeKind, string> = {
    auth: 'AUTH', order: 'ORDER', system: 'SYSTEM',
    price: 'PRICE', algo: 'ALGO', engine: 'ENGINE', rest: 'REST',
  }
  return <span className={`geng-badge geng-badge-${kind}`}>{label[kind]}</span>
}

// ── Code strings ───────────────────────────────────────────────────────────────

const CODE_FORMAT_PHONE = `<span class="cmt">// Normalises any Ghana number format to +233XXXXXXXXX</span>
<span class="kw">const</span> <span class="fn">formatPhoneNumber</span> = (<span class="var">number</span>: <span class="type">string</span>) =&gt; {
  <span class="kw">const</span> <span class="var">cleaned</span> = <span class="var">number</span>.<span class="fn">replace</span>(<span class="str">/\\s+/g</span>, <span class="str">''</span>);
  <span class="kw">if</span> (<span class="var">cleaned</span>.<span class="fn">startsWith</span>(<span class="str">'0'</span>))   <span class="kw">return</span> <span class="str">\`+233\${cleaned.substring(1)}\`</span>;
  <span class="kw">if</span> (<span class="var">cleaned</span>.<span class="fn">startsWith</span>(<span class="str">'233'</span>)) <span class="kw">return</span> <span class="str">\`+\${cleaned}\`</span>;
  <span class="kw">if</span> (!<span class="var">cleaned</span>.<span class="fn">startsWith</span>(<span class="str">'+'</span>))  <span class="kw">return</span> <span class="str">\`+233\${cleaned}\`</span>;
  <span class="kw">return</span> <span class="var">cleaned</span>;
};
<span class="cmt">// Input: max 9 digits, numeric only, live validation</span>
<span class="kw">const</span> <span class="var">isButtonDisabled</span> = <span class="var">phoneNumber</span>.<span class="var">length</span> &lt; <span class="num">9</span>;`

const CODE_OTP = `<span class="cmt">// 4-digit OTP — advances focus automatically, backs up on delete</span>
<span class="kw">const</span> <span class="fn">handleInputChange</span> = (<span class="var">value</span>, <span class="var">index</span>) =&gt; {
  <span class="kw">const</span> <span class="var">newOtp</span> = [...<span class="var">otp</span>];
  <span class="var">newOtp</span>[<span class="var">index</span>] = <span class="var">value</span>;
  <span class="fn">setOtp</span>(<span class="var">newOtp</span>);
  <span class="cmt">// Digit entered → advance to next</span>
  <span class="kw">if</span> (<span class="var">value</span> &amp;&amp; <span class="var">index</span> &lt; <span class="var">inputsRef</span>.<span class="var">current</span>.<span class="var">length</span> - <span class="num">1</span>)
    <span class="var">inputsRef</span>.<span class="var">current</span>[<span class="var">index</span> + <span class="num">1</span>].<span class="fn">focus</span>();
  <span class="cmt">// Deleted → go back</span>
  <span class="kw">else if</span> (!<span class="var">value</span> &amp;&amp; <span class="var">index</span> &gt; <span class="num">0</span>)
    <span class="var">inputsRef</span>.<span class="var">current</span>[<span class="var">index</span> - <span class="num">1</span>].<span class="fn">focus</span>();
};
<span class="kw">const</span> <span class="var">isButtonDisabled</span> = <span class="var">otp</span>.<span class="fn">some</span>(<span class="var">v</span> =&gt; <span class="var">v</span> === <span class="str">''</span>);`

const CODE_BENTO = `<span class="cmt">// 3 order cards stack with staggered translateY animations</span>
<span class="kw">const</span> <span class="var">topBent</span> = <span class="fn">useRef</span>(<span class="kw">new</span> <span class="type">Animated.Value</span>(-<span class="num">200</span>)).<span class="var">current</span>;
<span class="fn">Animated.timing</span>(<span class="var">topBent</span>, { <span class="var">toValue</span>: <span class="num">0</span>,   <span class="var">duration</span>: <span class="num">900</span> }).<span class="fn">start</span>();

<span class="kw">const</span> <span class="var">secBent</span> = <span class="fn">useRef</span>(<span class="kw">new</span> <span class="type">Animated.Value</span>(-<span class="num">200</span>)).<span class="var">current</span>;
<span class="fn">Animated.timing</span>(<span class="var">secBent</span>, { <span class="var">toValue</span>: -<span class="num">30</span>, <span class="var">duration</span>: <span class="num">900</span> }).<span class="fn">start</span>();

<span class="kw">const</span> <span class="var">thiBent</span> = <span class="fn">useRef</span>(<span class="kw">new</span> <span class="type">Animated.Value</span>(-<span class="num">200</span>)).<span class="var">current</span>;
<span class="fn">Animated.timing</span>(<span class="var">thiBent</span>, { <span class="var">toValue</span>: -<span class="num">60</span>, <span class="var">duration</span>: <span class="num">600</span> }).<span class="fn">start</span>();
<span class="cmt">// ID format: "GA - 007" shown in dashed-border pill, green text</span>`

const CODE_OFFERS = `<span class="kw">const</span> <span class="var">inputFields</span> = [
  { <span class="var">id</span>: <span class="num">1</span>, <span class="var">title</span>: <span class="str">'Emergency Offer'</span>, <span class="var">price</span>: <span class="num">12</span>, <span class="var">route</span>: <span class="str">'SelectLocation'</span> },
  { <span class="var">id</span>: <span class="num">2</span>, <span class="var">title</span>: <span class="str">'Regular Offer'</span>,    <span class="var">price</span>: <span class="num">10</span>, <span class="var">route</span>: <span class="str">'SelectLocation'</span> },
  { <span class="var">id</span>: <span class="num">3</span>, <span class="var">title</span>: <span class="str">'3 Months Free Refill'</span>, <span class="var">price</span>: <span class="num">7</span>, <span class="var">route</span>: <span class="str">'SelectLocation'</span> },
];

<span class="cmt">// On tap → navigate with first params:</span>
<span class="var">navigation</span>.<span class="fn">navigate</span>(<span class="str">'SelectLocation'</span>, {
  <span class="var">offerName</span>:  <span class="var">item</span>.<span class="var">title</span>,
  <span class="var">offerPrice</span>: <span class="var">item</span>.<span class="var">price</span>,
  <span class="var">offerId</span>:    <span class="var">item</span>.<span class="var">id</span>,
});`

const CODE_CYLINDER = `<span class="kw">const</span> <span class="fn">handleSelectCylinder</span> = (<span class="var">item</span>: <span class="type">Cylinder</span>) =&gt; {
  <span class="kw">if</span> (<span class="var">selectedId</span> === <span class="var">item</span>.<span class="var">id</span>) {          <span class="cmt">// Tap again → deselect</span>
    <span class="fn">setSelectedId</span>(<span class="kw">null</span>); <span class="fn">setPrice</span>(<span class="str">'n/a'</span>); <span class="fn">setTotalCost</span>(<span class="num">0</span>);
    <span class="kw">return</span>;
  }
  <span class="fn">setSelectedId</span>(<span class="var">item</span>.<span class="var">id</span>);
  <span class="fn">setPrice</span>(<span class="var">item</span>.<span class="var">price</span>);

  <span class="cmt">// Robust price parse — matches first numeric sequence</span>
  <span class="kw">const</span> <span class="var">match</span> = <span class="var">item</span>.<span class="var">price</span>.<span class="fn">match</span>(<span class="str">/[\\d.]+/</span>);
  <span class="kw">if</span> (<span class="var">match</span>) {
    <span class="kw">const</span> <span class="var">cylinderCost</span> = <span class="fn">parseFloat</span>(<span class="var">match</span>[<span class="num">0</span>]);
    <span class="fn">setTotalCost</span>(<span class="var">cylinderCost</span> + (<span class="fn">parseFloat</span>(<span class="var">offerPrice</span>) || <span class="num">0</span>));
  }
};`

const CODE_PARAM_SPREAD = `<span class="cmt">// Amount.tsx — spreads all accumulated params forward</span>
<span class="var">navigation</span>.<span class="fn">navigate</span>(<span class="str">'Payment'</span>, {
  <span class="var">offerName</span>, <span class="var">offerPrice</span>, <span class="var">offerId</span>,        <span class="cmt">// Home</span>
  <span class="var">locationName</span>, <span class="var">locationCoordinates</span>,       <span class="cmt">// SelectLocation</span>
  <span class="var">price</span>, <span class="var">cylinderName</span>,                     <span class="cmt">// SelectCylinder</span>
  <span class="var">amount</span>, <span class="var">selectedKg</span>, <span class="var">totalCost</span>,          <span class="cmt">// Amount</span>
  ...<span class="var">otherParams</span>
});

<span class="cmt">// Payment.tsx — destructures the full accumulated object</span>
<span class="kw">const</span> { <span class="var">offerName</span>, <span class="var">price</span>, <span class="var">amount</span>, <span class="var">totalCost</span>, ...<span class="var">rest</span>
      } = <span class="var">route</span>.<span class="var">params</span> <span class="kw">as</span> <span class="type">AmountScreenParams</span> || {};`

const CODE_SLIDER = `<span class="kw">const</span> <span class="fn">handleSliderChange</span> = (<span class="var">value</span>: <span class="type">number</span>) =&gt; {
  <span class="fn">setSliderValue</span>(<span class="var">value</span>);

  <span class="cmt">// Map 0–1 float to 2–24 kg range</span>
  <span class="kw">const</span> <span class="var">kg</span> = <span class="num">2</span> + <span class="type">Math</span>.<span class="fn">round</span>(<span class="var">value</span> * <span class="num">22</span>);
  <span class="fn">setSelectedKg</span>(<span class="var">kg</span>);

  <span class="cmt">// Price = weight × rate (GHC 5/kg)</span>
  <span class="kw">const</span> <span class="var">price</span> = <span class="var">kg</span> * <span class="var">pricePerKg</span>;   <span class="cmt">// pricePerKg = 5</span>
  <span class="fn">setAmount</span>(<span class="var">price</span>.<span class="fn">toFixed</span>(<span class="num">2</span>));
};`

const CODE_COST = `<span class="cmt">// Recalculates whenever any price component changes</span>
<span class="fn">useEffect</span>(() =&gt; {
  <span class="kw">const</span> <span class="var">a</span> = <span class="fn">parseFloat</span>(<span class="var">offerPrice</span>) || <span class="num">0</span>;   <span class="cmt">// from offer (12/10/7)</span>
  <span class="kw">const</span> <span class="var">b</span> = <span class="fn">parseFloat</span>(<span class="var">price</span>)      || <span class="num">0</span>;   <span class="cmt">// from SelectCylinder</span>
  <span class="kw">const</span> <span class="var">c</span> = <span class="fn">parseFloat</span>(<span class="var">amount</span>)     || <span class="num">0</span>;   <span class="cmt">// from slider / input</span>
  <span class="fn">setTotalCost</span>(<span class="var">a</span> + <span class="var">b</span> + <span class="var">c</span>);
}, [<span class="var">offerPrice</span>, <span class="var">price</span>, <span class="var">amount</span>]);
<span class="cmt">// Example: Emergency(12) + 12kg cylinder(3) + 10kg gas(50) = GHC 65</span>`

const CODE_MOMO = `<span class="cmt">// Initiates MTN / Vodafone MoMo payment via REST</span>
<span class="kw">const</span> <span class="fn">handlePayment</span> = <span class="kw">async</span> () =&gt; {
  <span class="fn">setLoading</span>(<span class="kw">true</span>);
  <span class="kw">try</span> {
    <span class="kw">const</span> <span class="var">res</span> = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">\`\${BASE_URL}/api/payment/initiate\`</span>, {
      <span class="var">method</span>: <span class="str">'POST'</span>,
      <span class="var">headers</span>: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
      <span class="var">body</span>: <span class="type">JSON</span>.<span class="fn">stringify</span>({
        <span class="var">phoneNumber</span>, <span class="var">amount</span>: <span class="var">totalCost</span>, <span class="var">orderId</span>,
        <span class="var">network</span>: <span class="var">selectedNetwork</span>,     <span class="cmt">// 'MTN' | 'VODAFONE' | 'AIRTELTIGO'</span>
      }),
    });
    <span class="kw">const</span> { <span class="var">status</span>, <span class="var">reference</span> } = <span class="kw">await</span> <span class="var">res</span>.<span class="fn">json</span>();
    <span class="kw">if</span> (<span class="var">status</span> === <span class="str">'success'</span>) <span class="var">navigation</span>.<span class="fn">navigate</span>(<span class="str">'Tracker'</span>, { <span class="var">reference</span> });
  } <span class="kw">finally</span> { <span class="fn">setLoading</span>(<span class="kw">false</span>); }
};`

const CODE_LOC_HOOK = `<span class="cmt">// Custom hook — requests device location, handles denial gracefully</span>
<span class="kw">const</span> <span class="fn">useLocationService</span> = () =&gt; {
  <span class="kw">const</span> [<span class="var">location</span>, <span class="fn">setLocation</span>] = <span class="fn">useState</span>&lt;<span class="type">LatLng</span> | <span class="kw">null</span>&gt;(<span class="kw">null</span>);
  <span class="kw">const</span> [<span class="var">loading</span>, <span class="fn">setLoading</span>]   = <span class="fn">useState</span>(<span class="kw">true</span>);

  <span class="fn">useEffect</span>(() =&gt; {
    <span class="type">Location</span>.<span class="fn">requestForegroundPermissionsAsync</span>()
      .<span class="fn">then</span>(({ <span class="var">status</span> }) =&gt; {
        <span class="kw">if</span> (<span class="var">status</span> !== <span class="str">'granted'</span>) { <span class="fn">setLoading</span>(<span class="kw">false</span>); <span class="kw">return</span>; }
        <span class="kw">return</span> <span class="type">Location</span>.<span class="fn">getCurrentPositionAsync</span>({});
      })
      .<span class="fn">then</span>(<span class="var">pos</span> =&gt; {
        <span class="kw">if</span> (<span class="var">pos</span>) <span class="fn">setLocation</span>({ <span class="var">lat</span>: <span class="var">pos</span>.<span class="var">coords</span>.<span class="var">latitude</span>,
                               <span class="var">lng</span>: <span class="var">pos</span>.<span class="var">coords</span>.<span class="var">longitude</span> });
      })
      .<span class="fn">finally</span>(() =&gt; <span class="fn">setLoading</span>(<span class="kw">false</span>));
  }, []);

  <span class="kw">return</span> { <span class="var">location</span>, <span class="var">loading</span> };
};`

const CODE_GEOCODE = `<span class="cmt">// Converts lat/lng to human-readable address using Google Maps</span>
<span class="kw">const</span> <span class="fn">reverseGeocode</span> = <span class="kw">async</span> (<span class="var">lat</span>: <span class="type">number</span>, <span class="var">lng</span>: <span class="type">number</span>) =&gt; {
  <span class="kw">const</span> <span class="var">url</span> = <span class="str">\`https://maps.googleapis.com/maps/api/geocode/json\`</span>
    + <span class="str">\`?latlng=\${lat},\${lng}&key=\${MAPS_API_KEY}\`</span>;
  <span class="kw">const</span> { <span class="var">results</span> } = <span class="kw">await</span> (<span class="kw">await</span> <span class="fn">fetch</span>(<span class="var">url</span>)).<span class="fn">json</span>();
  <span class="kw">return</span> <span class="var">results</span>[<span class="num">0</span>]?.<span class="var">formatted_address</span> ?? <span class="str">'Unknown location'</span>;
};

<span class="cmt">// Result feeds SelectLocation's initial address field</span>
<span class="kw">const</span> { <span class="var">location</span> } = <span class="fn">useLocationService</span>();
<span class="fn">useEffect</span>(() =&gt; {
  <span class="kw">if</span> (<span class="var">location</span>) <span class="fn">reverseGeocode</span>(<span class="var">location</span>.<span class="var">lat</span>, <span class="var">location</span>.<span class="var">lng</span>).<span class="fn">then</span>(<span class="fn">setAddress</span>);
}, [<span class="var">location</span>]);`

const CODE_MAPS = `<span class="cmt">// Default region centred on Kumasi, GH — fallback if geolocation denied</span>
<span class="kw">const</span> <span class="var">KUMASI_REGION</span>: <span class="type">Region</span> = {
  <span class="var">latitude</span>:       <span class="num">6.6885</span>,
  <span class="var">longitude</span>:      -<span class="num">1.6244</span>,
  <span class="var">latitudeDelta</span>:  <span class="num">0.0922</span>,
  <span class="var">longitudeDelta</span>: <span class="num">0.0421</span>,
};

&lt;<span class="type">MapView</span>
  <span class="var">provider</span>={<span class="type">PROVIDER_GOOGLE</span>}
  <span class="var">initialRegion</span>={<span class="var">userRegion</span> ?? <span class="var">KUMASI_REGION</span>}
  <span class="var">showsUserLocation</span>
  <span class="var">showsMyLocationButton</span>
  <span class="var">style</span>={{ <span class="var">flex</span>: <span class="num">1</span> }}
/&gt;`

const CODE_PROGRESS = `<span class="cmt">// Each order phase drives one Animated.Value</span>
<span class="kw">const</span> <span class="var">progress</span> = <span class="fn">useRef</span>(<span class="kw">new</span> <span class="type">Animated.Value</span>(<span class="num">0</span>)).<span class="var">current</span>;

<span class="fn">useEffect</span>(() =&gt; {
  <span class="kw">const</span> <span class="var">targets</span>: <span class="type">Record</span>&lt;<span class="type">OrderState</span>, <span class="type">number</span>&gt; = {
    PENDING: <span class="num">0</span>, ACCEPTED: <span class="num">0.2</span>, PICKUP: <span class="num">0.4</span>,
    FILLING: <span class="num">0.6</span>, DELIVERING: <span class="num">0.8</span>, DELIVERED: <span class="num">1.0</span>,
  };
  <span class="fn">Animated.timing</span>(<span class="var">progress</span>, {
    <span class="var">toValue</span>:        <span class="var">targets</span>[<span class="var">orderState</span>],
    <span class="var">duration</span>:       <span class="num">600</span>,
    <span class="var">useNativeDriver</span>: <span class="kw">false</span>,
  }).<span class="fn">start</span>();
}, [<span class="var">orderState</span>]);`

const CODE_RIDER_MAP = `<span class="cmt">// Rider location polled every 5 s while order is active</span>
<span class="fn">useEffect</span>(() =&gt; {
  <span class="kw">if</span> (<span class="var">orderState</span> !== <span class="str">'DELIVERING'</span>) <span class="kw">return</span>;
  <span class="kw">const</span> <span class="var">id</span> = <span class="fn">setInterval</span>(<span class="kw">async</span> () =&gt; {
    <span class="kw">const</span> { <span class="var">lat</span>, <span class="var">lng</span> } = <span class="kw">await</span> <span class="fn">fetchRiderLocation</span>(<span class="var">orderId</span>);
    <span class="fn">setRiderCoord</span>({ <span class="var">latitude</span>: <span class="var">lat</span>, <span class="var">longitude</span>: <span class="var">lng</span> });
    <span class="var">mapRef</span>.<span class="var">current</span>?.<span class="fn">animateToRegion</span>({
      <span class="var">latitude</span>: <span class="var">lat</span>, <span class="var">longitude</span>: <span class="var">lng</span>,
      <span class="var">latitudeDelta</span>: <span class="num">0.01</span>, <span class="var">longitudeDelta</span>: <span class="num">0.01</span>,
    }, <span class="num">800</span>);
  }, <span class="num">5000</span>);
  <span class="kw">return</span> () =&gt; <span class="fn">clearInterval</span>(<span class="var">id</span>);
}, [<span class="var">orderState</span>, <span class="var">orderId</span>]);`

const CODE_STAGGER = `<span class="cmt">// 3-slide onboarding with staggered entrance</span>
<span class="kw">const</span> <span class="var">opacity</span>   = <span class="fn">useRef</span>(<span class="kw">new</span> <span class="type">Animated.Value</span>(<span class="num">0</span>)).<span class="var">current</span>;
<span class="kw">const</span> <span class="var">translateY</span>= <span class="fn">useRef</span>(<span class="kw">new</span> <span class="type">Animated.Value</span>(<span class="num">40</span>)).<span class="var">current</span>;

<span class="fn">Animated.parallel</span>([
  <span class="fn">Animated.timing</span>(<span class="var">opacity</span>,    { <span class="var">toValue</span>: <span class="num">1</span>, <span class="var">duration</span>: <span class="num">500</span>, <span class="var">delay</span>: <span class="var">index</span> * <span class="num">120</span> }),
  <span class="fn">Animated.timing</span>(<span class="var">translateY</span>, { <span class="var">toValue</span>: <span class="num">0</span>, <span class="var">duration</span>: <span class="num">500</span>, <span class="var">delay</span>: <span class="var">index</span> * <span class="num">120</span> }),
]).<span class="fn">start</span>();
<span class="cmt">// delay = slideIndex × 120ms — each slide staggers 120 ms later</span>`

const CODE_SPLASH = `<span class="cmt">// SplashScreen checks AsyncStorage for existing auth token</span>
<span class="fn">useEffect</span>(() =&gt; {
  <span class="kw">const</span> <span class="fn">checkAuth</span> = <span class="kw">async</span> () =&gt; {
    <span class="kw">const</span> <span class="var">token</span> = <span class="kw">await</span> <span class="type">AsyncStorage</span>.<span class="fn">getItem</span>(<span class="str">'userToken'</span>);
    <span class="cmt">// Token present → skip Onboarding, go straight to Home</span>
    <span class="var">navigation</span>.<span class="fn">replace</span>(<span class="var">token</span> ? <span class="str">'Home'</span> : <span class="str">'Onboarding'</span>);
  };
  <span class="kw">const</span> <span class="var">timer</span> = <span class="fn">setTimeout</span>(<span class="var">checkAuth</span>, <span class="num">2000</span>); <span class="cmt">// 2 s brand moment</span>
  <span class="kw">return</span> () =&gt; <span class="fn">clearTimeout</span>(<span class="var">timer</span>);
}, []);`

// ── Main component ─────────────────────────────────────────────────────────────

export default function GasEngineeringSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('intro')
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())

  // Demo: phone formatter
  const [phoneInput, setPhoneInput] = useState('')
  const formatPhone = (v: string) => {
    const c = v.replace(/\s+/g, '')
    if (c.startsWith('0'))   return `+233${c.substring(1)}`
    if (c.startsWith('233')) return `+${c}`
    if (!c.startsWith('+'))  return `+233${c}`
    return c
  }
  const normalizedPhone = phoneInput ? formatPhone(phoneInput) : '—'
  const phoneValid = normalizedPhone.length === 13 && normalizedPhone.startsWith('+233')

  // Demo: slider
  const [sliderValue, setSliderValue] = useState(0)
  const kg = 2 + Math.round(sliderValue * 22)
  const sliderPrice = kg * 5

  // Demo: param steps
  const [paramStep, setParamStep] = useState(0)

  // Demo: cost accumulation
  const [offerPriceSel, setOfferPriceSel] = useState(12)
  const [cylPriceSel, setCylPriceSel]     = useState(0)
  const [amtDemo, setAmtDemo]             = useState(0)
  const totalCostDemo = offerPriceSel + cylPriceSel + amtDemo

  // Demo: order states
  const [activeState, setActiveState] = useState('PENDING')
  const stateInfo = ORDER_STATES.find(s => s.id === activeState)!

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const nav = (id: SectionId) => setActiveSection(id)

  return (
    <div className="geng-root">
      {/* Island */}
      <div className="geng-island" aria-hidden="true">
        <span className="geng-island__dot" />
        <span className="geng-island__label">GasApp</span>
        <span className="geng-island__sep">·</span>
        <span className="geng-island__value">Engineering · v1.0.0</span>
        <div className="geng-waveform">
          {[0,1,2,3,4].map(i => <span key={i} />)}
        </div>
      </div>

      <div className="geng-layout">
        {/* ── Sidebar ── */}
        <aside className="geng-sidebar">
          <div className="geng-search">
            <SearchIcon />
            <input className="geng-search__input" placeholder="Search" readOnly />
            <span className="geng-kbd">⌘ K</span>
          </div>

          <nav className="geng-nav">
            <div
              className={`geng-nav__intro${activeSection === 'intro' ? ' active' : ''}`}
              onClick={() => nav('intro')}
            >
              Introduction
            </div>

            {NAV_GROUPS.map(g => (
              <div className="geng-nav-group" key={g.id}>
                <div
                  className={`geng-nav-group-header${openGroups.has(g.id) ? ' open' : ''}`}
                  onClick={() => toggleGroup(g.id)}
                >
                  <span>{g.label}</span>
                  <svg className="geng-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={`geng-nav-children${openGroups.has(g.id) ? ' open' : ''}`}>
                  {g.children.map(c => (
                    <div
                      key={c.id}
                      className={`geng-nav-child${activeSection === c.id ? ' active' : ''}`}
                      onClick={() => nav(c.id)}
                    >
                      <span>{c.label}</span>
                      <Badge kind={c.badge} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="geng-sidebar__footer">
            <button className="geng-api-btn">↗ API Docs</button>
            <span className="geng-scalar-tag">Powered by Prince</span>
          </div>
        </aside>

        {/* ── Main panel ── */}
        <main className="geng-main">

          {/* INTRO ─────────────────────────────────────────────────────────── */}
          {activeSection === 'intro' && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <span className="geng-version-badge">v1.0.0</span>
                <span className="geng-version-badge">React Native · Expo</span>
              </div>
              <div className="geng-intro-title">GasApp Engineering</div>
              <p className="geng-intro-desc">
                On-demand LPG delivery for Kumasi. Users pick an offer, set a location,
                choose a cylinder size, calculate amount via slider, pay via Mobile Money,
                and track the rider in real-time. 12-screen flow, 0 Redux — all state
                passed as navigation params.
              </p>

              <div className="geng-metrics">
                <div className="geng-metric">
                  <div className="geng-metric__label">Screens</div>
                  <div className="geng-metric__value">12</div>
                </div>
                <div className="geng-metric">
                  <div className="geng-metric__label">Price Range</div>
                  <div className="geng-metric__value" style={{ fontSize: 13, marginTop: 4 }}>
                    GHC 2–24<span className="geng-metric__unit">kg</span>
                  </div>
                </div>
                <div className="geng-metric">
                  <div className="geng-metric__label">Map Default</div>
                  <div className="geng-metric__value" style={{ fontSize: 11, marginTop: 6 }}>
                    Kumasi, GH
                  </div>
                </div>
              </div>

              <div className="geng-server-card" style={{ maxWidth: 640 }}>
                <div className="geng-server-card__title">Screen Navigation Flow</div>
                <p className="geng-flow-text">
                  <span className="hi">SplashScreen</span>{' → '}<span className="w">Onboarding</span>{' → '}<span className="w">PhoneNumber</span>{' → '}<span className="w">OTPVerification</span>{' →'}<br />
                  <span className="w">GeneralDetails</span>{' → '}<span className="hi">OrderIDPage</span>{' → '}<span className="w">Home</span>{' → '}<span className="w">SelectLocation</span>{' →'}<br />
                  <span className="w">SelectCylinder</span>{' → '}<span className="w">Amount</span>{' → '}<span className="w">Payment</span>{' → '}<span className="hi">Tracker</span>
                </p>
              </div>

              <div style={{ marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--g-muted)', textTransform: 'uppercase', letterSpacing: '.12em' }}>Available Offers</div>
              <div className="geng-offer-grid">
                <div className="geng-offer-card">
                  <div className="geng-offer-card__icon">⚡</div>
                  <div className="geng-offer-card__title">Emergency</div>
                  <div className="geng-offer-card__price" style={{ color: '#6b7df5' }}>GHC 12 / fill</div>
                  <div className="geng-offer-card__desc">Delivery within 20 minutes.</div>
                </div>
                <div className="geng-offer-card" style={{ borderColor: 'rgba(82,185,34,.2)' }}>
                  <div className="geng-offer-card__icon">✅</div>
                  <div className="geng-offer-card__title">Regular</div>
                  <div className="geng-offer-card__price" style={{ color: 'var(--g-green)' }}>GHC 10 / fill</div>
                  <div className="geng-offer-card__desc">Scheduled 2pm – 4pm. Most popular.</div>
                </div>
                <div className="geng-offer-card" style={{ borderColor: 'rgba(255,199,0,.2)' }}>
                  <div className="geng-offer-card__icon">📅</div>
                  <div className="geng-offer-card__title">3 Months</div>
                  <div className="geng-offer-card__price" style={{ color: 'var(--g-yellow)' }}>GHC 7 / month</div>
                  <div className="geng-offer-card__desc">3-month subscription plan.</div>
                </div>
              </div>

              <div className="geng-server-card">
                <div className="geng-server-card__title">Auth Server</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--g-green)' }}>
                  🟢 http://159.223.20.22:5001/api/auth
                </div>
              </div>
            </div>
          )}

          {/* AUTH: PHONE + OTP ──────────────────────────────────────────────── */}
          {activeSection === 'auth-phone' && (
            <div>
              <div className="geng-eyebrow">Auth Flow</div>
              <div className="geng-title">Phone + OTP <Badge kind="auth" /></div>
              <p className="geng-subtitle">Ghana phone numbers entered without country code — the app normalises to +233 before sending. 4-digit OTP with auto-advance and backspace handling.</p>

              <CodeBlock lang="TypeScript" file="PhoneNumber.tsx — formatPhoneNumber()" html={CODE_FORMAT_PHONE} />

              <div className="geng-demo">
                <div className="geng-demo__header">
                  <div className="geng-demo__title"><span className="geng-live-dot" /> DEMO — Ghana Phone Normaliser</div>
                </div>
                <div className="geng-demo__body">
                  <p className="geng-demo__hint">Try 0244123456, 244123456, or 233244123456 — all normalise to the same +233 format.</p>
                  <input
                    className="geng-demo-input"
                    type="text"
                    placeholder="e.g. 0244123456"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                  />
                  <div className="geng-demo-output">
                    Normalised: <span className="val">{normalizedPhone}</span>
                    {phoneInput && (
                      <span className={`tag ${phoneValid ? 'ok' : 'err'}`}>
                        {phoneValid ? '✓ valid' : '✗ invalid'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <CodeBlock lang="TypeScript" file="OTPVerification.tsx — auto-advance" html={CODE_OTP} />

              <div className="geng-endpoint">
                <span className="geng-method geng-method-post">POST</span>
                <span className="geng-endpoint__path">/api/auth/send-otp</span>
                <span className="geng-endpoint__desc">Send OTP to phone number</span>
              </div>
              <div className="geng-endpoint">
                <span className="geng-method geng-method-post">POST</span>
                <span className="geng-endpoint__path">/api/auth/verify-otp</span>
                <span className="geng-endpoint__desc">Verify OTP → returns prefix + requestId</span>
              </div>
            </div>
          )}

          {/* AUTH: USER ID ──────────────────────────────────────────────────── */}
          {activeSection === 'auth-id' && (
            <div>
              <div className="geng-eyebrow">Auth Flow</div>
              <div className="geng-title">User ID Generation <Badge kind="auth" /></div>
              <p className="geng-subtitle">After OTP + general details, users receive a unique GA-XXX identifier shown on OrderIDPage with animated bento card stacking.</p>
              <CodeBlock lang="TypeScript" file="OrderIDPage.tsx — bento animation" html={CODE_BENTO} />
              <DecisionBlock label="Why GA-XXX?">
                The GA prefix stands for "GasApp". The 3-digit suffix keeps IDs short enough
                to read aloud to a rider over the phone and doubles as a receipt reference
                for disputes — both parties carry the same ID.
              </DecisionBlock>
            </div>
          )}

          {/* ORDER: OFFERS ──────────────────────────────────────────────────── */}
          {activeSection === 'order-offers' && (
            <div>
              <div className="geng-eyebrow">Order Pipeline</div>
              <div className="geng-title">Offer Selection <Badge kind="order" /></div>
              <p className="geng-subtitle">Three hardcoded offers in Home.tsx. Each carries its own price, icon, and route target. Selecting begins the param cascade.</p>
              <CodeBlock lang="TypeScript" file="Home.tsx — inputFields constant" html={CODE_OFFERS} />
              <DecisionBlock label="Why hardcoded offers?">
                Offer definitions are stable business rules — they don't change per user.
                Hardcoding eliminates an API round-trip on Home load. If offers become
                dynamic, the array is a clean extraction to a{' '}
                <code>useOffers()</code> hook with SWR caching.
              </DecisionBlock>
            </div>
          )}

          {/* ORDER: CYLINDER ────────────────────────────────────────────────── */}
          {activeSection === 'order-cylinder' && (
            <div>
              <div className="geng-eyebrow">Order Pipeline</div>
              <div className="geng-title">Cylinder Selection <Badge kind="order" /></div>
              <p className="geng-subtitle">4-cylinder grid rendered from a local array. Togglable — tapping the same cylinder again deselects it. Price parsed via regex for robustness.</p>
              <CodeBlock lang="TypeScript" file="SelectCylinder.tsx — handleSelectCylinder()" html={CODE_CYLINDER} />
            </div>
          )}

          {/* ORDER: PARAM ACCUMULATION ──────────────────────────────────────── */}
          {activeSection === 'order-state' && (
            <div>
              <div className="geng-eyebrow">Order Pipeline</div>
              <div className="geng-title">Param Accumulation <Badge kind="system" /></div>
              <p className="geng-subtitle">No Redux, no context — all order state is accumulated as navigation params spread-forwarded through every screen. By Payment, the full order object is built.</p>
              <CodeBlock lang="TypeScript" file="Amount.tsx → Payment.tsx — param spread" html={CODE_PARAM_SPREAD} />

              <div className="geng-demo">
                <div className="geng-demo__header">
                  <div className="geng-demo__title"><span className="geng-live-dot" /> DEMO — Order Object Build-up Per Screen</div>
                </div>
                <div className="geng-demo__body">
                  <p className="geng-demo__hint">Click through each screen to see how the params object grows.</p>
                  <div className="geng-pills-row">
                    {PARAM_STEPS.map((s, i) => (
                      <button key={s.key} className={`geng-pill${paramStep === i ? ' active' : ''}`} onClick={() => setParamStep(i)}>
                        {s.screen}
                      </button>
                    ))}
                  </div>
                  <div
                    className="geng-param-display"
                    dangerouslySetInnerHTML={{ __html: renderParamDisplay(PARAM_STEPS[paramStep].display) }}
                  />
                </div>
              </div>

              <DecisionBlock label="Param spread vs. global state">
                For a linear 5-step funnel with no branching, param accumulation is
                simpler than Redux. The <code>...otherParams</code> spread means adding a
                new field anywhere requires zero changes to intermediate screens.
              </DecisionBlock>
            </div>
          )}

          {/* PRICING: SLIDER ────────────────────────────────────────────────── */}
          {activeSection === 'price-slider' && (
            <div>
              <div className="geng-eyebrow">Pricing Engine</div>
              <div className="geng-title">Slider Formula <Badge kind="price" /></div>
              <p className="geng-subtitle">Maps a 0–1 float to 2–24 kg using linear interpolation with rounding. GHC 5/kg. Same formula in both Onboarding (demo) and Amount (real).</p>

              <div className="geng-metrics">
                <div className="geng-metric"><div className="geng-metric__label">Min Weight</div><div className="geng-metric__value">2<span className="geng-metric__unit">kg</span></div></div>
                <div className="geng-metric"><div className="geng-metric__label">Max Weight</div><div className="geng-metric__value">24<span className="geng-metric__unit">kg</span></div></div>
                <div className="geng-metric"><div className="geng-metric__label">Price / kg</div><div className="geng-metric__value">GHC 5</div></div>
              </div>

              <div className="geng-demo">
                <div className="geng-demo__header">
                  <div className="geng-demo__title"><span className="geng-live-dot" /> DEMO — Live Slider Calculation</div>
                </div>
                <div className="geng-demo__body">
                  <p className="geng-demo__hint">Drag the slider — exactly as Amount.tsx computes it in production.</p>
                  <div className="geng-slider-raw">
                    <span>Slider value</span>
                    <span>{sliderValue.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min={0} max={1} step={0.01}
                    value={sliderValue}
                    className="geng-slider"
                    onChange={e => setSliderValue(parseFloat(e.target.value))}
                  />
                  <div className="geng-slider-labels"><span>2 kg (min)</span><span>24 kg (max)</span></div>
                  <div className="geng-calc-grid">
                    <div className="geng-calc-card">
                      <div className="geng-calc-card__formula">2 + round(v × 22)</div>
                      <div className="geng-calc-card__value">{kg} kg</div>
                    </div>
                    <div className="geng-calc-card">
                      <div className="geng-calc-card__formula">pricePerKg × kg</div>
                      <div className="geng-calc-card__value">GHC {sliderPrice}</div>
                    </div>
                    <div className="geng-calc-card highlight">
                      <div className="geng-calc-card__formula">setAmount()</div>
                      <div className="geng-calc-card__value">{sliderPrice.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <CodeBlock lang="TypeScript" file="Amount.tsx — handleSliderChange()" html={CODE_SLIDER} />
            </div>
          )}

          {/* PRICING: COST ──────────────────────────────────────────────────── */}
          {activeSection === 'price-cost' && (
            <div>
              <div className="geng-eyebrow">Pricing Engine</div>
              <div className="geng-title">Cost Accumulation <Badge kind="price" /></div>
              <p className="geng-subtitle">Three price components sum into totalCost. Recalculates in a useEffect triggered by any of the three inputs.</p>

              <div className="geng-demo">
                <div className="geng-demo__header">
                  <div className="geng-demo__title"><span className="geng-live-dot" /> DEMO — Live Cost Calculator</div>
                </div>
                <div className="geng-demo__body">
                  <p className="geng-demo__hint">Select each component to see the total update.</p>

                  <div className="geng-cost-row">
                    <span className="geng-cost-row__label">Offer Price</span>
                    <div className="geng-cost-row__pills">
                      {[{v:12,l:'Emergency GHC 12'},{v:10,l:'Regular GHC 10'},{v:7,l:'Monthly GHC 7'}].map(o => (
                        <button key={o.v} className={`geng-cost-pill${offerPriceSel===o.v?' active':''}`} onClick={() => setOfferPriceSel(o.v)}>{o.l}</button>
                      ))}
                    </div>
                  </div>
                  <div className="geng-cost-row">
                    <span className="geng-cost-row__label">Cylinder Price</span>
                    <div className="geng-cost-row__pills">
                      {[{v:3,l:'12kg GHC 3'},{v:4,l:'15kg GHC 4'},{v:5,l:'18kg GHC 5'},{v:6,l:'20kg GHC 6'}].map(o => (
                        <button key={o.v} className={`geng-cost-pill${cylPriceSel===o.v?' active':''}`} onClick={() => setCylPriceSel(o.v)}>{o.l}</button>
                      ))}
                    </div>
                  </div>
                  <div className="geng-cost-row">
                    <span className="geng-cost-row__label">Gas Amount (kg slider)</span>
                    <div style={{ flex: 1, paddingLeft: 12 }}>
                      <input type="range" min={0} max={120} step={5} value={amtDemo}
                        className="geng-slider"
                        onChange={e => setAmtDemo(parseInt(e.target.value))} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--g-muted)' }}>
                        GHC {amtDemo}
                      </span>
                    </div>
                  </div>
                  <div className="geng-cost-total">
                    <span className="geng-cost-total__label">Total Cost</span>
                    <span className="geng-cost-total__value">GHC {totalCostDemo}</span>
                  </div>
                </div>
              </div>

              <CodeBlock lang="TypeScript" file="Amount.tsx — cost useEffect" html={CODE_COST} />
            </div>
          )}

          {/* PRICING: MOMO ──────────────────────────────────────────────────── */}
          {activeSection === 'price-payment' && (
            <div>
              <div className="geng-eyebrow">Pricing Engine</div>
              <div className="geng-title">MoMo Payment <Badge kind="rest" /></div>
              <p className="geng-subtitle">MTN / Vodafone / AirtelTigo Mobile Money integration via REST. Payment is initiated with phone, amount, and network; the server polls for confirmation and returns a reference.</p>
              <CodeBlock lang="TypeScript" file="Payment.tsx — handlePayment()" html={CODE_MOMO} />
              <div className="geng-endpoint"><span className="geng-method geng-method-post">POST</span><span className="geng-endpoint__path">/api/payment/initiate</span><span className="geng-endpoint__desc">Initiate MoMo payment</span></div>
              <div className="geng-endpoint"><span className="geng-method geng-method-get">GET</span><span className="geng-endpoint__path">/api/payment/status/:reference</span><span className="geng-endpoint__desc">Poll payment status</span></div>
              <DecisionBlock label="Network selection UI">
                A bottom sheet lets users pick their network (MTN / Vodafone / AirtelTigo) before
                confirming. The network selection is not pre-filled from the phone number prefix
                — users in Ghana often have multiple SIMs.
              </DecisionBlock>
            </div>
          )}

          {/* LOCATION: HOOK ─────────────────────────────────────────────────── */}
          {activeSection === 'loc-hook' && (
            <div>
              <div className="geng-eyebrow">Location Services</div>
              <div className="geng-title">useLocationService <Badge kind="algo" /></div>
              <p className="geng-subtitle">Custom hook wrapping Expo Location. Requests foreground permission, fetches current position, handles denial, and returns a typed LatLng or null.</p>
              <CodeBlock lang="TypeScript" file="hooks/useLocationService.ts" html={CODE_LOC_HOOK} />
              <DecisionBlock label="Graceful degradation">
                If permission is denied, the hook returns <code>null</code> and
                SelectLocation falls back to manual address search — the flow never
                blocks on geolocation. Kumasi is the implicit default for Autocomplete results.
              </DecisionBlock>
            </div>
          )}

          {/* LOCATION: GEOCODE ──────────────────────────────────────────────── */}
          {activeSection === 'loc-geocode' && (
            <div>
              <div className="geng-eyebrow">Location Services</div>
              <div className="geng-title">Reverse Geocoding <Badge kind="algo" /></div>
              <p className="geng-subtitle">Converts the device's lat/lng to a human-readable address to pre-fill the SelectLocation input, reducing friction for the majority of orders delivered to the user's current location.</p>
              <CodeBlock lang="TypeScript" file="SelectLocation.tsx — reverseGeocode()" html={CODE_GEOCODE} />
            </div>
          )}

          {/* LOCATION: MAPS ─────────────────────────────────────────────────── */}
          {activeSection === 'loc-map' && (
            <div>
              <div className="geng-eyebrow">Location Services</div>
              <div className="geng-title">Google Maps Setup <Badge kind="engine" /></div>
              <p className="geng-subtitle">react-native-maps with PROVIDER_GOOGLE. Default region centred on Kumasi — fallback when geolocation is denied. Users can drag the map pin to fine-tune delivery address.</p>
              <CodeBlock lang="TSX" file="SelectLocation.tsx — MapView config" html={CODE_MAPS} />
            </div>
          )}

          {/* TRACKER: STATES ────────────────────────────────────────────────── */}
          {activeSection === 'track-states' && (
            <div>
              <div className="geng-eyebrow">Delivery Tracker</div>
              <div className="geng-title">Order States <Badge kind="engine" /></div>
              <p className="geng-subtitle">Delivery lifecycle modelled as 6 discrete string-literal states. UI re-renders purely from state — no hidden elements, no boolean flags.</p>

              <div className="geng-flow" style={{ marginBottom: 20 }}>
                {ORDER_STATES.map((s, i) => (
                  <>
                    <span key={s.id} className={`geng-flow-node${activeState === s.id ? ' green' : ''}`}>{s.id}</span>
                    {i < ORDER_STATES.length - 1 && <span key={`a${i}`} className="geng-flow-arrow">→</span>}
                  </>
                ))}
              </div>

              <div className="geng-demo">
                <div className="geng-demo__header">
                  <div className="geng-demo__title"><span className="geng-live-dot" /> DEMO — Order State Explorer</div>
                </div>
                <div className="geng-demo__body">
                  <p className="geng-demo__hint">Click a state to see what it renders on the Tracker screen.</p>
                  <div className="geng-pills-row">
                    {ORDER_STATES.map(s => (
                      <button key={s.id} className={`geng-pill${activeState === s.id ? ' active' : ''}`} onClick={() => setActiveState(s.id)}>
                        {s.id}
                      </button>
                    ))}
                  </div>
                  <div className="geng-state-display">
                    <span style={{ fontSize: 24 }}>{stateInfo.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{stateInfo.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--g-muted)' }}>{stateInfo.desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRACKER: PROGRESS ──────────────────────────────────────────────── */}
          {activeSection === 'track-progress' && (
            <div>
              <div className="geng-eyebrow">Delivery Tracker</div>
              <div className="geng-title">Progress Animation <Badge kind="engine" /></div>
              <p className="geng-subtitle">A single Animated.Value drives the progress bar. Each state transition triggers Animated.timing to the matching 0–1 target over 600 ms — no spring physics needed for a status bar.</p>
              <CodeBlock lang="TypeScript" file="Tracker.tsx — progress animation" html={CODE_PROGRESS} />
            </div>
          )}

          {/* TRACKER: MAP ───────────────────────────────────────────────────── */}
          {activeSection === 'track-map' && (
            <div>
              <div className="geng-eyebrow">Delivery Tracker</div>
              <div className="geng-title">Rider Map <Badge kind="algo" /></div>
              <p className="geng-subtitle">Rider coordinates polled every 5 seconds while order is in DELIVERING state. MapView animates the camera to follow the rider pin. Interval clears automatically when state changes.</p>
              <CodeBlock lang="TypeScript" file="Tracker.tsx — rider location polling" html={CODE_RIDER_MAP} />
              <DecisionBlock label="Poll vs. WebSocket">
                A 5-second poll is used instead of a WebSocket because the delivery
                timeline is long (15–30 minutes) and low-frequency updates are
                acceptable. A WebSocket would be justified if sub-second updates
                were needed, e.g. a live bidding screen.
              </DecisionBlock>
            </div>
          )}

          {/* ONBOARDING: ANIM ───────────────────────────────────────────────── */}
          {activeSection === 'onboard-anim' && (
            <div>
              <div className="geng-eyebrow">Onboarding</div>
              <div className="geng-title">Staggered Animations <Badge kind="engine" /></div>
              <p className="geng-subtitle">Three onboarding slides each animate in with a staggered delay. Animated.parallel runs opacity and translateY together; the delay = slideIndex × 120 ms staggers each card.</p>
              <CodeBlock lang="TypeScript" file="Onboarding.tsx — stagger" html={CODE_STAGGER} />
            </div>
          )}

          {/* ONBOARDING: SPLASH ─────────────────────────────────────────────── */}
          {activeSection === 'onboard-splash' && (
            <div>
              <div className="geng-eyebrow">Onboarding</div>
              <div className="geng-title">Splash → Route <Badge kind="system" /></div>
              <p className="geng-subtitle">SplashScreen checks AsyncStorage for an existing auth token after a 2-second brand moment. Existing users skip Onboarding entirely and land directly on Home.</p>
              <CodeBlock lang="TypeScript" file="SplashScreen.tsx — auth check" html={CODE_SPLASH} />
              <div className="geng-flow">
                <span className="geng-flow-node green">SplashScreen</span>
                <span className="geng-flow-arrow">→</span>
                <span className="geng-flow-node">AsyncStorage.getItem</span>
                <span className="geng-flow-arrow">→</span>
                <span className="geng-flow-node blue">token? Home : Onboarding</span>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--g-muted)' }}>
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
