import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function LiveClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return <span>{time}</span>
}

export default function Footer() {
  return (
    <footer className="px-8 pt-20 pb-10 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Label */}
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-4">
          Let's work together
        </p>

        {/* Big email */}
        <a
          href="mailto:harithfakrullah@gmail.com"
          className="block font-serif font-light text-[clamp(2.5rem,8vw,7rem)] leading-none tracking-tight text-white pb-6 hover:border-violet-400/60 hover:text-violet-200 transition-all duration-300"
        >
          harithfakrullah@gmail.com
        </a>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 text-sm text-neutral-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>Designed &amp; built by Harith Fakrullah</span>
            <span className="hidden md:block text-neutral-700">·</span>
            <span>
              Rembau, <LiveClock />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://linkedin.com/in/harithfakrullah/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 rounded-full hover:border-neutral-600 hover:text-white transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/Trixxy98"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 rounded-full hover:border-neutral-600 hover:text-white transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}