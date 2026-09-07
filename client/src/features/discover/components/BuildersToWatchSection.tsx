import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { Builder } from '../data/discoverData'
import BuilderAvatar from './BuilderAvatar'
import FollowBuilderButton from '../../follows/components/FollowBuilderButton'

const ease = [0.22, 1, 0.36, 1] as const

interface BuildersToWatchSectionProps {
  builders: Builder[]
}

export default function BuildersToWatchSection({ builders }: BuildersToWatchSectionProps) {
  return (
    <section className="py-16 md:py-24 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            BUILDERS TO WATCH
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>
        <p className="text-[14px] text-[#555B55] mb-10">People quietly building interesting things.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builders.map((builder, i) => (
            <motion.div
              key={builder.username}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease }}
            >
              <div className="border border-white/[0.06] p-6 relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative">
                  <BuilderAvatar letter={builder.avatar} size="lg" />

                  <Link to={`/profile/${builder.username}`}>
                    <h4 className="text-[16px] font-bold text-[#F5F7F2] mt-4 mb-1 group-hover:text-[#B6F34A] transition-colors duration-200">
                      @{builder.username}
                    </h4>
                  </Link>
                  <p className="text-[13px] text-[#8A8F89] leading-relaxed mb-4 line-clamp-2">
                    {builder.headline}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#303530] font-mono">
                        PROJECTS
                      </span>
                      <span className="text-[12px] font-mono text-[#555B55]">{builder.projectCount}</span>
                    </div>
                    {builder.currentProject && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#303530] font-mono">
                          BUILDING
                        </span>
                        <span className="text-[12px] font-mono text-[#B6F34A]">{builder.currentProject}</span>
                      </div>
                    )}
                  </div>

                  <FollowBuilderButton username={builder.username} displayName={builder.displayName} size="sm" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
