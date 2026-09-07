import { Briefcase } from 'lucide-react'
import type { ProfileExperienceEntry } from '../../../lib/hooks'

interface ProfileExperienceProps {
  entries: ProfileExperienceEntry[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function ProfileExperience({ entries }: ProfileExperienceProps) {
  return (
    <div className="border border-white/[0.06] p-6 h-full">
      <div className="flex items-center gap-2 mb-5">
        <Briefcase className="w-4 h-4 text-[#555B55]" />
        <h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#555B55]">
          Experience
        </h3>
      </div>

      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className={i > 0 ? 'pt-4 border-t border-white/[0.04]' : ''}>
            <p className="text-[11px] text-[#303530] font-mono">
              {formatDate(entry.startDate)} — {entry.endDate ? formatDate(entry.endDate) : 'Present'}
            </p>
            <p className="text-[14px] font-bold text-[#F5F7F2] tracking-[-0.01em] mt-1">
              {entry.role}
            </p>
            <p className="text-[13px] text-[#8A8F89]">
              {entry.company}
            </p>
            {entry.description && (
              <p className="text-[12px] text-[#555B55] mt-2 leading-relaxed">
                {entry.description}
              </p>
            )}
            {entry.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] font-mono text-[#303530] border border-white/[0.06] px-1.5 py-0.5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
