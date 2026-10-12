import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Related from './components/Related/Related'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FBFBFA] text-[#111111] font-sans selection:bg-[#E1F3FE] selection:text-[#1F6C9F]">
      {/* Subtle Warm Atmospheric Grain / Ambient Radial Accent (Minimalist UI) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(at 15% 15%, rgba(225, 243, 254, 0.35) 0px, transparent 50%), radial-gradient(at 85% 80%, rgba(237, 243, 236, 0.4) 0px, transparent 50%)',
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

export default App
