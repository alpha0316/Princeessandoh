/**
 * WebGL2 page-curl renderer. The front image is treated as a sheet of paper
 * that lifts from its top-right corner and rolls around a cylinder toward
 * the bottom-left, revealing the back image underneath. Everything is done
 * per-fragment (no mesh): for each pixel we find which layer of the rolled
 * paper is on top, so the curl stays smooth at any resolution.
 */

const VERT = `#version 300 es
const vec2 POS[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vec2 p = POS[gl_VertexID];
  vUv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5); // top-down
  gl_Position = vec4(p, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uFront;
uniform sampler2D uBack;
uniform vec4 uFrontST;
uniform vec4 uBackST;
uniform float uAspect;
uniform float uT;
uniform float uR;
uniform vec2 uDir;
const float PI = 3.14159265;

vec3 tex(sampler2D s, vec4 st, vec2 q) {
  vec2 n = vec2(q.x / uAspect, q.y);
  return texture(s, n * st.xy + st.zw).rgb;
}
bool inside(vec2 q) {
  return q.x >= 0.0 && q.x <= uAspect && q.y >= 0.0 && q.y <= 1.0;
}
// Underside of the sheet: the image showing through thin paper.
vec3 backside(vec2 q, float light) {
  return mix(tex(uFront, uFrontST, q), vec3(0.97), 0.78) * light;
}

void main() {
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 corner = vec2(uAspect, 0.0);
  float r = uR;
  // Signed distance past the curl line (s < 0: lifted side).
  float s = dot(p - corner, uDir) - uT;

  if (s >= 0.0) {
    // Paper that has rolled all the way over lies flat on top, face down.
    float a = s + PI * r;
    vec2 p0 = p - uDir * (s + a);
    if (inside(p0)) {
      float edge = smoothstep(0.0, r * 1.5, s);
      outColor = vec4(backside(p0, mix(0.9, 1.0, edge)), 1.0);
      return;
    }
    // Still-flat part of the front page, with a soft shadow from the roll.
    vec2 lift = p - uDir * (s + PI * r * 0.5);
    float present = inside(lift) ? 1.0 : 0.0;
    float shade = 1.0 - 0.22 * present * exp(-s / (r * 0.6));
    outColor = vec4(tex(uFront, uFrontST, p) * shade, 1.0);
    return;
  }

  if (s >= -r) {
    float th1 = asin(clamp(-s / r, 0.0, 1.0));
    // Upper half of the cylinder: we see the underside.
    float th2 = PI - th1;
    vec2 p0 = p - uDir * (s + r * th2);
    if (inside(p0)) {
      float light = 0.72 + 0.28 * pow(sin(th2 * 0.5 + PI * 0.25), 2.0);
      outColor = vec4(backside(p0, light), 1.0);
      return;
    }
    // Lower half: the front face, darkening as it turns toward vertical.
    p0 = p - uDir * (s + r * th1);
    if (inside(p0)) {
      float light = 1.0 - 0.38 * pow(sin(th1), 1.6);
      outColor = vec4(tex(uFront, uFrontST, p0) * light, 1.0);
      return;
    }
  }

  // Revealed page, shadowed where the curl stands over it.
  vec2 lift = p - uDir * (s + PI * r * 0.5);
  float present = inside(lift) ? 1.0 : 0.0;
  float e = max(0.0, -s - r);
  float shade = 1.0 - 0.38 * present * exp(-e / (r * 0.9));
  outColor = vec4(tex(uBack, uBackST, p) * shade, 1.0);
}`

export type CurlFrame = {
  front: HTMLImageElement
  back: HTMLImageElement
  /** 0 = flat front page, 1 = fully turned (back page showing). */
  progress: number
}

/** Matches CSS object-fit: cover + object-position for a texture lookup. */
function coverST(img: HTMLImageElement, w: number, h: number, position: string) {
  const words = position.split(/\s+/)
  const px = words.includes('left') ? 0 : words.includes('right') ? 1 : 0.5
  const py = words.includes('top') ? 0 : words.includes('bottom') ? 1 : 0.5
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  const ox = (w - dw) * px
  const oy = (h - dh) * py
  return [w / dw, h / dh, -ox / dw, -oy / dh] as const
}

export function createCurlRenderer(canvas: HTMLCanvasElement, position = 'top') {
  const gl = canvas.getContext('webgl2', { antialias: true, premultipliedAlpha: false })
  if (!gl) return null

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    return sh
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  gl.bindVertexArray(gl.createVertexArray())

  const loc = (n: string) => gl.getUniformLocation(prog, n)
  const u = {
    front: loc('uFront'),
    back: loc('uBack'),
    frontST: loc('uFrontST'),
    backST: loc('uBackST'),
    aspect: loc('uAspect'),
    t: loc('uT'),
    r: loc('uR'),
    dir: loc('uDir'),
  }
  gl.uniform1i(u.front, 0)
  gl.uniform1i(u.back, 1)

  const textures = new Map<HTMLImageElement, WebGLTexture>()
  const textureFor = (img: HTMLImageElement) => {
    let t = textures.get(img)
    if (t) return t
    t = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    textures.set(img, t)
    return t
  }

  // Lift direction: from the top-right corner, down and to the left.
  const dir = [-1, 0.42]
  const dl = Math.hypot(dir[0], dir[1])
  dir[0] /= dl
  dir[1] /= dl

  const draw = ({ front, back, progress }: CurlFrame) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }
    gl.viewport(0, 0, canvas.width, canvas.height)

    const aspect = w / h
    // The curl radius swells mid-turn so the paper reads as flexible
    // rather than creased.
    const r = 0.09 + 0.09 * Math.sin(Math.PI * progress)
    // Furthest page corner along the lift direction (bottom-left).
    const maxDot = Math.max(0, -aspect * dir[0] + dir[1], dir[1], -aspect * dir[0])
    const tEnd = maxDot + (Math.PI * r) / 2 + 0.02
    const t = -0.01 + progress * (tEnd + 0.01)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureFor(front))
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, textureFor(back))
    gl.uniform4fv(u.frontST, coverST(front, w, h, position))
    gl.uniform4fv(u.backST, coverST(back, w, h, position))
    gl.uniform1f(u.aspect, aspect)
    gl.uniform1f(u.t, t)
    gl.uniform1f(u.r, r)
    gl.uniform2f(u.dir, dir[0], dir[1])
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const dispose = () => {
    textures.forEach((t) => gl.deleteTexture(t))
    textures.clear()
    gl.deleteProgram(prog)
    // No forced loseContext(): the same canvas can be re-initialised
    // (StrictMode re-runs effects) and a lost context can't be reused. The
    // context is reclaimed when the canvas unmounts.
  }

  return { draw, dispose }
}

const imageCache = new Map<string, Promise<HTMLImageElement>>()

export function loadImage(src: string) {
  let p = imageCache.get(src)
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
    imageCache.set(src, p)
  }
  return p
}
