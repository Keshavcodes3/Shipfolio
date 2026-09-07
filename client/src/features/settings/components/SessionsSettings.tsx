import { motion } from 'framer-motion'
import { Monitor, Smartphone, Trash2 } from 'lucide-react'
import { useSessions, useRevokeSession, useRevokeAllSessions } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

export default function SessionsSettings() {
  const { data: sessions, isLoading } = useSessions()
  const revokeSession = useRevokeSession()
  const revokeAllSessions = useRevokeAllSessions()

  const handleRevoke = async (sessionId: string) => {
    if (window.confirm('Revoke this session?')) {
      await revokeSession.mutateAsync(sessionId)
    }
  }

  const handleRevokeAll = async () => {
    if (window.confirm('Revoke all other sessions? You will remain logged in on this device.')) {
      await revokeAllSessions.mutateAsync()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2] mb-6">Sessions</h2>

      <div className="space-y-6">
        <div className="border border-white/[0.06] p-6">
          <h3 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[#8A8F89] mb-4">
            Active Sessions
          </h3>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-white/[0.02] animate-pulse" />
              ))}
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 border ${
                    session.isCurrent ? 'border-[#B6F34A]/20 bg-[#B6F34A]/[0.02]' : 'border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {session.os?.toLowerCase().includes('mobile') ? (
                      <Smartphone className="w-5 h-5 text-[#555B55]" />
                    ) : (
                      <Monitor className="w-5 h-5 text-[#555B55]" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] text-[#F5F7F2]">
                          {session.browser} · {session.os}
                        </p>
                        {session.isCurrent && (
                          <span className="text-[10px] font-mono text-[#B6F34A] bg-[#B6F34A]/10 px-2 py-0.5">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#555B55]">
                        {session.location ?? 'Unknown location'} · Last active {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <motion.button
                      onClick={() => handleRevoke(session.id)}
                      disabled={revokeSession.isPending}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                    >
                      Revoke
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#555B55]">No active sessions.</p>
          )}
        </div>

        {sessions && sessions.filter((s) => !s.isCurrent).length > 0 && (
          <motion.button
            onClick={handleRevokeAll}
            disabled={revokeAllSessions.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-red-400 border border-red-400/20 hover:bg-red-400/5 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
            {revokeAllSessions.isPending ? 'Revoking...' : 'Revoke All Other Sessions'}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
