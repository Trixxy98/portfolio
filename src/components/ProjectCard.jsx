import { motion } from 'framer-motion'

export default function ProjectCard({ project, index }) {
  const href = project.live || project.github

  return (
    <motion.article
      role="listitem"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="group flex h-[440px] w-[min(82vw,340px)] shrink-0 snap-start flex-col overflow-hidden border border-white/10 bg-[#0b1822] md:h-[460px] md:w-[350px]"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.title}`}
        className="relative block h-40 shrink-0 overflow-hidden bg-neutral-900 md:h-44"
        style={{ backgroundColor: project.color }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-between px-8">
            <span className="font-serif text-8xl font-light text-white/10">{String(index + 1).padStart(2, '0')}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Preview coming soon</span>
          </div>
        )}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061018]/30 to-transparent" />
      </a>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between font-mono text-xs tracking-widest text-[#9fd6ff]/60">
          <span>{String(index + 1).padStart(2, '0')} / PROJECT</span>
          <span>{project.year}</span>
        </div>
        <h3 className="font-serif text-3xl font-light leading-tight text-white">{project.title}</h3>
        <p className="mt-1 truncate text-sm text-violet-300/80">{project.subtitle}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-400">{project.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="line-clamp-2 max-w-[64%] font-mono text-[10px] leading-4 tracking-wide text-neutral-500">
            {project.tech.slice(0, 3).join(' / ')}
          </p>
          <div className="flex shrink-0 gap-3 text-xs text-neutral-300">
            {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="hover:text-white">Live ↗</a>}
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">Code ↗</a>}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
