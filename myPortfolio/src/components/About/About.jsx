import { motion } from 'motion/react'
import Profile from '../../assets/profile.jpg'
import Button from '../Button/Button'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import Socials from '../Socials'
import Panel from '../Panel'
import SectionHeader from '../SectionHeader'
import { SkillIcon } from '../Skills/SkillIcons'
import { player } from '../../game/player'

const profile = [
    { label: 'Origin', value: 'Indonesia' },
    { label: 'Guild', value: 'Computer Science' },
    { label: 'Focus', value: 'AI / Machine Learning' },
    { label: 'Alignment', value: 'Lawful Curious' },
]

const records = [
    { label: 'Quests cleared', value: player.quests, tone: 'text-ember' },
    { label: 'Trophies', value: player.trophies, tone: 'text-xp' },
    { label: 'Skills learned', value: player.skills, tone: 'text-emerald' },
    { label: 'Schools studied', value: player.schools, tone: 'text-arcane' },
]

const equipment = [
    { slot: 'Main hand', item: 'Python' },
    { slot: 'Off hand', item: 'PyTorch' },
    { slot: 'Tome', item: 'Jupyter Notebooks' },
    { slot: 'Relic', item: 'Git' },
]

function StatBar({ label, value, max, fill, caption }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between font-pixel text-xs">
                <span className="text-ink-soft">{label}</span>
                <span className="text-muted">{caption ?? `${value} / ${max}`}</span>
            </div>
            <div
                role="meter"
                aria-label={label}
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
                className="h-3 overflow-hidden rounded-sm border border-gold-dim bg-void/60 p-px"
            >
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: value / max }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full origin-left rounded-[1px] ${fill}`}
                />
            </div>
        </div>
    )
}

function About() {
    return (
        <section id="about" data-zone="Character Sheet" className="relative w-full px-4 py-24 sm:px-6 md:py-32">
            <div className="mx-auto w-full max-w-6xl">
                <SectionHeader tag="Chapter I" title="Character Sheet">
                    Every adventurer has a story. Here is the one behind this portfolio.
                </SectionHeader>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
                    <Panel className="flex flex-col gap-5 p-5">
                        <div className="relative">
                            <div className="aspect-square w-full overflow-hidden rounded-sm border-2 border-gold shadow-[0_0_0_3px_var(--color-void),0_0_40px_-8px_var(--color-gold)]">
                                <img
                                    src={Profile}
                                    alt="Portrait of Wilbert Yang"
                                    width="320"
                                    height="320"
                                    loading="lazy"
                                    className="size-full object-cover object-[center_20%]"
                                />
                            </div>
                            <div className="absolute inset-x-4 -bottom-4 rounded-sm border-2 border-gold bg-panel-2 px-3 py-1.5 text-center shadow-lg">
                                <p className="font-display text-base font-bold tracking-wide text-ink">{player.name}</p>
                                <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">
                                    Lv. {player.level} {player.title}
                                </p>
                            </div>
                        </div>

                        <dl className="mt-4 grid grid-cols-1 divide-y divide-line">
                            {profile.map((row) => (
                                <div key={row.label} className="flex items-center justify-between gap-4 py-2">
                                    <dt className="font-pixel text-xs uppercase tracking-wider text-muted">{row.label}</dt>
                                    <dd className="text-right font-medium text-ink">{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Panel>

                    <div className="flex flex-col gap-6">
                        <Panel className="flex flex-col gap-5 p-5 sm:p-7">
                            <h3 className="font-display text-lg font-bold tracking-wide text-gold">Lore</h3>
                            <p className="text-lg leading-relaxed text-ink">
                                A Computer Science graduate who specializes in{' '}
                                <strong className="font-bold text-arcane">Artificial Intelligence</strong> and{' '}
                                <strong className="font-bold text-mp">Data Science</strong>, building scalable machine
                                learning architectures and automated, real-world solutions.
                            </p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <StatBar label="EXP" value={player.xp} max={player.xpToNext} fill="bg-linear-to-r from-xp to-ember" caption={`${player.xp} / ${player.xpToNext} to Lv. ${player.level + 1}`} />
                                <StatBar label="Curiosity" value={100} max={100} fill="bg-linear-to-r from-mp to-arcane" caption="MAX" />
                            </div>
                            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
                                <Button
                                    href={CV}
                                    download
                                    icon={
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    }
                                >
                                    Download CV
                                </Button>
                                <Button href="#projects" variant="secondary">View Quests</Button>
                                <div className="flex items-center gap-3 sm:ml-auto">
                                    <span className="font-pixel text-xs uppercase tracking-wider text-muted">Summon</span>
                                    <Socials />
                                </div>
                            </div>
                        </Panel>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {records.map((r) => (
                                <Panel key={r.label} className="flex flex-col items-center gap-1 px-3 py-4 text-center">
                                    <span className={`font-display text-4xl font-black ${r.tone}`}>{r.value}</span>
                                    <span className="font-pixel text-[11px] uppercase tracking-wider text-muted">{r.label}</span>
                                </Panel>
                            ))}
                        </div>

                        <Panel className="p-5 sm:p-6">
                            <h3 className="mb-4 font-display text-lg font-bold tracking-wide text-gold">Equipment</h3>
                            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {equipment.map((e) => (
                                    <li key={e.slot} className="flex items-center gap-3">
                                        <span className="grid size-12 shrink-0 place-items-center rounded-sm border-2 border-gold-dim bg-radial from-[#fbf3dc] to-[#cdb88a] shadow-[inset_0_0_8px_rgb(0_0_0/0.25)]">
                                            <SkillIcon name={e.item} className="size-7" />
                                        </span>
                                        <span className="flex min-w-0 flex-col">
                                            <span className="font-pixel text-[10px] uppercase tracking-wider text-muted">{e.slot}</span>
                                            <span className="truncate font-medium text-ink">{e.item}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Panel>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
