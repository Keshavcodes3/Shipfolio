import { motion } from 'framer-motion'
import { GitCommit, GitPullRequest, Tag, GitBranch, Rocket } from 'lucide-react'
import type { NormalizedActivity } from '../utils/activityNormalizer'

const ease = [0.22, 1, 0.36, 1] as const

const typeIcons: Record<string, typeof GitCommit> = {
  commit: GitCommit,
  pull_request: GitPullRequest,
  release: Tag,
  issue: GitBranch,
  deployment: Rocket,
}

const verbColors: Record<string, string> = {
  shipped: '#B6F34A',
  released: '#B6F34A',
  merged: '#B6F34A',
  added: '#B6F34A',
  fixed: '#B6F34A',
  improved: '#B6F34A',
  started: '#8A8F89',
  updated: '#8A8F89',
  pushed: '#555B55',
  created: '#555B55',
}

interface MeaningfulActivityItemProps {
  activity: NormalizedActivity
  index: number
}

export default function MeaningfulActivityItem({ activity, index }: MeaningfulActivityItemProps) {
  const Icon = typeIcons[activity.type] ?? GitCommit
  const color = verbColors[activity.verb] ?? '#555B55'

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      <div className="absolute left-[5px] top-3 bottom-0 w-px bg-white/[0.06]" />

      <div className="absolute left-0 top-1.5 z-10">
        <div
          className="w-[11px] h-[11px] rounded-full border-2 border-[#080A08]"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`/profile/${activity.actor.username}`}
              className="text-[13px] font-bold text-[#F5F7F2] hover:text-[#B6F34A] transition-colors"
            >
              @{activity.actor.username}
            </a>
            <span className="text-[13px] text-[#8A8F89]">
              {activity.verb}
            </span>
            <a
              href={`/projects/${activity.projectId}`}
              className="text-[13px] font-bold text-[#F5F7F2] hover:text-[#B6F34A] transition-colors"
            >
              {activity.projectName}
            </a>
          </div>

          <p className="text-[14px] text-[#F5F7F2] mt-1 leading-relaxed">
            {activity.title}
          </p>

          {activity.description && (
            <p className="text-[12px] text-[#555B55] mt-1">
              {activity.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-[#303530] font-mono">
              {activity.createdAt}
            </span>
            {activity.metadata?.pullRequestNumber && (
              <span className="text-[10px] text-[#303530] font-mono">
                PR #{activity.metadata.pullRequestNumber}
              </span>
            )}
            {activity.metadata?.sha && (
              <span className="text-[10px] text-[#303530] font-mono">
                {activity.metadata.sha.slice(0, 7)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
