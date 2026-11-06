import { useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SelectedWork from './components/SelectedWork'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import GithubContributions from './components/GithubContributions'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ScrollProgress from './components/ScrollProgress'
import CustomCursor from './components/CustomCursor'
import NoiseOverlay from './components/NoiseOverlay'
import { useSmoothScroll, scrollToHash } from './hooks/useSmoothScroll'
import TickerTape from './components/TickerTape'
import TerminalHud from './components/TerminalHud'

const INTRO_KEY = 'hf-intro-seen'

function shouldSkipIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

function App() {
  const [loaderDone, setLoaderDone] = useState(shouldSkipIntro)

  const finishIntro = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      // Storage unavailable (private mode); intro will simply replay.
    }
    setLoaderDone(true)
  }

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
      <CustomCursor />
      <NoiseOverlay />
      {!loaderDone && <LoadingScreen onComplete={finishIntro} />}
      <ScrollProgress />
      <TerminalHud />
      <div className="relative z-0 bg-[#101820] text-[#eee9df] font-sans">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[#101820]"
        />
        <header className="fixed top-0 left-0 right-0 z-50">
          <TickerTape />
          <Navbar />
        </header>
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero introComplete={loaderDone} />
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
