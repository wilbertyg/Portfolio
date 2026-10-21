import { motion } from 'motion/react'
import { skillCategories } from '../Skills/SkillList'
import { SkillIcon } from '../Skills/SkillIcons'

const SKILLS = [...new Set(skillCategories.flatMap((c) => c.skills))]

function Row({ items, reverse = false, duration = 60 }) {
    return (
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <motion.ul
                className="flex shrink-0 items-center gap-10 pr-10"
                animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
                transition={{ duration, ease: 'linear', repeat: Infinity }}
            >
                {[...items, ...items].map((skill, i) => (
                    <li key={`${skill}-${i}`} aria-hidden={i >= items.length || undefined} className="flex shrink-0 items-center gap-10">
                        <span className="flex items-center gap-4">
                            <span className="grid size-10 place-items-center rounded-xl bg-white/90 shadow-sm ring-1 ring-black/5 sm:size-12">
                                <SkillIcon name={skill} className="size-5 sm:size-6" />
                            </span>
                            <span className="text-3xl font-semibold tracking-[-0.04em] whitespace-nowrap text-[#0B0B0F] sm:text-5xl dark:text-[#F4F4F5]">
                                {skill}
                            </span>
                        </span>
                        <span aria-hidden="true" className="text-2xl text-[#7C3AED] dark:text-[#A78BFA]">✦</span>
                    </li>
                ))}
            </motion.ul>
        </div>
    )
}

function Marquee() {
    const half = Math.ceil(SKILLS.length / 2)
    return (
        <div aria-label="Technologies I work with" role="region" className="relative z-10 flex flex-col gap-6 border-y border-black/10 bg-white/30 py-10 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.015]">
            <Row items={SKILLS.slice(0, half)} />
            <Row items={SKILLS.slice(half)} reverse duration={70} />
        </div>
    )
}

export default Marquee
