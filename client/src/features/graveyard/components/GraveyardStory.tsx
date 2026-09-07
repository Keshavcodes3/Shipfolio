import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, GitFork, ArrowLeft, BookOpen, Clock, AlertTriangle, CheckCircle, Lightbulb, Target, BarChart3, X, Tag } from 'lucide-react'
import type { GraveyardProject } from '../data/graveyardData'

const ease = [0.22, 1, 0.36, 1] as const

interface GraveyardStoryProps {
  project: GraveyardProject | null
  isOpen: boolean
  onClose: () => void
}

export default function GraveyardStory({ project, isOpen, onClose }: GraveyardStoryProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-y-0 right-0 w-full sm:w-[600px] md:w-[700px] bg-[#0C0F0C] border-l border-white/[0.06] z-50 overflow-hidden"
          >
            <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#303530]">
              {/* Header */}
              <div className="sticky top-0 bg-[#0C0F0C]/90 backdrop-blur-xl border-b border-white/[0.06] z-10">
                <div className="flex items-center justify-between px-6 py-4">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-[#8A8F89] hover:text-[#F5F7F2] transition-colors text-[12px] cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Back to Graveyard
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center text-[#555B55] hover:text-[#F5F7F2] transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-10">
                {/* Project Header */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B6F34A]">
                      {project.category}
                    </span>
                    <span className="text-[#303530]">·</span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#555B55]">
                      {project.abandonedAt}
                    </span>
                  </div>

                  <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] text-[#F5F7F2] mb-3 leading-[0.9]">
                    {project.name}
                  </h1>

                  <p className="text-[clamp(1rem,2vw,1.3rem)] text-[#B6F34A] mb-6 leading-snug max-w-[480px]">
                    {project.description}
                  </p>

                  {/* Builder */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#1A1D1A] border border-white/[0.08] flex items-center justify-center text-[14px] font-bold text-[#B6F34A]">
                      {project.builder.avatar}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#F5F7F2]">{project.builder.displayName}</p>
                      <p className="text-[12px] text-[#555B55]">@{project.builder.username}</p>
                    </div>
                  </div>

                  {/* Meta line */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#555B55] font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {project.duration}
                    </span>
                    <span>·</span>
                    <span>{project.startedAt} → {project.abandonedAt}</span>
                    {project.repository && (
                      <>
                        <span>·</span>
                        <a
                          href={project.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#8A8F89] hover:text-[#B6F34A] transition-colors"
                        >
                          <GitFork size={12} />
                          Repository
                          <ExternalLink size={10} />
                        </a>
                      </>
                    )}
                    {project.liveUrl && (
                      <>
                        <span>·</span>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#8A8F89] hover:text-[#B6F34A] transition-colors"
                        >
                          <ExternalLink size={12} />
                          Live Site
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* The Story */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen size={16} className="text-[#B6F34A]" />
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">THE STORY</h2>
                  </div>
                  <div className="space-y-4">
                    {project.longDescription.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-[15px] leading-[1.7] text-[#C5C8C5]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Why It Ended */}
                <div className="mb-16 p-6 bg-[#B6F34A]/[0.03] border border-[#B6F34A]/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle size={16} className="text-[#B6F34A]" />
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#B6F34A]">WHY IT ENDED</h2>
                  </div>
                  <p className="text-[15px] leading-[1.7] text-[#F5F7F2] font-medium">
                    {project.reason}
                  </p>
                </div>

                {/* What Went Wrong */}
                {project.whatWentWrong && project.whatWentWrong.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <AlertTriangle size={16} className="text-[#FF6B6B]" />
                      <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">WHAT WENT WRONG</h2>
                    </div>
                    <div className="space-y-3">
                      {project.whatWentWrong.map((item, i) => (
                        <div key={i} className="flex gap-3 text-[14px] leading-[1.6] text-[#C5C8C5]">
                          <span className="text-[#FF6B6B] mt-1 shrink-0">×</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What Went Right */}
                {project.whatWentRight && project.whatWentRight.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle size={16} className="text-[#B6F34A]" />
                      <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">WHAT WENT RIGHT</h2>
                    </div>
                    <div className="space-y-3">
                      {project.whatWentRight.map((item, i) => (
                        <div key={i} className="flex gap-3 text-[14px] leading-[1.6] text-[#C5C8C5]">
                          <span className="text-[#B6F34A] mt-1 shrink-0">✓</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* The Lesson */}
                <div className="mb-16 p-6 border-l-2 border-[#B6F34A] bg-[#B6F34A]/[0.02]">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb size={16} className="text-[#B6F34A]" />
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">THE LESSON</h2>
                  </div>
                  <p className="text-[15px] leading-[1.7] text-[#F5F7F2] font-medium">
                    {project.lesson}
                  </p>
                </div>

                {/* Technical Decisions */}
                {project.technicalDecisions && project.technicalDecisions.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <Target size={16} className="text-[#8A8F89]" />
                      <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">TECHNICAL DECISIONS</h2>
                    </div>
                    <div className="space-y-4">
                      {project.technicalDecisions.map((dec, i) => (
                        <div key={i} className="p-4 bg-[#121512] border border-white/[0.04] rounded-lg">
                          <p className="text-[13px] font-semibold text-[#F5F7F2] mb-2">{dec.decision}</p>
                          <p className="text-[13px] text-[#8A8F89] mb-2">Outcome: {dec.outcome}</p>
                          <p className="text-[13px] text-[#B6F34A]">→ {dec.lesson}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {project.timeline && project.timeline.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <Clock size={16} className="text-[#8A8F89]" />
                      <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">TIMELINE</h2>
                    </div>
                    <div className="space-y-0">
                      {project.timeline.map((event, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-[#303530] shrink-0 mt-2" />
                            {i < project.timeline!.length - 1 && (
                              <div className="w-[1px] flex-1 bg-[#1A1D1A]" />
                            )}
                          </div>
                          <div className="pb-6">
                            <p className="text-[10px] font-mono text-[#555B55] mb-1">{event.date}</p>
                            <p className="text-[13px] text-[#C5C8C5]">{event.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <BarChart3 size={16} className="text-[#8A8F89]" />
                      <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">BY THE NUMBERS</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {project.metrics.map((metric, i) => (
                        <div key={i} className="p-4 bg-[#121512] border border-white/[0.04] rounded-lg">
                          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">{metric.label}</p>
                          <p className="text-[18px] font-bold text-[#F5F7F2]">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Would Build Again */}
                <div className="mb-16 p-6 bg-[#121512] border border-white/[0.04] rounded-lg">
                  <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#555B55] mb-3">WOULD BUILD AGAIN</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${project.wouldBuildAgain ? 'bg-[#B6F34A]' : 'bg-[#FF6B6B]'}`} />
                    <span className="text-[15px] font-medium text-[#F5F7F2]">
                      {project.wouldBuildAgain ? 'Yes — different approach' : 'No — lesson learned'}
                    </span>
                  </div>
                </div>

                {/* Advice */}
                {project.advice && (
                  <div className="mb-16 p-6 border border-[#B6F34A]/20 rounded-lg bg-[#B6F34A]/[0.02]">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb size={16} className="text-[#B6F34A]" />
                      <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#B6F34A]">ADVICE</h2>
                    </div>
                    <p className="text-[15px] leading-[1.7] text-[#F5F7F2] font-medium italic">
                      "{project.advice}"
                    </p>
                  </div>
                )}

                {/* Related Lessons */}
                {project.relatedLessons && project.relatedLessons.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen size={16} className="text-[#8A8F89]" />
                      <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">RELATED LESSONS</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.relatedLessons.map((lesson, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#1A1D1A] border border-white/[0.06] rounded text-[12px] text-[#8A8F89]">
                          {lesson}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <Tag size={16} className="text-[#8A8F89]" />
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">TECHNOLOGIES</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#1A1D1A] border border-white/[0.06] rounded text-[12px] text-[#C5C8C5]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <Tag size={16} className="text-[#8A8F89]" />
                      <h2 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">TAGS</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#B6F34A]/[0.06] border border-[#B6F34A]/10 rounded text-[12px] text-[#B6F34A]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Builder's Other Projects */}
                {project.builder.otherProjects && project.builder.otherProjects.length > 0 && (
                  <div className="mb-16 pt-8 border-t border-white/[0.06]">
                    <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#555B55] mb-4">
                      MORE FROM {project.builder.displayName.toUpperCase()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.builder.otherProjects.map((p, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#121512] border border-white/[0.04] rounded text-[12px] text-[#8A8F89]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom spacer */}
                <div className="h-20" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
