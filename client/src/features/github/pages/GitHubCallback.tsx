import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { useAuth } from '../../auth/hooks/useAuth'
import { api } from '../../../lib/api'

const ease = [0.22, 1, 0.36, 1] as const

export default function GitHubCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      setStatus('error')
      setErrorMessage('You must be logged in to link a GitHub account.')
      return
    }

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      setStatus('error')
      setErrorMessage(searchParams.get('error_description') || 'Authorization was denied.')
      return
    }

    if (!code) {
      setStatus('error')
      setErrorMessage('No authorization code received from GitHub.')
      return
    }

    const storedState = sessionStorage.getItem('github_oauth_state')
    if (state && storedState && state !== storedState) {
      setStatus('error')
      setErrorMessage('Invalid state parameter. Please try again.')
      return
    }
    sessionStorage.removeItem('github_oauth_state')

    const linkAccount = async () => {
      try {
        const { data } = await api.post('/github/account/link', { code })

        if (!data.success) {
          throw new Error(data.message || 'Failed to link GitHub account')
        }

        setStatus('success')
        const returnTo = sessionStorage.getItem('github_link_return') || '/dashboard'
        sessionStorage.removeItem('github_link_return')
        setTimeout(() => navigate(returnTo), 1500)
      } catch (err: any) {
        setStatus('error')
        setErrorMessage(err?.message || 'Failed to link GitHub account. Please try again.')
      }
    }

    linkAccount()
  }, [searchParams, navigate, isAuthenticated, authLoading])

  return (
    <div className="min-h-screen bg-[#080A08] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="text-center max-w-[400px]"
      >
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease }}
            >
              {/* Orbiting rings */}
              <div className="relative mb-8 mx-auto w-20 h-20">
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#B6F34A]/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                {/* Middle ring — dashed */}
                <motion.div
                  className="absolute inset-1.5 rounded-full border border-dashed border-[#B6F34A]/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                />
                {/* Inner ring */}
                <motion.div
                  className="absolute inset-3 rounded-full border border-[#B6F34A]/15"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />

                {/* Orbiting dot 1 */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B6F34A]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: `0px ${40}px` }}
                />
                {/* Orbiting dot 2 */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B6F34A]/60"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: `0px ${-40}px` }}
                />

                {/* Center pulsing core */}
                <motion.div
                  className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-[#B6F34A]/10"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 m-auto">
                  <LoadingSpinner size={20} />
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-[15px] text-[#F5F7F2] font-medium mb-2"
              >
                Linking your GitHub account...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-[13px] text-[#555B55]"
              >
                This will only take a moment.
              </motion.p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease }}
            >
              {/* Glow burst */}
              <div className="relative mb-8 mx-auto w-20 h-20">
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#B6F34A]/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2.5, 2], opacity: [0, 0.4, 0] }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#B6F34A]/10"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 3, 2.5], opacity: [0, 0.2, 0] }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                />

                {/* Checkmark circle */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#B6F34A] flex items-center justify-center"
                >
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
                  >
                    <Check className="w-8 h-8 text-[#080A08]" strokeWidth={3} />
                  </motion.div>
                </motion.div>

                {/* Radiating particles */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <motion.div
                    key={angle}
                    className="absolute w-1 h-1 rounded-full bg-[#B6F34A]"
                    style={{ top: '50%', left: '50%' }}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                      x: Math.cos((angle * Math.PI) / 180) * 48,
                      y: Math.sin((angle * Math.PI) / 180) * 48,
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                  />
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-[15px] text-[#F5F7F2] font-medium mb-2"
              >
                GitHub connected!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-[13px] text-[#555B55]"
              >
                Redirecting you back...
              </motion.p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease }}
            >
              {/* Error icon with shake */}
              <div className="relative mb-8 mx-auto w-20 h-20">
                <motion.div
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-red-400/10 flex items-center justify-center"
                  animate={{ x: [0, -6, 6, -4, 4, -2, 2, 0] }}
                  transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  >
                    <X className="w-8 h-8 text-red-400" strokeWidth={2.5} />
                  </motion.div>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-[15px] text-[#F5F7F2] font-medium mb-2"
              >
                Something went wrong
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-[13px] text-[#555B55] mb-6"
              >
                {errorMessage}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                onClick={() => navigate('/dashboard')}
                className="text-[12px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
              >
                ← BACK TO DASHBOARD
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
