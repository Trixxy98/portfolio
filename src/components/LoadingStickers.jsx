import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const GAP = 36
const ink = '#141414'

function Helmet({ shell, stripe, dark = '#111' }) {
  return (
    <svg width="118" height="112" viewBox="0 0 118 112" className="drop-shadow-[0_10px_14px_rgba(0,0,0,0.14)]" aria-hidden="true">
      <path
        d="M24 62c0-30 16-46 40-46 20 0 36 14 40 34 2 10 0 20-6 28-8 12-20 20-34 22-18 2-40-10-40-38z"
        fill={shell}
        stroke={ink}
        strokeWidth="3.5"
      />
      <path d="M36 34c14-12 34-10 46 4" fill="none" stroke={stripe} strokeWidth="8" strokeLinecap="round" />
      <path d="M48 58c10-18 32-20 48-6 3 3 4 8 2 12-12 4-32 8-48 0-3-2-4-6-2-6z" fill={dark} />
      <path d="M62 52c12-6 24-4 32 2" fill="none" stroke="#d4d4d4" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="40" cy="32" rx="7" ry="4.5" fill="#f5f5f4" stroke={ink} strokeWidth="2" />
      <path d="M30 78c8 10 22 16 36 16" fill="none" stroke={stripe} strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function Suit({ base, yoke, panel, name, nameFill = '#fff' }) {
  return (
    <svg width="112" height="128" viewBox="0 0 112 128" className="drop-shadow-[0_10px_14px_rgba(0,0,0,0.14)]" aria-hidden="true">
      <path d="M18 40 36 28l20 16 20-16 18 12 10 36-16 38H24L8 76 18 40z" fill={base} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M36 30c8 14 32 14 40 0" fill={yoke} stroke={ink} strokeWidth="3" />
      <path d="M30 54h52v18H30z" fill={panel} />
      <path d="M46 18h20v12H46z" rx="4" fill={yoke} stroke={ink} strokeWidth="2.5" />
      <text x="56" y="67" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill={nameFill} letterSpacing="0.5">
        {name}
      </text>
    </svg>
  )
}

function Crest({ fill, text, textFill = '#fff', ring = '#111' }) {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="drop-shadow-[0_10px_14px_rgba(0,0,0,0.14)]" aria-hidden="true">
      <circle cx="48" cy="48" r="40" fill={fill} stroke={ink} strokeWidth="3.5" />
      <circle cx="48" cy="48" r="30" fill="none" stroke={ring} strokeWidth="3" />
      <text x="48" y="54" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="800" fill={textFill}>
        {text}
      </text>
    </svg>
  )
}

const STICKERS = [
  () => <Helmet shell="#EF1A2D" stripe="#FFF200" />,
  () => <Suit base="#EF1A2D" yoke="#fff" panel="#FFF200" name="FERRARI" nameFill="#111" />,
  () => <Crest fill="#EF1A2D" text="SF" ring="#FFF200" />,
  () => <Helmet shell="#FF8000" stripe="#111" />,
  () => <Suit base="#FF8000" yoke="#111" panel="#1a1a1a" name="McLAREN" />,
  () => <Crest fill="#FF8000" text="MCL" textFill="#111" ring="#111" />,
  () => <Helmet shell="#0B1D4B" stripe="#E10600" dark="#07122e" />,
  () => <Suit base="#0B1D4B" yoke="#E10600" panel="#FFD100" name="RED BULL" nameFill="#111" />,
  () => <Crest fill="#0B1D4B" text="RB" ring="#FFD100" />,
  () => <Helmet shell="#111" stripe="#00D2BE" />,
  () => <Suit base="#111" yoke="#00D2BE" panel="#C8C8C8" name="MERC" nameFill="#111" />,
  () => <Crest fill="#111" text="AMG" ring="#00D2BE" />,
  () => <Helmet shell="#00574B" stripe="#C5D86D" />,
  () => <Suit base="#00574B" yoke="#C5D86D" panel="#0B1F1A" name="ASTON" />,
  () => <Helmet shell="#00A3E0" stripe="#fff" />,
  () => <Suit base="#041E42" yoke="#00A3E0" panel="#fff" name="WILLIAMS" nameFill="#041E42" />,
]

export default function LoadingStickers() {
  const [items, setItems] = useState([])
  const last = useRef(null)
  const count = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      if (last.current) {
        const dx = e.clientX - last.current.x
        const dy = e.clientY - last.current.y
        if (dx * dx + dy * dy < GAP * GAP) return
      }
      last.current = { x: e.clientX, y: e.clientY }
      const id = count.current + 1
      count.current = id
      const rot = (Math.random() - 0.5) * 28
      setItems((prev) => [
        ...prev.slice(-14),
        { id, x: e.clientX, y: e.clientY, rot, index: id % STICKERS.length },
      ])
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {items.map((item) => {
        const Mark = STICKERS[item.index]
        return (
          <motion.div
            key={item.id}
            initial={{ scale: 0.35, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            className="absolute"
            style={{
              left: item.x,
              top: item.y,
              rotate: item.rot,
              x: '-50%',
              y: '-50%',
            }}
          >
            <Mark />
          </motion.div>
        )
      })}
    </div>
  )
}
