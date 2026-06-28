import { motion } from 'framer-motion'

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div
        className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 relative"
        style={{ backgroundColor: project.color }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-neutral-600 text-xs">Screenshot coming soon</span>
          </div>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs px-3 py-1.5 rounded-full font-medium"
          >
            Live ↗
          </a>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-neutral-500 mb-1">{project.year}</p>
          <h3 className="font-semibold text-base mb-2 group-hover:underline underline-offset-4 decoration-neutral-600">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs border border-neutral-700 text-neutral-500 px-2 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-600 hover:text-white transition-colors whitespace-nowrap pt-6"
        >
          GitHub ↗
        </a>
      </div>
    </motion.div>
  )
}