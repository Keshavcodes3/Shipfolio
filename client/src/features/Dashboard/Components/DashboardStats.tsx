import { motion } from 'framer-motion'
import { useMyProjects } from '../data/dashboardHooks'

const ease = [0.22, 1, 0.36, 1] as const

export default function DashboardStats() {
  const { data: projects } = useMyProjects()

  const stats = {
    projects: projects?.length ?? 0,
    shipped: projects?.filter((p) => p.status === 'SHIPPED').length ?? 0,
    building: projects?.filter((p) => p.status === 'BUILDING').length ?? 0,
    featured: projects?.filter((p) => p.isFeatured).length ?? 0,
  }

  const statItems = [
    { label: 'Projects', value: stats.projects, green: false },
    { label: 'Shipped', value: stats.shipped, green: false },
    { label: 'Building', value: stats.building, green: true },
    { label: 'Featured', value: stats.featured, green: false },
  ]

  return (
    <section className="px-6 pb-6 md:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06]">
        {statItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease }}
            className="bg-[#080A08] px-5 py-5"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold tracking-tight text-[#F5F7F2]">
                {item.value}
              </span>
              {item.green && item.value > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#B6F34A] animate-pulse" />
              )}
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
