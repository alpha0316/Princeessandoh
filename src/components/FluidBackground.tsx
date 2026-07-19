import { useEffect, useRef } from 'react'
import { mouse, decayMouse, initMouseTracking } from '../stores/mouse'

// ── Cursor interaction tunables (DotField-style scatter, in fluid form) ──
// World units: the viewport height spans ≈ 2.2 units in shader space.
const RADIUS = 0.55      // cursor influence radius
const PUSH = 0.22        // how far the fluid pattern is shoved away from the cursor
const BASE_VIVID = 1.0   // vein intensity when idle (1 = the untouched marble look)
const HOVER_VIVID = 1.5  // vein intensity near the cursor (>1 deepens the veins)
const EASE = 0.1         // smoothing for cursor follow + settle-back (lower = more lag)

// ── Bow-wave shape — like a boat through water, the influence is not a
// circle: short and intense ahead of travel, a long soft wake behind.
const FRONT = 0.65       // reach ahead of travel, as a fraction of RADIUS (the bow)
const BACK = 2.1         // reach behind travel (the trailing wake)
const SIDE = 1.0         // lateral reach
const BOW = 0.9          // extra push strength at the leading edge (the collision)

const VS = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FS = `
precision highp float;
varying vec2 vUv;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uHover;
uniform vec2  uVel;
uniform float uAniso;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i+vec2(1,0)), u.x),
    mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i=0; i<7; i++) {
    v += a * noise(p);
    p  = rot * p * 2.01;
    a *= 0.52;
  }
  return v;
}

float fluid(vec2 p) {
  float t = uTime;
  // Brisk and turbulent by default: quick time drift plus strong
  // domain-warp coefficients for busy, disturbed marble veins.
  vec2 q = vec2(
    fbm(p + vec2(0.00, 0.00) + t * 0.052),
    fbm(p + vec2(5.20, 1.30) + t * 0.042)
  );
  vec2 r = vec2(
    fbm(p + 6.6*q + vec2(1.70, 9.20) + t * 0.074),
    fbm(p + 6.6*q + vec2(8.30, 2.80) + t * 0.060)
  );
  return fbm(p + 5.8*r);
}

// ── Marble palette — off-white with soft blue-grey / warm-beige veins ──
vec3 pal(float t) {
  t = clamp(t, 0.0, 1.0);
  t = t * t * (3.0 - 2.0*t);

  vec3 white     = vec3(0.969, 0.965, 0.984);
  vec3 blueGrey  = vec3(0.804, 0.827, 0.902);
  vec3 warmBeige = vec3(0.925, 0.890, 0.847);
  vec3 deepBlue  = vec3(0.663, 0.706, 0.851);

  // Slow mood drift between the cool and warm veins, kept subtle so the
  // surface stays light and marble-like rather than a solid color wash.
  float drift = 0.5 + 0.5 * sin(uTime * 0.05);
  vec3 midA = mix(blueGrey, warmBeige, drift);
  vec3 midB = mix(warmBeige, deepBlue, drift);

  vec3 c0 = white;
  vec3 c1 = mix(white, midA, 0.58);
  vec3 c2 = mix(white, midB, 0.64);
  vec3 c3 = mix(white, deepBlue, 0.44);

  if (t < 0.33) return mix(c0, c1, t/0.33);
  if (t < 0.66) return mix(c1, c2, (t-0.33)/0.33);
                return mix(c2, c3, (t-0.66)/0.34);
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;
  vec2 p  = (uv - 0.5) * vec2(aspect, 1.0) * 2.2;

  vec2 mUv  = vec2(uMouse.x - 0.5, -(uMouse.y - 0.5)) * vec2(aspect, 1.0) * 2.2;
  vec2 diff = p - mUv;
  float dist = length(diff);

  // ── Bow-wave scatter — the influence region is stretched along the
  // cursor's direction of travel: compressed ahead (the bow, where the
  // collision happens) and drawn out behind (the wake). uAniso fades
  // the shape back to a plain circle when the pointer is still ──────
  vec2 vel = vec2(uVel.x * aspect, -uVel.y) * 2.2;
  vec2 travel = vel / (length(vel) + 0.0001);
  float along = dot(diff, travel);
  float across = length(diff - along * travel);
  float reach = along > 0.0 ? ${FRONT.toFixed(4)} : ${BACK.toFixed(4)};
  float dAniso = length(vec2(across / ${SIDE.toFixed(4)}, along / reach));
  float dEff = mix(dist, dAniso, uAniso);

  float falloff = 0.0;
  if (dEff < ${RADIUS.toFixed(4)}) {
    float t = 1.0 - dEff / ${RADIUS.toFixed(4)};
    falloff = t * t * (3.0 - 2.0 * t);
  }
  // Push radially away, hitting harder on the leading edge — the water
  // parting at the bow — and easing off into the trailing wake.
  vec2 dir = diff / max(dist, 0.001);
  float bow = 1.0 + ${BOW.toFixed(4)} * uAniso * clamp(along / ${RADIUS.toFixed(4)}, 0.0, 1.0);
  p -= dir * ${PUSH.toFixed(4)} * falloff * bow * uHover;

  float f = fluid(p * 1.05);
  f = smoothstep(0.08, 0.92, f);

  vec3 col = pal(f);

  // ── Proximity vividness — the opacity boost from the dot-field
  // reference, mapped to vein intensity: the marble deepens near the
  // cursor and relaxes back to its idle look as uHover eases out ────
  vec3 quiet = vec3(0.969, 0.965, 0.984);
  float vivid = ${BASE_VIVID.toFixed(4)} + (${HOVER_VIVID.toFixed(4)} - ${BASE_VIVID.toFixed(4)}) * falloff * uHover;
  col = clamp(mix(quiet, col, vivid), 0.0, 1.0);

  float vig = length(uv - 0.5) * 0.55;
  col = mix(col, vec3(0.969, 0.965, 0.984), vig * vig * 0.5);

  float leftFade = smoothstep(0.0, 0.45, uv.x);
  col = mix(vec3(0.969, 0.965, 0.984), col, leftFade * 0.5 + 0.5);

  // ── Top-to-bottom fade — the marble reads strongest in the upper
  // half of the screen and settles into a flat, quiet surface toward
  // the bottom, so it doesn't compete with content further down ─────
  float verticalFade = smoothstep(0.0, 0.6, uv.y);
  col = mix(vec3(0.969, 0.965, 0.984), col, verticalFade);

  gl_FragColor = vec4(col, 1.0);
}`

