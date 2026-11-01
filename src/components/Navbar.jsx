import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton'
import ScrambleText from './ScrambleText'

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
        className={`px-6 md:px-8 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-[#101820]/92 backdrop-blur-sm border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium tracking-tight text-[#eee9df]">Harith Fakrullah</span>
          <span className="text-[#84949b] text-[10px] font-mono tracking-widest hidden md:block">
            SYS/OK
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#work" className="text-sm text-[#c1c9c8] hover:text-white transition-colors">
            <ScrambleText text="Work" />
          </a>
          <a href="#about" className="text-sm text-[#c1c9c8] hover:text-white transition-colors">
            <ScrambleText text="About" />
          </a>
          <MagneticButton
            href="mailto:harithfakrullah@gmail.com"
            className="text-sm px-4 py-2 border border-white/20 rounded-full hover:bg-[#eee9df] hover:text-[#101820] hover:border-[#eee9df] transition-all duration-200"
          >
            <ScrambleText text="Get in touch" />
          </MagneticButton>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#101820] text-[#eee9df] flex flex-col items-center justify-center gap-10"
          >
            <a href="#work" onClick={close} className="font-serif text-4xl font-light text-[#eee9df] hover:text-[#9fbeca] transition-colors">
              Work
            </a>
            <a href="#about" onClick={close} className="font-serif text-4xl font-light text-[#eee9df] hover:text-[#9fbeca] transition-colors">
              About
            </a>
            <a href="mailto:harithfakrullah@gmail.com" onClick={close} className="mt-4 text-sm px-6 py-3 border border-white/20 rounded-full hover:bg-[#eee9df] hover:text-[#101820] transition-all duration-200">
              Get in touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
