import { lazy, Suspense, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import MagneticButton from './MagneticButton'
import { scrollToHash } from '../hooks/useSmoothScroll'

const BlueprintCar = lazy(() => import('./BlueprintCar'))

const headingLines = [
  ["I'm", 'Harith.'],
  ['a', 'software', 'developer'],
  ['based', 'in', 'Malaysia.'],
]

const infoItems = [
  { label: 'Based', value: 'Rembau, Negeri Sembilan' },
  { label: 'Focus', value: 'Frontend & Full-Stack Dev' },
  { label: 'Languages', value: 'Malay, English, Mandarin' },
  { label: 'Open for', value: 'Freelance & Opportunities' },
]

export default function Hero({ introComplete = true }) {
  const headingRef = useRef(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const words = headingRef.current.querySelectorAll('.word-inner')
    gsap.from(words, {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.06,
      ease: 'power4.out',
      delay: 0.2,
    })
  }, { scope: headingRef })

  return (
    <section id="top" className="relative min-h-screen">
      <Suspense fallback={null}>
        <BlueprintCar introComplete={introComplete} />
      </Suspense>
      <div className="relative z-10 flex min-h-screen flex-col pt-32 px-8 max-w-7xl mx-auto text-[#eee9df]">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] rounded-full bg-[#527f91]/15 blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Heading */}
      <div className="flex flex-1 flex-col items-start gap-6 pt-4 md:pt-8">
        <h1
          ref={headingRef}
          aria-label="I'm Harith, a software developer based in Malaysia."
          className="relative max-w-3xl font-serif font-light text-[clamp(2.6rem,9vw,4.5rem)] leading-[1.03] tracking-tight lg:text-[clamp(4rem,5vw,5.25rem)]"
        >
          {headingLines.map((line, index) => (
            <span key={index} className="block" aria-hidden="true">
              {line.map((word) => (
                <span key={word} className="mr-[0.2em] inline-block overflow-hidden align-bottom">
                  {word === 'Harith.' ? (
                    <em className="word-inner block italic text-[#a9c0c9] underline decoration-[#a9c0c9]/40 underline-offset-4">
                      {word}
                    </em>
                  ) : (
                    <span className="word-inner block">{word}</span>
                  )}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="relative max-w-md text-base leading-7 text-[#c1c9c8] md:text-lg"
        >
          I build thoughtful, performant web experiences, from polished React interfaces to AI-powered full-stack apps.
        </motion.p>
      </div>

      {/* Bottom: Info + resume */}
      <div className="flex flex-col items-start justify-between gap-8 pb-12 mt-8 md:flex-row md:items-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 gap-x-12 gap-y-5"
        >
          {infoItems.map((item) => (
            <div key={item.label}>
              <p className="text-xs font-mono uppercase tracking-widest text-[#aebbc0] mb-1">
                {item.label}
              </p>
              <p className="text-base text-[#c1c9c8]">{item.value}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-wrap items-center gap-3"
        >
          <MagneticButton
            href="#work"
            onClick={(e) => { e.preventDefault(); scrollToHash('#work') }}
            className="inline-flex items-center gap-2 rounded-full border border-[#eee9df] bg-[#eee9df] px-5 py-2.5 text-sm font-medium text-[#101820] transition-all duration-200 hover:border-[#9fbeca] hover:bg-[#9fbeca]"
          >
            View my work
            <span aria-hidden="true">↓</span>
          </MagneticButton>
          <MagneticButton
            href="/Resume_Mohd_Harith_Fakrullah.pdf"
            download="Harith_Fakrullah_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-[#c1c9c8] transition-all duration-200 hover:border-[#a9c0c9] hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Resume
          </MagneticButton>
        </motion.div>
      </div>
      </div>
    </section>
  )
}
