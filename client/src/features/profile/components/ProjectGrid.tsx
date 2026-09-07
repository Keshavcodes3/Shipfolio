import type { ProfileProject } from '../data/profileData'
import ProfileProjectCard from './ProfileProjectCard'

export default function ProjectGrid({ projects }: { projects: ProfileProject[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project, i) => (
        <ProfileProjectCard key={project.name} project={project} index={i} />
      ))}
    </div>
  )
}
