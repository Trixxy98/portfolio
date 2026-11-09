import { motion } from 'framer-motion'

/**
 * Shared section heading: numbered mono eyebrow + serif title with an
 * italic accent, optional description, and an optional right-hand slot.
 */
export default function SectionHeader({ index, eyebrow, title, accent, description, id, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-wrap items-end justify-between gap-7 ${className}`}
    >
      <div>
        <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-accent">
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
          <span>{eyebrow}</span>
        </p>
        <h2 id={id} className="max-w-xl font-serif text-5xl font-light leading-[1.05] text-paper md:text-6xl">
          {title}
          {accent && <> <em className="text-accent-soft">{accent}</em></>}
        </h2>
        {description && (
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted sm:text-base">{description}</p>
        )}
      </div>
      {children}
    </motion.div>
  )
}
