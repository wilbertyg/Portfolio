import { useTheme } from '../../context/ThemeContext'

function SunIcon({ className = 'size-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </svg>
    )
}

function MoonIcon({ className = 'size-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    )
}

function ThemeToggle({ className = '', showLabel = false }) {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`group inline-flex size-9 items-center justify-center gap-2 rounded-full text-xs font-medium text-[#0B0B0F] transition-all duration-300 hover:bg-black/5 active:scale-[0.92] dark:text-[#F4F4F5] dark:hover:bg-white/10 ${className}`}
        >
            <span className="relative flex size-4 items-center justify-center transition-transform duration-500 group-hover:rotate-[30deg]">
                {isDark ? (
                    <SunIcon className="size-4" />
                ) : (
                    <MoonIcon className="size-4" />
                )}
            </span>
            {showLabel && (
                <span className="font-sans text-xs">
                    {isDark ? 'Light mode' : 'Dark mode'}
                </span>
            )}
        </button>
    )
}

export default ThemeToggle
