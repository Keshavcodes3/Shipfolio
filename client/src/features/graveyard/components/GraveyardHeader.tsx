import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function GraveyardHeader() {
  return (
    <section className="pt-20 md:pt-28 pb-8 relative">
      {/* Top metadata line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-2 h-2 rounded-full bg-[#B6F34A]/40" />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#303530]">
          THE ARCHIVE
        </span>
        <div className="flex-1 h-[1px] bg-white/[0.04]" />
        <span className="text-[10px] font-mono text-[#303530]">
          EST. 2026
        </span>
      </motion.div>

      {/* Main headline */}
      <div className="overflow-hidden">
        {['NOT EVERYTHING', 'WORTH BUILDING', 'GETS FINISHED.'].map((line, i) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease }}
          >
            <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black tracking-[-0.07em] leading-[0.85] text-[#F5F7F2]">
              {line}
            </h1>
          </motion.div>
        ))}
      </div>

      {/* Subtext + annotation */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease }}
          className="max-w-[440px]"
        >
          <p className="text-[15px] text-[#8A8F89] leading-relaxed mb-4">
            A collection of abandoned projects, unfinished experiments,
            and ideas that taught their builders something worth keeping.
          </p>
          <p className="text-[13px] text-[#555B55] italic">
            some things are worth remembering even when they're over
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-[1px] bg-[#B6F34A]/30" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B6F34A]/50">
            Click any project to read its story
          </span>
        </motion.div>
      </div>
    </section>
  )
}
