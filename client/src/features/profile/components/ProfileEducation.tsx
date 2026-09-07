import { GraduationCap } from 'lucide-react'
import type { ProfileEducationEntry } from '../../../lib/hooks'

interface ProfileEducationProps {
  entries: ProfileEducationEntry[]
}

export default function ProfileEducation({ entries }: ProfileEducationProps) {
  return (
    <div className="border border-white/[0.06] p-6 h-full">
      <div className="flex items-center gap-2 mb-5">
        <GraduationCap className="w-4 h-4 text-[#555B55]" />
        <h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#555B55]">
          Education
        </h3>
      </div>

      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className={i > 0 ? 'pt-4 border-t border-white/[0.04]' : ''}>
            <p className="text-[14px] font-bold text-[#F5F7F2] tracking-[-0.01em]">
              {entry.degree}
              {entry.fieldOfStudy && entry.degree ? ` — ${entry.fieldOfStudy}` : entry.fieldOfStudy}
            </p>
            <p className="text-[13px] text-[#8A8F89] mt-0.5">
              {entry.institution}
            </p>
            <p className="text-[11px] text-[#303530] font-mono mt-1">
              {entry.startYear} — {entry.endYear ?? 'Present'}
            </p>
            {entry.description && (
              <p className="text-[12px] text-[#555B55] mt-2 leading-relaxed">
                {entry.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
