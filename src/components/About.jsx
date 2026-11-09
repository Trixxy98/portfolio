import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { projects } from '../data/projects'

// First industry role (SY Trisilco) started March 2025.
const CAREER_START = new Date(2025, 2, 1)

function yearsSince(date) {
  const months = (new Date().getFullYear() - date.getFullYear()) * 12 + new Date().getMonth() - date.getMonth()
  return Math.max(1, Math.floor(months / 12))
}

const stats = [
  { value: String(projects.length).padStart(2, '0'), label: 'Shipped projects' },
  { value: `${yearsSince(CAREER_START)}+`, label: 'Years in industry' },
  { value: '03', label: 'Languages spoken' },
]

const services = [
  {
    num: '01',
    title: 'Frontend Development',
    desc: 'Building responsive, performant web interfaces using React, TypeScript, and Tailwind CSS — from wireframe to polished, pixel-perfect UI.',
  },
  {
    num: '02',
    title: 'Full-Stack Development',
    desc: 'End-to-end apps with Node.js and Express, Python and FastAPI, or ASP.NET Core — REST APIs, JWT authentication, and PostgreSQL, MySQL, or MongoDB.',
  },
  {
    num: '03',
    title: 'AI & LLM Integration',
    desc: 'Shipping AI features with OpenAI, Groq, Claude, and Gemini — structured output, function calling, and on-device inference with MediaPipe for real-time analysis.',
  },
  {
    num: '04',
    title: 'DevOps & Deployment',
    desc: 'Containerising apps with Docker and Docker Compose, defining cloud infra with Terraform, and automating typecheck, test, and build pipelines with GitHub Actions.',
  },
  {
    num: '05',
    title: 'UI/UX Implementation',
    desc: 'Translating designs into clean, accessible code with smooth animations using GSAP and Framer Motion for engaging user experiences.',
  },
  {
    num: '06',
    title: 'API Integration',
    desc: 'Integrating third-party APIs with proper error handling, loading states, and data management using TanStack Query and Axios.',
  },
]

function Services() {
  const [open, setOpen] = useState('01')

  return (
    <div>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-accent">What I do</p>
      <div className="divide-y divide-white/10 border-y border-white/10">
        {services.map((s) => {
          const isOpen = open === s.num
          return (
            <div key={s.num}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : s.num)}
                  aria-expanded={isOpen}
                  aria-controls={`service-${s.num}`}
                  className="group flex w-full items-center gap-6 py-5 text-left"
                >
                  <span className="w-6 shrink-0 font-mono text-xs text-accent">{s.num}</span>
                  <span className="flex-1 text-lg text-paper transition-colors group-hover:text-accent">{s.title}</span>
                  <span
                    aria-hidden="true"
                    className="text-xl leading-none text-subtle transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`service-${s.num}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-xl pb-6 pl-12 text-sm leading-relaxed text-muted">{s.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="border-t border-white/10 px-6 py-20 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader index="02" eyebrow="About / Profile" title="A little" accent="about me." className="mb-14" />

        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <div className="relative w-28 shrink-0 sm:w-36">
                <img
                  src="/photo.webp"
                  alt="Portrait of Harith Fakrullah"
                  loading="lazy"
                  width="288"
                  height="360"
                  className="aspect-[4/5] w-full border border-white/10 object-cover grayscale-[35%]"
                />
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-2 -right-2 size-full border border-accent/40" />
              </div>
              <div className="space-y-4 text-base leading-7 text-muted">
                <p>
                  I&apos;m a software developer at <span className="text-paper">Datascience Sdn Bhd</span>, working across
                  the stack on financial management systems used by public institutions in Malaysia, from debugging production
                  issues and tuning SQL to building internal tools in React and Node.js.
                </p>
                <p className="hidden sm:block">
                  Outside work I build side projects that blend full-stack engineering with AI. I care about interfaces that
                  feel fast, clear and considered.
                </p>
              </div>
            </div>
            <p className="mt-4 text-base leading-7 text-muted sm:hidden">
              Outside work I build side projects that blend full-stack engineering with AI. I care about interfaces that
              feel fast, clear and considered.
            </p>

            <dl className="mt-10 grid grid-cols-3 border-y border-white/10">
              {stats.map((stat, i) => (
                <div key={stat.label} className={`flex flex-col-reverse py-5 ${i ? 'border-l border-white/10 pl-5' : ''}`}>
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">{stat.label}</dt>
                  <dd className="mb-2 font-serif text-4xl font-light lining-nums tabular-nums text-paper md:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Services />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
