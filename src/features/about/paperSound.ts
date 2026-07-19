// Synthesized paper rustle — a short burst of filtered noise, so no audio
// asset is needed. Browsers block audio before the first user gesture; in
// that case the sound silently no-ops (the load-in drop stays visual only).
let ctx: AudioContext | null = null

export function playPaperSound() {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
      if (ctx.state === 'suspended') return
    }

    const dur = 0.16
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2
    }

    const src = ctx.createBufferSource()
    src.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 0.9
    filter.frequency.setValueAtTime(2000, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + dur)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start()
  } catch {
    // Audio unavailable (autoplay policy, no device) — stay silent.
  }
}
