import { useState } from 'react'
import Card from '../Card/Card'
import { ProjectList } from './ProjectList'
import SectionHeader from '../SectionHeader'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { EASE } from '../fx'

const filters = ['All', 'Machine Learning', 'Deep Learning', 'Web Development']

const matches = (project, filter) => {
    if (filter === 'All') return true
    if (filter === 'Machine Learning') return ['Machine Learning', 'NLP & Transformers'].includes(project.category)
    return project.category === filter
}

function Projects() {
    const [selectedFilter, setSelectedFilter] = useState('All')
    const shouldReduceMotion = useReducedMotion()
    const filteredProjects = ProjectList.filter((p) => matches(p, selectedFilter))

    return (
        <section id="projects" className="relative w-full px-6 py-24 md:py-36">
            <div className="mx-auto w-full max-w-6xl">
                <SectionHeader
                    index="02"
                    tag="Selected Work"
                    title="Featured Projects"
                    aside={
                        <div
                            role="group"
                            aria-label="Filter projects"
                            className="flex flex-wrap items-center gap-1 rounded-full border border-black/10 bg-white/50 p-1 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
                        >
                            {filters.map((filter) => {
                                const isActive = selectedFilter === filter
                                return (
                                    <button
                                        key={filter}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => setSelectedFilter(filter)}
                                        className={`relative rounded-full px-3.5 py-1.5 font-mono text-[11px] transition-colors duration-300 active:scale-[0.97] ${
                                            isActive
                                                ? 'font-semibold text-white dark:text-[#0B0B0F]'
                                                : 'font-medium text-[#57534E] hover:text-[#0B0B0F] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="activeProjectFilter"
                                                className="absolute inset-0 rounded-full bg-[#0B0B0F] dark:bg-[#F4F4F5]"
                                                transition={
                                                    shouldReduceMotion
                                                        ? { duration: 0 }
                                                        : { type: 'spring', stiffness: 450, damping: 35 }
                                                }
                                            />
                                        )}
                                        <span className="relative z-10">{filter}</span>
                                    </button>
                                )
                            })}
                        </div>
                    }
                >
                    Predictive diagnostics, voice biometrics, and NLP transformer architectures.
                </SectionHeader>

                <motion.ul layout className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6" aria-live="polite">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, i) => (
                            <motion.li
                                key={project.id}
                                layout
                                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: '-60px' }}
                                exit={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
                                transition={{ duration: 0.8, ease: EASE, delay: (i % 2) * 0.12 }}
                                className={i % 2 ? 'md:translate-y-16' : ''}
                            >
                                <Card {...project} index={ProjectList.indexOf(project)} total={ProjectList.length} />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
                <div className="hidden h-16 md:block" aria-hidden="true" />
            </div>
        </section>
    )
}

export default Projects