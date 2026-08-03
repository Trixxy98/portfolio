import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

export default function ProjectRow({ project, index, isHovered, isDimmed, onHoverStart, onHoverEnd }) {
  const shift = { x: isHovered ? 28 : 0 }
  const shiftTransition = { duration: 0.5, ease: EASE }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="border-b border-neutral-800"
    >
      <div
        className={`flex items-center gap-6 py-8 transition-opacity duration-300 ${
          isDimmed ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <motion.span
          animate={{ opacity: isHovered ? 1 : 0.4 }}
          transition={shiftTransition}
          className="font-mono text-xs text-neutral-600 w-8 shrink-0"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>

        <a
          href={project.live || project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0"
        >
          <motion.h3
            animate={shift}
            transition={shiftTransition}
            className={`font-serif font-light text-4xl lg:text-5xl leading-tight tracking-tight transition-colors duration-300 ${
              isHovered ? 'text-violet-200' : 'text-white'
            }`}
          >
            {project.title}
          </motion.h3>
          <motion.p
            animate={shift}
            transition={shiftTransition}
            className="mt-2 text-xs text-neutral-500 truncate"
          >
            {project.tech.join('  ·  ')}
          </motion.p>
        </a>

        <div className="flex items-center gap-6 shrink-0 text-xs">
          <span className="font-mono text-neutral-600">{project.year}</span>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              Live ↗
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </motion.div>
  )
}
