import { ThemeProvider } from './context/ThemeContext'
import PrismBackground from './components/Background/PrismBackground'
import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Related from './components/Related/Related'
import Footer from './components/Footer/Footer'

function AppContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-transparent text-[#111111] dark:text-[#FBFBFA] font-sans selection:bg-[#E1F3FE] selection:text-[#1F6C9F] dark:selection:bg-[#1E3A5F] dark:selection:text-[#93C5FD] transition-colors duration-200">
      {/* WebGL Prismatic Light Ribbon Background */}
      <PrismBackground />

      <Navbar />
      <main id="main-content" className="relative z-10 flex-1">
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

