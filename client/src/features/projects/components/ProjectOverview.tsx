import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProjectOverview({ about }: { about: string }) {
  return (
    <section className="py-16 md:py-20 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">ABOUT</span>
        <p className="text-[clamp(1rem,2vw,1.25rem)] text-[#8A8F89] leading-relaxed mt-6 max-w-[560px]">
          {about}
        </p>
      </motion.div>
    </section>
  )
}
