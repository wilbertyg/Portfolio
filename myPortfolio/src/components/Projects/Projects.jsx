import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ProjectList } from './ProjectList'
import SectionHeader from '../SectionHeader'
import Panel from '../Panel'
import Button from '../Button/Button'
import { XP_REWARD } from '../../game/player'

const questTone = {
    'Machine Learning': 'text-arcane border-arcane',
    'Deep Learning': 'text-mp border-mp',
    'NLP & Transformers': 'text-emerald border-emerald',
    'Web Development': 'text-ember border-ember',
}

function Projects() {
    const [selected, setSelected] = useState(0)
    const tabRefs = useRef([])
    const quest = ProjectList[selected]

    const onKeyDown = (e) => {
        const last = ProjectList.length - 1
        const next = { ArrowDown: selected + 1, ArrowUp: selected - 1, Home: 0, End: last }[e.key]
        if (next === undefined) return
        e.preventDefault()
        const i = (next + ProjectList.length) % ProjectList.length
        setSelected(i)
        tabRefs.current[i]?.focus()
    }

    return (
        <section id="projects" data-zone="Quest Board" className="relative w-full px-4 py-24 sm:px-6 md:py-32">
            <div className="mx-auto w-full max-w-6xl">
                <SectionHeader tag="Chapter III" title="Quest Log">
                    Predictive diagnostics, voice biometrics, and NLP transformer architectures. Pick a quest to read its log.
                </SectionHeader>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
                    <Panel className="self-start p-3">
                        <p className="flex items-center justify-between px-2 pt-1 pb-3 font-pixel text-xs uppercase tracking-widest text-muted">
                            <span>Quests</span>
                            <span className="text-emerald">
                                {ProjectList.length}/{ProjectList.length} cleared
                            </span>
                        </p>
                        <div role="tablist" aria-label="Quests" aria-orientation="vertical" className="flex flex-col gap-1" onKeyDown={onKeyDown}>
                            {ProjectList.map((p, i) => {
                                const active = i === selected
                                return (
                                    <button
                                        key={p.id}
                                        ref={(el) => (tabRefs.current[i] = el)}
                                        type="button"
                                        role="tab"
                                        id={`quest-tab-${p.id}`}
                                        aria-selected={active}
                                        aria-controls="quest-panel"
                                        tabIndex={active ? 0 : -1}
                                        onClick={() => setSelected(i)}
                                        className={`group relative flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left transition-colors ${
                                            active ? 'bg-gold/15' : 'hover:bg-gold/5'
                                        }`}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="questCursor"
                                                aria-hidden="true"
                                                className="absolute inset-y-1 left-0 w-1 rounded-full bg-gold"
                                            />
                                        )}
                                        <span
                                            aria-hidden="true"
                                            className={`grid size-8 shrink-0 rotate-45 place-items-center rounded-sm border-2 ${questTone[p.category]} bg-void/50`}
                                        >
                                            <span className="-rotate-45 font-display text-sm font-black">✓</span>
                                        </span>
                                        <span className="flex min-w-0 flex-col">
                                            <span className={`truncate font-display text-sm font-bold tracking-wide ${active ? 'text-gold' : 'text-ink'}`}>
                                                {p.title}
                                            </span>
                                            <span className="font-pixel text-[10px] uppercase tracking-wider text-muted">{p.category}</span>
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </Panel>

                    <Panel id="quest-panel" role="tabpanel" aria-labelledby={`quest-tab-${quest.id}`} className="overflow-hidden p-5 sm:p-7">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]"
                            >
                                <div className="relative">
                                    <div className="aspect-[16/10] overflow-hidden rounded-sm border-2 border-gold-dim bg-void shadow-[0_0_0_3px_var(--color-void)]">
                                        <img src={quest.image} alt={`Screenshot of ${quest.title}`} width="640" height="400" loading="lazy" className="size-full object-cover object-top" />
                                    </div>
                                    <span
                                        aria-hidden="true"
                                        className="absolute -top-3 -right-2 rotate-12 rounded-sm border-2 border-emerald bg-panel px-2 py-0.5 font-display text-sm font-black tracking-[0.2em] text-emerald shadow-lg"
                                    >
                                        CLEARED
                                    </span>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <span className={`inline-block rounded-sm border px-2 py-0.5 font-pixel text-[11px] uppercase tracking-widest ${questTone[quest.category]}`}>
                                            {quest.category}
                                        </span>
                                        <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-wide text-ink">{quest.title}</h3>
                                    </div>

                                    <div>
                                        <h4 className="mb-1 font-pixel text-xs uppercase tracking-widest text-gold">Objective</h4>
                                        <p className="leading-relaxed text-ink-soft">{quest.description}</p>
                                    </div>

                                    <div>
                                        <h4 className="mb-2 font-pixel text-xs uppercase tracking-widest text-gold">Rewards</h4>
                                        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                                            {quest.tags.map((tag) => (
                                                <li key={tag} className="flex items-center gap-1.5 rounded-sm border border-line bg-panel-2 px-2 py-1 text-sm text-ink">
                                                    <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
                                                    {tag}
                                                </li>
                                            ))}
                                            <li className="rounded-sm border border-xp/60 bg-xp/10 px-2 py-1 font-pixel text-xs text-xp">+{XP_REWARD.quest} EXP</li>
                                        </ul>
                                    </div>

                                    <Button href={quest.url} target="_blank" rel="noopener noreferrer" className="mt-auto self-start">
                                        {quest.btnText} ↗
                                        <span className="sr-only">: {quest.title} (opens in a new tab)</span>
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </Panel>
                </div>
            </div>
        </section>
    )
}

export default Projects
