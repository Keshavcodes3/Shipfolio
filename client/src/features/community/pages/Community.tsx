import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import {
  MessageCircle, ChevronUp, Send, Pin, X, Plus, Hash, Users,
  Sparkles, HelpCircle, Rocket, Repeat, TrendingUp,
  ArrowRight, Zap, BookOpen, Search, Trash2
} from 'lucide-react'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import Logo from '../../../components/Logo'
import SEO from '../../../components/SEO'
import {
  useCommunityPosts, useCommunityStats, useCommunityCategories,
  useCommunityRecentAuthors, useCommunityComments,
  useCreateCommunityPost, useCreateCommunityComment,
  useToggleCommunityUpvote, useDeleteCommunityPost, useUser,
} from '../../../lib/hooks'
import type { CommunityPost } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

const TYPE_META: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  DISCUSSION: { label: 'DISCUSSION', icon: HelpCircle, color: '#8A8F89', bg: 'rgba(138,143,137,0.08)' },
  PROJECT_UPDATE: { label: 'UPDATE', icon: Repeat, color: '#B6F34A', bg: 'rgba(182,243,74,0.06)' },
  ASK_FOR_REVIEW: { label: 'REVIEW', icon: Sparkles, color: '#F5C542', bg: 'rgba(245,197,66,0.06)' },
  SHIP: { label: 'SHIP', icon: Rocket, color: '#4AF5E1', bg: 'rgba(74,245,225,0.06)' },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'now'
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const d = Math.floor(hr / 24)
  if (d < 7) return `${d}d`
  return `${Math.floor(d / 7)}w`
}

