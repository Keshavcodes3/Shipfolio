import { motion } from 'framer-motion'
import Logo from '../../../components/Logo'

const ease = [0.22, 1, 0.36, 1] as const

export default function GraveyardFooter() {
  return (
    <footer className="py-20 md:py-28 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
        className="text-center max-w-[500px] mx-auto"
      >
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-[1px] bg-[#B6F34A]/20" />
          <div className="w-2 h-2 rounded-full bg-[#B6F34A]/20" />
          <div className="w-12 h-[1px] bg-[#B6F34A]/20" />
        </div>

        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#303530] mb-5">
          THE ARCHIVE CONTINUES
        </p>

        <p className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold tracking-[-0.03em] text-[#F5F7F2] mb-4 leading-tight">
          Every project here made<br />someone a better builder.
        </p>

        <p className="text-[14px] text-[#555B55] mb-10">
          Your next experiment could teach you something too.
        </p>

        <div className="flex items-center justify-center gap-2 text-[10px] text-[#303530] font-mono">
          <Logo size="sm" animate={false} />
          <span className="text-[#B6F34A]/30">·</span>
          <span>GRAVEYARD</span>
          <span className="text-[#B6F34A]/30">·</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </motion.div>
    </footer>
  )
}
