import { useEffect, useRef } from 'react'
import { mouse, decayMouse, initMouseTracking } from '../stores/mouse'

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
uniform vec2  uMouseVel;
uniform float uMouseStr;

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

  // ── Direction of travel, decomposed into along/across the stroke ──
  vec2 vel    = uMouseVel * vec2(1.0, -1.0);
  vec2 dirVel = vel / (length(vel) + 0.0001);
  float along = dot(diff, dirVel);
  vec2  perp  = diff - along * dirVel;

  // ── Gentle domain nudge — a light touch, not a lens. Kept small so
  // it can't compress the noise field into ring/coil artifacts ──────
  float nudgeFalloff = exp(-(length(perp) * 1.8 + max(along, 0.0) * 1.8 + max(-along, 0.0) * 0.7));
  vec2 translate = vel * nudgeFalloff * uMouseStr * 0.9;

  // ── Stir curl — one soft hook trailing the cursor, like a finger
  // dragged through liquid. Bounded angle + tight radius so it reads
  // as a single curl, never a multi-wrap ring/coil. This only warps
  // *where* the existing marble samples from, so the swirl is made of
  // the same palette colors — motion, not a painted-on color patch ──
  float curlFalloff = exp(-length(diff) * 2.1) * uMouseStr;
  float curlAngle = curlFalloff * 1.2;
  float sa = sin(curlAngle), ca = cos(curlAngle);
  vec2 curled = mat2(ca, -sa, sa, ca) * diff;

  p = mUv + curled + translate;

  float f = fluid(p * 1.05);
  f = smoothstep(0.08, 0.92, f);

  vec3 col = pal(f);

  // ── Faint warm breath inside the curl — barely-there, so the swirl
  // still reads as "the marble itself moving" rather than a new color ──
  vec3 warm = vec3(0.97, 0.86, 0.78);
  float warmth = curlFalloff * smoothstep(0.3, 0.9, curlFalloff);
  col = mix(col, warm, clamp(warmth * 0.22, 0.0, 0.18));

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
    const uMouseVel = gl.getUniformLocation(prog, 'uMouseVel')
    const uMouseStr = gl.getUniformLocation(prog, 'uMouseStr')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)
    const stopMouseTracking = initMouseTracking()

    let id: number
    const loop = (now: number) => {
      id = requestAnimationFrame(loop)
      decayMouse()
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, now * 0.001)
      gl.uniform2f(uMouse, mouse.nx, mouse.ny)
      gl.uniform2f(uMouseVel, mouse.vx, mouse.vy)
      gl.uniform1f(uMouseStr, mouse.strength)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    id = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
      stopMouseTracking()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
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
