import './App.css'
import About from './components/About/About'
import Navbar from './components/Navbar/Navbar'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Related from './components/Related/Related'

function App() {
  return (
    <>
      <Navbar />
      <About />
      <Skills />
      <Projects />
      <Related />
    </>
  )
}

export default App
