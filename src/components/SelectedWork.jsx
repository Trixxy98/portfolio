import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'
import SectionHeader from './SectionHeader'
import { projects } from '../data/projects'

const WorkspaceVisual = lazy(() => import('./Workspace'))

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

  const goTo = (i) => {
    const rail = railRef.current
    const card = rail?.children[i]
    if (!card) return
    rail.scrollTo({
      left: card.offsetLeft - rail.firstElementChild.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <section id="work" className="border-t border-white/10 px-8 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
          <SectionHeader
            index="01"
            eyebrow={`Selected Work / ${String(projects.length).padStart(2, '0')} projects`}
            title="Built to"
            accent="make an impact."
            description="A collection of things I've designed, built and shipped."
          />
          <Suspense fallback={<div className="h-[280px] border border-white/10 sm:h-[320px] md:h-[340px] lg:h-[380px]" />}>
            <WorkspaceVisual />
          </Suspense>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#c1c9c8]">
            Explore projects <span className="hidden sm:inline">/ scroll to browse</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="mr-2 font-mono text-xs tabular-nums text-[#a9c0c9]">
              {String(projects.length ? position.index + 1 : 0).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => move(-1)} disabled={!position.canPrev} aria-label="Previous project" className="flex size-9 items-center justify-center border border-white/20 text-[#eee9df] transition-colors hover:border-[#9fbeca] disabled:cursor-not-allowed disabled:opacity-30">←</button>
            <button type="button" onClick={() => move(1)} disabled={!position.canNext} aria-label="Next project" className="flex size-9 items-center justify-center border border-white/20 text-[#eee9df] transition-colors hover:border-[#9fbeca] disabled:cursor-not-allowed disabled:opacity-30">→</button>
          </div>
        </div>

        <div ref={railRef} role="list" aria-label="Projects" tabIndex={0} className="project-rail mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-3 outline-none focus-visible:ring-1 focus-visible:ring-[#9fbeca]">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="mt-5 flex justify-center gap-2" role="group" aria-label="Jump to project">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${project.title}`}
              aria-current={position.index === i ? 'true' : undefined}
              className="group flex h-6 items-center"
            >
              <span
                className={`block h-px transition-all duration-300 ${
                  position.index === i ? 'w-8 bg-[#eee9df]' : 'w-4 bg-white/25 group-hover:bg-[#9fbeca]'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
