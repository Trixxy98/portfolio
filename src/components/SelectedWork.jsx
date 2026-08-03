import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import ProjectCard from './ProjectCard'
import ProjectRow from './ProjectRow'
import ProjectPreview from './ProjectPreview'
import { useCanHover } from '../hooks/useCanHover'
import { projects } from '../data/projects'

const SPRING = { damping: 24, stiffness: 200, mass: 0.5 }

export default function SelectedWork() {
  const canHover = useCanHover()
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    setHoveredId(null)
  }, [canHover])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const x = useSpring(mouseX, SPRING)
  const y = useSpring(mouseY, SPRING)

  const trackMouse = (e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  // Teleport the preview to the cursor on entry so it doesn't sweep in from the last position.
  const enterList = (e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
    x.jump(e.clientX)
    y.jump(e.clientY)
  }

  const hoveredProject = projects.find((p) => p.id === hoveredId) ?? null

  return (
    <section id="work" className="px-8 py-24 max-w-7xl mx-auto border-t border-neutral-800">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs uppercase tracking-widest text-neutral-500 mb-12"
      >
        Selected Work
      </motion.h2>

      {canHover ? (
        <>
          <div
            onMouseEnter={enterList}
            onMouseMove={trackMouse}
            onMouseLeave={() => setHoveredId(null)}
            className="border-t border-neutral-800"
          >
            {projects.map((project, i) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={i}
                isHovered={hoveredId === project.id}
                isDimmed={hoveredId !== null && hoveredId !== project.id}
                onHoverStart={() => setHoveredId(project.id)}
                onHoverEnd={() => setHoveredId(null)}
              />
            ))}
          </div>
          <ProjectPreview project={hoveredProject} x={x} y={y} />
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
