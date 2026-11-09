import { useState } from 'react'
import { motion } from 'framer-motion'

const GRID = {
  backgroundImage:
    'linear-gradient(rgba(159,190,202,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(159,190,202,0.12) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
}

/** Blueprint-style cover for projects without a screenshot yet. */
function BlueprintPoster({ project, index }) {
  return (
    <div className="relative flex h-full flex-col justify-between bg-ink-2 p-5" style={GRID}>
      <div className="flex items-start justify-between font-mono text-xs uppercase tracking-[0.18em] text-accent">
        <span>FIG. {String(index + 1).padStart(2, '0')}</span>
        <span>{project.year}</span>
      </div>
      <div>
        <p className="font-serif text-4xl font-light italic leading-none text-paper/90">{project.title}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="border border-accent/35 px-1.5 py-0.5 font-mono text-xs text-accent-soft">{t}</span>
          ))}
        </div>
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-dashed border-accent/25" />
    </div>
  )
}

export default function ProjectCard({ project, index }) {
  const href = project.live || project.github
  const [expanded, setExpanded] = useState(false)
  const descId = `project-desc-${project.id}`

  return (
    <motion.article
      role="listitem"
      aria-labelledby={`project-title-${project.id}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="group flex h-[460px] w-[min(82vw,340px)] shrink-0 snap-start flex-col overflow-hidden border border-white/10 bg-surface shadow-[0_12px_36px_rgba(0,0,0,0.22)] transition-colors hover:border-accent/40 md:h-[480px] md:w-[350px]"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title} ${project.live ? 'live site' : 'source code'} (new tab)`}
        className="relative block h-40 shrink-0 overflow-hidden border-b border-white/10 bg-surface-2 md:h-44"
        style={{ backgroundColor: project.color }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <BlueprintPoster project={project} index={index} />
        )}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
      </a>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between font-mono text-xs tracking-widest text-accent">
          <span>{String(index + 1).padStart(2, '0')} / PROJECT</span>
          <span>{project.year}</span>
        </div>
        <h3 id={`project-title-${project.id}`} className="font-serif text-3xl font-light leading-tight text-paper">{project.title}</h3>
        <p className="mt-1 truncate text-sm text-accent-soft">{project.subtitle}</p>

        <p
          id={descId}
          data-lenis-prevent={expanded || undefined}
          className={`mt-3 text-sm leading-6 text-muted ${expanded ? 'min-h-0 flex-1 overflow-y-auto pr-1' : 'line-clamp-3'}`}
        >
          {project.description}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={descId}
          className="-my-2 mt-0 self-start py-3 font-mono text-xs uppercase tracking-wider text-accent hover:text-paper"
        >
          {expanded ? 'Less ↑' : 'More ↓'}
        </button>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className={`${expanded ? "" : "line-clamp-2"} max-w-[64%] font-mono text-xs leading-4 tracking-wide text-subtle`}>
            {(expanded ? project.tech : project.tech.slice(0, 3)).join(' / ')}
          </p>
          <div className="-my-3 flex shrink-0 gap-1 text-xs text-paper-dim">
            {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="px-1.5 py-3 hover:text-accent">Live <span aria-hidden="true">↗</span><span className="sr-only">: {project.title} (new tab)</span></a>}
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-1.5 py-3 hover:text-accent">Code <span aria-hidden="true">↗</span><span className="sr-only">: {project.title} on GitHub (new tab)</span></a>}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
