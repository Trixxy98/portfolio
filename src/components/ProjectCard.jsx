import { motion } from 'framer-motion'

export default function ProjectCard({ project, index }) {
  const reversed = index % 2 === 1
  const href = project.live || project.github

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: 0.04 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-14 border-t border-neutral-800"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative block overflow-hidden border border-neutral-800 bg-neutral-900 ${
          reversed ? 'lg:order-2' : ''
        }`}
        style={{ backgroundColor: project.color }}
      >
        <div className="aspect-[16/10] overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
                Screenshot coming soon
              </span>
            </div>
          )}
        </div>
        <span className="pointer-events-none absolute top-3 left-3 w-2.5 h-2.5 border-l border-t border-white/30" />
        <span className="pointer-events-none absolute top-3 right-3 w-2.5 h-2.5 border-r border-t border-white/30" />
        <span className="pointer-events-none absolute bottom-3 left-3 w-2.5 h-2.5 border-l border-b border-white/30" />
        <span className="pointer-events-none absolute bottom-3 right-3 w-2.5 h-2.5 border-r border-b border-white/30" />
      </a>

      <div className={reversed ? 'lg:order-1' : ''}>
        <div className="flex items-center gap-3 mb-4 font-mono text-[10px] tracking-widest text-neutral-600">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span className="text-neutral-800">/</span>
          <span>{project.year}</span>
        </div>

        <h3 className="font-serif font-light text-3xl md:text-4xl leading-tight tracking-tight mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-violet-300/80 mb-4">{project.subtitle}</p>
        <p className="text-sm text-neutral-400 leading-relaxed max-w-md mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] tracking-wide text-neutral-500 border border-neutral-800 px-2 py-1"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-5 text-xs">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Live ↗
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </motion.article>
  )
}
