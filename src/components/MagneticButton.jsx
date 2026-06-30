import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({ children, href, className, download }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - (left + width / 2)) * 0.35
    const y = (e.clientY - (top + height / 2)) * 0.35
    setPos({ x, y })
  }

  const handleMouseLeave = () => setPos({ x: 0, y: 0 })

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, mass: 0.5 }}
      className="inline-block"
    >
      <a href={href} download={download} className={className}>
        {children}
      </a>
    </motion.div>
  )
}