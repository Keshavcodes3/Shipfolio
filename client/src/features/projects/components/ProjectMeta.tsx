import { motion } from 'framer-motion'
import type { ProjectDetail } from '../data/projectDetailData'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectMetaProps {
  project: ProjectDetail
}

export default function ProjectMeta({ project }: ProjectMetaProps) {
  const items = [
    { label: 'STATUS', value: project.status },
    { label: 'BUILT BY', value: `@${project.owner.username}` },
    { label: 'UPDATED', value: project.lastUpdated },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-white/[0.06]"
    >
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#303530] font-mono mb-1">{item.label}</p>
          <p className="text-[13px] text-[#8A8F89] font-mono">{item.value}</p>
        </div>
      ))}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#303530] font-mono mb-1">STACK</p>
        <p className="text-[13px] text-[#8A8F89] font-mono">{project.technologies.slice(0, 3).join(' · ')}</p>
      </div>
    </motion.div>
  )
}
