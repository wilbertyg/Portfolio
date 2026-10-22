import { motion, useReducedMotion } from 'motion/react'
import { skillCategories } from './SkillList'
import { SkillIcon } from './SkillIcons'
import SectionHeader from '../SectionHeader'
import PixelArt, { Hand } from '../PixelArt'
import { ICONS } from '../Game/sprites'
import { win, slot, label } from '../styles'

function Skills() {
    const reduceMotion = useReducedMotion()
    const total = new Set(skillCategories.flatMap((c) => c.skills)).size

    return (
        <section id="skills" tabIndex={-1} className="relative w-full px-4 py-20 outline-none sm:px-6 md:py-28">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    index="02"
                    tag="Spellbook"
                    icon="star"
                    title="Learned Spells"
                    aside={
                        <p className={`${win} shrink-0 self-start px-4 py-3 md:self-auto`}>
                            <span className="font-display text-2xl text-gold">{total}</span>
                            <span className={`ml-3 ${label} text-[9px]`}>spells known</span>
                        </p>
                    }
                >
                    Three schools of magic, studied in the Academy — from neural sorcery down to the humble tools of the trade.
                </SectionHeader>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                    {skillCategories.map((cat, i) => (
                        <motion.article
                            key={cat.id}
                            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className={`${win} p-5 sm:p-6 ${i === 0 ? 'lg:col-span-2' : ''}`}
                        >
                            <header className="mb-5 flex items-start gap-4 border-b-2 border-dashed border-white/25 pb-4">
                                <span className={`${slot} flex size-12 shrink-0 items-center justify-center`}>
                                    <PixelArt art={ICONS.gem} colors={{ c: cat.gem, C: cat.gem }} className="h-8 w-auto opacity-90" />
                                </span>
                                <div>
                                    <p className={`${label} text-[9px] text-gold`}>School of {cat.school}</p>
                                    <h3 className="text-2xl leading-tight">{cat.title}</h3>
                                    <p className="text-lg leading-snug text-white/70">{cat.description}</p>
                                </div>
                            </header>

                            <ul
                                className={`grid grid-cols-2 gap-2 sm:grid-cols-3 ${i === 0 ? 'md:grid-cols-4 lg:grid-cols-5' : ''}`}
                                aria-label={`${cat.title} skills`}
                            >
                                {cat.skills.map((skill) => (
                                    <li
                                        key={skill}
                                        className={`${slot} group flex items-center gap-2.5 px-2 py-2 transition-colors hover:border-gold hover:bg-void/60`}
                                    >
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-frame p-1.5 shadow-[inset_-2px_-2px_0_#B8BCD0]">
                                            <SkillIcon name={skill} className="size-6" />
                                        </span>
                                        <span className="min-w-0 flex-1 text-lg leading-tight">{skill}</span>
                                        <Hand className="-scale-x-100 max-sm:hidden" />
                                    </li>
                                ))}
                            </ul>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills
