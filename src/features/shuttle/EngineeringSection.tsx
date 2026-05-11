import React, { useState, useCallback, useEffect, useRef } from 'react'
import './engineering-section.css'

// ── Types ────────────────────────────────────────────────────────────────────

type Platform = 'web' | 'rn'
type SectionId =
  | 'intro'
  | 'be-server' | 'be-mqtt' | 'be-api' | 'be-drivers'
  | 'arch-stack' | 'arch-data'
  | 'rt-mqtt' | 'rt-driver' | 'rt-ws'
  | 'loc-gps' | 'loc-route' | 'loc-dr'
  | 'mov-interp' | 'mov-match' | 'mov-state'
  | 'notif-engine' | 'notif-sound'
  | 'edge-offroute' | 'edge-perf'
  | 'test-scenarios' | 'test-sim'

type GroupId = 'backend' | 'arch' | 'rt' | 'loc' | 'mov' | 'notif' | 'edge' | 'test'

// ── Syntax-highlight helpers ──────────────────────────────────────────────────
// Pre-highlighted HTML strings for code blocks. All content is static — no user input.
// We use dangerouslySetInnerHTML so we can write multi-line HTML without JSX escaping issues.

const kw = (s: string) => `<span class="eng-kw">${s}</span>`
const fn = (s: string) => `<span class="eng-fn">${s}</span>`
const str = (s: string) => `<span class="eng-str">${s}</span>`
const num = (s: string) => `<span class="eng-num">${s}</span>`
const cmt = (s: string) => `<span class="eng-cmt">${s}</span>`
const cn = (s: string) => `<span class="eng-cn">${s}</span>`
const tp = (s: string) => `<span class="eng-type">${s}</span>`
const vr = (s: string) => `<span class="eng-var">${s}</span>`

// ── Code content ──────────────────────────────────────────────────────────────

const CODE = {
  connectWeb: `${kw('import')} { ${fn('io')} } ${kw('from')} ${str("'socket.io-client'")};

${kw('const')} ${vr('socket')} = ${fn('io')}(${str("'https://api.shuttleapp.me'")}, {
  transports: [${str("'websocket'")}, ${str("'polling'")}],
});`,

  connectRn: `${kw('import')} { ${fn('io')} } ${kw('from')} ${str("'socket.io-client'")};

${kw('const')} ${vr('socket')} = ${fn('io')}(${str("'https://api.shuttleapp.me'")}, {
  transports: [${str("'websocket'")}], ${cmt('// RN: websocket only — no polling')}
  forceNew: ${kw('true')},
});`,

  serverStartup: `${kw('import')} ${vr('express')}       ${kw('from')} ${str("'express'")};
${kw('import')} ${vr('http')}          ${kw('from')} ${str("'http'")};
${kw('import')} { ${fn('initializeSocket')} }     ${kw('from')} ${str("'../services/socket.js'")};
${kw('import')} { ${fn('initializeMQTTTracker')} } ${kw('from')} ${str("'../services/mqtt-tracker.js'")};

${kw('const')} ${vr('app')}    = ${fn('express')}();
${kw('const')} ${vr('server')} = ${vr('http')}.${fn('createServer')}(${vr('app')});
${kw('const')} { ${vr('io')} } = ${fn('initializeSocket')}(${vr('server')}); ${cmt('// Socket.IO attached to same server')}

${fn('initializeMQTTTracker')}(${vr('io')})
  .${fn('then')}(() =&gt; ${vr('console')}.${fn('log')}(${str("'✅ MQTT Tracker initialized'")}))
  .${fn('catch')}(${vr('err')} =&gt; ${vr('console')}.${fn('error')}(${str("'⚠️ MQTT init failed:'")} , ${vr('err')}.${vr('message')}));

${cmt('// Routes')}
${vr('app')}.${fn('use')}(${str("'/api/drivers'")},     ${vr('driverRoute')});
${vr('app')}.${fn('use')}(${str("'/api/auth/driver'")}, ${vr('authRoute')});
${vr('app')}.${fn('use')}(${str("'/api/auth/user'")},   ${vr('userAuthRoute')});
${vr('app')}.${fn('use')}(${str("'/api/locations'")},   ${vr('locationRoute')});
${vr('app')}.${fn('use')}(${str("'/api/bites'")},       ${vr('bitesRoute')});
${vr('server')}.${fn('listen')}(${num('5002')});`,

  gracefulShutdown: `${kw('const')} ${fn('gracefulShutdown')} = (${vr('signal')}) =&gt; {
  ${fn('shutdownMQTTTracker')}();     ${cmt('// disconnect broker, clear deviceMap')}
  ${vr('server')}.${fn('close')}(() =&gt; ${vr('process')}.${fn('exit')}(${num('0')}));
  ${fn('setTimeout')}(() =&gt; ${vr('process')}.${fn('exit')}(${num('1')}), ${num('10_000')}); ${cmt('// force-kill after 10s')}
};
${vr('process')}.${fn('on')}(${str("'SIGTERM'")}, () =&gt; ${fn('gracefulShutdown')}(${str("'SIGTERM'")}));
${vr('process')}.${fn('on')}(${str("'SIGINT'")},  () =&gt; ${fn('gracefulShutdown')}(${str("'SIGINT'")}));`,

  beClientWeb: `${kw('import')} { ${fn('io')} } ${kw('from')} ${str("'socket.io-client'")};
${kw('const')} ${vr('socket')} = ${fn('io')}(${str("'https://api.shuttleapp.me'")}, {
  transports: [${str("'websocket'")}, ${str("'polling'")}], ${cmt('// polling fallback works in browser')}
});`,

  beClientRn: `${kw('import')} { ${fn('io')} } ${kw('from')} ${str("'socket.io-client'")};
${kw('const')} ${vr('socket')} = ${fn('io')}(${str("'https://api.shuttleapp.me'")}, {
  transports: [${str("'websocket'")}], ${cmt('// RN: polling causes issues on Android')}
  forceNew: ${kw('true')},
  reconnectionDelay: ${num('1000')},
  reconnectionAttempts: ${num('5')},
});`,

  mqttConfig: `${kw('const')} ${cn('MQTT_CONFIG')} = {
  brokerUrl:       ${vr('process')}.${vr('env')}.${cn('MQTT_BROKER_URL')} || ${str("'wss://mqtt.shuttleapp.me:xxxx'")},
  username:        ${vr('process')}.${vr('env')}.${cn('MQTT_USERNAME')},
  password:        ${vr('process')}.${vr('env')}.${cn('MQTT_PASSWORD')},
  topic:           ${vr('process')}.${vr('env')}.${cn('MQTT_TOPIC')} || ${str("'traccar/positions'")},
  reconnectPeriod: ${num('1000')},
  connectTimeout:  ${num('5000')},
};

${cmt('// Cache: re-serialise Array.from(mqttDevices) max once per 500ms')}
${kw('const')} ${cn('CACHE_TTL_MS')}         = ${num('500')};
${kw('const')} ${cn('BROADCAST_THROTTLE_MS')} = ${num('1000')}; ${cmt('// max 1 Socket.IO emit/sec')}
${kw('const')} ${cn('STALE_DEVICE_TTL_MS')}   = ${num('5')} * ${num('60')} * ${num('1000')}; ${cmt('// 5 min stale threshold')}
${kw('const')} ${cn('CLEANUP_INTERVAL_MS')}   = ${num('60')} * ${num('1000')};    ${cmt('// cleanup runs every 1 min')}`,

  mqttPayload: `${cmt('// Traccar publishes: { position: {...}, device: {...} }')}
${cmt('// deviceId resolution — priority chain:')}
${kw('const')} ${fn('extractDeviceId')} = (${vr('data')}) =&gt;
  ${vr('data')}.${vr('device')}?.${vr('uniqueId')}    ${cmt('// preferred — stable hardware ID')}
  || ${vr('data')}.${vr('uniqueId')}
  || ${vr('data')}.${vr('deviceId')}
  || ${vr('data')}.${vr('device')}?.${vr('id')}
  || ${str('`device-${Date.now()}`')}; ${cmt('// fallback')}

${cmt('// Stored shape in mqttDevices Map:')}
${kw('const')} ${vr('deviceData')} = {
  ${vr('deviceId')}: ${tp('String')}(${vr('deviceId')}),
  ${vr('position')}: {
    ${vr('latitude')}:  ${vr('position')}.${vr('latitude')},
    ${vr('longitude')}: ${vr('position')}.${vr('longitude')},
    ${vr('altitude')}:  ${vr('position')}.${vr('altitude')}  || ${num('0.0')},
    ${vr('speed')}:     ${vr('position')}.${vr('speed')}    || ${num('0.0')},  ${cmt('// km/h from Traccar')}
    ${vr('course')}:    ${vr('position')}.${vr('course')}   || ${num('0')},    ${cmt('// heading degrees 0–360')}
    ${vr('valid')}:     ${vr('position')}.${vr('valid')} !== ${kw('false')},
    ${vr('serverTime')}: ${vr('position')}.${vr('serverTime')},
    ${vr('attributes')}: ${vr('position')}.${vr('attributes')} || {},
  },
  ${vr('device')}: {
    ${vr('name')}:      ${vr('data')}.${vr('device')}?.${vr('name')}     || ${str("'GPS Device'")},
    ${vr('uniqueId')}:  ${vr('data')}.${vr('device')}?.${vr('uniqueId')},
    ${vr('status')}:    ${vr('data')}.${vr('device')}?.${vr('status')}   || ${str("'unknown'")},
    ${vr('disabled')}:  ${vr('data')}.${vr('device')}?.${vr('disabled')} || ${kw('false')},
  },
  ${vr('timestamp')}: ${tp('Date')}.${fn('now')}(),
};`,

  mqttBroadcast: `${kw('const')} ${fn('getMQTTDevicesData')} = () =&gt; {
  ${kw('const')} ${vr('now')} = ${tp('Date')}.${fn('now')}();
  ${kw('if')} (${vr('cachedData')} &amp;&amp; ${vr('now')} - ${vr('cachedAt')} &lt; ${cn('CACHE_TTL_MS')}) ${kw('return')} ${vr('cachedData')};
  ${vr('cachedData')} = ${tp('Array')}.${fn('from')}(${vr('mqttDevices')}.${fn('values')}());
  ${vr('cachedAt')} = ${vr('now')};
  ${kw('return')} ${vr('cachedData')};
};

${cmt('// 1 broadcast/sec max — Traccar can fire multiple messages/sec')}
${kw('const')} ${fn('broadcastMQTTDevices')} = () =&gt; {
  ${kw('if')} (!${vr('socketIoInstance')}) ${kw('return')};
  ${kw('const')} ${vr('now')} = ${tp('Date')}.${fn('now')}();
  ${kw('if')} (${vr('now')} - ${vr('lastBroadcast')} &lt; ${cn('BROADCAST_THROTTLE_MS')}) ${kw('return')};
  ${vr('lastBroadcast')} = ${vr('now')};
  ${kw('const')} ${vr('devices')} = ${fn('getMQTTDevicesData')}();
  ${kw('if')} (${vr('devices')}.${vr('length')}) ${vr('io')}.${fn('emit')}(${str("'mqtt-device-locations'")}, ${vr('devices')});
};`,

  mqttStaleCleanup: `${cmt('// Runs every 60s — prunes devices silent for more than 5 minutes')}
${kw('const')} ${fn('cleanupStaleDevices')} = () =&gt; {
  ${kw('const')} ${vr('now')} = ${tp('Date')}.${fn('now')}();
  ${kw('for')} (${kw('const')} [${vr('id')}, ${vr('device')}] ${kw('of')} ${vr('mqttDevices')}.${fn('entries')}()) {
    ${kw('const')} ${vr('lastSeen')} = ${kw('new')} ${tp('Date')}(${vr('device')}.${vr('position')}.${vr('serverTime')}).${fn('getTime')}();
    ${kw('if')} (${vr('now')} - ${vr('lastSeen')} &gt; ${cn('STALE_DEVICE_TTL_MS')}) {
      ${vr('mqttDevices')}.${fn('delete')}(${vr('id')}); ${cmt('// bus is parked or tracker off')}
    }
  }
  ${fn('invalidateMQTTDevicesCache')}();
};
${cmt('// Boot: also builds deviceId → driverID map from MongoDB')}
${kw('await')} ${fn('buildDeviceDriverMapping')}(); ${cmt('// DriverModel.find({ deviceId: { $exists: true } })')}`,

  pollWeb: `${kw('const')} ${fn('fetchDrivers')} = ${kw('async')} () =&gt; {
  ${kw('const')} ${vr('res')} = ${kw('await')} ${fn('fetch')}(${str("'https://api.shuttleapp.me/api/drivers/drivers'")});
  ${kw('return')} ${vr('res')}.${fn('json')}();
};

${cmt('// Poll every 30s — route assignments rarely change')}
${fn('useEffect')}(() =&gt; {
  ${fn('fetchDrivers')}().${fn('then')}(${vr('setDrivers')});
  ${kw('const')} ${vr('id')} = ${fn('setInterval')}(() =&gt; ${fn('fetchDrivers')}().${fn('then')}(${vr('setDrivers')}), ${num('30_000')});
  ${kw('return')} () =&gt; ${fn('clearInterval')}(${vr('id')});
}, []);`,

  pollRn: `${kw('const')} ${fn('fetchDrivers')} = ${kw('async')} () =&gt; {
  ${kw('const')} ${vr('res')} = ${kw('await')} ${fn('fetch')}(${str("'https://api.shuttleapp.me/api/drivers/drivers'")});
  ${kw('return')} ${vr('res')}.${fn('json')}();
};

${cmt('// AppState listener — pause polls when app is backgrounded')}
${fn('useEffect')}(() =&gt; {
  ${kw('const')} ${vr('sub')} = ${vr('AppState')}.${fn('addEventListener')}(${str("'change'")}, ${vr('state')} =&gt; {
    ${kw('if')} (${vr('state')} === ${str("'active'")}) ${fn('fetchDrivers')}().${fn('then')}(${vr('setDrivers')});
  });
  ${kw('return')} () =&gt; ${vr('sub')}.${fn('remove')}();
}, []);`,

  driverSchema: `${kw('const')} ${vr('driverSchema')} = ${kw('new')} ${fn('Schema')}({
  ${vr('name')}:     { ${tp('type')}: ${tp('String')}, required: ${kw('true')} },
  ${vr('driverID')}: { ${tp('type')}: ${tp('String')}, required: ${kw('true')}, unique: ${kw('true')} },
  ${vr('deviceId')}: { ${tp('type')}: ${tp('String')} },  ${cmt('// Traccar uniqueId')}
  ${vr('busRoute')}: { ${tp('type')}: ${tp('String')} },  ${cmt("// e.g. 'route-a'")}
  ${vr('isActive')}: { ${tp('type')}: ${tp('Boolean')}, default: ${kw('false')} },
});

${cmt('// Built at startup — O(1) lookup during MQTT message handling')}`,

  archStackText: `Backend  : Node.js, Express, Socket.IO, MQTT.js
Database : MongoDB (driver records), Redis (caching)
GPS      : Traccar (GPS platform) → MQTT re-publish
Web      : React + Vite, Mapbox GL JS
Mobile   : React Native (Expo), Mapbox SDK
Auth     : JWT (driver + passenger flows)
Hosting  : Single VPS, PM2 process manager`,

  deviceType: `${cmt('// In-memory device entry (mqttDevices Map)')}
${kw('interface')} ${tp('DeviceEntry')} {
  ${vr('deviceId')}: ${tp('string')};
  ${vr('position')}: {
    ${vr('latitude')}:   ${tp('number')};
    ${vr('longitude')}:  ${tp('number')};
    ${vr('speed')}:      ${tp('number')}; ${cmt('// km/h')}
    ${vr('course')}:     ${tp('number')}; ${cmt('// 0–360 heading')}
    ${vr('valid')}:      ${tp('boolean')};
    ${vr('serverTime')}: ${tp('string')};
  };
  ${vr('device')}: { ${vr('name')}: ${tp('string')}; ${vr('uniqueId')}: ${tp('string')}; ${vr('status')}: ${tp('string')} };
  ${vr('timestamp')}: ${tp('number')}; ${cmt('// Date.now() on receipt')}
}`,

  driverType: `${kw('interface')} ${tp('DriverDoc')} {
  ${vr('driverID')}: ${tp('string')};   ${cmt("// e.g. 'D-001'")}
  ${vr('name')}:     ${tp('string')};
  ${vr('deviceId')}: ${tp('string')};   ${cmt('// Traccar uniqueId (hardware)')}
  ${vr('busRoute')}: ${tp('string')};   ${cmt("// 'route-a' | 'route-b' | …")}
  ${vr('isActive')}: ${tp('boolean')};
}`,

  mqttHandler: `${vr('mqttClient')}.${fn('on')}(${str("'message'")}, (${vr('topic')}, ${vr('payload')}) =&gt; {
  ${kw('const')} ${vr('data')} = ${tp('JSON')}.${fn('parse')}(${vr('payload')}.${fn('toString')}());
  ${kw('const')} { ${vr('position')}, ${vr('device')} } = ${vr('data')};

  ${cmt('// Guard: reject GPS cold-start artifacts')}
  ${kw('if')} (${vr('position')}.${vr('latitude')} === ${num('0')} &amp;&amp; ${vr('position')}.${vr('longitude')} === ${num('0')}) ${kw('return')};

  ${vr('mqttDevices')}.${fn('set')}(${fn('extractDeviceId')}(${vr('data')}), ${fn('buildDeviceData')}(${vr('data')}));
  ${fn('invalidateMQTTDevicesCache')}();
  ${fn('broadcastMQTTDevices')}(); ${cmt('// throttled to 1/sec')}
});`,

  emaSmoothing: `${kw('const')} ${cn('ALPHA')} = ${num('0.3')}; ${cmt('// EMA weight — lower = smoother, laggier')}

${kw('function')} ${fn('emaSmooth')}(${vr('prev')}: ${tp('number')}, ${vr('next')}: ${tp('number')}): ${tp('number')} {
  ${kw('return')} ${cn('ALPHA')} * ${vr('next')} + (${num('1')} - ${cn('ALPHA')}) * ${vr('prev')};
}`,

  wsEvents: `${cmt('// Server → All clients')}
${str("'mqtt-device-locations'")}  → DeviceEntry[]    ${cmt('// GPS batch, 1/sec')}
${str("'driver-status'")}          → DriverStatus[]   ${cmt('// active/offline updates')}

${cmt('// Server → Driver clients only')}
${str("'route-assigned'")}         → RoutePayload     ${cmt('// new route assignment')}

${cmt('// Client connection events (Socket.IO built-ins)')}
${str("'connect'")}     ${cmt('// client joins — server sends current device snapshot')}
${str("'disconnect'")}  ${cmt('// client leaves — no cleanup needed (stateless clients)')}`,

  socketListener: `${fn('useEffect')}(() =&gt; {
  ${vr('socket')}.${fn('on')}(${str("'mqtt-device-locations'")}, (${vr('devices')}: ${tp('DeviceEntry')}[]) =&gt; {
    ${fn('setBusPositions')}(${fn('mergeAndSmooth')}(${vr('prev')}, ${vr('devices')}));
  });
  ${kw('return')} () =&gt; { ${vr('socket')}.${fn('off')}(${str("'mqtt-device-locations'")}) };
}, []);`,

  gpsProcessor: `${kw('function')} ${fn('processGPSUpdate')}(${vr('raw')}, ${vr('prev')}) {
  ${cmt('// 1. Reject zero-coordinate cold-starts')}
  ${kw('if')} (${vr('raw')}.${vr('lat')} === ${num('0')} &amp;&amp; ${vr('raw')}.${vr('lng')} === ${num('0')}) ${kw('return')} ${kw('null')};

  ${cmt('// 2. Reject invalid flag')}
  ${kw('if')} (${vr('raw')}.${vr('valid')} === ${kw('false')}) ${kw('return')} ${kw('null')};

  ${cmt('// 3. EMA smooth if previous position exists')}
  ${kw('if')} (${vr('prev')}) {
    ${vr('raw')}.${vr('lat')} = ${fn('ema')}(${vr('prev')}.${vr('lat')}, ${vr('raw')}.${vr('lat')});
    ${vr('raw')}.${vr('lng')} = ${fn('ema')}(${vr('prev')}.${vr('lng')}, ${vr('raw')}.${vr('lng')});
  }
  ${kw('return')} ${vr('raw')};
}`,

  routeProjection: `${kw('function')} ${fn('projectOntoRoute')}(${vr('coord')}: ${tp('LngLat')}, ${vr('route')}: ${tp('LngLat')}[]): ${tp('LngLat')} {
  ${kw('let')} ${vr('minDist')} = ${tp('Infinity')}, ${vr('closest')}: ${tp('LngLat')};
  ${kw('for')} (${kw('let')} ${vr('i')} = ${num('0')}; ${vr('i')} &lt; ${vr('route')}.${vr('length')} - ${num('1')}; ${vr('i')}++) {
    ${kw('const')} ${vr('pt')} = ${fn('nearestPointOnSegment')}(${vr('coord')}, ${vr('route')}[${vr('i')}], ${vr('route')}[${vr('i')} + ${num('1')}]);
    ${kw('const')} ${vr('d')} = ${fn('haversine')}(${vr('coord')}, ${vr('pt')});
    ${kw('if')} (${vr('d')} &lt; ${vr('minDist')}) { ${vr('minDist')} = ${vr('d')}; ${vr('closest')} = ${vr('pt')}; }
  }
  ${kw('return')} ${vr('closest')};
}`,

  deadReckoning: `${kw('function')} ${fn('deadReckon')}(${vr('last')}: ${tp('DeviceEntry')}, ${vr('dtMs')}: ${tp('number')}): ${tp('LngLat')} {
  ${kw('const')} ${vr('dtHours')} = ${vr('dtMs')} / ${num('3_600_000')};
  ${kw('const')} ${vr('dist')}    = ${vr('last')}.${vr('position')}.${vr('speed')} * ${vr('dtHours')}; ${cmt('// km')}
  ${kw('const')} ${vr('bearing')} = ${vr('last')}.${vr('position')}.${vr('course')};
  ${kw('return')} ${fn('destinationPoint')}(${vr('last')}.${vr('position')}, ${vr('dist')}, ${vr('bearing')});
}`,

  interpolation: `${fn('useEffect')}(() =&gt; {
  ${kw('let')} ${vr('raf')}: ${tp('number')};
  ${kw('const')} ${fn('tick')} = () =&gt; {
    ${kw('const')} ${vr('now')} = ${tp('Date')}.${fn('now')}();
    ${kw('const')} ${vr('t')} = ${tp('Math')}.${fn('min')}(${num('1')}, (${vr('now')} - ${vr('lastUpdateAt')}) / ${cn('GPS_INTERVAL_MS')});
    ${fn('setLng')}(${fn('lerp')}(${vr('prev')}.${vr('lng')}, ${vr('next')}.${vr('lng')}, ${vr('t')}));
    ${fn('setLat')}(${fn('lerp')}(${vr('prev')}.${vr('lat')}, ${vr('next')}.${vr('lat')}, ${vr('t')}));
    ${vr('raf')} = ${fn('requestAnimationFrame')}(${fn('tick')});
  };
  ${vr('raf')} = ${fn('requestAnimationFrame')}(${fn('tick')});
  ${kw('return')} () =&gt; ${fn('cancelAnimationFrame')}(${vr('raf')});
}, [${vr('next')}]);`,

  routeMatcher: `${kw('const')} ${fn('resolveDriverRoute')} = (${vr('deviceId')}) =&gt; {
  ${kw('const')} ${vr('driverId')} = ${vr('deviceDriverMap')}.${fn('get')}(${vr('deviceId')}); ${cmt('// O(1)')}
  ${kw('if')} (!${vr('driverId')}) ${kw('return')} ${kw('null')};
  ${kw('const')} ${vr('driver')} = ${vr('driverCache')}.${fn('get')}(${vr('driverId')});
  ${kw('return')} ${vr('ROUTE_POLYLINES')}[${vr('driver')}?.${vr('busRoute')}] ?? ${kw('null')};
};`,

  trackingStateMachine: `${kw('type')} ${tp('TrackingState')} = ${str("'idle'")} | ${str("'tracking'")} | ${str("'arriving'")} | ${str("'arrived'")};

${cmt('// Transition triggers:')}
${cmt('// idle      → tracking  : user selects a bus stop')}
${cmt('// tracking  → arriving  : bus within ARRIVING_THRESHOLD (150m)')}
${cmt('// arriving  → arrived   : bus within ARRIVED_THRESHOLD (30m)')}
${cmt('// * → idle             : user cancels or bus goes stale')}`,

  notifHook: `${fn('useEffect')}(() =&gt; {
  ${kw('if')} (${vr('trackingState')} === ${str("'arriving'")} &amp;&amp; ${vr('prevState')} !== ${str("'arriving'")}) {
    ${fn('showNotification')}({
      title: ${str("'Bus Approaching'")},
      body: ${str('`${busName} is ~30s away from your stop`')},
    });
    ${fn('playArrivalSound')}(); ${cmt('// haptic + audio')}
  }
}, [${vr('trackingState')}]);`,

  soundFeedback: `${kw('export function')} ${fn('playArrivalSound')}() {
  ${kw('const')} ${vr('ctx')} = ${kw('new')} ${tp('AudioContext')}();
  ${kw('const')} ${vr('osc')} = ${vr('ctx')}.${fn('createOscillator')}();
  ${kw('const')} ${vr('gain')} = ${vr('ctx')}.${fn('createGain')}();
  ${vr('osc')}.${fn('connect')}(${vr('gain')}); ${vr('gain')}.${fn('connect')}(${vr('ctx')}.${vr('destination')});
  ${vr('osc')}.${vr('frequency')}.${fn('setValueAtTime')}(${num('880')}, ${vr('ctx')}.${vr('currentTime')});
  ${vr('osc')}.${vr('frequency')}.${fn('exponentialRampToValueAtTime')}(${num('440')}, ${vr('ctx')}.${vr('currentTime')} + ${num('0.3')});
  ${vr('gain')}.${vr('gain')}.${fn('setValueAtTime')}(${num('0.15')}, ${vr('ctx')}.${vr('currentTime')});
  ${vr('gain')}.${vr('gain')}.${fn('exponentialRampToValueAtTime')}(${num('0.001')}, ${vr('ctx')}.${vr('currentTime')} + ${num('0.4')});
  ${vr('osc')}.${fn('start')}(); ${vr('osc')}.${fn('stop')}(${vr('ctx')}.${vr('currentTime')} + ${num('0.4')});
}`,

  offRouteDetector: `${kw('const')} ${cn('OFF_ROUTE_THRESHOLD_M')} = ${num('80')};

${kw('function')} ${fn('isOffRoute')}(${vr('gps')}: ${tp('LngLat')}, ${vr('route')}: ${tp('LngLat')}[]): ${tp('boolean')} {
  ${kw('const')} ${vr('projected')} = ${fn('projectOntoRoute')}(${vr('gps')}, ${vr('route')});
  ${kw('return')} ${fn('haversineMeters')}(${vr('gps')}, ${vr('projected')}) &gt; ${cn('OFF_ROUTE_THRESHOLD_M')};
}`,

  perfAudit: `1. Throttle broadcasts to 1/sec (not per MQTT message)
   → prevents 20 buses × 0.5Hz = 10 emits/sec becoming 20 emits/sec

2. Serialisation cache (500ms TTL)
   → Array.from(Map.values()) runs once per 500ms not once per message

3. In-memory device map (not MongoDB reads per GPS update)
   → O(1) lookup vs ~8ms MongoDB round-trip

4. Client-side interpolation at 60fps
   → server sends position data 0.5Hz; client animates at screen rate

5. Stale device cleanup every 60s
   → prevents unbounded Map growth for parked/offline devices`,

  testScenarios: `✅ Normal tracking: bus moves along route, marker follows smoothly
✅ GPS jitter: EMA smoothing keeps marker stable while bus is stationary
✅ Cold start: zero-coord reject prevents Gulf of Guinea snap
✅ Signal loss: dead reckoning continues for up to 60s
✅ Off-route: bus takes detour, raw GPS used, snaps back on return
✅ Arriving: notification fires at 150m, sound plays once
✅ Multiple buses: all buses tracked simultaneously on single Socket.IO
✅ Stale bus: device silent 5+ min, removed from broadcast payload
✅ Reconnect: client re-connects, receives current device snapshot immediately
✅ Driver re-assignment: new busRoute takes effect on next MQTT message`,

  replayTool: `${kw('const')} ${fn('replayLog')} = ${kw('async')} (${vr('log')}: ${tp('PositionEntry')}[], ${vr('speed')} = ${num('1')}) =&gt; {
  ${kw('for')} (${kw('const')} [${vr('i')}, ${vr('entry')}] ${kw('of')} ${vr('log')}.${fn('entries')}()) {
    ${kw('if')} (${vr('i')} &gt; ${num('0')}) {
      ${kw('const')} ${vr('dt')} = (${vr('log')}[${vr('i')}].${vr('ts')} - ${vr('log')}[${vr('i')}-${num('1')}].${vr('ts')}) / ${vr('speed')};
      ${kw('await')} ${fn('sleep')}(${vr('dt')});
    }
    ${vr('mqttClient')}.${fn('publish')}(${str("'traccar/positions'")}, ${tp('JSON')}.${fn('stringify')}(${vr('entry')}));
  }
};`,

  driverSchemaFull: `${kw('const')} ${vr('driverSchema')} = ${kw('new')} ${vr('mongoose')}.${tp('Schema')}({
  ${vr('driverID')}:    { ${tp('type')}: ${tp('String')},  unique: ${kw('true')},  required: ${kw('true')} },
  ${vr('firstName')}:   { ${tp('type')}: ${tp('String')},  required: ${kw('true')}, trim: ${kw('true')} },
  ${vr('lastName')}:    { ${tp('type')}: ${tp('String')},  required: ${kw('true')}, trim: ${kw('true')} },
  ${vr('phoneNumber')}: { ${tp('type')}: ${tp('String')},  unique: ${kw('true')},  required: ${kw('true')} },
  ${vr('active')}:      { ${tp('type')}: ${tp('Boolean')}, default: ${kw('true')} },
  ${vr('busID')}:       { ${tp('type')}: ${vr('mongoose')}.${tp('Schema')}.Types.ObjectId, ref: ${str("'Bus'")} },
  ${vr('busRoute')}:    { ${tp('type')}: ${vr('mongoose')}.${tp('Schema')}.Types.ObjectId, ref: ${str("'Route'")} },
  ${cmt('// ↓ The critical field — links Traccar device to this driver')}
  ${vr('deviceId')}:    { ${tp('type')}: ${tp('String')}, unique: ${kw('true')}, sparse: ${kw('true')}, trim: ${kw('true')} },
});`,

  busSchema: `${kw('const')} ${vr('busSchema')} = ${kw('new')} ${vr('mongoose')}.${tp('Schema')}({
  ${vr('busID')}:       { ${tp('type')}: ${tp('String')},  unique: ${kw('true')}, required: ${kw('true')} },
  ${vr('driverID')}:    { ${tp('type')}: ${tp('String')},  ref: ${str("'Driver'")} },
  ${vr('plateNumber')}: { ${tp('type')}: ${tp('String')},  unique: ${kw('true')}, uppercase: ${kw('true')}, trim: ${kw('true')} },
  ${vr('active')}:      { ${tp('type')}: ${tp('Boolean')}, default: ${kw('true')} },
  ${vr('route')}:       { ${tp('type')}: ${vr('mongoose')}.${tp('Schema')}.Types.ObjectId, ref: ${str("'Route'")} },
});`,

  buildMapping: `${cmt('// Called once on server boot — builds the fast lookup map')}
${kw('export const')} ${fn('buildDeviceDriverMapping')} = ${kw('async')} () =&gt; {
  ${kw('const')} ${vr('drivers')} = ${kw('await')} ${vr('DriverModel')}
    .${fn('find')}({ ${vr('deviceId')}: { $exists: ${kw('true')}, $ne: ${kw('null')} } })
    .${fn('select')}(${str("'deviceId driverID'")}); ${cmt('// minimal projection')}

  ${vr('deviceToDriverMap')}.${fn('clear')}();
  ${kw('for')} (${kw('const')} ${vr('driver')} ${kw('of')} ${vr('drivers')}) {
    ${vr('deviceToDriverMap')}.${fn('set')}(${tp('String')}(${vr('driver')}.${vr('deviceId')}), ${vr('driver')}.${vr('driverID')});
  }
  ${cmt('// Map: "861694061234567" → "DRV-001"')}
  ${cmt('// O(1) lookup on every MQTT message — no DB round-trip')}
};`,

  rtMqttClient: `${kw('const')} ${vr('socket')} = ${fn('io')}(${cn('SOCKET_SERVER_URL')}, {
  transports: [${str("'websocket'")}, ${str("'polling'")}],
  reconnectionDelay: ${num('1000')}, reconnectionAttempts: ${num('5')},
});

${vr('socket')}.${fn('on')}(${str("'mqtt-device-locations'")}, (${vr('devices')}: ${tp('MQTTDevice')}[]) =&gt; {
  ${kw('const')} ${vr('map')}: ${tp('Record')}&lt;${tp('string')}, ${tp('MQTTDevice')}&gt; = {};
  ${vr('devices')}.${fn('forEach')}(${vr('d')} =&gt; { ${vr('map')}[${vr('d')}.${vr('deviceId')}] = ${vr('d')}; });
  ${fn('setDevices')}(${vr('map')});
});`,

  rtDriverMerge: `${cmt('// MQTT position always wins over stale API position')}
${kw('const')} ${vr('lat')} = ${vr('mqttMatch')}?.${vr('position')}?.${vr('latitude')}  ?? ${vr('apiDriver')}.${vr('coords')}?.${vr('latitude')}  ?? ${num('0')};
${kw('const')} ${vr('lng')} = ${vr('mqttMatch')}?.${vr('position')}?.${vr('longitude')} ?? ${vr('apiDriver')}.${vr('coords')}?.${vr('longitude')} ?? ${num('0')};

${cmt('// Only surface drivers with valid coordinates')}
${kw('const')} ${vr('visible')} = ${vr('merged')}.${fn('filter')}(${vr('d')} =&gt;
  ${vr('d')}.${vr('active')} &amp;&amp; (${vr('d')}.${vr('coords')}.${vr('latitude')} !== ${num('0')} || ${vr('d')}.${vr('coords')}.${vr('longitude')} !== ${num('0')})
);`,

  locGpsSmoothed: `${kw('const')} ${cn('POSITION_SMOOTH_ALPHA')} = ${num('0.24')}; ${cmt('// 24% new, 76% history')}

${vr('ref')}.${vr('current')}.${vr('lat')} = ${cn('POSITION_SMOOTH_ALPHA')} * ${vr('rawLat')}
  + (${num('1')} - ${cn('POSITION_SMOOTH_ALPHA')}) * ${vr('ref')}.${vr('current')}.${vr('lat')};

${cmt('// Heading: use shortest-path delta to avoid 359°→1° spinning')}
${kw('let')} ${vr('diff')} = ${vr('rawHeading')} - ${vr('ref')}.${vr('current')}.${vr('heading')};
${vr('diff')} = ((${vr('diff')} + ${num('180')}) % ${num('360')}) - ${num('180')};
${vr('ref')}.${vr('current')}.${vr('heading')} += ${num('0.28')} * ${vr('diff')}; ${cmt('// α=0.28 for heading')}`,

  locRouteSnap: `${kw('const')} ${cn('MAX_PROGRESS_STEP_M')} = ${num('180')}; ${cmt('// max forward advance per update')}
${kw('const')} ${cn('BACKTRACK_BUFFER_M')}  = ${num('40')};  ${cmt('// allow slight backward correction')}

${cmt('// Only prefer reverse direction if heading delta strongly matches')}
${kw('const')} ${vr('prefersReverse')} = ${vr('revDiff')} + ${num('10')} &lt; ${vr('fwdDiff')};`,

  locDrTick: `${kw('const')} ${vr('slowFactor')}    = ${tp('Math')}.${fn('max')}(${num('0')}, ${num('1')} - ${vr('drElapsed')} / ${cn('DEAD_RECKONING_MAX_MS')});
${kw('const')} ${vr('effectiveSpd')}  = ${vr('anchor')}.${vr('current')}.${vr('speed')} * ${vr('slowFactor')};
${kw('const')} ${vr('advanceMetres')} = ${vr('effectiveSpd')} * (${vr('staleDt')} / ${num('1000')});
${kw('const')} ${vr('pos')} = ${fn('getPositionAtDistance')}(${vr('routeCoords')}, ${vr('cumDist')}, ${vr('predictedDist')});`,

  movInterpEase: `${cmt('// Cubic ease-in-out — smooth glide between GPS positions')}
${kw('const')} ${vr('t')} = ${vr('rawT')} &lt; ${num('0.5')}
  ? ${num('4')} * ${vr('rawT')} ** ${num('3')}
  : ${num('1')} - ${tp('Math')}.${fn('pow')}(-${num('2')} * ${vr('rawT')} + ${num('2')}, ${num('3')}) / ${num('2')};

${cmt('// Speed-aware duration: faster bus = shorter animation cycle')}
${vr('duration')} = ${tp('Math')}.${fn('min')}(${cn('MAX_DUR')}, ${tp('Math')}.${fn('max')}(${cn('MIN_DUR')}, (${vr('dist')} / ${vr('speedMs')}) * ${num('900')}));`,

  movMatchBearing: `${kw('if')} (${vr('currentIdx')} &gt; ${vr('startIdx')}) {
  ${kw('const')} ${vr('toPrev')} = ${fn('getBearing')}(${vr('stops')}[${vr('currentIdx')}], ${vr('stops')}[${vr('currentIdx')}-${num('1')}]);
  ${kw('const')} ${vr('toNext')} = ${fn('getBearing')}(${vr('stops')}[${vr('currentIdx')}], ${vr('stops')}[${vr('currentIdx')}+${num('1')}]);
  ${cmt('// Bus reversing toward start if heading closer to backward direction')}
  ${kw('return')} ${fn('headingDelta')}(${vr('heading')}, ${vr('toPrev')}) &lt;= ${fn('headingDelta')}(${vr('heading')}, ${vr('toNext')});
}`,

  movStateArrival: `${cmt('// Priority 1: routeMatch position (from route geometry — most accurate)')}
${kw('if')} (${vr('driver')}.${vr('routeMatch')}?.${vr('position')}?.${vr('stop')})
  ${kw('return')} { isAtStop: ${kw('true')}, stopName: ${vr('driver')}.${vr('routeMatch')}.${vr('position')}.${vr('stop')}.${vr('name')} };

${cmt('// Priority 2: haversine radius fallback (~5m)')}
${kw('for')} (${kw('const')} ${vr('dp')} ${kw('of')} ${vr('dropPoints')})
  ${kw('if')} (${fn('hasArrivedAtStop')}(${vr('coords')}, ${vr('dp')})) ${kw('return')} { isAtStop: ${kw('true')}, stopName: ${vr('dp')}.${vr('name')} };`,

  notifDedup: `${kw('const')} ${vr('shownRef')} = ${fn('useRef')}(${kw('new')} ${tp('Set')}&lt;${tp('string')}&gt;());

${kw('const')} ${fn('notify')} = (${vr('key')}: ${tp('string')}, ${vr('n')}: ${tp('Notification')}) =&gt; {
  ${kw('if')} (${vr('shownRef')}.${vr('current')}.${fn('has')}(${vr('key')})) ${kw('return')} ${kw('false')}; ${cmt('// already shown — block')}
  ${vr('shownRef')}.${vr('current')}.${fn('add')}(${vr('key')});
  ${fn('setNotification')}(${vr('n')});
  ${kw('return')} ${kw('true')};
};`,

  notifBrake: `${kw('const')} ${vr('osc')} = ${vr('ctx')}.${fn('createOscillator')}();
${vr('osc')}.${vr('type')} = ${str("'sawtooth'")}; ${cmt('// harsh texture = brake feel')}
${vr('osc')}.${vr('frequency')}.${fn('setValueAtTime')}(${num('420')}, ${vr('ctx')}.${vr('currentTime')});
${vr('osc')}.${vr('frequency')}.${fn('exponentialRampToValueAtTime')}(${num('120')}, ${vr('ctx')}.${vr('currentTime')} + ${num('0.28')});
${cmt('// 420Hz → 120Hz over 280ms mimics bus brake squeal')}`,

  edgeLastKnown: `${cmt('// Hold last-known position when MQTT tick has no new coords')}
${kw('if')} (${vr('lat')} &amp;&amp; ${vr('lng')}) {
  ${vr('lastKnownRef')}.${vr('current')}[${vr('id')}] = { ${vr('latitude')}:${vr('lat')}, ${vr('longitude')}:${vr('lng')}, ${vr('heading')}, ${vr('speed')} };
} ${kw('else')} {
  ${kw('const')} ${vr('last')} = ${vr('lastKnownRef')}.${vr('current')}[${vr('id')}];
  ${kw('if')} (!${vr('last')}) ${kw('return')} ${kw('null')}; ${cmt('// never had valid coords — skip render')}
  ({ ${vr('latitude')}: ${vr('lat')}, ${vr('longitude')}: ${vr('lng')} } = ${vr('last')});
}
${kw('return')} &lt;${cn('AnimatedMQTTBus')} opacity={${num('0.4')}} /&gt;; ${cmt('// dimmed, excluded from routing')}`,

  testMatrix: `GPS_DROP        Signal lost 3–30s → dead reckoning → icon continues moving
OFF_ROUTE       Bus deviates &gt;50m → geofence flags → 40% opacity, excluded
SERVICE_CLOSED  After 18:00 → isServiceClosed=true → parked toast
NO_BUS_ON_ROUTE All buses off-route → 2.5s debounce → warning notification
PICKUP_ARRIVED  Bus enters 10m radius → brake sound → "Bus arrived" toast
TURNING_POINT   Bus past student stop → heading check → reverse route shown
DUAL_STOP_NEAR  Two stops within 20m → routeMatch priority → correct stop
JOURNEY_COMPLETE Student + bus at dropOff → 🎉 modal`,

  testResume: `${kw('const')} ${vr('resumeMonday')} =
  (${vr('day')} === ${num('5')} &amp;&amp; ${vr('mins')} &gt;= ${num('1080')}) || ${cmt('// Friday after 6pm')}
  ${vr('day')} === ${num('6')} || ${vr('day')} === ${num('0')};  ${cmt('// Saturday or Sunday')}

${kw('return')} ${vr('resumeMonday')}
  ? ${str("'Buses are parked. Service resumes on Monday'")}
  : ${str("'Buses are parked now. Service resumes at 7:00 AM'")};`,

  archIntegrated: `${kw('const')} ${cn('API_POLL_INTERVAL_MS')} = ${num('30_000')};

${fn('useEffect')}(() =&gt; {
  ${kw('const')} ${fn('fetchAPI')} = ${kw('async')} () =&gt; {
    ${kw('const')} ${vr('data')} = ${kw('await')} ${fn('fetch')}(${str('`${BASE_URL}/drivers`')}).${fn('then')}(${vr('r')} =&gt; ${vr('r')}.${fn('json')}());
    ${vr('apiDriversRef')}.${vr('current')} = ${vr('data')}.${vr('drivers')};
    ${fn('merge')}(${vr('data')}.${vr('drivers')}, ${vr('mqttDevicesMap')}, ${vr('isServiceClosed')});
  };
  ${fn('fetchAPI')}();
  ${kw('const')} ${vr('poll')} = ${fn('setInterval')}(${fn('fetchAPI')}, ${cn('API_POLL_INTERVAL_MS')});
  ${kw('return')} () =&gt; ${fn('clearInterval')}(${vr('poll')});
}, [${vr('isServiceClosed')}]); ${cmt('// mqttDevices NOT here — no re-fetch on every GPS tick')}`,

  integratedDriverType: `${kw('interface')} ${tp('IntegratedDriver')} {
  ${vr('driverID')}:  ${tp('string')};
  ${vr('busRoute')}:  ${tp('string')}[];       ${cmt('// stop names in route order')}
  ${vr('coords')}: {
    ${vr('latitude')}:  ${tp('number')};
    ${vr('longitude')}: ${tp('number')};
    ${vr('speed')}:     ${tp('number')};    ${cmt('// m/s')}
    ${vr('heading')}:   ${tp('number')};    ${cmt('// 0–360 degrees')}
    ${vr('timestamp')}: ${tp('number')};
  };
  ${vr('dataSource')}: ${str("'api'")} | ${str("'mqtt'")} | ${str("'both'")};
  ${vr('geofenceStatus')}?: {
    ${vr('status')}:    ${str("'on_route'")} | ${str("'off_route'")} | ${str("'in_depot'")};
    ${vr('deviation')}: ${tp('number')};   ${cmt('// metres from route')}
  };
}`,
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ type, children }: { type: 'mqtt' | 'algo' | 'engine' | 'system' | 'rest'; children: string }) {
  return <span className={`eng-badge eng-badge-${type}`}>{children}</span>
}

