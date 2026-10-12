import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Related from './components/Related/Related'
import Footer from './components/Footer/Footer'

function AppContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FBFBFA] dark:bg-[#111112] text-[#111111] dark:text-[#FBFBFA] font-sans selection:bg-[#E1F3FE] selection:text-[#1F6C9F] dark:selection:bg-[#1E3A5F] dark:selection:text-[#93C5FD] transition-colors duration-200">
      {/* Light mode: subtle dark ambient radial depth */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-100 dark:hidden"
        style={{
          backgroundImage:
            'radial-gradient(at 15% 15%, rgba(17, 17, 17, 0.04) 0px, transparent 55%), radial-gradient(at 85% 80%, rgba(17, 17, 17, 0.035) 0px, transparent 55%)',
        }}
        aria-hidden="true"
      />

      {/* Dark mode: subtle white ambient radial glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden opacity-100 dark:block"
        style={{
          backgroundImage:
            'radial-gradient(at 15% 15%, rgba(255, 255, 255, 0.055) 0px, transparent 55%), radial-gradient(at 85% 80%, rgba(255, 255, 255, 0.045) 0px, transparent 55%)',
        }}
        aria-hidden="true"
      />

      <Navbar />
      <main className="relative z-10 flex-1">
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

