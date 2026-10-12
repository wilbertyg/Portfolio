import { useState } from 'react'
import Card from '../Card/Card'
import { ProjectList } from './ProjectList'
import SectionHeader from '../SectionHeader'
import { motion, AnimatePresence } from 'motion/react'

const filters = ['All', 'Machine Learning', 'Deep Learning', 'Web Development']

const matches = (project, filter) => {
    if (filter === 'All') return true
    if (filter === 'Machine Learning') return ['Machine Learning', 'NLP & Transformers'].includes(project.category)
    return project.category === filter
}

function Projects() {
    const [selectedFilter, setSelectedFilter] = useState('All')
    const filteredProjects = ProjectList.filter((p) => matches(p, selectedFilter))

    return (
        <section id="projects" className="relative w-full px-6 py-20 md:py-28">
            <div className="mx-auto w-full max-w-5xl">
                <SectionHeader
                    tag="Portfolio"
                    title="Featured Projects"
                    aside={
                        <div
                            role="group"
                            aria-label="Filter projects"
                            className="flex flex-wrap items-center gap-1 rounded-full border border-[#EAEAEA] bg-[#F7F6F3] p-1 self-start md:self-auto dark:border-[#27272A] dark:bg-[#18181A]"
                        >
                            {filters.map((filter) => {
                                const isActive = selectedFilter === filter
                                return (
                                    <button
                                        key={filter}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => setSelectedFilter(filter)}
                                        className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors duration-150 ${
                                            isActive
                                                ? 'border border-[#EAEAEA] bg-white font-semibold text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-[#2E2E32] dark:bg-[#222225] dark:text-[#FBFBFA]'
                                                : 'font-medium text-[#787774] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                )
                            })}
                        </div>
                    }
                >
                    Predictive diagnostics, voice biometrics, and NLP transformer architectures.
                </SectionHeader>

                <motion.ul layout className="grid grid-cols-1 gap-5 md:grid-cols-2" aria-live="polite">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.li
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.25 }}
                            >
                                <Card {...project} />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            </div>
        </section>
    )
}

export default Projects