function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2') as WebGLRenderingContext
    if (!gl) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, mkShader(gl, gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, mkShader(gl, gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uHover = gl.getUniformLocation(prog, 'uHover')
    const uVel = gl.getUniformLocation(prog, 'uVel')
    const uAniso = gl.getUniformLocation(prog, 'uAniso')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)
    const stopMouseTracking = initMouseTracking()

    // Eased cursor state — the shader always receives the smoothed values,
    // so the scatter lags gently behind the pointer and settles back on its
    // own once the cursor leaves (uHover eases toward 0).
    const eased = { x: mouse.nx, y: mouse.ny, hover: 0, vx: 0, vy: 0 }
    let pointerInside = false
    const onEnter = () => { pointerInside = true }
    const onLeave = () => { pointerInside = false }
    window.addEventListener('pointermove', onEnter)
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    let id: number
    const loop = (now: number) => {
      id = requestAnimationFrame(loop)
      decayMouse()
      // mouse.strength keeps the effect alive on mobile (tilt/shake input),
      // where there is no hovering pointer.
      const hoverTarget = Math.max(pointerInside ? 1 : 0, Math.min(mouse.strength, 1))
      eased.hover += (hoverTarget - eased.hover) * EASE
      eased.x += (mouse.nx - eased.x) * EASE
      eased.y += (mouse.ny - eased.y) * EASE
      eased.vx += (mouse.vx - eased.vx) * EASE
      eased.vy += (mouse.vy - eased.vy) * EASE
      // Anisotropy tracks travel speed: still pointer = circular influence,
      // moving pointer = bow-wave oval stretched along its path.
      const speed = Math.hypot(eased.vx, eased.vy)
      const aniso = Math.min(speed / 0.4, 1)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, now * 0.001)
      gl.uniform2f(uMouse, eased.x, eased.y)
      gl.uniform1f(uHover, eased.hover)
      gl.uniform2f(uVel, eased.vx, eased.vy)
      gl.uniform1f(uAniso, aniso)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    id = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onEnter)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      stopMouseTracking()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fluid-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: 0,
      }}
    />
  )
}
