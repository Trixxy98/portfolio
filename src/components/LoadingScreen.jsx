import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import VolSurface from './VolSurface'

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const progressRef = useRef({ value: 0 })

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.to(progressRef.current, {
      value: 1,
      duration: 2.6,
      ease: 'power2.inOut',
    }).to(containerRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      delay: 0.2,
      onComplete,
    })
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0b0b0b] overflow-hidden flex flex-col items-center justify-center gap-6"
    >
      <div className="font-mono text-[10px] tracking-widest text-neutral-500 text-center">
        <p className="text-violet-300/80 mb-1">IV SURFACE</p>
        <p>STRIKE × TENOR × σ</p>
      </div>

      <div className="relative w-[min(82vw,560px)] h-[min(52vh,400px)]">
        <VolSurface progressRef={progressRef} />
      </div>

      <p className="text-xs text-neutral-600 tracking-widest uppercase">
        Harith Fakrullah — Portfolio
      </p>
    </div>
  )
}
