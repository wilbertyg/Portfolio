import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import Overworld from './components/Game/Overworld'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Related from './components/Related/Related'
import Footer from './components/Footer/Footer'

function AppContent() {
    return (
        <div className="relative flex min-h-screen flex-col font-sans text-ink selection:bg-gold selection:text-void dark:text-white">
            {/* Day: dotted game-manual parchment. Night: starfield. */}
            <div
                className="fixed inset-0 -z-10 bg-parch bg-[radial-gradient(rgb(92_63_40/0.14)_1px,transparent_1.5px)] bg-size-[14px_14px] dark:bg-night dark:bg-[radial-gradient(rgb(255_246_200/0.55)_1px,transparent_1.5px),radial-gradient(rgb(255_246_200/0.25)_1px,transparent_1.5px)] dark:bg-size-[97px_89px,41px_37px]"
                aria-hidden="true"
            />

            <Navbar />
            <main id="main-content" className="relative z-10 flex-1">
                <Overworld />
                <div className="h-2 bg-void" aria-hidden="true" />
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
            <AppContent />
        </ThemeProvider>
    )
}

export default App
