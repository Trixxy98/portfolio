import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const experiences = [
  {
    role: 'Software Developer',
    company: 'Datascience Sdn Bhd',
    period: 'Feb 2026 – Present',
    points: [
      'Managed and resolved technical tickets (L1–L3) for Financial Management Systems used by Universiti Utara Malaysia, Tourism Malaysia, and Majlis Agama Islam dan Adat Istiadat Melayu Perlis (MAIPs).',
      'Debugged and resolved issues across frontend, backend, and database layers in production environments (PHP, JavaScript, MySQL, Dbeaver).',
      'Collaborated with a development team to design and develop an internal Ticket Management System, contributed to both frontend and backend development using React, JavaScript, Tailwind CSS, Axios, React Query, and Node.js, integrated with REST APIs.',
      'Performed database investigation and SQL query optimization to improve system performance.',
      'Implemented POS Digital Certification for approval workflows to enhance security and compliance.',
      'Contributed to the development and implementation of change requests for the addition of SKBBK functionality, including system enhancements, API integration, and updates to existing workflows.',
    ],
  },
  {
    role: 'IT Support Assistant (Protege)',
    company: 'SY Trisilco Sdn Bhd',
    period: 'Mar 2025 – Jan 2026',
    points: [
      'Performed IP patching and updated microwave link network configurations for YTL Communications (YES).',
      'Upgraded existing microwave links by migrating connections from microwave to fiber infrastructure.',
      'Installed and configured Ceragon IP-10 IDUs, including IP address configuration, for new fiber sites.',
      'Maintained Excel macros and contributed to the development of internal automation systems using Power BI.',
      'Assisted with microwave backhaul operations and supported the decommissioning of legacy microwave links.',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="px-8 py-24 max-w-7xl mx-auto border-t border-white/10">
      <SectionHeader
        index="05"
        eyebrow="Experience / Career"
        title="Where I've"
        accent="worked."
        className="mb-14"
      />

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
              <p className="text-base font-semibold text-[#eee9df]">{exp.role}</p>
              <p className="text-base text-[#c1c9c8] mt-1">{exp.company}</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#9fbeca]">{exp.period}</p>
            </div>
            <ul className="flex flex-col gap-3">
              {exp.points.map((point, j) => (
                  <li key={j} className="text-base text-[#c1c9c8] flex gap-3 leading-relaxed">
                  <span className="text-[#9fbeca] mt-0.5 shrink-0">—</span>
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
