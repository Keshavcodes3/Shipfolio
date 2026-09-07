import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import FeedbackRequestForm from '../components/FeedbackRequestForm'
import { projects } from '../../projects/data/projectDetailData'
import type { FeedbackCategory } from '../data/feedbackData'

const ease = [0.22, 1, 0.36, 1] as const

export default function CreateFeedbackRequest() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)

  const project = id ? projects[id] : undefined

  if (!project) {
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
              PROJECT NOT FOUND
            </p>
            <Link
              to="/discover"
              className="text-[12px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
            >
              ← BACK TO DISCOVER
            </Link>
          </motion.div>
        </div>
      </SidebarShell>
    )
  }

  const handleSubmit = (_data: {
    title: string
    description: string
    category: FeedbackCategory
    context: string
  }) => {
    setSubmitted(true)
    setTimeout(() => {
      navigate(`/projects/${id}/feedback`)
    }, 1500)
  }

  if (submitted) {
    return (
      <SidebarShell>
        <div className="flex items-center justify-center px-5 py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#B6F34A]/[0.12] flex items-center justify-center mx-auto mb-4">
              <div className="w-3 h-3 rounded-full bg-[#B6F34A]" />
            </div>
            <p className="text-[18px] font-bold text-[#F5F7F2] mb-2">Feedback request created.</p>
            <p className="text-[13px] text-[#555B55]">Redirecting to feedback page...</p>
          </motion.div>
        </div>
      </SidebarShell>
    )
  }

  return (
    <SidebarShell>
      <div className="text-[#F5F7F2] overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[5%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.03] blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-[600px] mx-auto px-5 md:px-8 py-12 md:py-20">
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
              ASK FOR FEEDBACK
            </h1>
            <p className="text-[15px] text-[#8A8F89] max-w-[400px] leading-relaxed">
              Be specific about what you are trying to improve. Good questions get better answers.
            </p>
          </motion.div>

          {/* Form */}
          <FeedbackRequestForm
            projectName={project.name}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/projects/${id}`)}
          />
        </div>
      </div>
    </SidebarShell>
  )
}
