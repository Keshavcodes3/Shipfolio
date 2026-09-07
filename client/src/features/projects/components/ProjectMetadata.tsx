import { ArrowUpRight } from 'lucide-react'

interface ProjectMetadataProps {
  technologies: string[]
  year: number
}

export default function ProjectMetadata({ technologies, year }: ProjectMetadataProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-1.5">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-[9px] font-mono text-[#555B55] border border-white/[0.05]"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span className="text-[11px] text-[#303530] font-mono">{year}</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-[#303530]" />
      </div>
    </div>
  )
}
