import { lazy, Suspense } from 'react'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Related from './components/Related/Related'
import Footer from './components/Footer/Footer'
import ZoneBanner from './components/ZoneBanner'

// three.js lives in its own chunk so the UI paints before the 3D world loads.
const WorldScene = lazy(() => import('./components/Background/WorldScene'))

function AppContent() {
    return (
        <div className="relative flex min-h-screen flex-col font-sans text-ink">
            <Suspense fallback={null}>
                <WorldScene />
            </Suspense>

            <Navbar />
            <ZoneBanner />
            <main id="main-content" className="relative z-10 flex-1">
                <Hero />
                <About />
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
