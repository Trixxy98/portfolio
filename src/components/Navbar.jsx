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
        className={`relative z-50 px-6 md:px-8 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled || isOpen ? 'bg-[#101820]/92 backdrop-blur-sm border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <a href="#top" onClick={(e) => goTo(e, '#top')} className="flex items-center gap-3" aria-label="Harith Fakrullah, back to top">
          <span className="text-sm font-medium tracking-tight text-[#eee9df]">Harith Fakrullah</span>
          <span className="text-[#aebbc0] text-[11px] font-mono tracking-widest hidden md:block">
            SYS/OK
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => goTo(e, link.href)}
              className={`text-sm text-[#c1c9c8] hover:text-white transition-colors ${link.wide ? 'hidden lg:inline' : ''}`}
            >
              <ScrambleText text={link.label} />
            </a>
          ))}
          <MagneticButton
            href="mailto:harithfakrullah@gmail.com"
            className="text-sm px-4 py-2 border border-white/20 rounded-full hover:bg-[#eee9df] hover:text-[#101820] hover:border-[#eee9df] transition-all duration-200"
          >
            <ScrambleText text="Get in touch" />
          </MagneticButton>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
            className="block w-6 h-px bg-[#eee9df] origin-center"
          />
          <motion.span
            animate={{ opacity: isOpen ? 0 : 1 }}
            className="block w-6 h-px bg-[#eee9df]"
          />
          <motion.span
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
            className="block w-6 h-px bg-[#eee9df] origin-center"
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#101820] text-[#eee9df] flex flex-col items-center justify-center gap-8"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => goTo(e, link.href)}
                className="font-serif text-4xl font-light text-[#eee9df] hover:text-[#9fbeca] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="mailto:harithfakrullah@gmail.com" onClick={() => setIsOpen(false)} className="mt-4 text-sm px-6 py-3 border border-white/20 rounded-full hover:bg-[#eee9df] hover:text-[#101820] transition-all duration-200">
              Get in touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
