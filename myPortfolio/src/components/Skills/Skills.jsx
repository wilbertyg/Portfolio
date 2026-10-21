import { motion } from 'motion/react'
import { skillCategories } from './SkillList'
import { SkillIcon } from './SkillIcons'
import SectionHeader from '../SectionHeader'
import Panel from '../Panel'
import { player } from '../../game/player'

function SkillNode({ name, tone, index }) {
    return (
        <motion.li
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex items-center gap-4"
        >
            <span
                className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-md border-2 ${tone.border} bg-radial from-[#fbf3dc] to-[#cdb88a] shadow-[0_0_0_3px_var(--color-panel),inset_0_0_10px_rgb(0_0_0/0.25)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105`}
            >
                <SkillIcon name={name} className="size-8" />
                <span
                    aria-hidden="true"
                    className={`absolute inset-0 -z-10 rounded-md ${tone.bg} opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-60`}
                />
            </span>
            <span className="flex min-w-0 flex-col">
                <span className="font-medium leading-tight text-ink">{name}</span>
                <span className={`font-pixel text-[10px] uppercase tracking-widest ${tone.text}`}>Learned</span>
            </span>
        </motion.li>
    )
}

function Skills() {
    return (
        <section id="skills" data-zone="The Skill Grove" className="relative w-full px-4 py-24 sm:px-6 md:py-32">
            <div className="mx-auto w-full max-w-6xl">
                <SectionHeader
                    tag="Chapter II"
                    title="Skill Tree"
                    aside={
                        <p className="self-start rounded-sm border-2 border-gold-dim bg-panel/80 px-3 py-2 font-pixel text-xs text-ink-soft backdrop-blur-sm md:self-auto">
                            <span className="text-gold">{player.skills}</span> skills across{' '}
                            <span className="text-gold">{player.schools}</span> schools
                        </p>
                    }
                >
                    Three schools of study. Each skill below was learned along the way.
                </SectionHeader>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {skillCategories.map((cat) => (
                        <Panel as="article" key={cat.id} className="flex flex-col p-5 sm:p-6">
                            <header className="mb-6 flex items-start gap-4 border-b border-line pb-5">
                                <span
                                    aria-hidden="true"
                                    className={`grid size-12 shrink-0 place-items-center rounded-full border-2 ${cat.tone.border} bg-void/50 text-2xl ${cat.tone.text} shadow-[0_0_24px_-4px_currentColor]`}
                                >
                                    {cat.glyph}
                                </span>
                                <div>
                                    <p className={`font-pixel text-[11px] uppercase tracking-widest ${cat.tone.text}`}>{cat.school}</p>
                                    <h3 className="font-display text-lg font-bold leading-snug tracking-wide text-ink">{cat.title}</h3>
                                    <p className="mt-1 text-sm leading-snug text-muted">{cat.description}</p>
                                </div>
                            </header>

                            <ol className="relative flex flex-col gap-4">
                                {/* Talent-tree spine connecting the nodes */}
                                <span aria-hidden="true" className={`absolute top-4 bottom-4 left-[27px] w-0.5 ${cat.tone.bg} opacity-40`} />
                                {cat.skills.map((skill, i) => (
                                    <SkillNode key={`${cat.id}-${skill}`} name={skill} tone={cat.tone} index={i} />
                                ))}
                            </ol>
                        </Panel>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills
