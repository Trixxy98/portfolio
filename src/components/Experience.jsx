import { motion } from 'framer-motion'

const experiences = [
  {
    role: 'Software Developer',
    company: 'Datascience Sdn Bhd',
    period: 'Feb 2026 – Present',
    points: [
      'Managed and resolved technical tickets (L1–L3) for Financial Management Systems used by UUM, Tourism Malaysia, and MAIPs with PHP, Corrad Framework and MySQL',
      'Developed a Ticket Management System using React, Tailwind CSS, Axios, and React Query integrated with REST APIs',
      'Performed database investigation and SQL query optimization to improve system performance',
      'Implemented POS Digital Certification for approval workflows to enhance security and compliance',
    ],
  },
  {
    role: 'IT Support Assistant (Protege)',
    company: 'SY Trisilco Sdn Bhd',
    period: 'Mar 2025 – Jan 2026',
    points: [
      'IP patching and updating microwave links network configuration for YTL Communication (YES)',
      'Installed and configured single IDU IP10 Ceragon for new fiber sites',
      'Maintained Excel macros and contributed to internal automation systems',
    ],
  },
]

export default function Experience() {
  return (
    <section id="about" className="px-8 py-24 max-w-7xl mx-auto border-t border-neutral-800">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs uppercase tracking-widest text-neutral-500 mb-12"
      >
        Experience
      </motion.h2>

      <div className="flex flex-col gap-14">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col md:flex-row gap-6 md:gap-16"
          >
            <div className="md:w-52 shrink-0">
              <p className="text-sm font-semibold text-white">{exp.role}</p>
              <p className="text-sm text-neutral-400 mt-1">{exp.company}</p>
              <p className="text-xs text-neutral-600 mt-1">{exp.period}</p>
            </div>
            <ul className="flex flex-col gap-3">
              {exp.points.map((point, j) => (
                <li key={j} className="text-sm text-neutral-400 flex gap-3 leading-relaxed">
                  <span className="text-neutral-700 mt-0.5 shrink-0">—</span>
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}