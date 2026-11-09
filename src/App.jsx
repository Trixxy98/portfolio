import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SelectedWork from './components/SelectedWork'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import GithubContributions from './components/GithubContributions'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import { useSmoothScroll, scrollToHash } from './hooks/useSmoothScroll'

function App() {
  useSmoothScroll()

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus({ preventScroll: true })
          scrollToHash('#top')
        }}
      >
        Skip to content
      </a>
      <ScrollProgress />
      <div className="relative z-0 bg-ink text-paper font-sans">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-ink"
        />
        <header className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </header>
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <SelectedWork />
          <About />
          <GithubContributions />
          <Skills />
          <Experience />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}

export default App
