import { useEffect, useState } from 'react'
import { useScroll } from 'framer-motion'

export default function TerminalHud() {
  const { scrollYProgress } = useScroll()
  const [scrollPct, setScrollPct] = useState('000')
  const [pos, setPos] = useState({ x: '0.5000', y: '0.5000' })

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setScrollPct(String(Math.round(v * 100)).padStart(3, '0'))
    })
    return unsub
  }, [scrollYProgress])

  useEffect(() => {
    let frame = 0
    const onMove = (e) => {
      if (frame) return
      const { clientX, clientY } = e
      frame = requestAnimationFrame(() => {
        setPos({
          x: (clientX / window.innerWidth).toFixed(4),
          y: (clientY / window.innerHeight).toFixed(4),
        })
        frame = 0
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="pointer-events-none hidden md:block fixed inset-0 z-40 font-mono text-[10px] tracking-widest text-neutral-600">
      <span className="absolute top-28 left-4">N {pos.y}</span>
      <span className="absolute top-28 right-4">SCR {scrollPct}</span>
      <span className="absolute bottom-4 left-4">HF.SYS / OK</span>
      <span className="absolute bottom-4 right-4">E {pos.x}</span>
    </div>
  )
}
