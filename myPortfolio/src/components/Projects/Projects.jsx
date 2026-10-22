import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ProjectList } from './ProjectList'
import SectionHeader from '../SectionHeader'
import Button from '../Button/Button'
import { Hand } from '../PixelArt'
import { playSfx } from '../Game/sfx'
import { win, chip, label } from '../styles'

const filters = ['All', 'Machine Learning', 'Deep Learning', 'Web Development']

const matches = (project, filter) => {
    if (filter === 'All') return true
    if (filter === 'Machine Learning') return ['Machine Learning', 'NLP & Transformers'].includes(project.category)
    return project.category === filter
}

const questType = (project) => (project.category === 'Web Development' ? 'Side quest' : 'Main quest')

function QuestDetail({ project }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-sm border-4 border-void bg-void">
                <img src={project.image} alt="" loading="lazy" width="640" height="400" className="aspect-[16/10] w-full object-cover object-top" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <span className={chip}>{project.category}</span>
                <span className={`${chip} text-heal`}>★ Cleared</span>
            </div>
            <h3 className="font-display text-sm leading-relaxed text-gold sm:text-base">{project.title}</h3>
            <p className="text-xl leading-snug text-white/90">{project.description}</p>
            <div>
                <p className={`${label} mb-2 text-[9px] text-white/60`}>Loot obtained</p>
                <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                    {project.tags.map((tag) => (
                        <li key={tag} className={`${chip} text-white`}>
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>
            {project.btnEnabled && (
                <Button href={project.url} target="_blank" rel="noopener noreferrer" className="self-start">
                    {project.btnText} ▸<span className="sr-only">: {project.title} (opens in a new tab)</span>
                </Button>
            )}
        </div>
    )
}

function Projects() {
    const [filter, setFilter] = useState('All')
    const [selected, setSelected] = useState(ProjectList[0].id)
    const reduceMotion = useReducedMotion()
    const visible = ProjectList.filter((p) => matches(p, filter))
    const current = visible.find((p) => p.id === selected) ?? visible[0]

    return (
        <section id="projects" tabIndex={-1} className="relative w-full px-4 py-20 outline-none sm:px-6 md:py-28">
            <div className="mx-auto max-w-6xl">
                <SectionHeader index="03" tag="Guild Board" icon="sword" title="Quest Log">
                    Contracts taken and cleared — predictive diagnostics, voice biometrics, transformer NLP, and a side trip into the web.
                </SectionHeader>

                <div className={`${win} p-3 sm:p-5`}>
                    <div role="group" aria-label="Filter quests" className="mb-4 flex flex-wrap gap-2 border-b-2 border-dashed border-white/25 pb-4">
                        {filters.map((f) => (
                            <button
                                key={f}
                                type="button"
                                aria-pressed={filter === f}
                                onClick={() => {
                                    playSfx('select')
                                    setFilter(f)
                                }}
                                className={`group flex items-center gap-2 rounded-sm border-2 px-3 py-2 ${label} text-[9px] transition-colors ${
                                    filter === f ? 'border-gold bg-void/60 text-gold' : 'border-void/60 bg-void/25 text-white/80 hover:text-white'
                                }`}
                            >
                                <Hand active={filter === f} className="max-sm:hidden" />
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                        <ol className="flex flex-col gap-1" aria-label="Quests">
                            {visible.map((p) => {
                                const isOn = p.id === current?.id
                                return (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            aria-pressed={isOn}
                                            onClick={() => {
                                                playSfx('select')
                                                setSelected(p.id)
                                            }}
                                            className={`group flex w-full items-center gap-3 rounded-sm px-2 py-3 text-left transition-colors ${
                                                isOn ? 'bg-void/50' : 'hover:bg-white/10'
                                            }`}
                                        >
                                            <Hand active={isOn} />
                                            <span className="flex min-w-0 flex-1 flex-col">
                                                <span className={`${label} text-[8px] ${questType(p) === 'Main quest' ? 'text-gold' : 'text-mp'}`}>
                                                    {questType(p)}
                                                </span>
                                                <span className="text-xl leading-tight">{p.title}</span>
                                            </span>
                                            <span className={`${label} text-[8px] text-heal`}>Clear</span>
                                        </button>
                                        {isOn && (
                                            <div className="px-2 pt-2 pb-5 md:hidden">
                                                <QuestDetail project={p} />
                                            </div>
                                        )}
                                    </li>
                                )
                            })}
                        </ol>

                        <div className="hidden rounded-sm border-2 border-void/60 bg-void/25 p-4 md:block" aria-live="polite">
                            <AnimatePresence mode="wait" initial={false}>
                                {current && (
                                    <motion.div
                                        key={current.id}
                                        initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                                        transition={{ duration: 0.18, ease: 'easeOut' }}
                                    >
                                        <QuestDetail project={current} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Projects
