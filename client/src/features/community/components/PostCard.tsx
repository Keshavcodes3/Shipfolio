import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { MessageCircle, ArrowUp } from 'lucide-react'
import type { CommunityPost } from '../types/community'
import PostCategoryBadge from './PostCategoryBadge'

const ease = [0.22, 1, 0.36, 1] as const

interface PostCardProps {
  post: CommunityPost
  index?: number
  onClick?: () => void
}

const typeLabels: Record<string, string> = {
  PROJECT_UPDATE: 'PROJECT UPDATE',
  ASK_FOR_REVIEW: 'ASK FOR REVIEW',
  DISCUSSION: 'DISCUSSION',
  SHIP: 'SHIP',
}

export default function PostCard({ post, index = 0, onClick }: PostCardProps) {
  const [upvoted, setUpvoted] = useState(false)
  const [upvotes, setUpvotes] = useState(post.upvoteCount)

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation()
    setUpvoted(!upvoted)
    setUpvotes(upvoted ? upvotes - 1 : upvotes + 1)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      onClick={onClick}
      className="border border-white/[0.06] bg-white/[0.015] p-5 group hover:border-[#B6F34A]/15 transition-colors duration-300 cursor-pointer"
    >
      {/* Header: author + type + time */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${post.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-[#1A1D1A] border border-white/[0.08] flex items-center justify-center text-[11px] font-bold text-[#B6F34A]">
              {post.author.avatar ?? post.author.username[0].toUpperCase()}
            </div>
            <span className="text-[13px] font-bold text-[#F5F7F2] hover:text-[#B6F34A] transition-colors duration-200">
              @{post.author.username}
            </span>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#303530] border border-white/[0.06] px-2 py-0.5">
            {typeLabels[post.type]}
          </span>
        </div>
        <span className="text-[11px] text-[#303530] font-mono">{post.createdAt}</span>
      </div>

      {/* Pinned badge */}
      {post.isPinned && (
        <div className="mb-2">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#B6F34A]">
            PINNED
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-[16px] font-bold text-[#F5F7F2] mb-2 leading-snug group-hover:text-[#B6F34A] transition-colors duration-200">
        {post.title}
      </h3>

      {/* Content preview */}
      <p className="text-[13px] text-[#8A8F89] leading-relaxed mb-4 line-clamp-3">
        {post.content.split('\n')[0]}
      </p>

      {/* Project link */}
      {post.project && (
        <Link
          to={`/projects/${post.project.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/[0.02] border border-white/[0.04] hover:border-[#B6F34A]/15 transition-colors duration-200"
        >
          <span className="text-[11px] font-mono text-[#B6F34A]/70">{post.project.name}</span>
          <span className="text-[10px] text-[#303530]">·</span>
          <span className="text-[11px] text-[#555B55] line-clamp-1">{post.project.description}</span>
        </Link>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <PostCategoryBadge category={post.category} />
        {post.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[9px] font-mono text-[#555B55] border border-white/[0.04] px-1.5 py-0.5">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer: comments + upvote */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-2 text-[12px] text-[#555B55]">
          <MessageCircle size={13} />
          <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
        </div>
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-mono transition-colors duration-200 cursor-pointer border ${
            upvoted
              ? 'text-[#B6F34A] border-[#B6F34A]/20 bg-[#B6F34A]/[0.06]'
              : 'text-[#555B55] border-white/[0.06] hover:text-[#8A8F89]'
          }`}
        >
          <ArrowUp size={12} />
          <span>{upvotes}</span>
        </button>
      </div>
    </motion.article>
  )
}
