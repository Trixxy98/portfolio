import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SelectedWork from './components/SelectedWork'
import WhatIDo from './components/WhatIDo'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ScrollProgress from './components/ScrollProgress'
import CustomCursor from './components/CustomCursor'
import NoiseOverlay from './components/NoiseOverlay'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import TickerTape from './components/TickerTape'
import TerminalHud from './components/TerminalHud'

function App() {
  const [loaderDone, setLoaderDone] = useState(false)

  useSmoothScroll()

  return (
    <>
      <CustomCursor />
      <NoiseOverlay />
      {!loaderDone && <LoadingScreen onComplete={() => setLoaderDone(true)} />}
      <ScrollProgress />
      <TerminalHud />
      <main className="relative z-0 bg-[#061018] text-white font-sans">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(20,48,68,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(20,48,68,0.55) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <header className="fixed top-0 left-0 right-0 z-50">
          <TickerTape />
          <Navbar />
        </header>
        <Hero />
        <SelectedWork />
        <WhatIDo />
        <Skills />
        <Experience />
        <Footer />
      </main>
    </>
  )
}

export default App
