import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Button from '../Button/Button'
import Panel from '../Panel'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import { player } from '../../game/player'

const dialogue = [
    `Welcome, traveler. You have entered the realm of ${player.name}, a Computer Science graduate who wields Artificial Intelligence.`,
    'He specializes in AI and Data Science, forging scalable machine learning architectures and automated real-world solutions.',
    'Inspect his skill tree, browse the quest log, and visit the hall of trophies. The guild hall awaits at the end of the road.',
]

function useTypewriter(text, enabled) {
    const [count, setCount] = useState(enabled ? 0 : text.length)

    useEffect(() => {
        if (!enabled) {
            setCount(text.length)
            return
        }
        setCount(0)
        const id = setInterval(() => {
            setCount((c) => {
                if (c >= text.length) {
                    clearInterval(id)
                    return c
                }
                return c + 1
            })
        }, 22)
        return () => clearInterval(id)
    }, [text, enabled])

    return [text.slice(0, count), count >= text.length, () => setCount(text.length)]
}

function Hero() {
    const reduceMotion = useReducedMotion()
    const [line, setLine] = useState(0)
    const [shown, done, skip] = useTypewriter(dialogue[line], !reduceMotion)

    const advance = () => {
        if (!done) skip()
        else setLine((l) => (l + 1) % dialogue.length)
    }

    return (
        <section id="top" data-zone="Title" className="relative flex min-h-svh w-full flex-col justify-center px-4 pt-28 pb-10 sm:px-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="flex max-w-2xl flex-col items-start gap-5"
                >
                    <p className="flex items-center gap-2 font-pixel text-xs uppercase tracking-[0.3em] text-gold">
                        <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
                        A portfolio adventure
                    </p>

                    <h1 className="bg-linear-to-b from-ink via-ink to-gold bg-clip-text pb-1 font-display text-5xl font-black leading-[0.95] tracking-wide text-transparent drop-shadow-[0_4px_24px_rgb(0_0_0/0.45)] sm:text-7xl lg:text-8xl">
                        Wilbert
                        <br />
                        Yang
                    </h1>

                    <dl className="flex flex-wrap items-center gap-2 font-pixel text-xs">
                        <div className="flex items-center gap-1.5 rounded-sm border border-gold-dim bg-panel/80 px-2.5 py-1 backdrop-blur-sm">
                            <dt className="text-muted">CLASS</dt>
                            <dd className="text-gold">{player.title}</dd>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-sm border border-gold-dim bg-panel/80 px-2.5 py-1 backdrop-blur-sm">
                            <dt className="text-muted">LV</dt>
                            <dd className="text-gold">{player.level}</dd>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-sm border border-gold-dim bg-panel/80 px-2.5 py-1 backdrop-blur-sm">
                            <dt className="text-muted">REALM</dt>
                            <dd className="text-gold">AI &amp; Data Science</dd>
                        </div>
                    </dl>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button href="#about" size="lg">
                            <span className="flex items-center gap-2">
                                <span aria-hidden="true" className="animate-blink">▶</span> Press Start
                            </span>
                        </Button>
                        <Button href={CV} download variant="secondary" size="lg">
                            Load CV
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl"
                >
                    <Panel className="p-5 pt-6 sm:p-6 sm:pt-7">
                        <span className="absolute -top-3.5 left-5 rounded-sm border-2 border-gold-dim bg-panel-2 px-3 py-0.5 font-display text-xs font-bold uppercase tracking-[0.18em] text-gold">
                            The Oracle
                        </span>
                        <p className="sr-only" aria-live="polite">{dialogue[line]}</p>
                        <p aria-hidden="true" className="min-h-[5.25rem] text-lg leading-relaxed text-ink sm:min-h-[4.5rem]">
                            {shown}
                            {!done && <span className="ml-0.5 inline-block h-5 w-2 translate-y-0.5 bg-gold animate-blink" />}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="flex gap-1.5" aria-hidden="true">
                                {dialogue.map((_, i) => (
                                    <span key={i} className={`size-1.5 rotate-45 ${i === line ? 'bg-gold' : 'bg-gold-dim'}`} />
                                ))}
                            </span>
                            <button
                                type="button"
                                onClick={advance}
                                className="flex items-center gap-2 rounded-sm px-2 py-1 font-pixel text-xs uppercase tracking-widest text-gold hover:bg-gold/10"
                            >
                                {done ? (line === dialogue.length - 1 ? 'Again' : 'Next') : 'Skip'}
                                <span aria-hidden="true" className="animate-float">▼</span>
                            </button>
                        </div>
                    </Panel>
                </motion.div>
            </div>

            <a
                href="#about"
                className="mx-auto mt-10 flex flex-col items-center gap-1 font-pixel text-[11px] uppercase tracking-[0.3em] text-ink-soft hover:text-gold"
            >
                Scroll to begin
                <span aria-hidden="true" className="animate-float text-gold">◆</span>
            </a>
        </section>
    )
}

export default Hero
