import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { useGithubAccount, useInitGithubOAuth, useSyncGithubRepos } from '../data/dashboardHooks'

const ease = [0.22, 1, 0.36, 1] as const

export default function GithubConnectBanner() {
  const { data: account, isLoading: accountLoading } = useGithubAccount()
  const initOAuth = useInitGithubOAuth()
  const syncRepos = useSyncGithubRepos()
  const initiatedRef = useRef(false)

  useEffect(() => {
    if (accountLoading || initiatedRef.current) return

    if (account) {
      initiatedRef.current = true
      syncRepos.mutate(undefined, {
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? err?.message ?? ''
          const isGithubTokenIssue =
            (err?.response?.status === 400 || err?.response?.status === 401) &&
            (msg.toLowerCase().includes('re-link') || msg.toLowerCase().includes('github access token'))

          if (isGithubTokenIssue) {
            initOAuth.mutate(undefined, {
              onSuccess: (data) => {
                sessionStorage.setItem('github_link_return', '/dashboard')
                window.location.href = data.url
              },
            })
          }
        },
      })
    } else if (!accountLoading && account !== undefined) {
      initiatedRef.current = true
      initOAuth.mutate(undefined, {
        onSuccess: (data) => {
          sessionStorage.setItem('github_link_return', '/dashboard')
          window.location.href = data.url
        },
      })
    }
  }, [account, accountLoading])

  const isLoading = accountLoading || initOAuth.isPending

  return (
    <div className="px-6 pb-6 md:px-8">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="border border-white/[0.06] bg-white/[0.015] p-5 flex items-center gap-3"
          >
            <div className="relative">
              <LoadingSpinner size={16} className="text-[#555B55]" />
            </div>
            <span className="text-[12px] text-[#555B55]">Connecting to GitHub...</span>
          </motion.div>
        ) : account ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease }}
            className="border border-[#B6F34A]/10 bg-[#B6F34A]/[0.03] p-5"
          >
            <div className="flex items-center gap-3">
              {/* Animated check circle */}
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#B6F34A]/10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
                >
                  <Check className="h-4 w-4 text-[#B6F34A]" strokeWidth={3} />
                </motion.div>
                {/* Glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#B6F34A]/30"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.4, 1.2], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                />
              </div>
              <div>
                <motion.p
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-[13px] font-medium text-[#F5F7F2]"
                >
                  GitHub connected
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  className="text-[11px] text-[#8A8F89]"
                >
                  @{account.username}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="border border-white/[0.06] bg-white/[0.015] p-5 flex items-center gap-3"
          >
            <LoadingSpinner size={16} className="text-[#555B55]" />
            <span className="text-[12px] text-[#555B55]">Setting up GitHub...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
