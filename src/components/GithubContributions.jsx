import { useEffect, useState } from 'react'
import './GithubContributions.css'
import SectionHeader from './SectionHeader'

const USERNAME = 'Trixxy98'
const API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}`
const cache = new Map()
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const levels = ['No contributions', 'Low activity', 'Some activity', 'Active', 'Very active']

function formatDate(date) {
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
}

function calendarFor(days) {
  const firstDay = new Date(`${days[0].date}T12:00:00Z`).getUTCDay()
  const weeks = Array.from({ length: Math.ceil((days.length + firstDay) / 7) }, () => Array(7).fill(null))
  const months = []

  days.forEach((day, index) => {
    const week = Math.floor((index + firstDay) / 7)
    weeks[week][(index + firstDay) % 7] = day
    if (index === 0 || day.date.slice(5, 7) !== days[index - 1].date.slice(5, 7)) {
      months.push({ label: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(new Date(`${day.date}T12:00:00Z`)), week })
    }
  })

  return { weeks, months }
}

export default function GithubContributions() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 4 }, (_, index) => currentYear - index)
  const [year, setYear] = useState(currentYear)
  const [result, setResult] = useState({ status: 'loading', data: null })
  const [retry, setRetry] = useState(0)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let active = true
    const saved = cache.get(year)
    if (saved) return undefined

    fetch(`${API}?y=${year}`)
      .then((response) => {
        if (!response.ok) throw new Error('Contribution data unavailable')
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data.contributions) || typeof data.total?.[year] !== 'number') {
          throw new Error('Invalid contribution data')
        }
        const today = new Date().toISOString().slice(0, 10)
        const days = data.contributions.filter((day) =>
          /^\d{4}-\d{2}-\d{2}$/.test(day.date) && day.date.startsWith(`${year}-`) && day.date <= today &&
          Number.isInteger(day.count) && day.count >= 0 && Number.isInteger(day.level) && day.level >= 0 && day.level <= 4,
        )
        if (!days.length) throw new Error('No contribution data')
        cache.set(year, { days, total: data.total[year] })
        if (active) setResult({ status: 'success', data: cache.get(year) })
      })
      .catch(() => {
        if (active) setResult({ status: 'error', data: null })
      })

    return () => { active = false }
  }, [year, retry])

  const changeYear = (nextYear) => {
    if (nextYear === year) return
    setYear(nextYear)
    setSelected(null)
    const saved = cache.get(nextYear)
    setResult(saved ? { status: 'success', data: saved } : { status: 'loading', data: null })
  }

  const data = result.status === 'success' ? result.data : null
  const days = data?.days
  const { weeks, months } = days ? calendarFor(days) : { weeks: [], months: [] }
  const latest = days?.[days.length - 1]
  const activeDay = days?.find((day) => day.date === selected) || latest

  const handleGridKeyDown = (event) => {
    if (!days) return
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    let next
    if (event.key in steps) next = days.findIndex((day) => day.date === activeDay.date) + steps[event.key]
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = days.length - 1
    else return
    event.preventDefault()
    setSelected(days[Math.max(0, Math.min(next, days.length - 1))].date)
  }

  return (
    <section id="contributions" className="border-t border-white/10 px-6 py-20 sm:px-8 md:py-24" aria-labelledby="contributions-title">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="03"
          eyebrow="Open source / Activity log"
          id="contributions-title"
          title="A year in"
          accent="code."
          description="A glimpse of my public GitHub contribution history, one day at a time."
          className="mb-10"
        >
          <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-b border-accent/60 pt-3 pb-1 font-mono text-xs uppercase tracking-wider text-accent-soft transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            View GitHub profile <span aria-hidden="true">↗</span>
          </a>
        </SectionHeader>

        <div className="contrib-panel relative overflow-hidden border border-white/10 bg-surface p-5 sm:p-8">
          <div className="contrib-glow pointer-events-none absolute -right-32 -top-48 size-96 rounded-full bg-accent-deep/15 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Contribution calendar / {year}</p>
              <p className="mt-2 text-2xl font-light tabular-nums text-paper sm:text-3xl" aria-live="polite">
                {data ? data.total.toLocaleString() : '—'} <span className="text-sm text-subtle">contributions in {year}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Select contribution year">
              {years.map((option) => (
                <button key={option} type="button" onClick={() => changeYear(option)} aria-pressed={year === option} className={`min-w-14 border px-3 py-2 font-mono text-xs tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${year === option ? 'border-accent bg-accent-dim text-paper' : 'border-white/15 text-muted hover:border-accent hover:text-white'}`}>{option}</button>
              ))}
            </div>
          </div>

          {result.status === 'loading' && (
            <div role="status" className="flex min-h-56 items-center justify-center gap-3 font-mono text-sm text-muted">
              <span className="size-2 rounded-full bg-accent motion-safe:animate-pulse" aria-hidden="true" /> Loading GitHub activity…
            </div>
          )}
          {result.status === 'error' && (
            <div role="status" className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-muted">GitHub activity isn&apos;t available right now.</p>
              <button type="button" onClick={() => { setResult({ status: 'loading', data: null }); setRetry((value) => value + 1) }} className="border border-accent/50 px-4 py-2 font-mono text-xs text-accent-soft hover:bg-accent-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Try again</button>
            </div>
          )}
          {data && (
            <>
              <p className="mt-5 font-mono text-xs text-subtle sm:hidden">Swipe to explore the year →</p>
              <div className="contrib-scroll mt-5 overflow-x-auto pb-5" tabIndex={0} role="region" aria-label="Scrollable contribution calendar">
                <div className="contrib-calendar mx-auto w-max text-muted">
                  <div className="contrib-months" style={{ '--weeks': weeks.length }} aria-hidden="true">
                    {months.map(({ label, week }) => <span key={label} style={{ gridColumn: week + 1 }}>{label}</span>)}
                  </div>
                  <div className="flex gap-3">
                    <div className="contrib-weekdays font-mono text-[10px] text-subtle" aria-hidden="true">{weekdays.map((day, index) => <span key={day}>{index % 2 ? day : ''}</span>)}</div>
                    <div className="contrib-board" role="img" tabIndex={0} onKeyDown={handleGridKeyDown} onFocus={() => setSelected((value) => value || latest.date)} aria-label={`${data.total.toLocaleString()} contributions in ${year}. Use arrow keys to explore days; Home and End go to the first and last day.`}>
                      {weeks.map((week, weekIndex) => (
                        <div className="contrib-week" key={weekIndex} style={{ '--delay': `${Math.min(weekIndex, 45) * 12}ms` }}>
                          {week.map((day, index) => day ? (
                            <span key={day.date} className={`contrib-day contrib-level-${day.level} ${activeDay?.date === day.date ? 'contrib-selected' : ''}`} style={{ '--level': day.level }} title={`${formatDate(day.date)}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`} onMouseEnter={() => setSelected(day.date)} onClick={() => setSelected(day.date)} aria-hidden="true" />
                          ) : <span key={`empty-${index}`} className="contrib-day contrib-empty" aria-hidden="true" />)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                <p className="font-mono text-xs text-muted" aria-live="polite" aria-atomic="true">
                  <span className="text-accent-soft">{activeDay && formatDate(activeDay.date)}</span>
                  <span className="mx-2 text-subtle">/</span>{activeDay?.count} {activeDay?.count === 1 ? 'contribution' : 'contributions'}
                </p>
                <div className="flex items-center gap-1.5 font-mono text-xs text-subtle" aria-label="Color intensity: less to more activity">
                  <span className="mr-1">Less</span>{levels.map((label, level) => <span key={label} className={`contrib-legend contrib-level-${level}`} title={label} aria-hidden="true" />)}<span className="ml-1">More</span>
                </div>
              </div>
            </>
          )}
        </div>
        <p className="mt-4 font-mono text-xs leading-5 text-subtle">Public GitHub contributions via <a className="underline underline-offset-2 hover:text-paper" href="https://github-contributions-api.jogruber.de/" target="_blank" rel="noopener noreferrer">github-contributions-api.jogruber.de</a>. Counts may differ from private activity or update with a delay.</p>
      </div>
    </section>
  )
}
