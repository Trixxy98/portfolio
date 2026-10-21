import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import WorkspaceVisual from './Workspace'
import { projects } from '../data/projects'

export default function SelectedWork() {
  const railRef = useRef(null)
  const [position, setPosition] = useState({ index: 0, canPrev: false, canNext: projects.length > 1 })

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return undefined

    const update = () => {
      const card = rail.firstElementChild
      const step = card ? card.getBoundingClientRect().width + 20 : 1
      const next = {
        index: Math.min(Math.round(rail.scrollLeft / step), projects.length - 1),
        canPrev: rail.scrollLeft > 2,
        canNext: rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2,
      }
      setPosition((prev) => (
        prev.index === next.index && prev.canPrev === next.canPrev && prev.canNext === next.canNext
          ? prev
          : next
      ))
    }

    rail.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(rail)
    const frame = requestAnimationFrame(update)
    return () => {
      rail.removeEventListener('scroll', update)
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  const move = (direction) => {
    const rail = railRef.current
    if (!rail) return
    const width = rail.firstElementChild?.getBoundingClientRect().width || 350
    rail.scrollBy({
      left: (width + 20) * direction,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <section id="work" className="border-t border-neutral-800 px-8 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-6 font-mono text-base uppercase tracking-widest text-neutral-400 md:text-lg">Selected Work / {String(projects.length).padStart(2, '0')}</p>
            <h2 className="max-w-lg font-serif text-5xl font-light leading-[1.05] md:text-6xl">
              Built to <em className="text-[#9fd6ff]">make an impact.</em>
            </h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-neutral-400">
              A collection of things I&apos;ve designed, built and shipped.
            </p>
          </motion.div>
          <WorkspaceVisual />
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-400">
            Explore projects <span className="hidden sm:inline">/ scroll to browse</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="mr-2 font-mono text-xs tabular-nums text-[#9fd6ff]/75">
              {String(projects.length ? position.index + 1 : 0).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => move(-1)} disabled={!position.canPrev} aria-label="Previous project" className="flex size-9 items-center justify-center border border-white/15 text-white transition-colors hover:border-[#9fd6ff]/70 disabled:cursor-not-allowed disabled:opacity-30">←</button>
            <button type="button" onClick={() => move(1)} disabled={!position.canNext} aria-label="Next project" className="flex size-9 items-center justify-center border border-white/15 text-white transition-colors hover:border-[#9fd6ff]/70 disabled:cursor-not-allowed disabled:opacity-30">→</button>
          </div>
        </div>

        <div ref={railRef} role="list" aria-label="Projects" tabIndex={0} className="project-rail mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-3 outline-none focus-visible:ring-1 focus-visible:ring-[#9fd6ff]">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
