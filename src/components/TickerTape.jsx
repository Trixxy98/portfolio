import { useEffect, useState } from 'react'
import { formatMalaysiaTime } from '../utils/time'
import { projects } from '../data/projects'

const ITEMS = [
  { label: 'STATUS', value: 'OPEN TO WORK', tone: 'up' },
  { label: 'ROLE', value: 'SOFTWARE DEVELOPER @ DATASCIENCE' },
  { label: 'PROJECTS', value: String(projects.length).padStart(2, '0') },
  { label: 'LATEST', value: projects[0]?.title.toUpperCase() },
  { label: 'STACK', value: 'REACT · NODE · PYTHON · .NET' },
  { label: 'AI', value: 'OPENAI · CLAUDE · GEMINI · GROQ' },
  { label: 'LANG', value: 'BM · EN · 中文' },
  { label: 'BASED', value: 'REMBAU, MY' },
]

function Items({ hidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-8 px-6" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-2.5 shrink-0">
          <span className="text-[#84949b]">{item.label}</span>
          <span className={item.tone === 'up' ? 'text-emerald-300' : 'text-[#c1c9c8]'}>{item.value}</span>
          <span aria-hidden="true" className="text-white/15">/</span>
        </span>
      ))}
    </div>
  )
}

export default function TickerTape() {
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => setClock(formatMalaysiaTime(new Date(), { seconds: true }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-7 flex items-stretch border-b border-white/10 bg-[#101820]/95 backdrop-blur-sm font-mono text-[11px] tracking-wide text-[#aebbc0]">
      <div className="shrink-0 flex items-center gap-2 px-4 border-r border-white/10">
        <span className="size-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" aria-hidden="true" />
        <span className="text-emerald-300">AVAILABLE</span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-y-0 left-0 flex w-max items-center ticker-track">
          <Items />
          <Items hidden />
        </div>
      </div>

      <div className="shrink-0 hidden sm:flex items-center gap-3 px-4 border-l border-white/10 text-[#aebbc0]">
        <span>MYT</span>
        <span className="text-[#eee9df] tabular-nums">{clock}</span>
      </div>
    </div>
  )
}
