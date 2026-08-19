import { useEffect, useState } from 'react'

const BASE = [
  { sym: 'REACT', px: 19.21, chg: 0.42 },
  { sym: 'NODE', px: 22.14, chg: 0.18 },
  { sym: 'TS', px: 5.82, chg: 0.09 },
  { sym: 'SQL', px: 16.04, chg: -0.11 },
  { sym: 'DOCKER', px: 8.77, chg: 0.23 },
  { sym: 'GSAP', px: 3.41, chg: -0.04 },
  { sym: 'REDIS', px: 7.62, chg: 0.15 },
  { sym: 'LLM', px: 41.08, chg: 1.12 },
  { sym: 'NEXT', px: 15.33, chg: -0.21 },
  { sym: 'GIT', px: 2.58, chg: 0.03 },
]

function formatPx(n) {
  return n.toFixed(2)
}

function formatChg(n) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}`
}

function Quotes({ quotes }) {
  return (
    <div className="flex items-center gap-8 px-6">
      {quotes.map((q) => {
        const up = q.chg >= 0
        return (
          <span key={q.sym} className="flex items-center gap-2.5 shrink-0">
            <span className="text-neutral-300">{q.sym}</span>
            <span className="text-neutral-500 tabular-nums">{formatPx(q.px)}</span>
            <span className={`tabular-nums ${up ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatChg(q.chg)}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export default function TickerTape() {
  const [quotes, setQuotes] = useState(BASE)
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      setClock(`${h}:${m}:${s}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((prev) =>
        prev.map((q) => {
          const d = (Math.random() - 0.48) * 0.06
          const px = Math.max(0.2, q.px + d)
          return { ...q, px, chg: q.chg + d * 0.4 }
        }),
      )
    }, 1100)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-7 flex items-stretch border-b border-neutral-800/80 bg-[#0b0b0b]/80 backdrop-blur-sm font-mono text-[10px] tracking-wide text-neutral-400">
      <div className="shrink-0 flex items-center gap-2 px-4 border-r border-neutral-800">
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400">LIVE</span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-y-0 flex items-center ticker-track">
          <Quotes quotes={quotes} />
          <Quotes quotes={quotes} />
        </div>
      </div>

      <div className="shrink-0 hidden sm:flex items-center gap-3 px-4 border-l border-neutral-800 text-neutral-500">
        <span>MYT</span>
        <span className="text-neutral-300 tabular-nums">{clock}</span>
      </div>
    </div>
  )
}
