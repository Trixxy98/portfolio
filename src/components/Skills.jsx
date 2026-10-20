import { motion } from 'framer-motion'
import {
  SiReact, SiTypescript, SiJavascript, SiTailwindcss,
  SiGreensock, SiNodedotjs, SiExpress, SiPython, SiFastapi,
  SiDotnet, SiPhp, SiScikitlearn, SiNumpy, SiPandas, SiScipy,
  SiOpenai, SiClaude, SiGooglegemini, SiMediapipe,
  SiPostgresql, SiMysql, SiPrisma, SiMongodb,
  SiRedis, SiFirebase, SiDocker, SiGithubactions, SiTerraform,
  SiCloudflare, SiRailway, SiVercel, SiGit, SiStripe,
} from 'react-icons/si'
import { TbSparkles } from 'react-icons/tb'

const categories = [
  {
    label: 'Frontend',
    skills: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'GSAP', icon: SiGreensock, color: '#88CE02' },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
      { name: 'Express', icon: SiExpress, color: '#ffffff' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
      { name: '.NET', icon: SiDotnet, color: '#512BD4' },
      { name: 'PHP', icon: SiPhp, color: '#777BB4' },
    ],
  },
  {
    label: 'AI / ML',
    skills: [
      { name: 'scikit-learn', icon: SiScikitlearn, color: '#F7931E' },
      { name: 'NumPy', icon: SiNumpy, color: '#4DABCF' },
      { name: 'pandas', icon: SiPandas, color: '#E70488' },
      { name: 'SciPy', icon: SiScipy, color: '#8CAAE6' },
      { name: 'OpenAI', icon: SiOpenai, color: '#ffffff' },
      { name: 'Claude', icon: SiClaude, color: '#D97757' },
      { name: 'Gemini', icon: SiGooglegemini, color: '#8E75B2' },
      { name: 'Groq', icon: TbSparkles, color: '#F55036' },
      { name: 'MediaPipe', icon: SiMediapipe, color: '#0097A7' },
    ],
  },
  {
    label: 'Database',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
      { name: 'Prisma', icon: SiPrisma, color: '#5A67D8' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
      { name: 'Redis', icon: SiRedis, color: '#FF4438' },
      { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
    ],
  },
  {
    label: 'DevOps',
    skills: [
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF' },
      { name: 'Terraform', icon: SiTerraform, color: '#7B42BC' },
    ],
  },
  {
    label: 'Deploy',
    skills: [
      { name: 'Cloudflare', icon: SiCloudflare, color: '#F38020' },
      { name: 'Railway', icon: SiRailway, color: '#B57BFF' },
      { name: 'Vercel', icon: SiVercel, color: '#ffffff' },
    ],
  },
  {
    label: 'Tools',
    skills: [
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'Stripe', icon: SiStripe, color: '#635BFF' },
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
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
