import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const words = [
  { text: 'GitHub shows', muted: true },
  { text: 'everything', muted: true },
  { text: 'you made.', muted: true },
]

const words2 = [
  { text: 'Shipfolio shows', muted: true },
  { text: 'what you are', muted: false },
  { text: 'proud of.', muted: false, accent: true },
]

export default function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20%' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const lineHeight = useTransform(scrollYProgress, [0.2, 0.5], ['0%', '100%'])

  return (
    <section ref={ref} className="relative py-32 md:py-48 overflow-hidden" id="product">
      {/* Animated vertical line */}
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-white/[0.04]">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-[#B6F34A]/30"
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pl-12 md:pl-20">
        <div className="max-w-4xl">
          {/* First sentence */}
          <div className="mb-4">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15, y: 20 }}
                animate={isInView ? { opacity: word.muted ? 0.4 : 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                className={`inline-block mr-3 text-[clamp(1.5rem,4vw,3.2rem)] leading-[1.15] font-light ${
                  word.muted ? 'text-[#555B55]' : 'text-[#F5F7F2]'
                }`}
              >
                {word.text}
              </motion.span>
            ))}
          </div>

          {/* Second sentence */}
          <div>
            {words2.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15, y: 20 }}
                animate={isInView ? { opacity: word.muted ? 0.4 : 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease }}
                className={`inline-block mr-3 text-[clamp(1.5rem,4vw,3.2rem)] leading-[1.15] ${
                  word.accent
                    ? 'font-medium text-[#B6F34A]'
                    : word.muted
                    ? 'font-light text-[#555B55]'
                    : 'font-light text-[#F5F7F2]'
                }`}
              >
                {word.text}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.8, ease }}
          className="mt-20 h-px bg-gradient-to-r from-white/[0.08] to-transparent origin-left max-w-2xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-10 text-[15px] text-[#555B55] max-w-md leading-relaxed"
        >
          Not every commit is a story worth telling. Shipfolio helps you curate
          the work that matters and present it with the craft it deserves.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-16 flex gap-16"
        >
          {[
            { value: '2,847', label: 'Builders' },
            { value: '12,491', label: 'Projects Shipped' },
            { value: '847', label: 'Community Posts' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[clamp(1.2rem,2vw,1.6rem)] font-bold text-[#F5F7F2]">{stat.value}</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
