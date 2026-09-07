import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMyProjects } from '../../../lib/hooks'
import type { FilterStatus } from '../data/projectData'
import { toMyProject } from '../data/projectData'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import MyProjectsHeader from '../components/MyProjectsHeader'
import ProjectFilters from '../components/ProjectFilters'
import ProjectsGrid from '../components/ProjectsGrid'
import LoadingSpinner from '../../../components/LoadingSpinner'

const ease = [0.22, 1, 0.36, 1] as const

export default function MyProjects() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL')

  const { data: projects, isLoading } = useMyProjects(
    activeFilter !== 'ALL' ? { status: activeFilter } : undefined
  )

  const myProjects = (projects || []).map(toMyProject)

  // Sort: currently building first, then shipped, then by year desc
  const sorted = [...myProjects].sort((a, b) => {
    if (a.isCurrentlyBuilding && !b.isCurrentlyBuilding) return -1
    if (!a.isCurrentlyBuilding && b.isCurrentlyBuilding) return 1
    if (a.status === 'SHIPPED' && b.status !== 'SHIPPED') return -1
    if (a.status !== 'SHIPPED' && b.status === 'SHIPPED') return 1
    return b.year - a.year
  })

  return (
    <SidebarShell>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-10 lg:py-16">
        <MyProjectsHeader count={isLoading ? 0 : sorted.length} />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
          className="mt-10 mb-8 border-b border-white/[0.06] pb-3"
        >
          <ProjectFilters active={activeFilter} onChange={setActiveFilter} />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size={24} />
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#555B55]">
                Loading projects...
              </p>
            </div>
          </div>
        ) : (
          <ProjectsGrid projects={sorted} filter={activeFilter} />
        )}
      </div>
    </SidebarShell>
  )
}
