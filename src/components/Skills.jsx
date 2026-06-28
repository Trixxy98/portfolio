import { motion } from 'framer-motion'
import {
  SiReact, SiTypescript, SiJavascript, SiTailwindcss,
  SiGreensock, SiNodedotjs, SiPhp,
  SiMysql, SiPostgresql, SiFirebase, SiGit, SiFigma, SiNextdotjs
} from 'react-icons/si'

const categories = [
  {
    label: 'Frontend',
    skills: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'GSAP', icon: SiGreensock, color: '#88CE02' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
      { name: 'PHP', icon: SiPhp, color: '#777BB4' },
    ],
  },
  {
    label: 'Database',
    skills: [
      { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
    ],
  },
  {
    label: 'Tools',
    skills: [
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    ],
  },
]

export default function Skills() {
  return (
    <section className="px-8 py-24 max-w-7xl mx-auto border-t border-neutral-800">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs uppercase tracking-widest text-neutral-500 mb-12"
      >
        Skills
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: ci * 0.1 }}
          >
            <p className="text-xs uppercase tracking-widest text-neutral-600 mb-5">
              {cat.label}
            </p>
            <ul className="flex flex-col gap-4">
              {cat.skills.map((skill, si) => {
                const Icon = skill.icon
                return (
                  <motion.li
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: ci * 0.1 + si * 0.05 }}
                    className="flex items-center gap-3 group cursor-default"
                  >
                    <Icon
                      size={20}
                      style={{ color: skill.color }}
                      className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                    />
                    <span className="text-base text-neutral-300 group-hover:text-white transition-colors duration-200">
                      {skill.name}
                    </span>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}