function CopyBtn({ text }: { text: string }) {
  const [label, setLabel] = useState('Copy')
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setLabel('Copied!')
      setTimeout(() => setLabel('Copy'), 2000)
    })
  }, [text])
  return <button className="eng-copy-btn" onClick={handleCopy}>{label}</button>
}

function CodeBlock({ lang, file, html, plain }: { lang: string; file?: string; html?: string; plain?: string }) {
  const rawText = plain ?? (html ? html.replace(/<[^>]+>/g, '') : '')
  return (
    <div className="eng-code-block">
      <div className="eng-code-header">
        <span className="eng-code-lang">{lang}</span>
        {file && <span className="eng-code-file">{file}</span>}
        <CopyBtn text={rawText} />
      </div>
      <div className="eng-code-body">
        {html
          ? <pre dangerouslySetInnerHTML={{ __html: html }} />
          : <pre style={{ color: 'var(--text)' }}>{plain}</pre>
        }
      </div>
    </div>
  )
}

function MetricCard({ label, value, unit, sub }: { label: string; value: string; unit?: string; sub?: string }) {
  const isLong = value.length > 6
  return (
    <div className="eng-metric-card">
      <div className="eng-metric-label">{label}</div>
      <div className="eng-metric-value" style={isLong ? { fontSize: 13, marginTop: 4 } : {}}>
        {value}{unit && <span className="eng-metric-unit">{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function DecisionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="eng-decision-block">
      <div className="eng-decision-label">{label}</div>
      <div className="eng-decision-text">{children}</div>
    </div>
  )
}

function WarnBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="eng-warn-block">
      <div className="eng-warn-label">{label}</div>
      <div className="eng-decision-text" style={{ color: 'rgba(255,255,255,.7)' }}>{children}</div>
    </div>
  )
}

