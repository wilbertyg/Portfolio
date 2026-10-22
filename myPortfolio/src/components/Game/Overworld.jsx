import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useTheme } from '../../context/ThemeContext'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import PixelArt from '../PixelArt'
import { win, label } from '../styles'
import { createGame } from './engine'
import { playSfx } from './sfx'
import { ICONS } from './sprites'
import DialogBox, { useTypewriter } from './DialogBox'

const KEYS = {
    ArrowUp: 'up', w: 'up', W: 'up',
    ArrowDown: 'down', s: 'down', S: 'down',
    ArrowLeft: 'left', a: 'left', A: 'left',
    ArrowRight: 'right', d: 'right', D: 'right',
}
const CONFIRM = ['Enter', ' ', 'z', 'Z']
const CANCEL = ['Escape', 'x', 'X']
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

const DOORS = {
    home: { name: "Wilbert's House", target: 'about', text: "A cozy little house. The hero's STATUS sheet is pinned beside the door." },
    academy: { name: 'Arcane Academy', target: 'skills', text: 'The ACADEMY. Every spell Wilbert has learned is shelved inside.' },
    guild: { name: "Adventurers' Guild", target: 'projects', text: 'The GUILD hall. A board covered in cleared QUESTS hangs inside.' },
    hall: { name: 'Hall of Trophies', target: 'certifications', text: 'The TROPHY hall. Certificates and honors gleam along the walls.' },
    post: { name: 'Post Office', target: 'contact', text: 'The POST office. Leave a letter here and Wilbert will write back.' },
}

const SAGE_LINES = [
    'Ah, a traveler! Welcome to TENSOR TOWN.',
    'This village belongs to WILBERT YANG, a Computer Science graduate who studies the arcane arts of AI and Data Science.',
    'Each building holds a chapter of his tale. Walk up to a door and press ENTER (or A) to step inside.',
    "Psst... rumor has it he's open to new opportunities. The POST office is to the south-east.",
]

const SLIME_LINES = [
    "*bloop* I'm training to become a neural network someday!",
    '*bloop* My loss keeps going down... or am I just melting?',
    '*bloop* Wilbert taught me gradient descent. I rolled downhill for a week.',
]

const SIGNS = {
    welcome: 'TENSOR TOWN ~ Population: 1 developer, 1 slime, 1 very old sage.',
    bridge: 'Uncharted lands ahead. Future quests are still being generated...',
}

function downloadCV() {
    const a = document.createElement('a')
    a.href = CV
    a.download = 'CV_Wilbert_Yang.pdf'
    a.click()
}

function DPad({ game, onA, onB, onStart }) {
    const hold = (dir) => ({
        onPointerDown: (e) => {
            e.preventDefault()
            onStart()
            game.current?.press(dir, true)
        },
        onPointerUp: () => game.current?.press(dir, false),
        onPointerLeave: () => game.current?.press(dir, false),
        onPointerCancel: () => game.current?.press(dir, false),
    })
    const pad = 'absolute flex size-12 items-center justify-center bg-void/80 font-display text-[10px] text-white/80 active:bg-void touch-none select-none'
    const round = 'flex size-14 items-center justify-center rounded-full border-4 border-void font-display text-sm text-void shadow-[0_4px_0_var(--color-void)] active:translate-y-1 active:shadow-none touch-none select-none'

    // Touch-only shortcut; keyboard players use the arrow keys directly.
    return (
        <div className="pointer-events-none absolute inset-x-4 bottom-36 z-10 hidden items-end justify-between pointer-coarse:flex" aria-hidden="true">
            <div className="pointer-events-auto relative size-36">
                <button type="button" tabIndex={-1} className={`${pad} top-0 left-12 rounded-t-md`} {...hold('up')}>▲</button>
                <button type="button" tabIndex={-1} className={`${pad} top-12 left-0 rounded-l-md`} {...hold('left')}>◀</button>
                <span className="absolute top-12 left-12 size-12 bg-void/80" />
                <button type="button" tabIndex={-1} className={`${pad} top-12 right-0 rounded-r-md`} {...hold('right')}>▶</button>
                <button type="button" tabIndex={-1} className={`${pad} bottom-0 left-12 rounded-b-md`} {...hold('down')}>▼</button>
            </div>
            <div className="pointer-events-auto flex items-end gap-3 pb-2">
                <button type="button" tabIndex={-1} onClick={onB} className={`${round} mb-0 bg-hp`}>B</button>
                <button type="button" tabIndex={-1} onClick={onA} className={`${round} mb-8 bg-heal`}>A</button>
            </div>
        </div>
    )
}