// --- Post Composer ---
function PostComposer({ onSubmit, onClose, isSubmitting }: { onSubmit: (data: { title: string; content: string; category: string; tags: string[]; type: string }) => void; onClose: () => void; isSubmitting?: boolean }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Discussion')
  const [postType, setPostType] = useState('DISCUSSION')
  const [tags, setTags] = useState('')

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5),
      type: postType,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease }}
      className="overflow-hidden"
    >
      <div className="border border-[#B6F34A]/20 bg-gradient-to-br from-[#B6F34A]/[0.03] to-transparent p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#B6F34A]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#B6F34A]">COMPOSE</span>
          </div>
          <button onClick={onClose} className="text-[#555B55] hover:text-[#F5F7F2] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(TYPE_META).map(([key, meta]) => {
            const Icon = meta.icon
            return (
              <button
                key={key}
                onClick={() => setPostType(key)}
                className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.1em] px-3 py-1.5 border transition-all duration-200 ${postType === key ? 'border-[#B6F34A]/40 text-[#B6F34A] bg-[#B6F34A]/[0.08]' : 'border-white/[0.06] text-[#555B55] hover:text-[#8A8F89]'}`}
              >
                <Icon className="w-3 h-3" />
                {meta.label}
              </button>
            )
          })}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a title..."
          className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 mb-3"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share context, ask questions, show your work..."
          rows={5}
          className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-[13px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 resize-none mb-4"
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 text-[12px] text-[#8A8F89] focus:outline-none focus:border-[#B6F34A]/30"
          >
            {['Feedback', 'Show & Tell', 'Question', 'Discussion', 'Co-founder', 'Hiring', 'Built Something Cool'].map((c) => (
              <option key={c} value={c} className="bg-[#080A08]">{c}</option>
            ))}
          </select>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="flex-1 bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 text-[12px] text-[#8A8F89] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[10px] text-[#303530] font-mono">{title.length > 0 && content.length > 0 ? 'Ready to post' : 'Fill in title and content'}</p>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B6F34A] text-[#080A08] text-[11px] font-mono uppercase tracking-[0.1em] font-medium hover:bg-[#c8ff66] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.15 }, scale: { duration: 0.15 } }}
                  className="w-3.5 h-3.5"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
                  </svg>
                </motion.div>
              ) : (
                <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Send className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </AnimatePresence>
            {isSubmitting ? 'POSTING' : 'POST'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// --- Comment Composer ---
function CommentComposer({ postId }: { postId: string }) {
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const createComment = useCreateCommunityComment()

  const handleSubmit = () => {
    if (!content.trim() || isSending) return
    setIsSending(true)
    createComment.mutate({ postId, content: content.trim() }, {
      onSuccess: () => {
        setContent('')
        setTimeout(() => setIsSending(false), 400)
      },
      onError: () => setIsSending(false),
    })
  }

  return (
    <div>
      {/* Sending indicator */}
      <AnimatePresence>
        {isSending && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2.5 pb-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B6F34A] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B6F34A] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B6F34A] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] font-mono text-[#B6F34A]/60 uppercase tracking-wider">Sending</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Write a comment..."
          disabled={isSending}
          className="flex-1 bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[12px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 disabled:opacity-40 transition-opacity"
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSending}
          className="relative px-4 py-2.5 bg-[#B6F34A]/10 text-[#B6F34A] hover:bg-[#B6F34A]/20 transition-all disabled:opacity-30 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {isSending ? (
              <motion.div
                key="spinner"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.15 }, scale: { duration: 0.15 } }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Send className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

// --- Right Sidebar: Discussion Thread ---
function DiscussionThread({ post, onClose, currentUser, onDelete }: { post: CommunityPost; onClose: () => void; currentUser?: { id: string; username: string } | null; onDelete?: () => void }) {
  const { data: commentsData, isLoading: commentsLoading } = useCommunityComments(post.id)
  const comments = commentsData?.comments ?? []
  const typeMeta = TYPE_META[post.type] ?? TYPE_META.DISCUSSION
  const TypeIcon = typeMeta.icon
  const deletePost = useDeleteCommunityPost()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isAuthor = currentUser && currentUser.username === post.author.username

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(post.id)
      setShowDeleteConfirm(false)
      onDelete?.()
      onClose()
    } catch {
      // Error handled by mutation
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] bg-[#0A0C0A] border-l border-white/[0.08] z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ background: typeMeta.bg }}>
              <TypeIcon className="w-3 h-3" style={{ color: typeMeta.color }} />
              <span className="text-[9px] font-mono uppercase tracking-[0.1em]" style={{ color: typeMeta.color }}>{typeMeta.label}</span>
            </div>
            {post.isPinned && (
              <span className="flex items-center gap-1 text-[8px] font-mono text-[#B6F34A]">
                <Pin className="w-2.5 h-2.5" /> PINNED
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAuthor && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-[#555B55] hover:text-red-400 transition-colors p-1.5 hover:bg-white/[0.04]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="text-[#555B55] hover:text-[#F5F7F2] transition-colors p-1.5 hover:bg-white/[0.04]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Post content */}
          <div className="px-5 py-5 border-b border-white/[0.04]">
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/profile/${post.author.username}`} className="flex items-center gap-2.5 group/author">
                <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[11px] font-mono text-[#8A8F89] group-hover/author:border-[#B6F34A]/20 transition-colors">
                  {post.author.username[0].toUpperCase()}
                </div>
                <div>
                  <span className="text-[12px] font-mono text-[#C8CCC8] group-hover/author:text-[#B6F34A] transition-colors block leading-tight">@{post.author.username}</span>
                  <span className="text-[10px] text-[#303530]">{timeAgo(post.createdAt)}</span>
                </div>
              </Link>
            </div>

            <h2 className="text-[17px] font-bold tracking-[-0.02em] text-[#F5F7F2] mb-3 leading-snug">{post.title}</h2>
            <p className="text-[13px] text-[#B0B4B0] leading-[1.75] whitespace-pre-wrap">{post.content}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-[9px] font-mono text-[#555B55] border border-white/[0.06] px-2 py-0.5 hover:border-[#B6F34A]/20 transition-colors cursor-pointer">
                    <Hash className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.04]">
              <span className="flex items-center gap-1.5 text-[11px] text-[#555B55]">
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="font-mono">{post.upvoteCount}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#555B55]">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-mono">{comments.length}</span>
              </span>
              <span className="text-[10px] text-[#303530] border border-white/[0.06] px-2 py-0.5">{post.category}</span>
            </div>
          </div>

          {/* Comments */}
          <div className="px-5 py-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#555B55] mb-4">
              {comments.length} COMMENT{comments.length !== 1 ? 'S' : ''}
            </p>

            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-7 h-7 rounded-full bg-white/[0.06]" />
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-white/[0.06] mb-2" />
                      <div className="h-3 w-full bg-white/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3 group/comment"
                  >
                    <Link to={`/profile/${comment.author.username}`} className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[9px] font-mono text-[#8A8F89] shrink-0 hover:border-[#B6F34A]/20 transition-colors">
                      {comment.author.username[0].toUpperCase()}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/profile/${comment.author.username}`} className="text-[11px] font-mono text-[#C8CCC8] hover:text-[#B6F34A] transition-colors">
                          @{comment.author.username}
                        </Link>
                        <span className="text-[9px] text-[#303530]">{timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-[12px] text-[#B0B4B0] leading-relaxed">{comment.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <MessageCircle className="w-5 h-5 text-[#303530] mx-auto mb-2" />
                <p className="text-[12px] text-[#555B55]">No comments yet.</p>
                <p className="text-[10px] text-[#303530]">Be the first to reply.</p>
              </div>
            )}
          </div>
        </div>

        {/* Comment input — sticky bottom */}
        <div className="px-5 py-4 border-t border-white/[0.06] shrink-0 bg-[#0A0C0A]">
          <CommentComposer postId={post.id} />
        </div>
      </motion.aside>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease }}
              className="w-full max-w-[360px] bg-[#0A0C0A] border border-white/[0.06] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-[#F5F7F2]">Delete post?</h3>
                <button onClick={() => setShowDeleteConfirm(false)} className="text-[#555B55] hover:text-[#F5F7F2] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[13px] text-[#8A8F89] mb-6">
                This will permanently delete this post and all its comments. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deletePost.isPending}
                  className="flex-1 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deletePost.isPending ? 'Deleting...' : 'Delete Post'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// --- Single Post Card ---
function PostCard({ post, index, onClick, isSelected, currentUser }: { post: CommunityPost; index: number; onClick: () => void; isSelected?: boolean; currentUser?: { id: string; username: string } | null }) {
  const upvote = useToggleCommunityUpvote()
  const deletePost = useDeleteCommunityPost()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const typeMeta = TYPE_META[post.type] ?? TYPE_META.DISCUSSION
  const TypeIcon = typeMeta.icon
  const isAuthor = currentUser && currentUser.username === post.author.username

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deletePost.mutateAsync(post.id)
      setShowDeleteConfirm(false)
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease }}
      onClick={onClick}
      className={`group relative border transition-all duration-300 cursor-pointer ${isSelected ? 'border-[#B6F34A]/30 bg-[#B6F34A]/[0.02]' : 'border-white/[0.05] hover:border-white/[0.1]'}`}
    >
      {/* Left accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-300 ${isSelected ? 'opacity-100 bg-[#B6F34A]' : 'opacity-0 group-hover:opacity-100'}`} style={!isSelected ? { backgroundColor: typeMeta.color } : undefined} />

      <div className="p-5">
        {/* Top row: type + time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ background: typeMeta.bg }}>
              <TypeIcon className="w-3 h-3" style={{ color: typeMeta.color }} />
              <span className="text-[9px] font-mono uppercase tracking-[0.1em]" style={{ color: typeMeta.color }}>{typeMeta.label}</span>
            </div>
            {post.isPinned && (
              <span className="flex items-center gap-1 text-[8px] font-mono text-[#B6F34A]">
                <Pin className="w-2 h-2" /> PINNED
              </span>
            )}
            <span className="text-[9px] text-[#303530] border border-white/[0.06] px-1.5 py-0.5">{post.category}</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthor && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true) }}
                className="text-[#303530] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[10px] text-[#303530] font-mono">{timeAgo(post.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold tracking-[-0.01em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 mb-2">
          {post.title}
        </h3>

        {/* Content preview */}
        <p className="text-[12px] text-[#8A8F89] leading-relaxed line-clamp-2 mb-4">{post.content}</p>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[8px] font-mono text-[#555B55]">
                {post.author.username[0].toUpperCase()}
              </div>
              <span className="text-[11px] font-mono text-[#555B55] group-hover:text-[#8A8F89] transition-colors">@{post.author.username}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Upvote */}
            <button
              onClick={(e) => { e.stopPropagation(); upvote.mutate(post.id) }}
              className={`flex items-center gap-1 text-[11px] font-mono transition-colors ${post.isUpvoted ? 'text-[#B6F34A]' : 'text-[#303530] hover:text-[#555B55]'}`}
            >
              <ChevronUp className="w-4 h-4" />
              {post.upvoteCount}
            </button>
            {/* Comments */}
            <span className="flex items-center gap-1.5 text-[11px] text-[#303530] font-mono">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.commentCount}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/[0.04]">
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[8px] font-mono text-[#303530] border border-white/[0.06] px-2 py-0.5 hover:border-[#B6F34A]/20 hover:text-[#555B55] transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease }}
              className="w-full max-w-[360px] bg-[#0A0C0A] border border-white/[0.06] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-[#F5F7F2]">Delete post?</h3>
                <button onClick={() => setShowDeleteConfirm(false)} className="text-[#555B55] hover:text-[#F5F7F2] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[13px] text-[#8A8F89] mb-6">
                This will permanently delete this post and all its comments. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deletePost.isPending}
                  className="flex-1 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deletePost.isPending ? 'Deleting...' : 'Delete Post'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- Stats Row ---
