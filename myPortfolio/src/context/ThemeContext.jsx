import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
    theme: 'dark',
    isDark: true,
    toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme')
            if (saved === 'light' || saved === 'dark') return saved
        }
        // Default to dark mode as requested
        return 'dark'
    })

    const isDark = theme === 'dark'

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        try {
            localStorage.setItem('theme', theme)
        } catch {
            // handle private browsing quota exceptions
        }
    }, [theme, isDark])

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