// ── Demo wrapper ─────────────────────────────────────────────────────────────

function DemoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="eng-demo-block">
      <div className="eng-demo-header">
        <div className="eng-demo-title">
          <span className="eng-demo-live-dot" />
          DEMO — {title}
        </div>
      </div>
      <div className="eng-demo-body">{children}</div>
    </div>
  )
}

// ── Interactive demos ─────────────────────────────────────────────────────────

function DeviceDriverChainDemo() {
  const [step, setStep] = useState(0)
  const steps = [
    { num: '01', label: 'MQTT arrives',    emoji: '📡', desc: 'Raw payload from Traccar GPS device — contains uniqueId, position, speed, course.' },
    { num: '02', label: 'extractDeviceId', emoji: '🔍', desc: 'Resolve: device.uniqueId → uniqueId → deviceId → device.id → fallback timestamp.' },
    { num: '03', label: 'deviceDriverMap', emoji: '⚡', desc: 'O(1) in-memory lookup: "861694…" → "DRV-001". Built from MongoDB on boot.' },
    { num: '04', label: 'driverCache',     emoji: '📋', desc: 'driverID → { busRoute: "route-a", name: "Kofi A." } — REST-polled every 30s.' },
    { num: '05', label: 'ROUTE_POLYLINES', emoji: '🗺️', desc: 'busRoute → static JSON polyline array, ready for projection & snapping.' },
  ]
  return (
    <DemoBlock title="Device → Driver Chain">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <button className={`eng-chain-step${step === i ? ' active-step' : ''}`} onClick={() => setStep(i)}>
              <span className="eng-chain-num">{s.num}</span>
              <span className="eng-chain-label">{s.label}</span>
            </button>
            {i < steps.length - 1 && <span className="eng-chain-arrow">→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="eng-state-display">
        <span style={{ fontSize: 24 }}>{steps[step].emoji}</span>
        <div>
          <div style={{ color: 'var(--green)', marginBottom: 4, fontFamily: 'JetBrains Mono', fontSize: 11 }}>{steps[step].label}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{steps[step].desc}</div>
        </div>
      </div>
    </DemoBlock>
  )
}

function ConnectionStateMachineDemo() {
  const [stateIdx, setStateIdx] = useState(0)
  const states = [
    { label: 'connecting',            emoji: '🔄', title: 'Socket.IO Connecting',    desc: 'TCP handshake + Socket.IO upgrade. Attempts websocket first, polling fallback.' },
    { label: 'waiting_for_positions', emoji: '⏳', title: 'Connected — awaiting GPS',desc: 'Socket is up. Waiting for first mqtt-device-locations event from server.' },
    { label: 'ready ✓',              emoji: '✅', title: 'Live GPS streaming',       desc: 'Receiving position updates at ~1/sec. Bus markers animating on map.' },
    { label: 'parked',               emoji: '🅿️', title: 'Service closed / parked', desc: 'No MQTT positions for >5 min or service hours check returns isServiceClosed=true.' },
  ]
  return (
    <DemoBlock title="Connection State Machine">
      <div className="eng-state-machine">
        {states.map((s, i) => (
          <button key={i} className={`eng-state-pill${stateIdx === i ? ' active-pill' : ''}`} onClick={() => setStateIdx(i)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="eng-state-display">
        <span style={{ fontSize: 22 }}>{states[stateIdx].emoji}</span>
        <div>
          <div style={{ color: '#fff', marginBottom: 4 }}>{states[stateIdx].title}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{states[stateIdx].desc}</div>
        </div>
      </div>
    </DemoBlock>
  )
}

function OperatingHoursDemo() {
  const [mins, setMins] = useState(480)
  const [isWeekend, setIsWeekend] = useState(false)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const isOpen = !isWeekend && mins >= 420 && mins < 1080
  const info = isWeekend
    ? { emoji: '🅿️', title: 'Weekend — buses parked', color: 'var(--muted)' }
    : mins < 420
      ? { emoji: '🌙', title: 'Pre-service (before 07:00)', color: 'var(--muted)' }
      : mins >= 1080
        ? { emoji: '🅿️', title: 'After hours (after 18:00)', color: 'var(--muted)' }
        : { emoji: '✅', title: 'Service open — GPS streaming', color: 'var(--green)' }
  return (
    <DemoBlock title="Operating Hours Simulator">
      <div className="eng-demo-row">
        <button className={`eng-demo-btn${!isWeekend ? '' : ' orange'}`} onClick={() => setIsWeekend(false)}>Weekday</button>
        <button className={`eng-demo-btn${isWeekend ? ' orange' : ''}`} onClick={() => setIsWeekend(true)}>Weekend</button>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 20, color: isOpen ? 'var(--green)' : 'var(--muted)', marginLeft: 8 }}>{timeStr}</span>
      </div>
      <input type="range" min={0} max={1439} value={mins} onChange={e => setMins(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 16, accentColor: 'var(--green)' }} />
      <div className="eng-state-display">
        <span style={{ fontSize: 22 }}>{info.emoji}</span>
        <div>
          <div style={{ color: info.color }}>{info.title}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontFamily: 'JetBrains Mono' }}>
            isServiceClosed = {String(!isOpen)}
          </div>
        </div>
      </div>
    </DemoBlock>
  )
}

function MQTTMergeDemo() {
  const [hasApi, setHasApi] = useState(true)
  const [hasMqtt, setHasMqtt] = useState(true)
  const src = hasApi && hasMqtt ? 'both' : hasMqtt ? 'mqtt' : hasApi ? 'api' : 'none'
  const coords = hasMqtt
    ? { lat: 6.6727, lng: -1.5718, spd: 18 }
    : hasApi ? { lat: 6.6700, lng: -1.5700, spd: 0 } : null
  return (
    <DemoBlock title="API + MQTT Merge Logic">
      <div className="eng-demo-row">
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text)', display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={hasApi} onChange={e => setHasApi(e.target.checked)} style={{ accentColor: 'var(--green)' }} />
          API Response (metadata)
        </label>
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text)', display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={hasMqtt} onChange={e => setHasMqtt(e.target.checked)} style={{ accentColor: 'var(--green)' }} />
          MQTT Emission (GPS)
        </label>
      </div>
      <div className="eng-state-display" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
        {src === 'none'
          ? <span style={{ color: 'var(--muted)' }}>No data sources — driver hidden from map</span>
          : <>
              <div><span style={{ color: 'var(--muted)' }}>dataSource: </span><span style={{ color: 'var(--green)' }}>{src}</span></div>
              <div><span style={{ color: 'var(--muted)' }}>name: </span>{hasApi ? <span>Kofi Agyemang</span> : <em style={{ color: 'var(--muted)' }}>missing — can still render GPS</em>}</div>
              <div><span style={{ color: 'var(--muted)' }}>coords: </span>{coords ? <span style={{ color: '#a5d6ff' }}>{`lat:${coords.lat}, lng:${coords.lng}, spd:${coords.spd}km/h`}</span> : <em style={{ color: 'var(--muted)' }}>stale (last known)</em>}</div>
            </>
        }
      </div>
    </DemoBlock>
  )
}

function EMAFilterDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const runRef = useRef(false)
  const alphaRef = useRef(0.24)
  const [running, setRunning] = useState(false)
  const [alpha, setAlpha] = useState(0.24)

  useEffect(() => { alphaRef.current = alpha }, [alpha])
  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const toggle = () => {
    if (runRef.current) {
      runRef.current = false
      cancelAnimationFrame(rafRef.current)
      setRunning(false)
      return
    }
    runRef.current = true
    setRunning(true)
    const C = canvasRef.current!
    const ctx = C.getContext('2d')!
    const W = C.width, H = C.height
    let t = 0, smoothed = 0.5
    const rawPts: [number, number][] = []
    const smPts:  [number, number][] = []
    const knots: [number, number][] = [[0,.5],[.15,.25],[.3,.6],[.45,.35],[.6,.65],[.75,.4],[.9,.7],[1,.5]]
    const getY = (x: number) => {
      const s = x * (knots.length - 1)
      const i = Math.min(Math.floor(s), knots.length - 2)
      const ft = s - i
      return knots[i][1] * (1 - ft) + knots[i + 1][1] * ft
    }
    const draw = () => {
      if (!runRef.current) return
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0d0d10'
      ctx.fillRect(0, 0, W, H)
      t += 0.004
      const base = getY(t % 1)
      const raw = Math.max(0.05, Math.min(0.95, base + (Math.random() - 0.5) * 0.14))
      smoothed = alphaRef.current * raw + (1 - alphaRef.current) * smoothed
      const x = Math.round((t % 1) * W)
      if (rawPts.length > 0 && x < rawPts[rawPts.length - 1][0]) { rawPts.length = 0; smPts.length = 0 }
      rawPts.push([x, Math.round(raw * H)])
      smPts.push([x, Math.round(smoothed * H)])
      ctx.strokeStyle = 'rgba(249,115,22,0.55)'
      ctx.setLineDash([3, 3])
      ctx.lineWidth = 1.5
      ctx.beginPath()
      rawPts.forEach(([px, py], j) => j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
      ctx.stroke()
      ctx.strokeStyle = '#34c759'
      ctx.setLineDash([])
      ctx.lineWidth = 2
      ctx.beginPath()
      smPts.forEach(([px, py], j) => j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
      ctx.stroke()
      rafRef.current = requestAnimationFrame(draw)
    }
    smoothed = getY(0)
    rafRef.current = requestAnimationFrame(draw)
  }

  return (
    <DemoBlock title="EMA Filter: Raw GPS vs Smoothed">
      <div className="eng-demo-row">
        <button className="eng-demo-btn" onClick={toggle}>{running ? 'Stop' : 'Start'}</button>
        <span className="eng-demo-stat">α = <span>{alpha}</span></span>
        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'rgba(249,115,22,0.8)' }}>── raw</span>
        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#34c759' }}>── smoothed</span>
      </div>
      <input type="range" min={5} max={85} value={Math.round(alpha * 100)}
        onChange={e => setAlpha(Number(e.target.value) / 100)}
        style={{ width: '100%', marginBottom: 12, accentColor: 'var(--green)' }} />
      <canvas ref={canvasRef} width={560} height={140}
        style={{ width: '100%', background: '#0d0d10', borderRadius: 8, display: 'block' }} />
    </DemoBlock>
  )
}

function RouteSnapDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const runRef = useRef(false)
  const [running, setRunning] = useState(false)
  const [snapDist, setSnapDist] = useState('—')

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const toggle = () => {
    if (runRef.current) {
      runRef.current = false
      cancelAnimationFrame(rafRef.current)
      setRunning(false)
      return
    }
    runRef.current = true
    setRunning(true)
    const C = canvasRef.current!
    const ctx = C.getContext('2d')!
    const W = C.width, H = C.height
    const route: [number, number][] = [[40,H-40],[120,H/2-20],[200,H/2+30],[300,H/2-10],[400,H/2+20],[W-40,40]]

    const nearestOnSeg = (px: number, py: number, ax: number, ay: number, bx: number, by: number): [number, number] => {
      const dx = bx - ax, dy = by - ay
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
      return [ax + t * dx, ay + t * dy]
    }
    const snapToRoute = (px: number, py: number): [number, number] => {
      let best: [number, number] = route[0], bestD = Infinity
      for (let i = 0; i < route.length - 1; i++) {
        const pt = nearestOnSeg(px, py, route[i][0], route[i][1], route[i+1][0], route[i+1][1])
        const d = Math.hypot(pt[0] - px, pt[1] - py)
        if (d < bestD) { bestD = d; best = pt }
      }
      return best
    }

    let t = 0
    const draw = () => {
      if (!runRef.current) return
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0d0d10'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(59,130,246,0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([])
      ctx.beginPath()
      route.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.stroke()

      t += 0.008
      const frac = (t % 1)
      const segF = frac * (route.length - 1)
      const si = Math.min(Math.floor(segF), route.length - 2)
      const sf = segF - si
      const bx = route[si][0] * (1 - sf) + route[si + 1][0] * sf
      const by = route[si][1] * (1 - sf) + route[si + 1][1] * sf
      const noise = Math.sin(t * 7) * 28 + Math.cos(t * 5) * 20
      const rawX = bx + noise
      const rawY = by + noise * 0.5
      const [snapX, snapY] = snapToRoute(rawX, rawY)
      const dist = Math.round(Math.hypot(snapX - rawX, snapY - rawY) * 0.8)
      setSnapDist(`${dist}m`)

      ctx.strokeStyle = 'rgba(249,115,22,0.6)'
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(rawX, rawY); ctx.lineTo(snapX, snapY); ctx.stroke()
      ctx.fillStyle = 'rgba(249,115,22,0.9)'
      ctx.setLineDash([])
      ctx.beginPath(); ctx.arc(rawX, rawY, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#34c759'
      ctx.beginPath(); ctx.arc(snapX, snapY, 5, 0, Math.PI * 2); ctx.fill()

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
  }

  return (
    <DemoBlock title="GPS Snapping to Route Polyline">
      <div className="eng-demo-row">
        <button className="eng-demo-btn" onClick={toggle}>{running ? 'Stop' : 'Start'}</button>
        <span className="eng-demo-stat">snap offset: <span>{snapDist}</span></span>
        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'rgba(249,115,22,0.8)' }}>● raw GPS</span>
        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#34c759' }}>● snapped</span>
      </div>
      <canvas ref={canvasRef} width={560} height={160}
        style={{ width: '100%', background: '#0d0d10', borderRadius: 8, display: 'block' }} />
    </DemoBlock>
  )
}

function DeadReckoningDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const runRef = useRef(false)
  const gpsCutRef = useRef(false)
  const [running, setRunning] = useState(false)
  const [gpsLive, setGpsLive] = useState(true)
  const [status, setStatus] = useState('idle')

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const start = () => {
    if (runRef.current) return
    runRef.current = true
    gpsCutRef.current = false
    setRunning(true); setGpsLive(true); setStatus('tracking')
    const C = canvasRef.current!
    const ctx = C.getContext('2d')!
    const W = C.width, H = C.height
    const route: [number, number][] = [[30, H/2], [130, H/2-30], [250, H/2+20], [380, H/2-10], [W-30, H/2+10]]
    let t = 0, drStart = 0
    const MAX_DR = 4000

    const draw = (now: number) => {
      if (!runRef.current) return
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0d0d10'; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(59,130,246,0.4)'; ctx.lineWidth = 2; ctx.setLineDash([])
      ctx.beginPath()
      route.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.stroke()

      const isGPS = !gpsCutRef.current
      if (isGPS) { drStart = 0; t += 0.004 }
      else {
        if (drStart === 0) drStart = now
        const elapsed = now - drStart
        const slow = Math.max(0, 1 - elapsed / MAX_DR)
        t += 0.004 * slow
        const pct = Math.min(elapsed / MAX_DR, 1)
        setStatus(pct >= 1 ? 'stale' : `DR: ${(pct * 100).toFixed(0)}%`)
      }

      const frac = Math.min(t % 1, 0.99)
      const si = Math.min(Math.floor(frac * (route.length - 1)), route.length - 2)
      const sf = frac * (route.length - 1) - si
      const bx = route[si][0] * (1 - sf) + route[si + 1][0] * sf
      const by = route[si][1] * (1 - sf) + route[si + 1][1] * sf

      if (!isGPS) {
        ctx.fillStyle = 'rgba(249,115,22,0.2)'
        ctx.beginPath(); ctx.arc(bx, by, 18, 0, Math.PI * 2); ctx.fill()
      }
      ctx.fillStyle = isGPS ? '#34c759' : '#f97316'
      ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff'; ctx.font = '12px JetBrains Mono'
      ctx.fillText('🚌', bx - 8, by - 12)

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
  }

  const cutGPS = () => { gpsCutRef.current = true; setGpsLive(false); setStatus('dead reckoning') }
  const restoreGPS = () => { gpsCutRef.current = false; setGpsLive(true); setStatus('tracking') }
  const reset = () => {
    runRef.current = false
    cancelAnimationFrame(rafRef.current)
    setRunning(false); setGpsLive(true); setStatus('idle')
    const C = canvasRef.current!
    const ctx = C.getContext('2d')!
    ctx.clearRect(0, 0, C.width, C.height)
  }

  return (
    <DemoBlock title="Dead Reckoning Prediction">
      <div className="eng-demo-row">
        <button className="eng-demo-btn" onClick={start} disabled={running}>Start</button>
        <button className="eng-demo-btn orange" onClick={cutGPS} disabled={!running || !gpsLive}>Cut GPS</button>
        <button className="eng-demo-btn blue" onClick={restoreGPS} disabled={!running || gpsLive}>Restore GPS</button>
        <button className="eng-demo-btn" onClick={reset}>Reset</button>
        <span className="eng-demo-stat">status: <span style={{ color: gpsLive ? 'var(--green)' : 'var(--algo)' }}>{status}</span></span>
      </div>
      <canvas ref={canvasRef} width={560} height={120}
        style={{ width: '100%', background: '#0d0d10', borderRadius: 8, display: 'block' }} />
    </DemoBlock>
  )
}

function CubicEaseDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const [running, setRunning] = useState(false)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const animate = () => {
    if (running) return
    setRunning(true)
    const C = canvasRef.current!
    const ctx = C.getContext('2d')!
    const W = C.width, H = C.height
    const ease = (t: number) => t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2
    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0d0d10'; ctx.fillRect(0, 0, W, H)
      const pad = 40, trackW = W - pad * 2
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([])
      ctx.beginPath(); ctx.moveTo(pad, H * 0.35); ctx.lineTo(W - pad, H * 0.35); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(pad, H * 0.65); ctx.lineTo(W - pad, H * 0.65); ctx.stroke()

      const linearX = pad + t * trackW
      const easeX   = pad + ease(t) * trackW
      ctx.fillStyle = 'rgba(59,130,246,0.7)'; ctx.beginPath(); ctx.arc(linearX, H * 0.35, 8, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(59,130,246,0.4)'; ctx.font = '9px JetBrains Mono'
      ctx.fillText('linear', pad, H * 0.35 - 14)
      ctx.fillStyle = '#34c759'; ctx.beginPath(); ctx.arc(easeX, H * 0.65, 8, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(52,199,89,0.5)'; ctx.fillText('cubic ease', pad, H * 0.65 - 14)

      t += 0.008
      if (t > 1) { t = 0; setRunning(false); return }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
  }

  return (
    <DemoBlock title="Cubic Ease vs Linear">
      <div className="eng-demo-row">
        <button className="eng-demo-btn" onClick={animate} disabled={running}>Animate</button>
        <span className="eng-demo-stat">formula: <span>t&lt;0.5 ? 4t³ : 1−(−2t+2)³/2</span></span>
      </div>
      <canvas ref={canvasRef} width={560} height={100}
        style={{ width: '100%', background: '#0d0d10', borderRadius: 8, display: 'block' }} />
    </DemoBlock>
  )
}

function DirectionClassifierDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [heading, setHeading] = useState(45)
  const routeBearing = 60

  useEffect(() => {
    const C = canvasRef.current!
    const ctx = C.getContext('2d')!
    const W = C.width, H = C.height
    const cx = W / 2, cy = H / 2, r = Math.min(cx, cy) - 16
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0d0d10'; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([])
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
    const toRad = (d: number) => (d - 90) * Math.PI / 180
    const drawArrow = (deg: number, color: string, label: string, radius: number) => {
      const a = toRad(deg)
      ctx.strokeStyle = color; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius); ctx.stroke()
      ctx.fillStyle = color; ctx.font = '9px JetBrains Mono'
      ctx.fillText(label, cx + Math.cos(a) * (radius + 12) - 8, cy + Math.sin(a) * (radius + 12) + 4)
    }
    drawArrow(routeBearing, 'rgba(59,130,246,0.7)', 'route', r * 0.85)
    drawArrow((routeBearing + 180) % 360, 'rgba(59,130,246,0.4)', 'start', r * 0.65)
    drawArrow(heading, '#34c759', '🚌', r * 0.75)

    const delta = (a: number, b: number) => {
      let d = ((a - b) % 360 + 360) % 360; if (d > 180) d = 360 - d; return d
    }
    const fwdDiff = delta(heading, routeBearing)
    const revDiff = delta(heading, (routeBearing + 180) % 360)
    const isReversing = revDiff < fwdDiff
    ctx.fillStyle = isReversing ? '#f97316' : '#34c759'
    ctx.font = '11px JetBrains Mono'
    ctx.fillText(isReversing ? 'toward start ↩' : 'forward →', 8, H - 10)
  }, [heading, routeBearing])

  return (
    <DemoBlock title="Heading Direction Classifier">
      <div className="eng-demo-row">
        <span className="eng-demo-stat">heading: <span>{heading}°</span></span>
        <span className="eng-demo-stat" style={{ marginLeft: 8 }}>route bearing: <span style={{ color: 'rgba(59,130,246,0.9)' }}>{routeBearing}°</span></span>
      </div>
      <input type="range" min={0} max={359} value={heading} onChange={e => setHeading(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 12, accentColor: 'var(--green)' }} />
      <canvas ref={canvasRef} width={240} height={200}
        style={{ background: '#0d0d10', borderRadius: 8, display: 'block' }} />
    </DemoBlock>
  )
}

function StopArrivalDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const runRef = useRef(false)
  const [running, setRunning] = useState(false)
  const [dist, setDist] = useState('—')
  const [arrived, setArrived] = useState(false)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const toggle = () => {
    if (runRef.current) {
      runRef.current = false
      cancelAnimationFrame(rafRef.current)
      setRunning(false); setArrived(false); setDist('—')
      const C = canvasRef.current!
      C.getContext('2d')!.clearRect(0, 0, C.width, C.height)
      return
    }
    runRef.current = true; setRunning(true); setArrived(false)
    const C = canvasRef.current!
    const ctx = C.getContext('2d')!
    const W = C.width, H = C.height
    const stopX = W / 2, stopY = H / 2
    const ARRIVE_R = 30
    let t = 0

    const draw = () => {
      if (!runRef.current) return
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0d0d10'; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(52,199,89,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.arc(stopX, stopY, ARRIVE_R, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = 'rgba(52,199,89,0.4)'; ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.arc(stopX, stopY, ARRIVE_R * 4, 0, Math.PI * 2); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#34c759'; ctx.beginPath(); ctx.arc(stopX, stopY, 6, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '9px JetBrains Mono'; ctx.fillText('stop', stopX + 8, stopY + 4)

      t += 0.01
      const angle = t * 2
      const radius = Math.max(ARRIVE_R * 0.5, ARRIVE_R * 4.5 - t * ARRIVE_R * 3)
      const busX = stopX + Math.cos(angle) * radius
      const busY = stopY + Math.sin(angle) * radius
      const d = Math.round(Math.hypot(busX - stopX, busY - stopY) * 1.5)
      setDist(`${d}m`)
      const isArrived = d < ARRIVE_R * 1.5
      setArrived(isArrived)
      ctx.fillStyle = isArrived ? '#34c759' : '#f97316'
      ctx.beginPath(); ctx.arc(busX, busY, 7, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff'; ctx.font = '11px serif'; ctx.fillText('🚌', busX - 7, busY - 10)
      if (t > 6) { t = 0 }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
  }

  return (
    <DemoBlock title="Geofence Stop Arrival Detection">
      <div className="eng-demo-row">
        <button className="eng-demo-btn" onClick={toggle}>{running ? 'Reset' : 'Run'}</button>
        <span className="eng-demo-stat">distance: <span>{dist}</span></span>
        <span className="eng-demo-stat" style={{ marginLeft: 4 }}>arrived: <span style={{ color: arrived ? 'var(--green)' : 'var(--muted)' }}>{String(arrived)}</span></span>
      </div>
      <canvas ref={canvasRef} width={560} height={160}
        style={{ width: '100%', background: '#0d0d10', borderRadius: 8, display: 'block' }} />
    </DemoBlock>
  )
}

function NotifDedupDemo() {
  const shownRef = useRef(new Set<string>())
  const [log, setLog] = useState<{ key: string; time: string; blocked: boolean }[]>([])

  const fire = (key: string) => {
    const time = new Date().toLocaleTimeString()
    const blocked = shownRef.current.has(key)
    if (!blocked) shownRef.current.add(key)
    setLog(prev => [{ key, time, blocked }, ...prev].slice(0, 6))
  }

  const reset = () => { shownRef.current.clear(); setLog([]) }

  return (
    <DemoBlock title="Fire & Dedup Guard">
      <div className="eng-demo-row">
        <button className="eng-demo-btn" onClick={() => fire('approaching')}>approaching</button>
        <button className="eng-demo-btn orange" onClick={() => fire('arrived')}>arrived</button>
        <button className="eng-demo-btn blue" onClick={() => fire('offroute')}>off-route</button>
        <button className="eng-demo-btn purple" onClick={() => fire('departed')}>departed</button>
        <button className="eng-demo-btn" onClick={reset}>Reset</button>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
        fired keys: [{Array.from(shownRef.current).join(', ')}]
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {log.map((entry, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
            <span style={{ color: 'var(--muted)' }}>{entry.time}</span>
            <span style={{ color: entry.blocked ? 'var(--algo)' : 'var(--green)' }}>
              {entry.blocked ? '🚫 blocked' : '✅ fired'}
            </span>
            <span style={{ color: 'var(--text)' }}>notify("{entry.key}")</span>
          </div>
        ))}
      </div>
    </DemoBlock>
  )
}

function SoundFeedbackDemo() {
  const acRef = useRef<AudioContext | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const [playing, setPlaying] = useState('')

  const getAC = () => {
    if (!acRef.current) acRef.current = new AudioContext()
    return acRef.current
  }

  const playBrake = () => {
    const ctx = getAC()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const analyser = ctx.createAnalyser()
    osc.connect(gain); gain.connect(analyser); analyser.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(420, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.28)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    osc.start(); osc.stop(ctx.currentTime + 0.35)
    setPlaying('brake')
    drawWave(analyser)
    setTimeout(() => setPlaying(''), 400)
  }

  const playDepart = () => {
    const ctx = getAC()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const analyser = ctx.createAnalyser()
    osc.connect(gain); gain.connect(analyser); analyser.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4)
    gain.gain.setValueAtTime(0.10, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(); osc.stop(ctx.currentTime + 0.5)
    setPlaying('depart')
    drawWave(analyser)
    setTimeout(() => setPlaying(''), 550)
  }

  const drawWave = (analyser: AnalyserNode) => {
    cancelAnimationFrame(rafRef.current)
    const C = canvasRef.current!
    const ctx2 = C.getContext('2d')!
    const W = C.width, H = C.height
    const buf = new Uint8Array(analyser.frequencyBinCount)
    const step = () => {
      ctx2.clearRect(0, 0, W, H); ctx2.fillStyle = '#0d0d10'; ctx2.fillRect(0, 0, W, H)
      analyser.getByteTimeDomainData(buf)
      ctx2.strokeStyle = '#34c759'; ctx2.lineWidth = 1.5; ctx2.setLineDash([])
      ctx2.beginPath()
      buf.forEach((v, i) => {
        const x = (i / buf.length) * W
        const y = (v / 128) * (H / 2)
        i === 0 ? ctx2.moveTo(x, y) : ctx2.lineTo(x, y)
      })
      ctx2.stroke()
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    setTimeout(() => cancelAnimationFrame(rafRef.current), 600)
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <DemoBlock title="Web Audio Synthesis">
      <div className="eng-demo-row">
        <button className="eng-demo-btn orange" onClick={playBrake}>▶ Brake sound</button>
        <button className="eng-demo-btn" onClick={playDepart}>▶ Departure tone</button>
        {playing && <span className="eng-demo-stat" style={{ color: 'var(--green)' }}>playing: <span>{playing}</span></span>}
      </div>
      <canvas ref={canvasRef} width={560} height={80}
        style={{ width: '100%', background: '#0d0d10', borderRadius: 8, display: 'block' }} />
    </DemoBlock>
  )
}

function GeofenceStatusDemo() {
  const [status, setStatus] = useState<'on_route' | 'off_route' | 'in_depot' | 'maintenance'>('on_route')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const C = canvasRef.current!
    const ctx = C.getContext('2d')!
    const W = C.width, H = C.height
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0d0d10'; ctx.fillRect(0, 0, W, H)
    const cfg = {
      on_route:    { color: '#34c759', opacity: 1,   label: 'On Route',    icon: '🟢' },
      off_route:   { color: '#f97316', opacity: 0.4, label: 'Off Route',   icon: '🟠' },
      in_depot:    { color: '#3b82f6', opacity: 0.6, label: 'In Depot',    icon: '🅿️' },
      maintenance: { color: '#6b6b7a', opacity: 0.3, label: 'Maintenance', icon: '🔧' },
    }[status]
    ctx.globalAlpha = cfg.opacity
    ctx.fillStyle = cfg.color
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 28, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'; ctx.font = '22px serif'
    ctx.fillText('🚌', W / 2 - 12, H / 2 + 8)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px JetBrains Mono'
    ctx.fillText(`opacity: ${cfg.opacity}`, W / 2 - 28, H / 2 + 48)
  }, [status])

  return (
    <DemoBlock title="Geofence Status Renderer">
      <div className="eng-demo-row">
        {(['on_route', 'off_route', 'in_depot', 'maintenance'] as const).map(s => (
          <button key={s} className={`eng-demo-btn${status === s ? '' : ' blue'}`}
            style={status === s ? {} : { opacity: 0.5 }}
            onClick={() => setStatus(s)}>{s}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <canvas ref={canvasRef} width={160} height={120}
          style={{ background: '#0d0d10', borderRadius: 8, flexShrink: 0 }} />
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
          <div>status: <span style={{ color: status === 'on_route' ? 'var(--green)' : status === 'off_route' ? 'var(--algo)' : status === 'in_depot' ? 'var(--mqtt)' : 'var(--muted)' }}>{status}</span></div>
          <div>excluded from routing: <span style={{ color: status !== 'on_route' ? 'var(--algo)' : 'var(--muted)' }}>{String(status !== 'on_route')}</span></div>
          <div>rendered: <span style={{ color: status !== 'maintenance' ? 'var(--green)' : 'var(--muted)' }}>{String(status !== 'maintenance')}</span></div>
        </div>
      </div>
    </DemoBlock>
  )
}

function EndpointRow({ method, path, desc }: { method: 'GET' | 'POST' | 'PUT'; path: string; desc: string }) {
  return (
    <div className="eng-endpoint-row">
      <span className={`eng-method eng-method-${method.toLowerCase()}`}>{method}</span>
      <span className="eng-endpoint-path">{path}</span>
      <span className="eng-endpoint-desc">{desc}</span>
    </div>
  )
}

function PlatformToggle({ platform, setPlatform }: { platform: Platform; setPlatform: (p: Platform) => void }) {
  return (
    <div className="eng-platform-bar" style={{ marginBottom: 28 }}>
      <button className={`eng-platform-pill web${platform === 'web' ? ' p-active' : ''}`} onClick={() => setPlatform('web')}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 1.5C8 1.5 5.5 4.5 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4.5 10.5 8S8 14.5 8 14.5M1.5 8h13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        React + Vite
      </button>
      <button className={`eng-platform-pill rn${platform === 'rn' ? ' p-active' : ''}`} onClick={() => setPlatform('rn')}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="1" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="8" cy="12.5" r="1" fill="currentColor" />
        </svg>
        React Native
      </button>
    </div>
  )
}

// ── Section components ────────────────────────────────────────────────────────

function IntroSection({ platform, setPlatform }: { platform: Platform; setPlatform: (p: Platform) => void }) {
  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <span className="eng-version-badge">v1.0.0</span>
        <span className="eng-version-badge">OAS 3.0.3</span>
      </div>
      <div className="eng-intro-title">ShuttleApp Engineering</div>
      <p className="eng-intro-desc">
        Real-time shuttle tracking combining Socket.IO transport, EMA GPS smoothing, dead reckoning
        prediction, and geospatial route matching. Choose your client platform to see platform-specific
        code snippets throughout the docs.
      </p>
      <div className="eng-sub-label" style={{ marginBottom: 6 }}>Client Platform</div>
      <PlatformToggle platform={platform} setPlatform={setPlatform} />
      <div className="eng-server-card" style={{ maxWidth: 520 }}>
        <div className="eng-server-card-title">Install Client Dependencies</div>
        <div className="eng-mono" style={{ fontSize: 12, color: 'var(--green)', lineHeight: 1.8 }}>
          {platform === 'web'
            ? <>npm create vite@latest shuttle-web -- --template react-ts<br />npm install socket.io-client mapbox-gl</>
            : <>npx create-expo-app shuttle-mobile --template blank-typescript<br />npx expo install socket.io-client react-native-maps</>
          }
        </div>
      </div>
      <CodeBlock lang={platform === 'web' ? 'React + Vite' : 'React Native'} file="Connect to ShuttleApp server" html={platform === 'web' ? CODE.connectWeb : CODE.connectRn} />
      <div className="eng-metrics-row">
        <MetricCard label="Backend" value="Node.js" sub="Express + Socket.IO" />
        <MetricCard label="GPS Rate" value="~2" unit="s" />
        <MetricCard label="Dead Reckoning" value="60" unit="s" />
      </div>
      <div className="eng-server-card">
        <div className="eng-server-card-title">Production Server</div>
        <div className="eng-mono" style={{ fontSize: 13, color: 'var(--green)' }}>🟢 https://api.shuttleapp.me</div>
      </div>
    </>
  )
}

function BeServerSection({ platform }: { platform: Platform }) {
  const platLabel = platform === 'web' ? 'React + Vite' : 'React Native'
  return (
    <>
      <div className="eng-eyebrow">Backend</div>
      <div className="eng-title">Server Overview <Badge type="system">NODE</Badge></div>
      <p className="eng-subtitle">Express + HTTP server. Single process handles REST routes, Socket.IO upgrade, MQTT tracker, MongoDB, and Redis — all wired at startup.</p>
      <div className="eng-metrics-row">
        <MetricCard label="Framework" value="Express" sub="+ http.createServer" />
        <MetricCard label="Database" value="MongoDB" sub="+ Redis cache" />
        <MetricCard label="Default Port" value="5002" />
      </div>
      <CodeBlock lang="JavaScript" file="app.js — startup sequence" html={CODE.serverStartup} />
      <CodeBlock lang="JavaScript" file="Graceful shutdown — SIGTERM / SIGINT" html={CODE.gracefulShutdown} />
      <div className="eng-sub-label" style={{ margin: '20px 0 8px' }}>
        Client — <span style={{ color: platform === 'web' ? '#60a5fa' : '#34c759' }}>{platLabel}</span>
      </div>
      <CodeBlock lang={platLabel} file={platform === 'web' ? 'src/hooks/useSocket.ts' : 'hooks/useSocket.ts'} html={platform === 'web' ? CODE.beClientWeb : CODE.beClientRn} />
      <DecisionBlock label="Why single process?">
        Campus deployment is a single VPS. Keeping MQTT, Socket.IO, REST, and DB in one process avoids
        inter-process communication. If driver count grows significantly, the MQTT tracker can be extracted
        to a separate worker with shared Redis pub/sub.
      </DecisionBlock>
    </>
  )
}

function BeMqttSection() {
  return (
    <>
      <div className="eng-eyebrow">Backend</div>
      <div className="eng-title">MQTT Bridge <Badge type="mqtt">MQTT</Badge></div>
      <p className="eng-subtitle">
        Connects to a Traccar GPS platform over secure WebSocket MQTT (WSS). Subscribes to{' '}
        <span className="eng-inline-code">traccar/positions</span> — Traccar publishes position + device objects on every GPS update.
      </p>
      <div className="eng-metrics-row">
        <MetricCard label="Broker" value="mqtt.shuttleapp.me" />
        <MetricCard label="Broadcast Throttle" value="1" unit="s" />
        <MetricCard label="Stale TTL" value="5" unit="min" />
      </div>
      <CodeBlock lang="JavaScript" file="mqtt-tracker.js — config" html={CODE.mqttConfig} />
      <CodeBlock lang="JavaScript" file="mqtt-tracker.js — Traccar payload → deviceMap" html={CODE.mqttPayload} />
      <CodeBlock lang="JavaScript" file="mqtt-tracker.js — throttled broadcast" html={CODE.mqttBroadcast} />
      <CodeBlock lang="JavaScript" file="mqtt-tracker.js — stale device cleanup" html={CODE.mqttStaleCleanup} />
      <DecisionBlock label="Why Traccar over DIY MQTT broker?">
        Traccar is a battle-tested open-source GPS tracking platform. The physical GPS devices are
        pre-configured to send to the Traccar server, which re-publishes over MQTT. The backend never
        needs to manage GPS device protocols directly — Traccar normalises every vendor format into the
        standard{' '}<span className="eng-inline-code">{'{ position, device }'}</span> envelope.
      </DecisionBlock>
      <WarnBlock label="Coordinate Validation Guard">
        Messages with <span className="eng-mono" style={{ color: 'var(--algo)', fontSize: 12 }}>lat === 0 &amp;&amp; lng === 0</span>{' '}
        are explicitly rejected — this is a common GPS cold-start artifact where the device hasn't
        acquired a fix yet. Storing zero-coordinates would snap buses to the Gulf of Guinea on the client map.
      </WarnBlock>
    </>
  )
}

function BeApiSection({ platform }: { platform: Platform }) {
  const platLabel = platform === 'web' ? 'React + Vite' : 'React Native'
  return (
    <>
      <div className="eng-eyebrow">Backend</div>
      <div className="eng-title">REST API Routes <Badge type="rest">REST</Badge></div>
      <p className="eng-subtitle">
        Express routers mounted under <span className="eng-inline-code">/api</span>. Coordinates always arrive via Socket.IO, never REST. Clients poll REST every 30s for metadata.
      </p>
      <div style={{ marginBottom: 24 }}>
        <div className="eng-sub-label" style={{ marginBottom: 10 }}>Drivers</div>
        <EndpointRow method="GET"  path="/api/drivers/drivers" desc="All active drivers + route assignments" />
        <EndpointRow method="GET"  path="/api/drivers/:id"     desc="Single driver by driverID" />
        <EndpointRow method="POST" path="/api/drivers"         desc="Create new driver record" />
        <EndpointRow method="PUT"  path="/api/drivers/:id"     desc="Update driver (assign deviceId, busRoute)" />
        <div className="eng-sub-label" style={{ margin: '16px 0 10px' }}>Auth</div>
        <EndpointRow method="POST" path="/api/auth/driver/login"  desc="Driver login → JWT" />
        <EndpointRow method="POST" path="/api/auth/user/login"    desc="Passenger login → JWT" />
        <EndpointRow method="POST" path="/api/auth/user/register" desc="Passenger registration" />
        <div className="eng-sub-label" style={{ margin: '16px 0 10px' }}>Locations & Misc</div>
        <EndpointRow method="GET" path="/api/locations" desc="Route stop coordinates" />
        <EndpointRow method="GET" path="/api/bites"     desc="Bites feature data" />
        <EndpointRow method="GET" path="/api/docs"      desc="Scalar interactive API docs" />
      </div>
      <div className="eng-sub-label" style={{ marginBottom: 8 }}>
        30s Poll — <span style={{ color: platform === 'web' ? '#60a5fa' : '#34c759' }}>{platLabel}</span>
      </div>
      <CodeBlock lang={platLabel} file={platform === 'web' ? 'src/hooks/useDrivers.ts' : 'hooks/useDrivers.ts'} html={platform === 'web' ? CODE.pollWeb : CODE.pollRn} />
      <DecisionBlock label="Why coordinates via Socket.IO, not polling REST?">
        GPS updates arrive every ~2 seconds per bus. Polling REST at that rate for every connected
        passenger would be prohibitively expensive. Socket.IO broadcasts push a single payload to all
        connected clients simultaneously — O(1) fan-out regardless of passenger count.
      </DecisionBlock>
    </>
  )
}

function BeDriversSection() {
  return (
    <>
      <div className="eng-eyebrow">Backend</div>
      <div className="eng-title">Driver Management <Badge type="rest">REST</Badge></div>
      <p className="eng-subtitle">
        Each GPS device is mapped to a driver record in MongoDB. The driver document links a{' '}
        <span className="eng-inline-code">deviceId</span> (Traccar unique ID) to a{' '}
        <span className="eng-inline-code">busRoute</span>. This bridges raw hardware to named routes.
      </p>
      <div className="eng-metrics-row">
        <MetricCard label="Store" value="MongoDB" sub="DriverModel" />
        <MetricCard label="Cache" value="In-memory Map" sub="deviceId → driverID" />
        <MetricCard label="Rebuild" value="On boot" sub="buildDeviceDriverMapping()" />
      </div>
      <DeviceDriverChainDemo />
      <CodeBlock lang="JavaScript" file="models/driver.js — Driver schema" html={CODE.driverSchemaFull} />
      <CodeBlock lang="JavaScript" file="models/bus.js — Bus schema" html={CODE.busSchema} />
      <CodeBlock lang="JavaScript" file="mqtt-tracker.js — buildDeviceDriverMapping()" html={CODE.buildMapping} />
      <DecisionBlock label="Why an in-memory map?">
        Every MQTT message needs to resolve a hardware <span className="eng-inline-code">deviceId</span> to
        a named driver and route. A MongoDB query per GPS update would add 5–10ms per bus per second.
        The in-memory map makes this O(1) and is rebuilt from MongoDB on every server boot.
      </DecisionBlock>
      <WarnBlock label="sparse: true on deviceId">
        Without <span className="eng-inline-code">sparse: true</span>, MongoDB enforces the unique index
        even on null/undefined values — meaning only one driver can have no device assigned.{' '}
        <span className="eng-inline-code">sparse: true</span> skips null entries from the index entirely.
      </WarnBlock>
    </>
  )
}

function ArchStackSection() {
  return (
    <>
      <div className="eng-eyebrow">Architecture</div>
      <div className="eng-title">Stack <Badge type="system">SYSTEM</Badge></div>
      <p className="eng-subtitle">Full-stack TypeScript/JavaScript. GPS hardware communicates through Traccar, not directly to the server.</p>
      <div className="eng-flow">
        <span className="eng-flow-node orange">GPS Hardware</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node blue">Traccar</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node blue">MQTT Bridge</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node green">Node.js API</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node green">Socket.IO</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node">Clients</span>
      </div>
      <div className="eng-metrics-row">
        <MetricCard label="Backend" value="Node.js" sub="Express + Socket.IO" />
        <MetricCard label="Database" value="MongoDB" sub="+ Redis" />
        <MetricCard label="Maps" value="Mapbox GL" sub="React + RN" />
      </div>
      <CodeBlock lang="Text" file="Tech stack summary" plain={CODE.archStackText} />
      <CodeBlock lang="TypeScript" file="hooks/useSimpleIntegratedDrivers.ts — 30s API poll" html={CODE.archIntegrated} />
    </>
  )
}

function ArchDataSection() {
  return (
    <>
      <div className="eng-eyebrow">Architecture</div>
      <div className="eng-title">Data Structures <Badge type="system">SYSTEM</Badge></div>
      <p className="eng-subtitle">Core in-memory structures on the server. All rebuilt from MongoDB on boot and kept in sync via MQTT messages.</p>
      <CodeBlock lang="TypeScript" file="types/device.ts — runtime shapes" html={CODE.deviceType} />
      <CodeBlock lang="TypeScript" file="types/driver.ts — MongoDB document" html={CODE.driverType} />
      <CodeBlock lang="TypeScript" file="types/integrated-driver.ts — merged client shape" html={CODE.integratedDriverType} />
    </>
  )
}

function RtMqttSection() {
  return (
    <>
      <div className="eng-eyebrow">Real-time Layer</div>
      <div className="eng-title">MQTT Communication <Badge type="mqtt">MQTT</Badge></div>
      <p className="eng-subtitle">Every GPS update triggers the pipeline: parse → validate → deduplicate → throttle → broadcast.</p>
      <div className="eng-flow">
        <span className="eng-flow-node blue">MQTT message</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node">Parse JSON</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node orange">Validate coords</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node">Update deviceMap</span>
        <span className="eng-flow-arrow">→</span>
        <span className="eng-flow-node green">Socket.IO emit</span>
      </div>
      <ConnectionStateMachineDemo />
      <CodeBlock lang="TypeScript" file="hooks/useMQTTBuses.ts — Socket.IO client" html={CODE.rtMqttClient} />
      <CodeBlock lang="JavaScript" file="mqtt-tracker.js — message handler" html={CODE.mqttHandler} />
      <DecisionBlock label="Throttle vs debounce?">
        Throttle (emit at most once/sec) is used rather than debounce. With multiple buses broadcasting
        simultaneously, debounce would delay the emit until all buses go silent — throttle guarantees
        passengers see an update within 1 second of any bus moving.
      </DecisionBlock>
    </>
  )
}

function RtDriverSection() {
  return (
    <>
      <div className="eng-eyebrow">Real-time Layer</div>
      <div className="eng-title">Driver Tracking Logic <Badge type="mqtt">MQTT</Badge></div>
      <p className="eng-subtitle">On the client, each incoming position payload is matched to a known driver, then interpolated for smooth map movement between GPS updates.</p>
      <div className="eng-metrics-row">
        <MetricCard label="GPS interval" value="~2" unit="s" />
        <MetricCard label="Render rate" value="60" unit="fps" />
        <MetricCard label="Smoothing" value="EMA" sub="α = 0.24" />
      </div>
      <MQTTMergeDemo />
      <CodeBlock lang="TypeScript" file="hooks/useIntegratedDrivers.ts — merge()" html={CODE.rtDriverMerge} />
      <DecisionBlock label="Why EMA over raw GPS?">
        Raw GPS coordinates from cheap hardware jitter ±3–8 metres between consecutive readings even when
        the bus is stationary. EMA smoothing eliminates the visual jitter while keeping the displayed
        position within one bus-length of ground truth.
      </DecisionBlock>
    </>
  )
}

function RtWsSection() {
  return (
    <>
      <div className="eng-eyebrow">Real-time Layer</div>
      <div className="eng-title">WebSocket Events <Badge type="mqtt">MQTT</Badge></div>
      <p className="eng-subtitle">Socket.IO events flowing between server and clients. The server emits; clients listen. No client-to-server real-time events in v1.</p>
      <OperatingHoursDemo />
      <CodeBlock lang="TypeScript" file="Socket.IO event catalogue" html={CODE.wsEvents} />
      <CodeBlock lang="TypeScript" file="hooks/useSocketEvents.ts — listener pattern" html={CODE.socketListener} />
    </>
  )
}

function LocGpsSection() {
  return (
    <>
      <div className="eng-eyebrow">Location Engine</div>
      <div className="eng-title">GPS Processing <Badge type="algo">ALGO</Badge></div>
      <p className="eng-subtitle">Raw GPS data from Traccar is normalised, validated, and smoothed before being stored in the device map.</p>
      <div className="eng-metrics-row">
        <MetricCard label="Update rate" value="~2" unit="s" />
        <MetricCard label="Accuracy" value="±3–8" unit="m" />
        <MetricCard label="Position α" value="0.24" sub="24% new, 76% history" />
      </div>
      <EMAFilterDemo />
      <CodeBlock lang="TypeScript" file="hooks/useSmoothedIncoming.ts — EMA with heading" html={CODE.locGpsSmoothed} />
      <CodeBlock lang="JavaScript" file="services/gps-processor.js — validation pipeline" html={CODE.gpsProcessor} />
    </>
  )
}

function LocRouteSection() {
  return (
    <>
      <div className="eng-eyebrow">Location Engine</div>
      <div className="eng-title">Route Projection <Badge type="algo">ALGO</Badge></div>
      <p className="eng-subtitle">Given a raw GPS coordinate, the nearest point on the route polyline is computed to keep the bus marker visually on the road.</p>
      <div className="eng-metrics-row">
        <MetricCard label="Max step" value="180" unit="m" sub="MAX_PROGRESS_STEP_M" />
        <MetricCard label="Backtrack" value="40" unit="m" sub="BACKTRACK_BUFFER_M" />
        <MetricCard label="Off-route" value="80" unit="m" sub="threshold" />
      </div>
      <RouteSnapDemo />
      <CodeBlock lang="TypeScript" file="algorithms/route-projection.ts — nearest-point" html={CODE.routeProjection} />
      <CodeBlock lang="TypeScript" file="hooks/useRouteSnap.ts — progress constants" html={CODE.locRouteSnap} />
      <DecisionBlock label="Why progress limits?">
        Without <span className="eng-inline-code">MAX_PROGRESS_STEP_M</span>, a single errant GPS reading
        could teleport the snapped position hundreds of metres forward. The 180m cap ensures the bus can
        only advance at a realistic speed even with bad GPS data.
      </DecisionBlock>
      <WarnBlock label="Off-route threshold">
        If the nearest point on the route is more than 80m from the raw GPS position, the bus is
        considered off-route. Route projection is suspended and raw GPS is used directly until the
        bus re-enters the 80m corridor.
      </WarnBlock>
    </>
  )
}

function LocDrSection() {
  return (
    <>
      <div className="eng-eyebrow">Location Engine</div>
      <div className="eng-title">Dead Reckoning <Badge type="algo">ALGO</Badge></div>
      <p className="eng-subtitle">When GPS updates stop, the last known speed and heading are extrapolated forward for up to 60 seconds before the bus is shown as stale.</p>
      <div className="eng-metrics-row">
        <MetricCard label="Max reckoning" value="60" unit="s" />
        <MetricCard label="Stale threshold" value="2" unit="s" />
        <MetricCard label="Speed decay" value="slowFactor" sub="linear to zero" />
      </div>
      <DeadReckoningDemo />
      <CodeBlock lang="TypeScript" file="hooks/useDeadReckoning.ts — rAF tick" html={CODE.locDrTick} />
      <CodeBlock lang="TypeScript" file="algorithms/dead-reckoning.ts — base calculation" html={CODE.deadReckoning} />
      <DecisionBlock label="Why slowFactor speed decay?">
        Dead reckoning errors compound over time. By gradually reducing effective speed toward zero,
        the predicted position decelerates gracefully rather than continuing at full speed — this
        looks physically plausible even when the extrapolation is no longer accurate.
      </DecisionBlock>
    </>
  )
}

function MovInterpSection() {
  return (
    <>
      <div className="eng-eyebrow">Movement Engine</div>
      <div className="eng-title">Bus Interpolation <Badge type="engine">ENGINE</Badge></div>
      <p className="eng-subtitle">GPS updates arrive every ~2 seconds but the map renders at 60fps. A requestAnimationFrame loop interpolates the bus marker between GPS positions using cubic easing.</p>
      <div className="eng-metrics-row">
        <MetricCard label="Base duration" value="1400" unit="ms" />
        <MetricCard label="Min" value="700" unit="ms" />
        <MetricCard label="Max" value="2400" unit="ms" />
      </div>
      <CubicEaseDemo />
      <CodeBlock lang="TypeScript" file="hooks/useSmoothPosition.ts — cubic ease + speed-aware duration" html={CODE.movInterpEase} />
      <CodeBlock lang="TypeScript" file="hooks/useBusInterpolation.ts — rAF loop" html={CODE.interpolation} />
      <DecisionBlock label="Why cubic ease over linear?">
        Linear interpolation makes buses visually snap and coast at constant speed — unnatural for a
        vehicle starting and stopping. Cubic ease-in-out makes the bus appear to accelerate from a stop
        and decelerate to the next reported position, which matches observed bus behaviour.
      </DecisionBlock>
    </>
  )
}

function MovMatchSection() {
  return (
    <>
      <div className="eng-eyebrow">Movement Engine</div>
      <div className="eng-title">Route Matching <Badge type="engine">ENGINE</Badge></div>
      <p className="eng-subtitle">Each GPS device is assigned a <span className="eng-inline-code">busRoute</span> in the driver record. The server resolves the route polyline for that device on every MQTT update.</p>
      <DirectionClassifierDemo />
      <CodeBlock lang="TypeScript" file="algorithms/heading-classifier.ts — isHeadingTowardStart" html={CODE.movMatchBearing} />
      <CodeBlock lang="JavaScript" file="services/route-matcher.js — deviceId → polyline" html={CODE.routeMatcher} />
      <DecisionBlock label="Static route polylines">
        KNUST campus routes are fixed — buses follow the same physical roads every day. Storing route
        polylines as static JSON (not in the database) means no DB query is needed during GPS processing,
        and the polylines are always available even if MongoDB is temporarily unreachable.
      </DecisionBlock>
    </>
  )
}

function MovStateSection() {
  return (
    <>
      <div className="eng-eyebrow">Movement Engine</div>
      <div className="eng-title">Tracking State <Badge type="engine">ENGINE</Badge></div>
      <p className="eng-subtitle">The client tracks each bus through a state machine: idle → tracking → arriving → arrived. State transitions drive UI changes and notification triggers.</p>
      <StopArrivalDemo />
      <CodeBlock lang="TypeScript" file="hooks/useTrackingState.ts — state machine" html={CODE.trackingStateMachine} />
      <CodeBlock lang="TypeScript" file="hooks/useStopArrival.ts — priority logic" html={CODE.movStateArrival} />
      <WarnBlock label="Threshold tuning">
        The 150m arriving threshold was calibrated to give exactly ~30 seconds of warning at average
        KNUST campus bus speed (18 km/h). Too large triggers too many false notifications; too small
        gives passengers no time to move to the stop.
      </WarnBlock>
    </>
  )
}

function NotifEngineSection() {
  return (
    <>
      <div className="eng-eyebrow">Notifications</div>
      <div className="eng-title">Notification Engine <Badge type="rest">REST</Badge></div>
      <p className="eng-subtitle">Passenger notifications are fired client-side when the tracking state transitions to <span className="eng-inline-code">arriving</span>. No server push needed.</p>
      <NotifDedupDemo />
      <CodeBlock lang="TypeScript" file="hooks/useNotifications.ts — dedup guard" html={CODE.notifDedup} />
      <CodeBlock lang="TypeScript" file="hooks/useNotifications.ts — state trigger" html={CODE.notifHook} />
      <DecisionBlock label="Why client-side notifications?">
        The server does not know which passengers are waiting at which stop — that state lives only in the
        client session. Pushing from the server would require server-side session tracking (expensive) or
        WebPush subscriptions (complex). Client-side is simpler and just as reliable.
      </DecisionBlock>
    </>
  )
}

function NotifSoundSection() {
  return (
    <>
      <div className="eng-eyebrow">Notifications</div>
      <div className="eng-title">Sound Feedback <Badge type="engine">ENGINE</Badge></div>
      <p className="eng-subtitle">Audio cues are generated programmatically via the Web Audio API — no audio file to bundle. Brake sound fires on arriving; departure tone fires when the bus leaves a stop.</p>
      <SoundFeedbackDemo />
      <CodeBlock lang="TypeScript" file="utils/sound.ts — sawtooth brake sound" html={CODE.notifBrake} />
      <CodeBlock lang="TypeScript" file="utils/sound.ts — arrival tone" html={CODE.soundFeedback} />
      <DecisionBlock label="Why sawtooth for brake?">
        A sawtooth wave has rich harmonics that produce a harsh, buzzy texture — closer to the physical
        sensation of a bus slowing down than a pure sine wave. The 420→120Hz sweep mimics the pitch drop
        of a decelerating engine.
      </DecisionBlock>
    </>
  )
}

function EdgeOffrouteSection() {
  return (
    <>
      <div className="eng-eyebrow">Edge Cases</div>
      <div className="eng-title">Off-route Handling <Badge type="algo">ALGO</Badge></div>
      <p className="eng-subtitle">Buses can temporarily leave their assigned route. The system detects off-route conditions and degrades gracefully rather than snapping the marker to a nonsensical position.</p>
      <div className="eng-metrics-row">
        <MetricCard label="Corridor" value="80" unit="m" />
        <MetricCard label="Snap off" value="Immediate" />
        <MetricCard label="Opacity" value="40%" sub="off-route bus" />
      </div>
      <GeofenceStatusDemo />
      <CodeBlock lang="TypeScript" file="algorithms/off-route-detector.ts" html={CODE.offRouteDetector} />
      <CodeBlock lang="TypeScript" file="hooks/useLastKnown.ts — position fallback" html={CODE.edgeLastKnown} />
      <DecisionBlock label="Why 80m threshold?">
        KNUST roads typically have 5–10m of GPS error margin. 80m gives 3× slack for road width,
        parked vehicle detours, and GPS multipath in built-up areas while still detecting genuine
        off-route situations like a driver taking an alternative path.
      </DecisionBlock>
      <WarnBlock label="Last-known position fallback">
        When a bus momentarily drops from the MQTT stream mid-route, the last known coordinates are
        held and the bus is rendered at 40% opacity. Without this, the bus marker would vanish and
        re-appear — disorienting for passengers watching the map.
      </WarnBlock>
    </>
  )
}

function EdgePerfSection() {
  return (
    <>
      <div className="eng-eyebrow">Edge Cases</div>
      <div className="eng-title">Performance <Badge type="system">SYSTEM</Badge></div>
      <p className="eng-subtitle">Key performance decisions to keep the system responsive under KNUST conditions: 10–20 concurrent buses, 200+ simultaneous passenger connections.</p>
      <div className="eng-metrics-row">
        <MetricCard label="Max buses" value="20" sub="tested concurrent" />
        <MetricCard label="Clients" value="200+" sub="Socket.IO connections" />
        <MetricCard label="Broadcast" value="1" unit="/s" />
      </div>
      <CodeBlock lang="Text" file="Performance audit — key decisions" plain={CODE.perfAudit} />
    </>
  )
}

function TestScenariosSection() {
  return (
    <>
      <div className="eng-eyebrow">Testing</div>
      <div className="eng-title">Testing Scenarios <Badge type="system">SYSTEM</Badge></div>
      <p className="eng-subtitle">Core scenarios validated during development. Hardware GPS testing was done on the KNUST campus; edge cases were simulated by replaying recorded position logs.</p>
      <CodeBlock lang="Text" file="test-matrix.md — scenario → trigger → expected" plain={CODE.testMatrix} />
      <CodeBlock lang="Text" file="test-scenarios.md — validated cases" plain={CODE.testScenarios} />
    </>
  )
}

function TestSimSection() {
  return (
    <>
      <div className="eng-eyebrow">Testing</div>
      <div className="eng-title">Route Simulations <Badge type="algo">ALGO</Badge></div>
      <p className="eng-subtitle">A position log replay tool was built to test the full pipeline without physical GPS hardware. Recorded NMEA sequences are replayed at configurable speed.</p>
      <CodeBlock lang="JavaScript" file="tools/replay-positions.js" html={CODE.replayTool} />
      <CodeBlock lang="TypeScript" file="utils/service-hours.ts — getParkedServiceMessage()" html={CODE.testResume} />
      <DecisionBlock label="Replay-based testing over mocking">
        Mocking the MQTT layer would miss real-world issues like burst messages, out-of-order delivery,
        and the interaction between throttling and GPS update timing. Replaying actual captured logs
        exercises the full pipeline with realistic timing.
      </DecisionBlock>
    </>
  )
}

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV_GROUPS: { id: GroupId; label: string; children: { id: SectionId; label: string; badge: React.ReactNode }[] }[] = [
  { id: 'backend', label: 'Backend', children: [
    { id: 'be-server',  label: 'Server Overview',   badge: <Badge type="system">NODE</Badge> },
    { id: 'be-mqtt',    label: 'MQTT Bridge',        badge: <Badge type="mqtt">MQTT</Badge> },
    { id: 'be-api',     label: 'REST API Routes',    badge: <Badge type="rest">REST</Badge> },
    { id: 'be-drivers', label: 'Driver Management',  badge: <Badge type="rest">REST</Badge> },
  ]},
  { id: 'arch', label: 'Architecture', children: [
    { id: 'arch-stack', label: 'Stack',            badge: <Badge type="system">SYSTEM</Badge> },
    { id: 'arch-data',  label: 'Data Structures',  badge: <Badge type="system">SYSTEM</Badge> },
  ]},
  { id: 'rt', label: 'Real-time Layer', children: [
    { id: 'rt-mqtt',   label: 'MQTT Communication',    badge: <Badge type="mqtt">MQTT</Badge> },
    { id: 'rt-driver', label: 'Driver Tracking Logic', badge: <Badge type="mqtt">MQTT</Badge> },
    { id: 'rt-ws',     label: 'WebSocket Events',      badge: <Badge type="mqtt">MQTT</Badge> },
  ]},
  { id: 'loc', label: 'Location Engine', children: [
    { id: 'loc-gps',   label: 'GPS Processing',   badge: <Badge type="algo">ALGO</Badge> },
    { id: 'loc-route', label: 'Route Projection', badge: <Badge type="algo">ALGO</Badge> },
    { id: 'loc-dr',    label: 'Dead Reckoning',   badge: <Badge type="algo">ALGO</Badge> },
  ]},
  { id: 'mov', label: 'Movement Engine', children: [
    { id: 'mov-interp', label: 'Bus Interpolation', badge: <Badge type="engine">ENGINE</Badge> },
    { id: 'mov-match',  label: 'Route Matching',    badge: <Badge type="engine">ENGINE</Badge> },
    { id: 'mov-state',  label: 'Tracking State',    badge: <Badge type="engine">ENGINE</Badge> },
  ]},
  { id: 'notif', label: 'Notifications', children: [
    { id: 'notif-engine', label: 'Notification Engine', badge: <Badge type="rest">REST</Badge> },
    { id: 'notif-sound',  label: 'Sound Feedback',      badge: <Badge type="engine">ENGINE</Badge> },
  ]},
  { id: 'edge', label: 'Edge Cases', children: [
    { id: 'edge-offroute', label: 'Off-route Handling', badge: <Badge type="algo">ALGO</Badge> },
    { id: 'edge-perf',     label: 'Performance',        badge: <Badge type="system">SYSTEM</Badge> },
  ]},
  { id: 'test', label: 'Testing', children: [
    { id: 'test-scenarios', label: 'Testing Scenarios', badge: <Badge type="system">SYSTEM</Badge> },
    { id: 'test-sim',       label: 'Route Simulations', badge: <Badge type="algo">ALGO</Badge> },
  ]},
]

function renderSection(id: SectionId, platform: Platform, setPlatform: (p: Platform) => void) {
  switch (id) {
    case 'intro':          return <IntroSection platform={platform} setPlatform={setPlatform} />
    case 'be-server':      return <BeServerSection platform={platform} />
    case 'be-mqtt':        return <BeMqttSection />
    case 'be-api':         return <BeApiSection platform={platform} />
    case 'be-drivers':     return <BeDriversSection />
    case 'arch-stack':     return <ArchStackSection />
    case 'arch-data':      return <ArchDataSection />
    case 'rt-mqtt':        return <RtMqttSection />
    case 'rt-driver':      return <RtDriverSection />
    case 'rt-ws':          return <RtWsSection />
    case 'loc-gps':        return <LocGpsSection />
    case 'loc-route':      return <LocRouteSection />
    case 'loc-dr':         return <LocDrSection />
    case 'mov-interp':     return <MovInterpSection />
    case 'mov-match':      return <MovMatchSection />
    case 'mov-state':      return <MovStateSection />
    case 'notif-engine':   return <NotifEngineSection />
    case 'notif-sound':    return <NotifSoundSection />
    case 'edge-offroute':  return <EdgeOffrouteSection />
    case 'edge-perf':      return <EdgePerfSection />
    case 'test-scenarios': return <TestScenariosSection />
    case 'test-sim':       return <TestSimSection />
  }
}

// ── Root component ────────────────────────────────────────────────────────────

export default function EngineeringSection({ onScrollUpAtTop }: { onScrollUpAtTop?: () => void }) {
  const [activeSection, setActiveSection] = useState<SectionId>('intro')
  const [openGroups, setOpenGroups] = useState<Set<GroupId>>(new Set(['backend']))
  const [platform, setPlatform] = useState<Platform>('web')
  const mainPanelRef = useRef<HTMLElement>(null)
  const sidebarNavRef = useRef<HTMLElement>(null)
  const backHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onScrollUpAtTop) return
    const THRESHOLD = 360
    let accum = 0
    let fired = false

    const onWheel = (e: WheelEvent) => {
      if (fired) return
      const panelAtTop = !mainPanelRef.current || mainPanelRef.current.scrollTop <= 0
      const sidebarAtTop = !sidebarNavRef.current || sidebarNavRef.current.scrollTop <= 0

      if (e.deltaY < 0 && panelAtTop && sidebarAtTop) {
        accum += Math.abs(e.deltaY)
        const p = Math.min(accum / THRESHOLD, 1)
        if (backHintRef.current) {
          backHintRef.current.style.opacity = p.toFixed(3)
          backHintRef.current.style.transform = `translateX(-50%) translateY(${((p - 1) * 100).toFixed(1)}%)`
        }
        if (accum >= THRESHOLD) {
          fired = true
          onScrollUpAtTop()
        }
      } else if (e.deltaY > 0) {
        accum = 0
        if (backHintRef.current) {
          backHintRef.current.style.opacity = '0'
          backHintRef.current.style.transform = 'translateX(-50%) translateY(-100%)'
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [onScrollUpAtTop])

  const toggleGroup = useCallback((id: GroupId) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const navigate = useCallback((id: SectionId) => {
    setActiveSection(id)
    for (const g of NAV_GROUPS) {
      if (g.children.some(c => c.id === id)) {
        setOpenGroups(prev => new Set([...prev, g.id]))
        break
      }
    }
  }, [])

  const ALL_SECTION_IDS: SectionId[] = ['intro', ...NAV_GROUPS.flatMap(g => g.children.map(c => c.id))]

  return (
    <div className="eng-section">
      {/* Pull-back-to-Design indicator — slides down from top as user scrolls up */}
      <div ref={backHintRef} className="eng-back-hint" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Design
      </div>

      {/* Dynamic Island */}
      <div className="eng-island">
        <span style={{ width: 16, height: 16, background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>⚙</span>
        <span className="eng-island-label">ShuttleApp</span>
        <span className="eng-island-sep">·</span>
        <span className="eng-island-value">Engineering · v1.0.0</span>
        <div className="eng-waveform"><span /><span /><span /><span /><span /></div>
      </div>

      {/* Main layout */}
      <div className="eng-layout">
        {/* Sidebar */}
        <div className="eng-sidebar">
          <div className="eng-search-box">
            <div className="eng-search-inner">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input type="text" placeholder="Search" readOnly />
              <span className="eng-kbd">⌘ K</span>
            </div>
          </div>
          <nav className="eng-sidebar-nav" ref={sidebarNavRef as React.RefObject<HTMLElement>}>
            <div
              className={`eng-nav-intro${activeSection === 'intro' ? ' active' : ''}`}
              onClick={() => setActiveSection('intro')}
            >
              Introduction
            </div>
            {NAV_GROUPS.map(group => (
              <div className="eng-nav-group" key={group.id}>
                <div
                  className={`eng-nav-group-header${openGroups.has(group.id) ? ' open' : ''}`}
                  onClick={() => toggleGroup(group.id)}
                >
                  <span>{group.label}</span>
                  <svg className="eng-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={`eng-nav-children${openGroups.has(group.id) ? ' open' : ''}`}>
                  {group.children.map(child => (
                    <div
                      key={child.id}
                      className={`eng-nav-child${activeSection === child.id ? ' active' : ''}`}
                      onClick={() => navigate(child.id)}
                    >
                      <span>{child.label}</span>
                      {child.badge}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="eng-sidebar-footer">
            <button className="eng-api-client-btn">↗ Open API Client</button>
            <span className="eng-scalar-tag">Powered by Prince</span>
          </div>
        </div>

        {/* Main panel */}
        <main className="eng-main-panel" ref={mainPanelRef as React.RefObject<HTMLElement>}>
          {ALL_SECTION_IDS.map(id => (
            <div key={id} className={`eng-content-section${activeSection === id ? ' active' : ''}`}>
              {renderSection(id, platform, setPlatform)}
            </div>
          ))}
        </main>
      </div>

      {/* Tab bar */}
      <div className="eng-tab-bar">
        <div className="eng-tab-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          Product
        </div>
        <div className="eng-tab-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Design
        </div>
        <div className="eng-tab-item active engineering">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3-3 3 3 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Engineering
        </div>
      </div>
    </div>
  )
}
