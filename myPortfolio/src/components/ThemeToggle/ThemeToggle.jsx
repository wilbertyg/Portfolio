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
            className={`inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#EAEAEA] bg-white p-2 text-xs font-medium text-[#111111] transition-all duration-150 hover:border-[#111111] hover:bg-[#F7F6F3] active:scale-[0.96] dark:border-[#27272A] dark:bg-[#18181A] dark:text-[#FBFBFA] dark:hover:border-[#3F3F46] dark:hover:bg-[#222225] ${className}`}
        >
            <span className="relative flex size-4 items-center justify-center transition-transform duration-200">
                {isDark ? (
                    <SunIcon className="size-4 text-[#FBFBFA] transition-transform duration-200 rotate-0 hover:rotate-45" />
                ) : (
                    <MoonIcon className="size-4 text-[#111111] transition-transform duration-200 rotate-0 hover:-rotate-12" />
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
