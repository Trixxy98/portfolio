import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const dotX = useSpring(mouseX, { damping: 30, stiffness: 400 })
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 400 })

  const ringX = useSpring(mouseX, { damping: 20, stiffness: 150 })
  const ringY = useSpring(mouseY, { damping: 20, stiffness: 150 })

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    setIsVisible(true)

    const move = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleHoverIn = () => setIsHovering(true)
    const handleHoverOut = () => setIsHovering(false)

    window.addEventListener('mousemove', move)

    const interactables = document.querySelectorAll('a, button')
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverIn)
      el.addEventListener('mouseleave', handleHoverOut)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverIn)
        el.removeEventListener('mouseleave', handleHoverOut)
      })
    }
  }, [])

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