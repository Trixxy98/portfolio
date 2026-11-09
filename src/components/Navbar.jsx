import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton'
import ScrambleText from './ScrambleText'
import { scrollToHash, setScrollLocked } from '../hooks/useSmoothScroll'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contributions', label: 'Activity', wide: true },
  { href: '#skills', label: 'Skills', wide: true },
  { href: '#experience', label: 'Experience' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock page scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!isOpen) return undefined
    setScrollLocked(true)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
    }
  }, [isOpen])

  const goTo = (e, href) => {
    e.preventDefault()
    setIsOpen(false)
    scrollToHash(href)
  }

  return (
    <>
      <motion.nav
        aria-label="Primary"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-50 px-6 sm:px-8 py-4 transition-all duration-300 ${
          scrolled || isOpen ? 'bg-ink/92 backdrop-blur-sm border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#top" onClick={(e) => goTo(e, '#top')} className="-my-3 py-3 text-sm font-medium tracking-tight text-paper" aria-label="Harith Fakrullah, back to top">
          Harith Fakrullah
        </a>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => goTo(e, link.href)}
              className={`-my-3 py-3 text-sm text-muted hover:text-white transition-colors ${link.wide ? 'hidden lg:inline-block' : 'inline-block'}`}
            >
              <ScrambleText text={link.label} />
            </a>
          ))}
          <MagneticButton
            href="mailto:harithfakrullah@gmail.com"
            className="text-sm px-4 py-2 border border-white/20 hover:bg-paper hover:text-ink hover:border-paper transition-all duration-200"
          >
            <ScrambleText text="Get in touch" />
          </MagneticButton>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="md:hidden -mr-2 flex size-11 flex-col items-center justify-center gap-1.5"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
            className="block w-6 h-px bg-paper origin-center"
          />
          <motion.span
            animate={{ opacity: isOpen ? 0 : 1 }}
            className="block w-6 h-px bg-paper"
          />
          <motion.span
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
            className="block w-6 h-px bg-paper origin-center"
          />
        </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink text-paper flex flex-col items-center justify-center gap-8"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => goTo(e, link.href)}
                className="font-serif text-4xl font-light text-paper hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="mailto:harithfakrullah@gmail.com" onClick={() => setIsOpen(false)} className="mt-4 text-sm px-6 py-3 border border-white/20 hover:bg-paper hover:text-ink transition-all duration-200">
              Get in touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
