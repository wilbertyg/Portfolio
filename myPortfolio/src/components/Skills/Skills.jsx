import { useState } from 'react'
import { skillCategories } from './SkillList'
import TornadoHelix from './TornadoHelix'
import SkillListView from './SkillListView'
import SectionHeader from '../SectionHeader'
import { motion, AnimatePresence } from 'motion/react'

function TornadoIcon({ className = 'size-3.5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21 4H3" />
            <path d="M19 8H5" />
            <path d="M17 12H7" />
            <path d="M15 16H9" />
            <path d="M13 20h-2" />
        </svg>
    )
}

function ListIcon({ className = 'size-3.5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    )
}

function Skills() {
    // Tornado helix is the default view as requested
    const [viewMode, setViewMode] = useState('tornado')
    const [activeStrand, setActiveStrand] = useState(null)

    return (
        <section id="skills" className="relative w-full bg-transparent px-6 py-20 md:py-28">
            <div className="mx-auto w-full max-w-5xl">
                <SectionHeader
                    tag="Capabilities"
                    title="Technical Expertise"
                    aside={
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            {/* Primary Interface Switcher: 3D Tornado vs Normal List */}
                            <div
                                role="tablist"
                                aria-label="Skill display interface"
                                className="flex items-center gap-1 self-start rounded-full border border-[#EAEAEA] bg-[#F7F6F3] p-1 dark:border-[#27272A] dark:bg-[#18181A] sm:self-auto"
                            >
                                <button
                                    type="button"
                                    id="tab-tornado"
                                    role="tab"
                                    aria-selected={viewMode === 'tornado'}
                                    aria-controls="skills-display-panel"
                                    onClick={() => setViewMode('tornado')}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors duration-150 active:scale-[0.98] ${
                                        viewMode === 'tornado'
                                            ? 'border border-[#EAEAEA] bg-white font-semibold text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-[#2E2E32] dark:bg-[#222225] dark:text-[#FBFBFA]'
                                            : 'text-[#71717A] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                                    }`}
                                >
                                    <TornadoIcon className="size-3.5" />
                                    <span>3D Tornado</span>
                                </button>
                                <button
                                    type="button"
                                    id="tab-list"
                                    role="tab"
                                    aria-selected={viewMode === 'list'}
                                    aria-controls="skills-display-panel"
                                    onClick={() => setViewMode('list')}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors duration-150 active:scale-[0.98] ${
                                        viewMode === 'list'
                                            ? 'border border-[#EAEAEA] bg-white font-semibold text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-[#2E2E32] dark:bg-[#222225] dark:text-[#FBFBFA]'
                                            : 'text-[#71717A] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                                    }`}
                                >
                                    <ListIcon className="size-3.5" />
                                    <span>Normal List</span>
                                </button>
                            </div>

                            {/* Strand Filter (only relevant when in 3D Tornado mode) */}
                            {viewMode === 'tornado' && (
                                <div
                                    role="group"
                                    aria-label="Filter by helix strand"
                                    className="flex items-center gap-1.5 self-start rounded-full border border-[#EAEAEA] bg-[#F7F6F3] p-1 dark:border-[#27272A] dark:bg-[#18181A] sm:self-auto"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setActiveStrand(null)}
                                        className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-150 ${
                                            activeStrand === null
                                                ? 'border border-[#EAEAEA] bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-[#2E2E32] dark:bg-[#222225] dark:text-[#FBFBFA]'
                                                : 'text-[#71717A] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                                        }`}
                                    >
                                        All Strands
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveStrand(activeStrand === 'α' ? null : 'α')}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-150 ${
                                            activeStrand === 'α'
                                                ? 'border border-[#EAEAEA] bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-[#2E2E32] dark:bg-[#222225] dark:text-[#FBFBFA]'
                                                : 'text-[#71717A] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                                        }`}
                                    >
                                        <span className="size-1.5 rounded-full bg-[#1F6C9F]" />
                                        Strand α
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveStrand(activeStrand === 'β' ? null : 'β')}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-150 ${
                                            activeStrand === 'β'
                                                ? 'border border-[#EAEAEA] bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-[#2E2E32] dark:bg-[#222225] dark:text-[#FBFBFA]'
                                                : 'text-[#71717A] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                                        }`}
                                    >
                                        <span className="size-1.5 rounded-full bg-[#346538]" />
                                        Strand β
                                    </button>
                                </div>
                            )}
                        </div>
                    }
                />

                {/* Main Dynamic Container: 3D Tornado Helix OR Normal Categorized List */}
                <div
                    id="skills-display-panel"
                    role="tabpanel"
                    aria-labelledby={viewMode === 'tornado' ? 'tab-tornado' : 'tab-list'}
                    className="overflow-hidden rounded-[10px] border border-[#EAEAEA] bg-white dark:border-[#27272A] dark:bg-[#111112]"
                >
                    <AnimatePresence mode="wait">
                        {viewMode === 'tornado' ? (
                            <motion.div
                                key="tornado"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <TornadoHelix
                                    activeStrand={activeStrand}
                                    onSwitchToList={() => setViewMode('list')}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <SkillListView
                                    onSwitchToTornado={() => setViewMode('tornado')}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Accessible Content for Assistive Tech */}
                <div className="sr-only">
                    {skillCategories.map((cat) => (
                        <div key={cat.id}>
                            <h3>{cat.title}</h3>
                            <ul>
                                {cat.skills.map((s) => (
                                    <li key={`${cat.id}-${s}`}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills