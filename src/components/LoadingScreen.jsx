import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const countRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.to(countRef.current, {
      innerHTML: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      delay: 0.2,
      snap: { innerHTML: 1 },
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
      className="fixed inset-0 z-[100] bg-[#0b0b0b] flex flex-col items-end justify-end px-8 pb-12"
    >
      <div className="flex flex-col items-end gap-2">
        <p className="font-serif font-light text-[clamp(5rem,15vw,12rem)] leading-none text-white">
          <span ref={countRef}>0</span>
          <span className="text-neutral-600">%</span>
        </p>
        <p className="text-xs text-neutral-600 tracking-widest uppercase">
          Harith Fakrullah — Portfolio
        </p>
      </div>
    </div>
  )
}