import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const words1 = ['Software', 'Developer', 'based', 'in']
const words2 = ['Building', 'clean,', 'performant', 'web', 'experiences.']

const infoItems = [
  { label: 'Based', value: 'Rembau, Negeri Sembilan' },
  { label: 'Focus', value: 'Frontend & Full-Stack Dev' },
  { label: 'Languages', value: 'Malay, English, Mandarin' },
  { label: 'Open for', value: 'Freelance & Opportunities' },
]

export default function Hero() {
  const headingRef = useRef(null)

  useGSAP(() => {
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
    <section className="relative min-h-screen flex flex-col pt-20 px-8 max-w-7xl mx-auto">

      {/* Heading */}
      <div className="flex-1 flex items-center">
        <h1
          ref={headingRef}
          className="font-serif font-light text-5xl md:text-7xl lg:text-[90px] leading-[1.05] tracking-tight max-w-4xl"
        >
          {words1.map((word) => (
            <span key={word} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
              <span className="word-inner block">{word}</span>
            </span>
          ))}
          <span className="inline-block overflow-hidden align-bottom mr-[0.25em]">
            <em className="word-inner block italic text-violet-300 underline underline-offset-4 decoration-violet-400/40">
              Malaysia.
            </em>
          </span>
          {words2.map((word) => (
            <span key={word} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
              <span className="word-inner block">{word}</span>
            </span>
          ))}
        </h1>
      </div>

      {/* Bottom: Info + Photo */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 pb-12 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 gap-x-12 gap-y-5"
        >
          {infoItems.map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
                {item.label}
              </p>
              <p className="text-sm text-neutral-200">{item.value}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="w-full max-w-[280px] md:w-96 h-[300px] md:h-[500px] rounded-2xl overflow-hidden bg-neutral-800 shrink-0 relative"
        >
          <img
            src="/photo.jpg"
            alt="Harith Fakrullah"
            className="w-full h-full object-cover object-top"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-xs">
           
          </div>
        </motion.div>
      </div>
    </section>
  )
}