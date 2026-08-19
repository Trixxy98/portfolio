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
import ParticleBackground from './components/ParticleBackground'
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
      <main className="bg-[#0b0b0b] text-white font-sans relative">
        <ParticleBackground />
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
