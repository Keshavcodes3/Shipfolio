import { motion, AnimatePresence } from 'framer-motion'
import { GitFork, Check, RefreshCw, Unplug } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useConnectGitHub, useDisconnectGitHub, useGitHubRepos, useSyncGitHubRepos } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

function ShimmerBar({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative h-12 bg-white/[0.02] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(182,243,74,0.04), transparent)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay }}
      />
    </div>
  )
}

export default function GitHubSettings() {
  const { user } = useAuth()
  const connectGitHub = useConnectGitHub()
  const disconnectGitHub = useDisconnectGitHub()
  const { data: repos, isLoading: reposLoading } = useGitHubRepos()
  const syncRepos = useSyncGitHubRepos()

  const isConnected = !!user?.githubUsername

  const handleConnect = async () => {
    try {
      sessionStorage.setItem('github_link_return', '/settings/github')
      const { url, state } = await connectGitHub.mutateAsync('link')
      sessionStorage.setItem('github_oauth_state', state)
      window.location.href = url
    } catch {
      // Error handled by mutation
    }
  }

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect GitHub? This will remove access to your repositories.')) {
      await disconnectGitHub.mutateAsync()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2] mb-6">GitHub</h2>

      <div className="space-y-6">
        <div className="border border-white/[0.06] p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Animated icon container */}
              <motion.div
                className={`w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden ${isConnected ? 'bg-[#B6F34A]/10' : 'bg-white/[0.04]'}`}
                animate={isConnected ? { boxShadow: ['0 0 0 0 rgba(182,243,74,0)', '0 0 12px 2px rgba(182,243,74,0.15)', '0 0 0 0 rgba(182,243,74,0)'] } : {}}
                transition={isConnected ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
              >
                <GitFork className={`w-6 h-6 relative z-10 ${isConnected ? 'text-[#B6F34A]' : 'text-[#555B55]'}`} />
              </motion.div>

              <div>
                <h3 className="text-[15px] font-bold text-[#F5F7F2]">GitHub</h3>
                <AnimatePresence mode="wait">
                  {isConnected ? (
                    <motion.div
                      key="connected"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25, ease }}
                      className="flex items-center gap-2 mt-1"
                    >
                      <Check className="w-3 h-3 text-[#B6F34A]" />
                      <span className="text-[13px] text-[#B6F34A]">Connected as @{user.githubUsername}</span>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="disconnected"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25, ease }}
                      className="text-[13px] text-[#555B55] mt-1"
                    >
                      Not connected
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <AnimatePresence mode="wait">
                {isConnected ? (
                  <motion.div
                    key="connected-actions"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease }}
                    className="flex gap-2"
                  >
                    <motion.button
                      onClick={() => syncRepos.mutateAsync()}
                      disabled={syncRepos.isPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors disabled:opacity-50"
                    >
                      <motion.div
                        animate={syncRepos.isPending ? { rotate: 360 } : { rotate: 0 }}
                        transition={syncRepos.isPending ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </motion.div>
                      Sync
                    </motion.button>
                    <motion.button
                      onClick={handleDisconnect}
                      disabled={disconnectGitHub.isPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-red-400 border border-red-400/20 hover:bg-red-400/5 transition-colors disabled:opacity-50"
                    >
                      <Unplug className="w-3 h-3" />
                      Disconnect
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="connect"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease }}
                    onClick={handleConnect}
                    disabled={connectGitHub.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-colors disabled:opacity-50"
                  >
                    <GitFork className="w-3 h-3" />
                    {connectGitHub.isPending ? 'Connecting...' : 'Connect GitHub'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Repositories section with animated state transition */}
        <AnimatePresence mode="wait">
          {isConnected && (
            <motion.div
              key="repos-section"
              initial={{ opacity: 0, y: 12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="border border-white/[0.06] p-6 overflow-hidden"
            >
              <h3 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[#8A8F89] mb-4">
                Repositories
              </h3>
              {reposLoading ? (
                <div className="space-y-3">
                  <ShimmerBar delay={0} />
                  <ShimmerBar delay={0.15} />
                  <ShimmerBar delay={0.3} />
                </div>
              ) : repos && Array.isArray(repos) && repos.length > 0 ? (
                <div className="space-y-2">
                  {repos.map((repo, i: number) => (
                    <motion.div
                      key={repo.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease }}
                      className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
                    >
                      <div>
                        <p className="text-[14px] text-[#F5F7F2] font-mono">{repo.name}</p>
                        <p className="text-[11px] text-[#555B55]">{repo.fullName}</p>
                      </div>
                      {repo.isPrivate && (
                        <span className="text-[10px] text-[#303530] font-mono">Private</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#555B55]">No repositories found.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
