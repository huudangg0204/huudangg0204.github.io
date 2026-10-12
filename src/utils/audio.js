// 8-bit Retro Sound Generator using Web Audio API
// Lightweight, zero external files, no 404 errors, works offline

let audioCtx = null
let isMuted = false

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function toggleMute() {
  isMuted = !isMuted
  return isMuted
}

export function getMuteState() {
  return isMuted
}

export function playCoinSound() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(987.77, now) // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08) // E6

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.36)
  } catch (e) {
    console.debug('Audio error:', e)
  }
}

export function playJumpSound() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.15)

    gain.gain.setValueAtTime(0.1, now)
    gain.gain.linearRampToValueAtTime(0.01, now + 0.16)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.16)
  } catch (e) {
    console.debug('Audio error:', e)
  }
}

export function playPowerupSound() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const notes = [330, 392, 659, 523, 587, 784]
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.06
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.09)
    })
  } catch (e) {
    console.debug('Audio error:', e)
  }
}

export function playVictorySound() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const fanfare = [
      { f: 523.25, t: 0.0, d: 0.12 }, // C5
      { f: 659.25, t: 0.14, d: 0.12 }, // E5
      { f: 783.99, t: 0.28, d: 0.12 }, // G5
      { f: 1046.50, t: 0.42, d: 0.35 } // C6
    ]

    fanfare.forEach(note => {
      const now = ctx.currentTime + note.t
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(note.f, now)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.d)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + note.d + 0.05)
    })
  } catch (e) {
    console.debug('Audio error:', e)
  }
}

export function playBlipSound() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, now)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  } catch (e) {
    console.debug('Audio error:', e)
  }
}
