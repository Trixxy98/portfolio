import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Height of the fixed ticker + navbar, so anchor jumps land below the header.
const HEADER_OFFSET = -96

let instance = null

/** Lock or unlock page scrolling, e.g. while a full-screen menu is open. */
export function setScrollLocked(locked) {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/** Unlock scrolling and move to an in-page anchor such as "#work" (or "#top"). */
export function scrollToHash(hash) {
  setScrollLocked(false)
  const target = hash === '#top' ? 0 : document.querySelector(hash)
  if (target === null) return
  if (instance) {
    instance.scrollTo(target, { offset: target === 0 ? 0 : HEADER_OFFSET })
  } else if (target === 0) {
    window.scrollTo({ top: 0 })
  } else {
    target.scrollIntoView()
  }
  history.replaceState(null, '', hash === '#top' ? window.location.pathname : hash)
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: HEADER_OFFSET },
    })

    instance = lenis

    const rafFn = (time) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(rafFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      instance = null
      gsap.ticker.remove(rafFn)
    }
  }, [])
}
