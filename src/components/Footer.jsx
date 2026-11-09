import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText'
import { formatMalaysiaTime } from '../utils/time'

function LiveClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(formatMalaysiaTime())
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return <span>{time}</span>
}

const EMAIL = 'harithfakrullah@gmail.com'

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 border border-white/15 px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-paper"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {copied
          ? <polyline points="20 6 9 17 4 12" />
          : <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>}
      </svg>
      <span aria-live="polite">{copied ? 'Copied!' : 'Copy email'}</span>
    </button>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 pt-20 pb-10 sm:px-8">
      <motion.div
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Label */}
        <ScrambleText
            text="Let's work together"
            as="p"
            className="text-base uppercase tracking-widest text-subtle mb-4 cursor-default md:text-lg"
          />

        {/* Email + portrait */}
        <div className="flex items-center gap-4 pb-6 md:gap-8">
          <a
            href={`mailto:${EMAIL}`}
            className="min-w-0 flex-1 break-words font-serif text-[clamp(1.25rem,5vw,2.4rem)] font-light leading-none tracking-tight text-paper transition-colors duration-300 hover:text-accent md:text-[clamp(2rem,5vw,5.5rem)]"
          >
            harithfakrullah<wbr />@gmail.com
          </a>
          <div className="size-20 shrink-0 overflow-hidden rounded-full border border-accent/50 bg-surface p-1 shadow-[0_8px_24px_rgba(0,0,0,0.3)] md:size-28 lg:size-36">
            <img
              src="/photo.webp"
              alt=""
              loading="lazy"
              className="size-full rounded-full object-cover object-center"
            />
          </div>
        </div>
        <CopyEmailButton />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 text-sm text-subtle">
          <div className="flex flex-wrap items-center gap-4">
            <span>Designed &amp; built by Harith Fakrullah</span>
            <span className="hidden md:block text-faint">·</span>
            <span className="font-mono tabular-nums">
              Rembau, <LiveClock />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://linkedin.com/in/harithfakrullah/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 border border-white/15 hover:border-accent hover:text-accent transition-all duration-200"
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
              className="flex items-center gap-1.5 px-4 py-2.5 border border-white/15 hover:border-accent hover:text-accent transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
        <p className="mt-6 text-xs text-subtle">
          3D car: <a href="https://sketchfab.com/3d-models/f1-2026-concept-polygon-model-ea3bde709b1e4dc9b0ec8557d106ed42" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-paper-dim">F1 2026 concept by Qvist_designs</a>
          {' · '}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-paper-dim">CC BY 4.0</a>
          {' · '}Optimised and restyled for this site.
        </p>
      </motion.div>
    </footer>
  )
}
