import { useSyncExternalStore } from 'react'

// 8-bit blips synthesized with WebAudio — no audio files. Off until the player opts in.
const SOUNDS = {
    select: [[880, 0.04]],
    confirm: [[660, 0.05], [990, 0.08]],
    cancel: [[440, 0.05], [220, 0.08]],
    text: [[1320, 0.012]],
    bump: [[110, 0.06]],
    door: [[262, 0.07], [330, 0.07], [392, 0.07], [523, 0.12]],
    chest: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.25]],
    cheat: [[392, 0.06], [523, 0.06], [659, 0.06], [784, 0.06], [1047, 0.06], [1319, 0.3]],
}

let audio
let enabled = false
try {
    enabled = localStorage.getItem('sfx') === 'on'
} catch {
    // storage blocked; stay muted
}
const listeners = new Set()

export function setSfxEnabled(on) {
    enabled = on
    try {
        localStorage.setItem('sfx', on ? 'on' : 'off')
    } catch {
        // storage blocked; setting lasts for this visit
    }
    listeners.forEach((l) => l())
    if (on) playSfx('confirm')
}

export function playSfx(name) {
    if (!enabled || !SOUNDS[name]) return
    audio ??= new AudioContext()
    let t = audio.currentTime
    for (const [freq, dur] of SOUNDS[name]) {
        const osc = audio.createOscillator()
        const gain = audio.createGain()
        osc.type = 'square'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(name === 'text' ? 0.02 : 0.05, t)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
        osc.connect(gain).connect(audio.destination)
        osc.start(t)
        osc.stop(t + dur)
        t += dur
    }
}

export function useSfxEnabled() {
    return useSyncExternalStore(
        (l) => (listeners.add(l), () => listeners.delete(l)),
        () => enabled,
    )
}
