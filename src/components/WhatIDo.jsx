import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const services = [
  {
    num: '01',
    title: 'Frontend Development',
    desc: 'Building responsive, performant web interfaces using React, TypeScript, and Tailwind CSS — from wireframe to polished, pixel-perfect UI.',
  },
  {
    num: '02',
    title: 'Full-Stack Development',
    desc: 'End-to-end web applications with Node.js, Express, and databases like MySQL and PostgreSQL — REST APIs, authentication, and scalable architecture.',
  },
  {
    num: '03',
    title: 'UI/UX Implementation',
    desc: 'Translating designs into clean, accessible code with smooth animations using GSAP and Framer Motion for engaging user experiences.',
  },
  {
    num: '04',
    title: 'API Integration',
    desc: 'Integrating third-party and AI APIs with proper error handling, loading states, and data management using React Query and Axios.',
  },
]

export default function WhatIDo() {
  const [open, setOpen] = useState(null)

  return (
    <section className="px-8 py-24 max-w-7xl mx-auto border-t border-neutral-800">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs uppercase tracking-widest text-neutral-500 mb-12"
      >
        What I Do
      </motion.h2>

      <div className="divide-y divide-neutral-800">
        {services.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <button
              onClick={() => setOpen(open === s.num ? null : s.num)}
              className="w-full flex items-start gap-8 py-6 text-left group"
            >
              <span className="text-xs text-neutral-700 font-mono mt-1 w-6 shrink-0">{s.num}</span>
              <div className="flex-1 flex items-center justify-between">
                <h3 className="text-lg font-medium group-hover:underline underline-offset-4 decoration-neutral-700">
                  {s.title}
                </h3>
                <span
                  className="text-neutral-600 text-xl leading-none transition-transform duration-300"
                  style={{ transform: open === s.num ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  +
                </span>
              </div>
            </button>
            <AnimatePresence>
              {open === s.num && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pl-6 md:pl-14 pb-6 text-sm text-neutral-400 leading-relaxed max-w-xl">
                    {s.desc}
                    </p>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-24 flex flex-col items-center text-center gap-6"
      >
        <p className="text-2xl font-semibold">Have a project in mind? Let's talk.</p>
        <a
          href="mailto:harithfakrullah@gmail.com"
          className="px-6 py-3 border border-neutral-600 rounded-full text-sm hover:bg-white hover:text-black hover:border-white transition-all duration-200"
        >
          Get in touch →
        </a>
      </motion.div>
    </section>
  )
}