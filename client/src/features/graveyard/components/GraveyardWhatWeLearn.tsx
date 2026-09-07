import { motion } from 'framer-motion'
import { graveyardLessons } from '../data/graveyardData'

const ease = [0.22, 1, 0.36, 1] as const

export default function GraveyardWhatWeLearn() {
  return (
    <section className="py-16 md:py-24 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        {/* Header */}
        <div className="mb-14">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#303530] mb-4">
            REFLECTIONS
          </p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-[-0.06em] leading-[0.85] text-[#F5F7F2]">
            WHAT THE GRAVEYARD<br />
            TEACHES US.
          </h2>
        </div>

        {/* Lessons */}
        <div className="space-y-0">
          {graveyardLessons.map((lesson, i) => (
            <motion.div
              key={lesson.number}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
              className="group flex gap-6 md:gap-10 py-8 border-t border-white/[0.06] last:border-b cursor-default"
            >
              {/* Number */}
              <span className="text-[clamp(2rem,5vw,4rem)] font-black text-[#B6F34A]/10 leading-none shrink-0 w-[80px] group-hover:text-[#B6F34A]/20 transition-colors duration-500">
                {lesson.number}
              </span>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-[clamp(1rem,2vw,1.3rem)] font-bold tracking-[-0.03em] text-[#F5F7F2] mb-3 group-hover:text-[#B6F34A] transition-colors duration-300">
                  {lesson.title}
                </h3>
                <p className="text-[14px] text-[#8A8F89] leading-relaxed max-w-[480px]">
                  {lesson.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
