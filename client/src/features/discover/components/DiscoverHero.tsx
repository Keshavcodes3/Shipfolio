import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function DiscoverHero() {
  return (
    <section className="pt-20 md:pt-28 pb-12 md:pb-16 relative">
      <div className="overflow-hidden">
        {['WHAT PEOPLE', 'ARE BUILDING.'].map((line, i) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.8, ease }}
          >
            <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2]">
              {line}
            </h1>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease }}
        className="text-[15px] text-[#555B55] leading-relaxed mt-6 max-w-[420px]"
      >
        A room full of projects,
        ideas, and people worth discovering.
      </motion.p>
    </section>
  )
}
