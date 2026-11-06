import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible] = useState(() => !window.matchMedia('(hover: none)').matches)
  const [isHovering, setIsHovering] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const dotX = useSpring(mouseX, { damping: 30, stiffness: 400 })
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 400 })

  const ringX = useSpring(mouseX, { damping: 20, stiffness: 150 })
  const ringY = useSpring(mouseY, { damping: 20, stiffness: 150 })

  useEffect(() => {
    // Hide on touch devices
    if (!isVisible) return undefined

    document.documentElement.classList.add('has-custom-cursor')

    const move = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    // Delegated so elements rendered after mount (menus, fetched content) also count.
    const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label'
    const handleOver = (e) => setIsHovering(Boolean(e.target.closest?.(INTERACTIVE)))

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', handleOver)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', handleOver)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [isVisible, mouseX, mouseY])

  if (!isVisible) return null

  return (
    <>
      <motion.div
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[200] mix-blend-difference"
      />
      <motion.div
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isHovering ? 1.8 : 1 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[200] mix-blend-difference"
      />
    </>
  )
}