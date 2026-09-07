import { AnimatePresence } from 'framer-motion'
import type { MyProject, FilterStatus } from '../data/projectData'
import MyProjectCard from './MyProjectCard'
import ProjectsEmptyState from './ProjectsEmptyState'

interface ProjectsGridProps {
  projects: MyProject[]
  filter: FilterStatus
}

export default function ProjectsGrid({ projects, filter }: ProjectsGridProps) {
  if (projects.length === 0) {
    return <ProjectsEmptyState filter={filter} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {projects.map((project, i) => (
          <MyProjectCard key={project.id} project={project} index={i} />
        ))}
      </AnimatePresence>
    </div>
  )
}
