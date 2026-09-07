import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { featuredStory } from '../data/graveyardData'
import GraveyardProjectVisual from './GraveyardProjectVisual'

const ease = [0.22, 1, 0.36, 1] as const

export default function GraveyardFeaturedStory() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      className="py-16 md:py-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section label */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
          FEATURED STORY
        </span>
        <div className="flex-1 h-[1px] bg-white/[0.04]" />
      </div>

      {/* Story layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0">
        {/* Left: Large visual */}
        <div className="lg:col-span-5 relative h-[240px] lg:h-auto border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="absolute inset-0">
            <GraveyardProjectVisual type="letters" isHovered={isHovered} />
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0C0A]/50 lg:block hidden" />
        </div>

        {/* Right: Story content */}
        <div className="lg:col-span-7 lg:-ml-px border border-white/[0.06] bg-[#0A0C0A] p-8 md:p-12">
          {/* Builder */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-mono text-[#8A8F89]">
              {featuredStory.builder.avatar}
            </span>
            <div>
              <p className="text-[13px] text-[#F5F7F2]">{featuredStory.builder.displayName}</p>
              <p className="text-[11px] text-[#555B55]">@{featuredStory.builder.username}</p>
            </div>
            <span className="ml-auto text-[10px] text-[#303530] font-mono">
              {featuredStory.readTime}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.05em] leading-[0.9] text-[#F5F7F2] mb-6">
            {featuredStory.title}
          </h2>

          {/* Excerpt */}
          <div className="text-[14px] text-[#8A8F89] leading-relaxed space-y-4 mb-8">
            {featuredStory.excerpt.split('\n\n').slice(0, 2).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.2, ease }}
            className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.1em] text-[#B6F34A] hover:gap-3 transition-all duration-300"
          >
            Read the full story
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.section>
  )
}
