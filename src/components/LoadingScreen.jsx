import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const HFParticles = lazy(() => import('./HFParticles'))

const HOLD_AFTER_READY = 900 // ms to admire the formed "HF" before it scatters
const MODEL_TIMEOUT = 7000 // never wait longer than this for the hero model
const FORM_FALLBACK = 3500 // if WebGL is slow/unavailable, don't wait on the animation
const EXIT_FALLBACK = 1200

// The particles are sampled from the real logo, so it always matches favicon.svg.
// The viewBox crops the 64×64 icon down to just the HF mark (no purple tile).
const LOGO_URL = '/favicon.svg'
const MARK_VIEWBOX = '7.5 14.5 49 34.5'

async function loadMark() {
  const svg = await (await fetch(LOGO_URL)).text()
  const mark = svg
    .replace(/<rect[^>]*\/>/, '')
    .replace(/viewBox="[^"]*"/, `viewBox="${MARK_VIEWBOX}"`)
    .replace(/width="[^"]*"/, 'width="940"')
    .replace(/height="[^"]*"/, 'height="650"')
  const url = URL.createObjectURL(new Blob([mark], { type: 'image/svg+xml' }))
  const img = new Image()
  img.src = url
  await img.decode()
  return { img, url }
}

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)
  const doneRef = useRef(false)
  const progressRef = useRef({ start: 0, shown: 0 })

  const [mark, setMark] = useState(null)
  const [modelReady, setModelReady] = useState(false)
  const [formed, setFormed] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)

  const markModelReady = useCallback(() => setModelReady(true), [])
  const markFormed = useCallback(() => setFormed(true), [])
  const markFailed = useCallback(() => {
    setWebglFailed(true)
    setFormed(true)
  }, [])

  const slideOut = useCallback((fast = false) => {
    if (doneRef.current) return
    doneRef.current = true
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: fast ? 0.5 : 0.75,
      ease: 'power4.inOut',
      onComplete,
    })
  }, [onComplete])

  useEffect(() => {
    let cancelled = false
    let url
    loadMark()
      .then((result) => {
        url = result.url
        if (!cancelled) setMark(result)
      })
      .catch(() => { if (!cancelled) markFailed() })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [markFailed])

  useEffect(() => {
    const id = setTimeout(markModelReady, MODEL_TIMEOUT)
    return () => clearTimeout(id)
  }, [markModelReady])

  useEffect(() => {
    if (!mark) return undefined
    const id = setTimeout(markFormed, FORM_FALLBACK)
    return () => clearTimeout(id)
  }, [mark, markFormed])

  // Everything loaded and the letters have formed: hold, then scatter.
  useEffect(() => {
    if (!modelReady || !formed || exiting) return undefined
    const id = setTimeout(() => setExiting(true), HOLD_AFTER_READY)
    return () => clearTimeout(id)
  }, [modelReady, formed, exiting])

  // Safety net in case the particle canvas never reports that it finished.
  useEffect(() => {
    if (!exiting) return undefined
    const id = setTimeout(() => slideOut(), webglFailed ? 0 : EXIT_FALLBACK)
    return () => clearTimeout(id)
  }, [exiting, webglFailed, slideOut])

  // Progress readout, updated outside React to avoid re-rendering every frame.
  useEffect(() => {
    // Kept in a ref so the readout never jumps backwards when this effect re-runs.
    const p = progressRef.current
    if (!p.start) p.start = performance.now()
    const done = modelReady && formed
    let last = performance.now()
    let frame
    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const elapsed = (now - p.start) / 1000
      const target = done ? 100 : Math.min(94, (elapsed / 3) * 94)
      // Time-based easing so slow devices still reach 100% before the exit.
      p.shown += (Math.max(target, p.shown) - p.shown) * (1 - Math.exp(-dt * (done ? 9 : 4)))
      const value = Math.min(100, Math.round(p.shown + 0.4))
      if (counterRef.current) counterRef.current.textContent = String(value).padStart(3, '0')
      if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`
      if (value < 100) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [modelReady, formed])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') slideOut(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slideOut])

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100] h-screen h-dvh overflow-hidden bg-[#101820] text-[#eee9df]"
    >
      {/* Blueprint grid + soft vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: 'linear-gradient(rgba(159,190,202,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(159,190,202,0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(82,127,145,0.18),transparent_60%)]" />

      {mark && !webglFailed && (
        <Suspense fallback={null}>
          <HFParticles
            mark={mark.img}
            exiting={exiting}
            onFormed={markFormed}
            onExited={slideOut}
            onModelReady={markModelReady}
            onError={markFailed}
          />
        </Suspense>
      )}

      {webglFailed && (
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
          {mark
            ? <img src={mark.url} alt="" className="w-[min(60vw,320px)] opacity-80" />
            : <p className="font-sans text-[8rem] font-semibold text-[#9fbeca]/70">HF</p>}
        </div>
      )}

      {/* Corner readouts */}
      <div className="pointer-events-none absolute inset-x-6 top-6 flex justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-[#aebbc0]">
        <span>HF.SYS / {exiting ? 'Ready' : 'Initialising'}</span>
        <span className="hidden sm:inline">Rembau, MY</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: exiting ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: exiting ? 0 : 0.9 }}
        className="pointer-events-none absolute inset-x-0 bottom-[22%] text-center"
      >
        <p className="font-serif text-xl font-light italic text-[#eee9df]/90">Harith Fakrullah</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.35em] text-[#9fbeca]">Software Developer</p>
      </motion.div>

      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6">
        <div className="w-40 font-mono text-[11px] uppercase tracking-[0.2em] text-[#aebbc0] sm:w-56">
          <div className="mb-2 flex justify-between">
            <span>Loading</span>
            <span className="tabular-nums text-[#eee9df]"><span ref={counterRef}>000</span>%</span>
          </div>
          <div className="h-px bg-white/10">
            <div ref={barRef} className="h-px origin-left scale-x-0 bg-[#9fbeca]" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => slideOut(true)}
          className="border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#c1c9c8] transition-colors hover:border-[#9fbeca] hover:text-[#eee9df]"
        >
          Skip intro →
        </button>
      </div>
    </div>
  )
}
