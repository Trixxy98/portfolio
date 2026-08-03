import { AnimatePresence, motion } from 'framer-motion'

export default function ProjectPreview({ project, x, y }) {
  return (
    <motion.div
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      className="fixed top-0 left-0 w-[360px] aspect-[4/3] pointer-events-none z-[70]"
    >
      <AnimatePresence>
        {project && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.88, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.88, rotate: 5 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: project.color }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl shadow-black/60"
          >
            {project.image ? (
              <img src={project.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-neutral-600 text-xs">Screenshot coming soon</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