function StatsRow() {
  const { data: stats } = useCommunityStats()
  const items = [
    { label: 'Builders', value: stats?.activeBuilders ?? 0, icon: Users, accent: true },
    { label: 'Posts Today', value: stats?.postsToday ?? 0, icon: TrendingUp, accent: false },
    { label: 'Comments', value: stats?.totalComments ?? 0, icon: MessageCircle, accent: false },
    { label: 'Total Posts', value: stats?.totalPosts ?? 0, icon: BookOpen, accent: false },
  ]
  return (
    <div className="flex items-center gap-6 py-4 mb-8 border-y border-white/[0.04]">
      {items.map((item, i) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#1a1c1a] mr-4">|</span>}
            <Icon className={`w-3.5 h-3.5 ${item.accent ? 'text-[#B6F34A]' : 'text-[#303530]'}`} />
            <span className={`text-[13px] font-black tracking-[-0.02em] font-mono ${item.accent ? 'text-[#B6F34A]' : 'text-[#555B55]'}`}>
              {item.value}
            </span>
            <span className="text-[9px] uppercase tracking-[0.12em] text-[#303530] font-mono">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// --- Sidebar ---
function Sidebar() {
  const { data: categories } = useCommunityCategories()
  const { data: recentAuthors } = useCommunityRecentAuthors()

  return (
    <div className="space-y-5">
      {/* About */}
      <div className="border border-white/[0.06] p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#B6F34A] mb-3">ABOUT THIS ROOM</p>
        <p className="text-[12px] text-[#8A8F89] leading-relaxed">
          Share what you're building. Get feedback. Find collaborators. No gatekeeping.
        </p>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="border border-white/[0.06] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#B6F34A] mb-3">TOPICS</p>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <span key={cat.name} className="text-[10px] font-mono text-[#555B55] border border-white/[0.06] px-2.5 py-1 hover:border-[#B6F34A]/20 hover:text-[#8A8F89] transition-colors cursor-pointer">
                {cat.name}
                <span className="text-[#303530] ml-1">{cat.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active Builders */}
      {recentAuthors && recentAuthors.length > 0 && (
        <div className="border border-white/[0.06] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#B6F34A] mb-3">ACTIVE BUILDERs</p>
          <div className="space-y-3">
            {recentAuthors.map((author) => (
              <Link
                key={author.id}
                to={`/profile/${author.username}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[10px] font-mono text-[#8A8F89] shrink-0 group-hover:border-[#B6F34A]/20 transition-colors">
                  {author.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono text-[#C8CCC8] group-hover:text-[#B6F34A] transition-colors truncate">
                    @{author.username}
                  </p>
                  <p className="text-[9px] text-[#303530]">{author._count.communityPosts} post{author._count.communityPosts !== 1 ? 's' : ''}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#303530] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="border border-white/[0.06] p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#B6F34A] mb-3">ROOM RULES</p>
        <div className="space-y-2.5">
          {[
            { icon: '01', text: 'Be kind. Builders help builders.' },
            { icon: '02', text: 'Share context — show your work.' },
            { icon: '03', text: 'Ask specific questions.' },
            { icon: '04', text: 'No self-promo without contribution.' },
          ].map((rule) => (
            <div key={rule.icon} className="flex items-start gap-2.5">
              <span className="text-[8px] font-mono text-[#B6F34A] mt-0.5">{rule.icon}</span>
              <span className="text-[11px] text-[#555B55] leading-relaxed">{rule.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Main Page ---
type FilterType = 'all' | 'DISCUSSION' | 'PROJECT_UPDATE' | 'ASK_FOR_REVIEW' | 'SHIP'
type SortType = 'recent' | 'popular' | 'discussed'

export default function Community() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('recent')
  const [search, setSearch] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)

  const { data, isLoading } = useCommunityPosts({
    sort,
    type: filter === 'all' ? undefined : filter,
    search: search.trim() || undefined,
  })

  const { data: currentUser } = useUser()
  const createPost = useCreateCommunityPost()
  const posts = data?.posts ?? []

  const handleCreatePost = useCallback((input: { title: string; content: string; category: string; tags: string[]; type: string }) => {
    createPost.mutate(input, { onSuccess: () => setShowComposer(false) })
  }, [createPost])

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'DISCUSSION', label: 'DISCUSSIONS' },
    { key: 'PROJECT_UPDATE', label: 'UPDATES' },
    { key: 'ASK_FOR_REVIEW', label: 'REVIEWS' },
    { key: 'SHIP', label: 'SHIPS' },
  ]

  return (
    <SidebarShell>
      <SEO
        title="Community"
        description="Discussions, updates, and feedback from builders. Join the conversation about what you're building."
        url="/community"
      />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.02] blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-3%] w-[400px] h-[400px] rounded-full bg-[#B6F34A]/[0.015] blur-[120px]" />
      </div>

      <div className="relative z-10 text-[#F5F7F2]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          {/* Hero */}
          <section className="pt-16 md:pt-24 pb-6 md:pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease }}
            >
              <h1 className="text-[clamp(2rem,5.5vw,3.5rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2]">
                THE ROOM.
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease }}
              className="text-[13px] text-[#555B55] mt-4 max-w-[360px]"
            >
              Where builders help builders. Share, ask, discover.
            </motion.p>
          </section>

          {/* Stats */}
          <StatsRow />

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-8 pb-16">
            {/* Feed */}
            <div className="flex-1 min-w-0">
              {/* Toolbar: filters + search + new post */}
              <div className="flex flex-col gap-4 mb-6">
                {/* Filters */}
                <div className="flex items-center gap-1 border-b border-white/[0.06] overflow-x-auto">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className="relative shrink-0 py-3 px-1 mr-4"
                    >
                      <span className={`text-[11px] font-mono uppercase tracking-[0.12em] transition-colors ${filter === f.key ? 'text-[#F5F7F2]' : 'text-[#555B55] hover:text-[#8A8F89]'}`}>
                        {f.label}
                      </span>
                      {filter === f.key && (
                        <motion.div layoutId="community-filter" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#B6F34A]" transition={{ duration: 0.25, ease }} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Search + Sort + New Post */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-[280px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#303530]" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full bg-white/[0.03] border border-white/[0.06] pl-9 pr-4 py-2 text-[12px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(['recent', 'popular', 'discussed'] as SortType[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSort(s)}
                        className={`text-[9px] uppercase tracking-[0.12em] font-mono px-2.5 py-1.5 border transition-colors ${sort === s ? 'border-[#B6F34A]/30 text-[#B6F34A] bg-[#B6F34A]/[0.05]' : 'border-white/[0.06] text-[#555B55]'}`}
                      >
                        {s === 'recent' ? 'NEW' : s === 'popular' ? 'TOP' : 'ACTIVE'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowComposer(!showComposer)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B6F34A] text-[#080A08] text-[10px] font-mono uppercase tracking-[0.1em] font-medium hover:bg-[#c8ff66] transition-colors shrink-0 ml-auto"
                  >
                    <Plus className="w-3 h-3" />
                    NEW POST
                  </button>
                </div>
              </div>

              {/* Composer */}
              <AnimatePresence>
                {showComposer && (
                  <PostComposer onSubmit={handleCreatePost} onClose={() => setShowComposer(false)} isSubmitting={createPost.isPending} />
                )}
              </AnimatePresence>

              {/* Posts */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-white/[0.06] p-5 animate-pulse">
                      <div className="h-3 w-20 bg-white/[0.06] mb-3" />
                      <div className="h-4 w-48 bg-white/[0.06] mb-2" />
                      <div className="h-3 w-full bg-white/[0.04] mb-1" />
                      <div className="h-3 w-2/3 bg-white/[0.04]" />
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-3">
                  {posts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={i}
                      onClick={() => setSelectedPost(post)}
                      isSelected={selectedPost?.id === post.id}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center border border-white/[0.06]">
                  <div className="w-12 h-12 mx-auto mb-4 border border-white/[0.08] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#303530]" />
                  </div>
                  <p className="text-[14px] text-[#555B55] mb-1">
                    {search ? 'Nothing matches.' : 'The room is empty.'}
                  </p>
                  <p className="text-[11px] text-[#303530]">Start a conversation.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[260px] shrink-0">
              <Sidebar />
            </aside>
          </div>

          {/* Bottom CTA */}
          <section className="py-14 border-t border-white/[0.06]">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#303530] font-mono mb-1">NEXT MOVE</p>
                <p className="text-[16px] font-bold tracking-[-0.02em] text-[#F5F7F2]">Your turn to speak.</p>
              </div>
              <button
                onClick={() => setShowComposer(true)}
                className="relative group inline-flex items-center gap-2 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#080A08] overflow-hidden shrink-0"
              >
                <div className="absolute inset-0 bg-[#B6F34A] transition-all duration-300 group-hover:bg-[#c8ff66]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">+ New Post</span>
              </button>
            </motion.div>
          </section>
        </div>

        <footer className="border-t border-white/[0.06] py-8 px-5 md:px-8">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <Logo size="sm" animate={false} />
            <span className="text-[10px] text-[#303530] font-mono">© 2026</span>
          </div>
        </footer>
      </div>

      {/* Discussion Thread Sidebar */}
      <AnimatePresence>
        {selectedPost && (
          <DiscussionThread post={selectedPost} onClose={() => setSelectedPost(null)} currentUser={currentUser} onDelete={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </SidebarShell>
  )
}
