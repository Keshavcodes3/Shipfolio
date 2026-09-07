import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { useSignUp } from '@clerk/clerk-react'
import { FaGithub as Github } from 'react-icons/fa'
import Logo from '../../../components/Logo'
import SEO from '../../../components/SEO'

const ease = [0.22, 1, 0.36, 1] as const

function MetaLine() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-[#555B55]">SHIPFOLIO</span>
      <span className="h-px w-6 bg-white/[0.08]" />
      <span className="text-[9px] uppercase tracking-[0.24em] text-[#555B55]">BUILD</span>
      <span className="h-1 w-1 rounded-full bg-[#B6F34A]" />
      <span className="text-[9px] uppercase tracking-[0.24em] text-[#555B55]">SHIP</span>
      <span className="text-[9px] uppercase tracking-[0.24em] text-[#555B55]">SHOW</span>
    </div>
  )
}

function GithubIcon() {
  return <Github className="h-[15px] w-[15px]" />
}

export default function Register() {
  const { signUp, isLoaded } = useSignUp()

  async function handleGitHub() {
    if (!signUp) return
    await signUp.authenticateWithRedirect({
      strategy: 'oauth_github',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/dashboard',
    })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080A08] text-[#F5F7F2]">
      <SEO
        title="Create Account"
        description="Create your ShipFolio account and start building your living portfolio."
        url="/register"
        noindex={true}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,247,242,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,242,0.8) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-[12%] h-[300px] w-[300px] rounded-full sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]"
        style={{ background: 'radial-gradient(circle, rgba(182,243,74,0.025) 0%, transparent 68%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full flex-col lg:flex-row lg:max-w-[1500px]">
        <section className="hidden lg:flex lg:w-[52%] lg:items-center lg:px-16 xl:px-24">
          <div className="relative w-full">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="absolute left-0 top-[-180px]"
            >
              <Link to="/"><Logo size="sm" animate={false} /></Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -15, rotate: -3 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="mb-8 font-['Comic_Sans_MS'] text-[14px] text-[#B6F34A]"
            >
              for the things worth keeping →
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              className="max-w-[760px] font-['Comic_Sans_MS'] text-[clamp(4.4rem,8vw,8.5rem)] leading-[0.79] tracking-[-0.075em] text-[#F5F7F2]"
            >
              <span className="block rotate-[-2deg]">make</span>
              <span className="ml-[0.65em] mt-3 block rotate-[1deg]">something</span>
              <span className="ml-[1.25em] mt-3 block rotate-[-1deg]">
                worth{' '}
                <span className="relative inline-block">
                  seeing.
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.7, delay: 1, ease }}
                    className="absolute bottom-[-7px] left-0 h-[3px] -rotate-[2deg] bg-[#B6F34A]/70"
                  />
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease }}
              className="ml-[7rem] mt-14 max-w-[310px] font-['Comic_Sans_MS'] text-[13px] leading-6 text-[#555B55]"
            >
              Your projects don't need another repository. They need a place where the work can breathe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 15, rotate: 4 }}
              animate={{ opacity: 1, x: 0, rotate: 4 }}
              transition={{ duration: 0.6, delay: 1, ease }}
              className="absolute bottom-[6%] right-[8%] font-['Comic_Sans_MS'] text-[13px] text-[#555B55]"
            >
              ↓ keep building
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.15, ease }}
              className="absolute right-[18%] top-[10%] h-2 w-2 rounded-full bg-[#B6F34A] shadow-[0_0_18px_rgba(182,243,74,0.22)]"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute bottom-[-190px] left-0"
            >
              <MetaLine />
            </motion.div>
          </div>
        </section>

        <div className="hidden w-px bg-white/[0.06] lg:block" />

        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 lg:w-[48%] lg:justify-start lg:px-16 xl:px-24 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="w-full max-w-[400px]"
          >
            <div className="mb-10 flex items-center justify-between sm:mb-14 lg:hidden">
              <Link to="/"><Logo size="sm" animate={false} /></Link>
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#555B55]">02 / REGISTER</span>
            </div>

            <div className="mb-7 sm:mb-9">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mb-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#555B55] sm:mb-4"
              >
                Start here
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
                className="text-[26px] font-medium tracking-[-0.045em] text-[#F5F7F2] sm:text-[32px]"
              >
                Build your profile.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
                className="mt-3 max-w-[320px] text-[13px] leading-6 text-[#555B55]"
              >
                Turn the things you build into something people can explore.
              </motion.p>
            </div>

            <motion.button
              type="button"
              onClick={handleGitHub}
              disabled={!isLoaded}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              className="flex h-12 w-full items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.015] text-[13px] text-[#8A8F89] transition-colors duration-300 hover:border-white/[0.15] hover:text-[#F5F7F2] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GithubIcon />
              Continue with GitHub
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-6 border-t border-white/[0.06] pt-5 sm:mt-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#555B55]">Already have an account?</span>
                <Link to="/login" className="text-[11px] text-[#8A8F89] transition-colors duration-200 hover:text-[#F5F7F2]">
                  Sign in →
                </Link>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-5 text-[9px] leading-5 text-[#303530] sm:mt-6"
            >
              By creating an account, you agree to Shipfolio's terms and acknowledges its privacy policy.
            </motion.p>
          </motion.div>
        </section>
      </div>
    </main>
  )
}
