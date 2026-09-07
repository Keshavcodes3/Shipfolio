import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import FeedbackQuestion from '../components/FeedbackQuestion'
import FeedbackSummary from '../components/FeedbackSummary'
import FeedbackList from '../components/FeedbackList'
import FeedbackComposer from '../components/FeedbackComposer'
import { feedbackRequests, feedbackResponses, type FeedbackCategory } from '../data/feedbackData'
import { projects } from '../../projects/data/projectDetailData'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProjectFeedback() {
  const { id } = useParams<{ id: string }>()
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({})
  const [localResponses, setLocalResponses] = useState(feedbackResponses)

  const project = id ? projects[id] : undefined
  const request = feedbackRequests.find((r) => r.projectId === id)

  const responses = useMemo(
    () => localResponses.filter((r) => r.requestId === request?.id),
    [localResponses, request]
  )

  const helpfulCount = useMemo(
    () => Object.values(helpfulMap).filter(Boolean).length + responses.reduce((sum, r) => sum + r.helpfulCount, 0),
    [helpfulMap, responses]
  )

  if (!project || !request) {
    return (
      <SidebarShell>
        <div className="flex items-center justify-center px-5 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center"
          >
            <p className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-3">
              NO FEEDBACK REQUEST
            </p>
            <p className="text-[14px] text-[#555B55] mb-8">
              This project does not have an active feedback request.
            </p>
            <Link
              to={`/projects/${id}`}
              className="text-[12px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
            >
              ← BACK TO PROJECT
            </Link>
          </motion.div>
        </div>
      </SidebarShell>
    )
  }

  const handleToggleHelpful = (responseId: string) => {
    setHelpfulMap((prev) => ({ ...prev, [responseId]: !prev[responseId] }))
  }

  const handleSubmitFeedback = (content: string, category: FeedbackCategory) => {
    const newResponse = {
      id: `resp-local-${Date.now()}`,
      requestId: request.id,
      author: { username: 'you', displayName: 'You' },
      category,
      content,
      helpfulCount: 0,
      createdAt: 'just now',
    }
    setLocalResponses((prev) => [newResponse, ...prev])
  }

  return (
    <SidebarShell>
      <div className="text-[#F5F7F2] overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[5%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.03] blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-[720px] mx-auto px-5 md:px-8 py-12 md:py-20">
          {/* Back link */}
          <Link
            to={`/projects/${id}`}
            className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.12em] text-[#555B55] hover:text-[#8A8F89] transition-colors duration-200 mb-12"
          >
            <ArrowLeft size={14} />
            {project.name}
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2] mb-4">
              PROJECT FEEDBACK
            </h1>
            <p className="text-[15px] text-[#8A8F89]">
              {responses.length} {responses.length === 1 ? 'piece' : 'pieces'} of feedback
            </p>
          </motion.div>

          {/* Project context */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease }}
            className="border border-white/[0.06] bg-white/[0.015] p-5 mb-8"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B6F34A]/70 mb-2">
              {project.name}
            </p>
            <p className="text-[14px] text-[#8A8F89] mb-3">{project.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#B6F34A]">
                  {project.status}
                </span>
                <span className="text-[10px] text-[#303530]">·</span>
                <span className="text-[11px] text-[#555B55]">
                  {project.technologies.slice(0, 4).join(' · ')}
                </span>
              </div>
              <Link
                to={`/projects/${id}`}
                className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#B6F34A] transition-colors duration-200"
              >
                View Project
                <ExternalLink size={10} />
              </Link>
            </div>
          </motion.div>

          {/* Feedback summary */}
          <div className="mb-8">
            <FeedbackSummary responses={responses} helpfulCount={helpfulCount} />
          </div>

          {/* The question */}
          <div className="mb-8">
            <FeedbackQuestion request={request} />
          </div>

          {/* Existing feedback */}
          <div className="mb-8">
            <FeedbackList
              responses={responses}
              helpfulMap={helpfulMap}
              onToggleHelpful={handleToggleHelpful}
            />
          </div>

          {/* Composer */}
          {request.status === 'OPEN' && (
            <FeedbackComposer request={request} onSubmit={handleSubmitFeedback} />
          )}

          {/* Closed notice */}
          {request.status === 'CLOSED' && (
            <div className="p-6 border border-white/[0.06] bg-white/[0.015] text-center">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
                FEEDBACK REQUEST CLOSED
              </p>
              <p className="text-[13px] text-[#8A8F89]">
                The builder has finished collecting feedback.
              </p>
            </div>
          )}
        </div>
      </div>
    </SidebarShell>
  )
}
