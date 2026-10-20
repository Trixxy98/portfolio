import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LoadingStickers from './LoadingStickers'

const LIGHTS = [0, 1, 2, 3, 4]

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const lights = useRef([])
  const labelRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    LIGHTS.forEach((i) => {
      tl.to(lights.current[i], {
        opacity: 1,
        duration: 0.12,
        ease: 'power1.out',
      }, 0.35 + i * 0.42)
    })

    tl.to(lights.current, {
      opacity: 0,
      duration: 0.08,
    }, '+=0.35')
    tl.to(labelRef.current, {
      opacity: 1,
      duration: 0.2,
    }, '<')
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
      delay: 0.28,
      onComplete,
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#061018]">
      <LoadingStickers />
      <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-6 md:bottom-20">
        <div className="flex items-center gap-3 md:gap-5">
          {LIGHTS.map((i) => (
            <div
              key={i}
              ref={(node) => { lights.current[i] = node }}
              className="h-16 w-16 opacity-[0.16] md:h-20 md:w-20"
              style={{
                background: 'radial-gradient(circle at center, #ffb4b4 0%, #ff2a2a 18%, rgba(225,6,0,0.22) 46%, transparent 70%)',
              }}
            />
          ))}
        </div>
        <p ref={labelRef} className="font-mono text-[10px] tracking-[0.35em] text-[#d7f3ff]/75 opacity-0">
          LIGHTS OUT
        </p>
      </div>
    </div>
  )
}
