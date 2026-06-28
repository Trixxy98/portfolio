import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SelectedWork from './components/SelectedWork'
import WhatIDo from './components/WhatIDo'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Footer from './components/Footer'
import StarBackground from './components/StarBackground'
import LoadingScreen from './components/LoadingScreen'
import ScrollProgress from './components/ScrollProgress'
import CustomCursor from './components/CustomCursor'
import { useSmoothScroll } from './hooks/useSmoothScroll'

function App() {
  const [loaderDone, setLoaderDone] = useState(false)

  useSmoothScroll()

  return (
    <>
      <CustomCursor />
      {!loaderDone && <LoadingScreen onComplete={() => setLoaderDone(true)} />}
      <ScrollProgress />
      <main className="bg-[#0b0b0b] text-white font-sans relative">
        <StarBackground />
        <Navbar />
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