function Overworld() {
    const { isDark } = useTheme()
    const reduceMotion = useReducedMotion()
    const wrapRef = useRef(null)
    const canvasRef = useRef(null)
    const game = useRef(null)
    const onEvent = useRef(null)
    const startNight = useRef(isDark)
    const [started, setStarted] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dialog, setDialog] = useState(null)
    const [choice, setChoice] = useState(0)
    const [toast, setToast] = useState(null)

    const text = dialog ? dialog.pages[dialog.page] : ''
    const [shown, done, skip] = useTypewriter(text, !!reduceMotion)

    const open = (d) => {
        setDialog({ page: 0, ...d })
        setChoice(0)
    }

    const goTo = (id) => {
        const el = document.getElementById(id)
        el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
        el?.focus({ preventScroll: true })
    }

    onEvent.current = (e) => {
        setStarted(true)
        if (e.type === 'door') {
            playSfx('door')
            const d = DOORS[e.id]
            open({ speaker: d.name, pages: [d.text], choices: [{ label: 'Enter', run: () => goTo(d.target) }, { label: 'Not now' }] })
        } else if (e.type === 'chest') {
            playSfx(e.first ? 'chest' : 'select')
            open({
                pages: e.first
                    ? ['You open the treasure chest...', "You obtained WILBERT'S CV SCROLL! ✦"]
                    : ['The chest is empty. Luckily, the CV scroll can be copied as many times as you like.'],
                choices: [{ label: 'Download', run: downloadCV }, { label: 'Leave it' }],
            })
        } else {
            playSfx('confirm')
            if (e.id === 'sage') open({ speaker: 'Old Sage', pages: SAGE_LINES })
            else if (e.id === 'slime') open({ speaker: 'Slime', pages: [SLIME_LINES[(Math.random() * SLIME_LINES.length) | 0]] })
            else open({ speaker: 'Sign', pages: [SIGNS[e.id]] })
        }
    }

    useEffect(() => {
        const g = createGame({
            canvas: canvasRef.current,
            container: wrapRef.current,
            onEvent: (e) => onEvent.current(e),
            reduceMotion,
            night: startNight.current,
        })
        game.current = g
        const ro = new ResizeObserver(() => g.resize())
        ro.observe(wrapRef.current)
        const io = new IntersectionObserver(([entry]) => g.setActive(entry.isIntersecting))
        io.observe(wrapRef.current)
        return () => {
            ro.disconnect()
            io.disconnect()
            g.destroy()
        }
    }, [reduceMotion])

    useEffect(() => game.current?.setNight(isDark), [isDark])
    useEffect(() => game.current?.setPaused(!!dialog), [dialog])

    useEffect(() => {
        let progress = 0
        const onKey = (e) => {
            progress = e.key === KONAMI[progress] ? progress + 1 : e.key === KONAMI[0] ? 1 : 0
            if (progress < KONAMI.length) return
            progress = 0
            playSfx('cheat')
            game.current?.party()
            setToast('CHEAT ACTIVATED ★ +30 LIVES')
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    useEffect(() => {
        if (!toast) return
        const id = setTimeout(() => setToast(null), 3200)
        return () => clearTimeout(id)
    }, [toast])

    const close = () => {
        playSfx('cancel')
        setDialog(null)
    }

    const choose = (i) => {
        const c = dialog.choices[i]
        playSfx(i === dialog.choices.length - 1 ? 'cancel' : 'confirm')
        setDialog(null)
        c.run?.()
    }

    const advance = () => {
        if (!dialog) return game.current?.action()
        if (!done) return skip()
        if (dialog.page < dialog.pages.length - 1) {
            playSfx('select')
            return setDialog({ ...dialog, page: dialog.page + 1 })
        }
        if (dialog.choices) return choose(choice)
        close()
    }

    const onKeyDown = (e) => {
        const dir = KEYS[e.key]
        if (dialog) {
            const n = dialog.choices?.length
            if ((dir === 'up' || dir === 'down') && n && done && dialog.page === dialog.pages.length - 1) {
                setChoice((c) => (c + (dir === 'down' ? 1 : -1) + n) % n)
                playSfx('select')
            }
            if (CONFIRM.includes(e.key)) advance()
            else if (CANCEL.includes(e.key)) close()
            if (dir || CONFIRM.includes(e.key) || CANCEL.includes(e.key)) e.preventDefault()
            return
        }
        if (dir) {
            e.preventDefault()
            if (!e.repeat) game.current?.press(dir, true)
            setStarted(true)
        } else if (CONFIRM.includes(e.key)) {
            e.preventDefault()
            game.current?.action()
            setStarted(true)
        } else if (e.key === 'Escape') wrapRef.current.blur()
    }

    const onKeyUp = (e) => KEYS[e.key] && game.current?.press(KEYS[e.key], false)

    const pressStart = () => {
        playSfx('confirm')
        setStarted(true)
        wrapRef.current.focus()
    }

    return (
        <section id="title" aria-label="Tensor Town: an explorable pixel-art village" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#24502A]">
            <div
                ref={wrapRef}
                tabIndex={0}
                role="application"
                aria-roledescription="game"
                aria-label="Tensor Town map"
                aria-describedby="game-help"
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                    setFocused(false)
                    game.current?.release()
                }}
                onPointerDown={(e) => {
                    if (e.target !== canvasRef.current) return
                    setStarted(true)
                    if (dialog) advance()
                    else game.current?.tap(e.clientX, e.clientY)
                }}
                className="absolute inset-0 cursor-pointer outline-none"
            >
                <canvas ref={canvasRef} className="absolute top-0 left-0 [image-rendering:pixelated]" />
            </div>
            <p id="game-help" className="sr-only">
                Use the arrow keys or W A S D to walk, Enter to talk or open doors, Escape to leave the map. Every building links to a section
                of this page, which you can also reach from the main menu.
            </p>

            {/* CRT scanlines + vignette */}
            <div
                className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.07)_0_1px,transparent_1px_3px)]"
                aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(11_14_42/0.55))]" aria-hidden="true" />

            <div
                className={`pointer-events-none absolute inset-x-0 top-24 z-10 flex flex-col items-center px-4 text-center transition-all duration-700 sm:top-28 ${
                    started ? '-translate-y-8 opacity-0' : ''
                }`}
            >
                <p className="font-display text-[9px] tracking-[0.3em] text-white uppercase [text-shadow:2px_2px_0_var(--color-void)] sm:text-[11px]">
                    ~ A Developer Portfolio RPG ~
                </p>
                <h1 className="mt-4 bg-linear-to-b from-[#FFF8D0] via-gold to-[#E8901C] bg-clip-text font-display text-[clamp(1.9rem,8vw,4.6rem)] leading-[1.15] text-transparent [filter:drop-shadow(3px_0_0_#0B0E2A)_drop-shadow(-3px_0_0_#0B0E2A)_drop-shadow(0_3px_0_#0B0E2A)_drop-shadow(0_-3px_0_#0B0E2A)_drop-shadow(5px_6px_0_rgb(11_14_42/0.6))]">
                    Wilbert
                    <br />
                    Yang
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-snug text-white [text-shadow:2px_2px_0_var(--color-void)] sm:text-xl">
                    Computer Science Graduate · Artificial Intelligence &amp; Data Science
                </p>
                <button
                    type="button"
                    onClick={pressStart}
                    tabIndex={started ? -1 : 0}
                    className="group pointer-events-auto mt-8 flex items-center gap-3 px-4 py-3 font-display text-xs text-white uppercase [text-shadow:2px_2px_0_var(--color-void)] sm:text-sm"
                >
                    <span className="motion-safe:animate-nudge">
                        <PixelArt art={ICONS.hand} className="h-4 w-auto" />
                    </span>
                    <span className="motion-safe:animate-blink">Press Start</span>
                </button>
            </div>

            {toast && (
                <div role="status" className={`${win} absolute top-24 left-1/2 z-30 -translate-x-1/2 px-4 py-3 font-display text-[10px] whitespace-nowrap text-gold`}>
                    {toast}
                </div>
            )}

            {focused && !dialog && (
                <p className={`${win} absolute top-20 right-3 z-10 hidden px-3 py-2 sm:right-6 sm:top-24 md:block ${label} text-heal`}>● Playing · Esc to exit</p>
            )}

            {dialog ? (
                <DialogBox
                    dialog={dialog}
                    shown={shown}
                    done={done}
                    choice={choice}
                    onAdvance={advance}
                    onChoose={choose}
                    onHover={setChoice}
                />
            ) : (
                <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
                    <p className={`${win} px-3 py-2 ${label} text-[9px] text-white/90`}>
                        <span className="pointer-coarse:hidden">↑↓←→ / WASD walk · Enter talk · or click the map</span>
                        <span className="hidden pointer-coarse:inline">Tap the map to walk · Tap a building to enter</span>
                    </p>
                    <a
                        href="#about"
                        className={`${win} pointer-events-auto hidden shrink-0 items-center gap-2 px-3 py-2 sm:flex ${label} text-[9px] text-gold`}
                    >
                        Skip to menu <span className="motion-safe:animate-blink">▼</span>
                    </a>
                </div>
            )}

            <DPad game={game} onA={advance} onB={() => dialog && close()} onStart={() => setStarted(true)} />
        </section>
    )
}

export default Overworld
