import { motion } from 'motion/react'
import { skillCategories } from './SkillList'
import { SkillIcon } from './SkillIcons'
import SectionHeader from '../SectionHeader'
import { CountUp, EASE, SpotlightLayer, useSpotlight } from '../fx'
import { ProjectList } from '../Projects/ProjectList'
import { RelatedList } from '../Related/RelatedList'

const totalSkills = new Set(skillCategories.flatMap((c) => c.skills)).size

const stats = [
    { label: 'Technologies', value: totalSkills },
    { label: 'Projects', value: ProjectList.length },
    { label: 'Credentials', value: RelatedList.length },
]

// The first category is the headline card: it spans two columns and both rows on desktop.
const layout = ['md:col-span-2 md:row-span-2', 'md:col-span-1', 'md:col-span-1']

function CategoryCard({ cat, index }) {
    const onMove = useSpotlight()
    const featured = index === 0
    return (
        <motion.article
            onPointerMove={onMove}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE, delay: index * 0.12 }}
            className={`group relative flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white/55 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-black/20 sm:p-8 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20 ${layout[index]}`}
        >
            <SpotlightLayer />
            <header className="relative flex items-start justify-between gap-4">
                <div>
                    <div className="mb-3 flex items-center gap-2.5">
                        <span className={`size-2 rounded-full ${cat.dot}`} />
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#78716C] dark:text-[#71717A]">
                            0{index + 1} / {cat.skills.length} tools
                        </span>
                    </div>
                    <h3 className={`font-semibold tracking-[-0.035em] text-[#0B0B0F] dark:text-[#F4F4F5] ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                        {cat.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#57534E] dark:text-[#A1A1AA]">{cat.description}</p>
                </div>
            </header>

            <ul className={`relative mt-8 grid gap-2.5 ${featured ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
                {cat.skills.map((skill, i) => (
                    <motion.li
                        key={skill}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE, delay: 0.25 + index * 0.1 + i * 0.04 }}
                        className="group/skill flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/60 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:bg-white hover:shadow-[0_10px_30px_-12px_rgba(124,58,237,0.45)] dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-[#A78BFA]/40 dark:hover:bg-white/[0.07] dark:hover:shadow-[0_10px_30px_-12px_rgba(167,139,250,0.5)]"
                    >
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-500 group-hover/skill:rotate-[8deg] group-hover/skill:scale-110">
                            <SkillIcon name={skill} className="size-5" />
                        </span>
                        <span className="min-w-0 text-sm leading-tight font-medium tracking-tight text-[#0B0B0F] dark:text-[#F4F4F5]">{skill}</span>
                    </motion.li>
                ))}
            </ul>
        </motion.article>
    )
}

function Skills() {
    return (
        <section id="skills" className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-36">
            <SectionHeader
                index="01"
                tag="Capabilities"
                title="Technical Expertise"
                aside={
                    <dl className="flex gap-8 sm:gap-10">
                        {stats.map((s) => (
                            <div key={s.label} className="flex flex-col-reverse">
                                <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#78716C] dark:text-[#71717A]">{s.label}</dt>
                                <dd className="bg-gradient-to-b from-[#0B0B0F] to-[#0B0B0F]/50 bg-clip-text text-5xl font-semibold tracking-[-0.05em] text-transparent tabular-nums dark:from-white dark:to-white/40">
                                    <CountUp value={s.value} />
                                </dd>
                            </div>
                        ))}
                    </dl>
                }
            >
                From research notebooks to production pipelines — the languages, frameworks and tools I reach for.
            </SectionHeader>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
                {skillCategories.map((cat, i) => (
                    <CategoryCard key={cat.id} cat={cat} index={i} />
                ))}
            </div>
        </section>
    )
}

export default Skills
