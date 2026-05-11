// ── Message data types ────────────────────────────────────────────────────────

export interface Message {
  id: string
  text: string
  /** true = blue bubble (sent/right), false = grey bubble (received/left) */
  sent: boolean
  time: string
  /** Shown above received bubbles in group chats */
  sender?: string
  /** Triggers the parallax-fall animation on newly sent messages */
  isNew?: boolean
}

export interface Conversation {
  id: string
  name: string
  /** 1–2 letter fallback when no avatar image is provided */
  initials: string
  avatarColor: string
  lastMessage: string
  time: string
  unread?: boolean
  messages: Message[]
}

// ── Conversation data ─────────────────────────────────────────────────────────

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Stephen Yustiono',
    initials: 'SY',
    avatarColor: '#5AC8FA',
    lastMessage: 'A built-in failover means if the GPS signal drops, the last known pos…',
    time: '9:41 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: 'So honestly, how is a student supposed to know where the bus is before even deciding to have their ticket?',
        sent: false,
        time: '9:38 AM',
      },
      {
        id: 'm2',
        text: "Isn't exactly the gap we closed. You know the shuttle's ETA — it'll show 3 min — 4 min before you even board. And if it's between stops, it'll track the time live.",
        sent: true,
        time: '9:39 AM',
      },
      {
        id: 'm3',
        text: "What if I don't know where the nearest stop is?",
        sent: false,
        time: '9:40 AM',
      },
      {
        id: 'm4',
        text: "The app will tell you. The stop near the bus will be highlighted on the map and show walking distance so you know if you'll make it in time.",
        sent: true,
        time: '9:40 AM',
      },
      {
        id: 'm5',
        text: 'And what about when the bus...just...disappeared? Like the GPS dropped?',
        sent: false,
        time: '9:41 AM',
      },
      {
        id: 'm6',
        text: "A built-in failover means if the GPS signal drops, the last known position is shown with a timestamp. So students know it's stale — and we have a backup beacon system.",
        sent: true,
        time: '9:41 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    name: 'Erin Steed',
    initials: 'ES',
    avatarColor: '#FF9F0A',
    lastMessage: 'We compare sequential GPS points against the route sequence — if the…',
    time: '9:28 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: 'What protocol are you using for real-time bus location updates? WebSockets?',
        sent: false,
        sender: 'Dev_Mensah',
        time: '9:22 AM',
      },
      {
        id: 'm2',
        text: "MQTT. It's lighter than WebSockets for this use case — the bus is just publishing location events, not a two-way conversation",
        sent: true,
        time: '9:23 AM',
      },
      {
        id: 'm3',
        text: 'And what happens when the MQTT connection drops mid-route?',
        sent: false,
        sender: 'Dev_Mensah',
        time: '9:25 AM',
      },
      {
        id: 'm4',
        text: 'The client reconnects automatically, but in the gap we use dead reckoning — last known speed and heading to predict where the bus should be',
        sent: true,
        time: '9:26 AM',
      },
      {
        id: 'm5',
        text: 'How do you know which direction the bus is traveling on the route?',
        sent: false,
        sender: '_ama.codes',
        time: '9:27 AM',
      },
      {
        id: 'm6',
        text: 'We compare sequential GPS points against the route sequence — if the bus is passing stops in forward order, it\'s on an outbound run',
        sent: true,
        time: '9:28 AM',
      },
    ],
  },
  {
    id: 'conv-3',
    name: 'Daisy Tinsley',
    initials: 'DT',
    avatarColor: '#BF5AF2',
    lastMessage: 'ebi so chale 😂',
    time: '9:20 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: 'bro which app be this wey you dey build',
        sent: false,
        time: '9:12 AM',
      },
      {
        id: 'm2',
        text: 'Shuttle tracker, you go fit see where the bus dey in real time',
        sent: true,
        time: '9:13 AM',
      },
      {
        id: 'm3',
        text: 'DFKM. so I no go stand dey wait like mumu again?',
        sent: false,
        time: '9:14 AM',
      },
      {
        id: 'm4',
        text: 'Exactly. open am, the bus dey show on the map',
        sent: true,
        time: '9:15 AM',
      },
      {
        id: 'm5',
        text: 'E go show even before I comot room?',
        sent: false,
        time: '9:17 AM',
      },
      {
        id: 'm6',
        text: 'yes. so you know whether to rush or chill',
        sent: true,
        time: '9:18 AM',
      },
      {
        id: 'm7',
        text: 'bro this thing don save me already and I never even use am 😭',
        sent: false,
        time: '9:19 AM',
      },
      {
        id: 'm8',
        text: 'ebi so chale 😂',
        sent: true,
        time: '9:20 AM',
      },
    ],
  },
  {
    id: 'conv-4',
    name: 'Zach Friedman',
    initials: 'ZF',
    avatarColor: '#30D158',
    lastMessage: '👍',
    time: '9:00 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: "Prince, I heard you've been working on something related to campus transport",
        sent: false,
        time: '8:51 AM',
      },
      {
        id: 'm2',
        text: 'Yes sir, a real-time shuttle tracking app. Students can see bus positions live before deciding to head to a stop',
        sent: true,
        time: '8:52 AM',
      },
      {
        id: 'm3',
        text: "And what's the reliability like when campus internet is patchy?",
        sent: false,
        time: '8:54 AM',
      },
      {
        id: 'm4',
        text: 'We handle signal drops with dead reckoning — the app predicts bus position even without live GPS',
        sent: true,
        time: '8:55 AM',
      },
      {
        id: 'm5',
        text: 'Interesting. Has the transport office seen this?',
        sent: false,
        time: '8:57 AM',
      },
      {
        id: 'm6',
        text: 'Yes Please Doc. I\'m working hand in hand with the Transport Head',
        sent: true,
        time: '8:58 AM',
      },
      {
        id: 'm7',
        text: "Get that meeting. The problem is real, I've had students miss practicals because of this",
        sent: false,
        time: '8:59 AM',
      },
      {
        id: 'm8',
        text: '👍',
        sent: true,
        time: '9:00 AM',
      },
    ],
  },
  {
    id: 'conv-5',
    name: 'Kyle & Aaron',
    initials: 'KA',
    avatarColor: '#FF375F',
    lastMessage: 'Ok. Let\'s talk properly. Free this week?',
    time: '8:58 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: "Saw your demo. What's the actual problem you're solving in one sentence",
        sent: false,
        time: '8:44 AM',
      },
      {
        id: 'm2',
        text: 'Students waste 20+ mins daily on blind shuttle waits — we give them real-time visibility so they can make smarter decisions',
        sent: true,
        time: '8:45 AM',
      },
      {
        id: 'm3',
        text: 'How many students on campus',
        sent: false,
        time: '8:47 AM',
      },
      {
        id: 'm4',
        text: 'About 38,000 at KNUST alone. And this scales to any campus with a shuttle system',
        sent: true,
        time: '8:48 AM',
      },
      {
        id: 'm5',
        text: "What's stopping the transport office from just building this themselves",
        sent: false,
        time: '8:50 AM',
      },
      {
        id: 'm6',
        text: "They don't have the technical capacity, and frankly this has never been prioritised. We plug straight in",
        sent: true,
        time: '8:52 AM',
      },
      {
        id: 'm7',
        text: 'Monetisation',
        sent: false,
        time: '8:54 AM',
      },
      {
        id: 'm8',
        text: 'Institution licensing + ad placements for campus vendors in the app',
        sent: true,
        time: '8:56 AM',
      },
      {
        id: 'm9',
        text: 'Ok. Let\'s talk properly. Free this week?',
        sent: false,
        time: '8:58 AM',
      },
    ],
  },
  {
    id: 'conv-6',
    name: 'Dee McRobie',
    initials: 'DM',
    avatarColor: '#636366',
    lastMessage: "You've thought about everything",
    time: '8:35 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: "ah that's actually clean. what happens if the tracker loses network connection for some reason?",
        sent: false,
        time: '8:28 AM',
      },
      {
        id: 'm2',
        text: "We have stored all the routes, so through that we can predict the next coordinates based on the routes till the tracker regains connection",
        sent: true,
        time: '8:30 AM',
      },
      {
        id: 'm3',
        text: "Looks like the driver doesn't even know they're being tracked",
        sent: false,
        time: '8:33 AM',
      },
      {
        id: 'm4',
        text: "They know 😅",
        sent: true,
        time: '8:34 AM',
      },
      {
        id: 'm5',
        text: "You've thought about everything",
        sent: false,
        time: '8:35 AM',
      },
    ],
  },
  {
    id: 'conv-7',
    name: 'Gary Butcher',
    initials: 'GB',
    avatarColor: '#0A84FF',
    lastMessage: "You've thought about everything",
    time: '8:32 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: 'Bro MQTT on a campus network 💀 you\'re brave',
        sent: false,
        time: '8:18 AM',
      },
      {
        id: 'm2',
        text: "Imaooo it's been a journey ngl",
        sent: true,
        time: '8:19 AM',
      },
      {
        id: 'm3',
        text: 'Wait so the driver has an app too?',
        sent: false,
        time: '8:21 AM',
      },
      {
        id: 'm4',
        text: 'Not yet, We will make an app for them after the MVP. We have installed trackers in the buses',
        sent: true,
        time: '8:22 AM',
      },
      {
        id: 'm5',
        text: 'What does the students see on their end',
        sent: false,
        time: '8:24 AM',
      },
      {
        id: 'm6',
        text: "The campus's map view with the active buses",
        sent: true,
        time: '8:25 AM',
      },
      {
        id: 'm7',
        text: "Lmaoo so the driver doesn't even know they're being tracked?",
        sent: false,
        time: '8:27 AM',
      },
      {
        id: 'm8',
        text: 'They know 😅',
        sent: true,
        time: '8:28 AM',
      },
      {
        id: 'm9',
        text: 'ok ok that\'s actually clean. what happens if the tracker loses network connection for some seconds',
        sent: false,
        time: '8:30 AM',
      },
      {
        id: 'm10',
        text: 'We have stored all the routes, so through that we can predict the next coordinates based on the routes till the tracker regains connection',
        sent: true,
        time: '8:31 AM',
      },
      {
        id: 'm11',
        text: "You've thought about everything",
        sent: false,
        time: '8:32 AM',
      },
    ],
  },
  {
    id: 'conv-8',
    name: 'David Turissini',
    initials: 'DT',
    avatarColor: '#48484A',
    lastMessage: "You've thought about everything.",
    time: '8:02 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: "they won't have the technical capacity, but they have the budget. Have you thought about a white-label deal?",
        sent: false,
        time: '7:55 AM',
      },
      {
        id: 'm2',
        text: "Authorisation discovery is also important for software engineers in the app.",
        sent: false,
        time: '7:58 AM',
      },
      {
        id: 'm3',
        text: "You've thought about everything.",
        sent: false,
        time: '8:02 AM',
      },
    ],
  },
  {
    id: 'conv-9',
    name: 'Dee & Daisy',
    initials: 'DD',
    avatarColor: '#FF6961',
    lastMessage: "Good morning! I've got some great news, we got the grant!!!",
    time: '7:45 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        text: "Good morning! I've got some great news, we got the grant!!!",
        sent: false,
        time: '7:45 AM',
      },
    ],
  },
]
