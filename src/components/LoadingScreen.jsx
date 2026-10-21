import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const TEAMS = [
  { name: 'McLaren', src: '/logos/f1/blueprint/mclaren.png' },
  { name: 'Ferrari', src: '/logos/f1/blueprint/ferrari.png' },
  { name: 'Mercedes', src: '/logos/f1/blueprint/mercedes.png' },
  { name: 'Red Bull Racing', src: '/logos/f1/blueprint/redbull.png' },
  { name: 'Aston Martin', src: '/logos/f1/blueprint/astonmartin.png' },
  { name: 'Alpine', src: '/logos/f1/blueprint/alpine.png' },
  { name: 'Williams', src: '/logos/f1/blueprint/williams.png' },
  { name: 'Racing Bulls', src: '/logos/f1/blueprint/racingbulls.png' },
  { name: 'Kick Sauber', src: '/logos/f1/blueprint/sauber.png' },
  { name: 'Haas', src: '/logos/f1/blueprint/haas.png' },
]

const STEP = 0.42
const TOTAL = TEAMS.length * STEP

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true)
    }, 4000)

    Promise.all(TEAMS.map(({ src }) => new Promise((resolve) => {
      const image = new Image()
      image.onload = resolve
      image.onerror = resolve
      image.src = src
    }))).then(() => {
      if (!cancelled) {
        window.clearTimeout(timeout)
        setReady(true)
      }
    })

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    // Keep the final team visible until the intro slides away.
    const id = window.setInterval(() => {
      setIndex((i) => Math.min(i + 1, TEAMS.length - 1))
    }, STEP * 1000)
    return () => window.clearInterval(id)
  }, [ready])

  useGSAP(() => {
    if (!ready) return
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
      delay: TOTAL,
      onComplete,
    })
  }, { scope: containerRef, dependencies: [ready] })

  const team = TEAMS[index]

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] h-screen h-dvh overflow-hidden bg-[#061018]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(20,48,68,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(20,48,68,0.55) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 py-4">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.4em] text-[#9fd6ff]/60 sm:mb-8">
          The Grid
        </p>

        <div className="relative grid h-[clamp(120px,28dvh,220px)] w-[min(85vw,380px)] place-items-center bg-[radial-gradient(ellipse_at_center,rgba(20,48,68,0.5),rgba(6,16,24,0.2)_75%)]">
          <AnimatePresence>
            {ready && (
              <motion.img
                key={team.src}
                src={team.src}
                alt={team.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute max-h-[75%] max-w-[80%] object-contain"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
