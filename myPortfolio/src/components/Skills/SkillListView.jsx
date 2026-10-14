import { useState } from 'react'
import { skillCategories } from './SkillList'
import { SkillIcon } from './SkillIcons'
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

function SkillListView({ onSwitchToTornado }) {
    const [selectedCategory, setSelectedCategory] = useState('all')

    const totalSkillCount = new Set(
        skillCategories.flatMap((cat) => cat.skills)
    ).size

    const displayedCategories =
        selectedCategory === 'all'
            ? skillCategories
            : skillCategories.filter((cat) => cat.id === selectedCategory)

    return (
        <div className="relative w-full bg-white transition-colors duration-200 dark:bg-[#111112]">
            {/* Top Atmospheric Control Bar */}
            <div className="flex flex-col gap-3 border-b border-[#EAEAEA] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3.5 dark:border-[#27272A]">
                {/* Category Filter Tabs */}
                <div
                    role="tablist"
                    aria-label="Filter skills by category"
                    className="flex flex-wrap items-center gap-1"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === 'all'}
                        onClick={() => setSelectedCategory('all')}
                        className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-150 ${
                            selectedCategory === 'all'
                                ? 'border border-[#EAEAEA] bg-[#F7F6F3] text-[#111111] dark:border-[#2E2E32] dark:bg-[#18181A] dark:text-[#FBFBFA]'
                                : 'text-[#71717A] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                        }`}
                    >
                        All ({totalSkillCount})
                    </button>
                    {skillCategories.map((cat) => {
                        const isActive = selectedCategory === cat.id
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-150 ${
                                    isActive
                                        ? 'border border-[#EAEAEA] bg-[#F7F6F3] text-[#111111] dark:border-[#2E2E32] dark:bg-[#18181A] dark:text-[#FBFBFA]'
                                        : 'text-[#71717A] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                                }`}
                            >
                                <span className={`size-1.5 rounded-full ${cat.dot}`} />
                                <span className="truncate max-w-[130px] sm:max-w-none">
                                    {cat.title}
                                </span>
                                <span className="text-[10px] opacity-60">
                                    ({cat.skills.length})
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Switch back to 3D Tornado button */}
                {onSwitchToTornado && (
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={onSwitchToTornado}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEAEA] bg-white px-3 py-1 font-mono text-[10px] font-medium text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#F7F6F3] active:scale-[0.98] dark:border-[#27272A] dark:bg-[#18181A] dark:text-[#FBFBFA] dark:hover:bg-[#222225]"
                            aria-label="Switch back to 3D Tornado View"
                        >
                            <TornadoIcon className="size-3 text-[#1F6C9F]" />
                            <span>3D Tornado</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Categorized Skills Body */}
            <div className="p-5 sm:p-7 md:p-8 space-y-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        {displayedCategories.map((cat) => (
                            <div key={cat.id} className="space-y-3.5">
                                {/* Category Header */}
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${cat.dot}`} />
                                        <h3 className="font-sans text-base font-semibold tracking-tight text-[#111111] dark:text-[#FBFBFA]">
                                            {cat.title}
                                        </h3>
                                        <span className="rounded-full border border-[#EAEAEA] bg-[#F7F6F3] px-2 py-0.5 font-mono text-[10px] text-[#71717A] dark:border-[#27272A] dark:bg-[#18181A] dark:text-[#A1A1AA]">
                                            {cat.skills.length}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                                        {cat.description}
                                    </p>
                                </div>

                                {/* Skills Grid */}
                                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                                    {cat.skills.map((skill) => (
                                        <li
                                            key={`${cat.id}-${skill}`}
                                            className="group relative flex items-center gap-3.5 rounded-[12px] border border-[#EAEAEA] bg-[#FBFBFA] p-3 transition-all duration-150 hover:border-[#111111] hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 active:scale-[0.98] dark:border-[#27272A] dark:bg-[#141416] dark:hover:border-[#3F3F46] dark:hover:bg-[#18181A]"
                                        >
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-[9px] border border-[#EAEAEA] bg-white transition-colors group-hover:border-[#111111] dark:border-[#27272A] dark:bg-[#111112] dark:group-hover:border-[#3F3F46]">
                                                <SkillIcon name={skill} className="size-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-sans text-sm font-medium tracking-tight text-[#111111] dark:text-[#FBFBFA]">
                                                    {skill}
                                                </p>
                                                <span className="font-mono text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                                                    {cat.title.split('&')[0].trim()}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default SkillListView
