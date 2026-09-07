import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProjectStory({ story }: { story: string }) {
  const paragraphs = story.split('\n\n').filter(Boolean)

  return (
    <section className="py-16 md:py-20 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">THE STORY</span>
        <div className="mt-8 space-y-6 max-w-[560px]">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
              className="text-[15px] text-[#8A8F89] leading-[1.8]"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
