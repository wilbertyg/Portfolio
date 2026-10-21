import { lazy, Suspense } from 'react'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Marquee from './components/Marquee/Marquee'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Related from './components/Related/Related'
import Footer from './components/Footer/Footer'
import { CursorTrail } from './components/fx'

// three.js is the bulk of the bundle; load it after the page content.
const SceneBackground = lazy(() => import('./components/Background/SceneBackground'))

function AppContent() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-clip font-sans text-[#0B0B0F] selection:bg-[#7C3AED] selection:text-white dark:text-[#F4F4F5] dark:selection:bg-[#A78BFA] dark:selection:text-[#05050A]">
            {/* Three.js scene: iridescent core + scroll-morphing particle field */}
            <Suspense fallback={null}>
                <SceneBackground />
            </Suspense>
            <CursorTrail />

            <Navbar />
            <main id="main-content" className="relative z-10 flex-1">
                <About />
                <Marquee />
                <Skills />
                <Projects />
                <Related />
            </main>
            <Footer />
        </div>
    )
}

function App() {
    return (
        <ThemeProvider>
            <MotionConfig reducedMotion="user">
                <AppContent />
            </MotionConfig>
        </ThemeProvider>
    )
}

export default App
