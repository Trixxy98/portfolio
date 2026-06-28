import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setIsOpen(false)

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-5 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-[#0b0b0b]/90 backdrop-blur-sm border-b border-neutral-800' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium tracking-tight">Harith Fakrullah</span>
          <span className="text-neutral-600 text-sm hidden md:block">| Software Developer</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#work" className="text-sm text-neutral-400 hover:text-white transition-colors">Work</a>
          <a href="#about" className="text-sm text-neutral-400 hover:text-white transition-colors">About</a>
          <a
            href="mailto:harithfakrullah@gmail.com"
            className="text-sm px-4 py-2 border border-neutral-600 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-200"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
            className="block w-6 h-px bg-white origin-center"
          />
          <motion.span
            animate={{ opacity: isOpen ? 0 : 1 }}
            className="block w-6 h-px bg-white"
          />
          <motion.span
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
            className="block w-6 h-px bg-white origin-center"
          />
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0b0b0b] flex flex-col items-center justify-center gap-10"
          >
            <a
              href="#work"
              onClick={close}
              className="font-serif text-4xl font-light text-white hover:text-neutral-400 transition-colors"
            >
              Work
            </a>
            <a
              href="#about"
              onClick={close}
              className="font-serif text-4xl font-light text-white hover:text-neutral-400 transition-colors"
            >
              About
            </a>
            <a
              href="mailto:harithfakrullah@gmail.com"
              onClick={close}
              className="mt-4 text-sm px-6 py-3 border border-neutral-600 rounded-full hover:bg-white hover:text-black transition-all duration-200"
            >
              Get in touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}