import { useRef } from 'react'
import Logo from '../../../components/Logo'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

const ease = [0.22, 1, 0.36, 1] as const

const words = ['BUILD.', 'SHIP.', 'BE SEEN.']

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section className="relative py-40 md:py-56 overflow-hidden" id="community">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Background wordmark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 1 }}
          className="text-[clamp(6rem,18vw,18rem)] font-bold text-white/[0.015] tracking-[0.15em] leading-none whitespace-nowrap"
        >
          <Logo size="sm" animate={false} />
        </motion.span>
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 text-center">
        {/* Headline */}
        <div className="mb-10">
          {words.map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease }}
              className="overflow-hidden"
            >
              <span className={`block text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight ${
                i === 2 ? 'text-[#B6F34A]' : 'text-[#F5F7F2]'
              }`}>
                {word}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease }}
          className="text-[clamp(1rem,2vw,1.25rem)] text-[#8A8F89] mb-14 max-w-lg mx-auto leading-relaxed"
        >
          Give the things you build somewhere to live.
          <br />
          Stop hiding behind your commits.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#B6F34A] text-[#080A08] text-[13px] font-semibold rounded-md hover:bg-[#B6F34A]/90 transition-all duration-200"
          >
            Create your Shipfolio
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/discover"
            className="group inline-flex items-center gap-2 px-8 py-4 text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] border border-white/[0.08] rounded-md hover:border-white/[0.15] transition-all duration-200"
          >
            Explore builders
            <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-20 flex items-center justify-center gap-8"
        >
          {['No credit card required', 'Free for open source', 'Ship in minutes'].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#B6F34A]/40" />
              <span className="text-[11px] text-[#555B55]">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
