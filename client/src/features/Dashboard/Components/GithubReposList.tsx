import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitFork, Star, ArrowUpRight, Plus, Check, Globe, Lock } from 'lucide-react'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { useGithubRepos, useSyncGithubRepos, useCreateProject, type GithubRepo } from '../data/dashboardHooks'

const ease = [0.22, 1, 0.36, 1] as const

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

function RepoCard({ repo, index = 0 }: { repo: GithubRepo; index?: number }) {
  const createProject = useCreateProject()
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  async function handleImport() {
    setCreating(true)
    try {
      await createProject.mutateAsync({
        name: repo.name,
        description: repo.description ?? `Imported from ${repo.fullName}`,
        githubRepoId: repo.id,
      })
      setCreated(true)
    } catch (err) {
      console.error('Failed to create project:', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease }}
      className="border border-white/[0.06] bg-white/[0.015] p-4 hover:border-white/[0.1] transition-colors duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {repo.isPrivate ? (
            <Lock className="h-3.5 w-3.5 text-[#555B55] shrink-0" />
          ) : (
            <Globe className="h-3.5 w-3.5 text-[#555B55] shrink-0" />
          )}
          <h4 className="text-[14px] font-semibold text-[#F5F7F2] truncate">{repo.name}</h4>
        </div>
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-2"
        >
          <ArrowUpRight className="h-3.5 w-3.5 text-[#555B55] hover:text-[#F5F7F2] transition-colors" />
        </a>
      </div>

      {repo.description && (
        <p className="text-[12px] text-[#8A8F89] leading-relaxed mb-3 line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex items-center gap-4 mb-4">
        {repo.primaryLanguage && (
          <div className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: languageColors[repo.primaryLanguage] ?? '#8A8F89' }}
            />
            <span className="text-[11px] text-[#8A8F89]">{repo.primaryLanguage}</span>
          </div>
        )}
        {repo.stars > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-[#555B55]" />
            <span className="text-[11px] text-[#8A8F89]">{repo.stars}</span>
          </div>
        )}
        {repo.forks > 0 && (
          <div className="flex items-center gap-1">
            <GitFork className="h-3 w-3 text-[#555B55]" />
            <span className="text-[11px] text-[#8A8F89]">{repo.forks}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-[10px] text-[#303530] font-mono">
          {repo.pushedAt ? `Updated ${new Date(repo.pushedAt).toLocaleDateString()}` : 'No recent activity'}
        </span>

        {created ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center gap-1.5 text-[11px] text-[#B6F34A]"
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </motion.div>
            Imported
          </motion.span>
        ) : (
          <button
            onClick={handleImport}
            disabled={creating || repo.isArchived}
            className="flex items-center gap-1.5 text-[11px] text-[#8A8F89] hover:text-[#B6F34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {creating ? (
              <LoadingSpinner size={12} />
            ) : (
              <Plus className="h-3 w-3" />
            )}
            Import as project
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function GithubReposList() {
  const { data: repos, isLoading } = useGithubRepos()
  const syncRepos = useSyncGithubRepos()
  const [showAll, setShowAll] = useState(false)

  if (isLoading) {
    return (
      <div className="px-6 pb-8 md:px-8">
        <div className="flex items-center gap-2 mb-5">
          <LoadingSpinner size={14} className="text-[#555B55]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#555B55] font-mono">Loading repositories...</span>
        </div>
      </div>
    )
  }

  if (!repos || repos.length === 0) return null

  const displayedRepos = showAll ? repos : repos.slice(0, 6)

  return (
    <section className="px-6 pb-10 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#555B55] font-mono">
              Your repositories
            </h2>
            <span className="text-[10px] text-[#303530] font-mono">({repos.length})</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => syncRepos.mutate()}
              disabled={syncRepos.isPending}
              className="text-[11px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {syncRepos.isPending ? 'Syncing...' : 'Sync'}
            </button>
            {repos.length > 6 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[11px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors cursor-pointer"
              >
                {showAll ? 'Show less' : `Show all (${repos.length})`}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {displayedRepos.map((repo, i) => (
              <RepoCard key={repo.id} repo={repo} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
