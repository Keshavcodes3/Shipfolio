import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { useSignIn } from '@clerk/clerk-react'
import { ArrowRight } from 'lucide-react'
import Logo from '../../../components/Logo'
import SEO from '../../../components/SEO'

const ease = [0.22, 1, 0.36, 1] as const

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export default function Login() {
  const { signIn, isLoaded } = useSignIn()

  async function handleGitHub() {
    if (!signIn) return
    await signIn.authenticateWithRedirect({
      strategy: 'oauth_github',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/dashboard',
    })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080A08] text-[#F5F7F2]">
      <SEO
        title="Sign In"
        description="Sign in to your ShipFolio account."
        url="/login"
        noindex={true}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,247,242,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,242,0.6) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      <motion.div
        className="pointer-events-none absolute right-[15%] top-[25%] h-[300px] w-[300px] rounded-full sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]"
        style={{ background: 'radial-gradient(circle, rgba(182,243,74,0.025), transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen flex-col lg:flex-row lg:max-w-[1400px]">
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 lg:w-[43%] lg:justify-end lg:px-16 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="w-full max-w-[400px]"
          >
            <div className="mb-10 flex items-center justify-between sm:mb-14">
              <Link to="/"><Logo size="sm" animate={false} /></Link>
              <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-700">01 / SIGN IN</span>
            </div>

            <div className="mb-8 sm:mb-10">
              <h1 className="text-[28px] font-medium tracking-[-0.045em] sm:text-[34px]">Welcome back.</h1>
              <p className="mt-3 max-w-[300px] text-[13px] leading-6 text-neutral-600">Pick up where you left off.</p>
            </div>

            <motion.button
              type="button"
              onClick={handleGitHub}
              disabled={!isLoaded}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex h-12 w-full items-center justify-center gap-2 border border-white/[0.09] text-[13px] text-neutral-400 transition-colors hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GithubIcon className="h-4 w-4" />
              Continue with GitHub
            </motion.button>

            <div className="mt-6 border-t border-white/[0.06] pt-5 sm:mt-8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-700">Don't have an account?</span>
                <Link to="/register" className="text-[11px] text-neutral-400 transition-colors hover:text-white">
                  Create one →
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="hidden w-px bg-white/[0.06] lg:block" />

        <section className="relative hidden w-[57%] items-center px-16 lg:flex">
          <div className="relative w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mb-10 font-['Comic_Sans_MS'] text-[14px] text-[#B6F34A]"
            >
              welcome back.
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease }}
              className="max-w-[720px] font-['Comic_Sans_MS'] text-[clamp(4rem,7vw,7.5rem)] leading-[0.82] tracking-[-0.075em]"
            >
              <span className="block rotate-[-2deg]">you built it.</span>
              <span className="ml-[0.8em] mt-3 block rotate-[1deg]">
                now <span className="text-[#B6F34A]">show it.</span>
              </span>
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '230px' }}
              transition={{ duration: 0.8, delay: 0.9, ease }}
              className="ml-[8rem] mt-8 h-[2px] -rotate-[1deg] bg-[#B6F34A]/70"
            />

            <motion.div
              initial={{ opacity: 0, x: 15, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 5 }}
              transition={{ duration: 0.6, delay: 1, ease }}
              className="absolute right-[8%] top-[42%] font-['Comic_Sans_MS'] text-[13px] text-neutral-600"
            >
              ← keep shipping
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.15 }}
              className="ml-[8rem] mt-10 max-w-[280px] font-['Comic_Sans_MS'] text-[13px] leading-6 text-neutral-600"
            >
              the work is still here.
              <br />
              <span className="text-neutral-700">pick it back up.</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="absolute bottom-[-180px] left-0 flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-neutral-700"
            >
              <Logo size="sm" animate={false} />
              <span className="h-px w-8 bg-white/10" />
              <span>BUILD / SHIP / SHOW</span>
              <span className="h-px w-8 bg-white/10" />
              <span>2026</span>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  )
}
