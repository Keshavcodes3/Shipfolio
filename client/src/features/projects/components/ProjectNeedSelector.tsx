import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Edit3 } from 'lucide-react'
import {
  useProjectNeeds,
  useCreateProjectNeed,
  useUpdateProjectNeed,
  useDeleteProjectNeed,
} from '../../../lib/hooks'
import type { ProjectNeedType } from '../types/projectNeed'
import { NEED_TYPE_LABELS, ALL_NEED_TYPES } from '../types/projectNeed'

interface ProjectNeedSelectorProps {
  projectId: string
  isOwner: boolean
}

export default function ProjectNeedSelector({ projectId, isOwner }: ProjectNeedSelectorProps) {
  const { data: needs = [], isLoading } = useProjectNeeds(projectId)
  const createNeed = useCreateProjectNeed()
  const updateNeed = useUpdateProjectNeed()
  const deleteNeed = useDeleteProjectNeed()

  const [showAdd, setShowAdd] = useState(false)
  const [selectedType, setSelectedType] = useState<ProjectNeedType | null>(null)
  const [note, setNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')

  const existingTypes = needs.map((n) => n.type)
  const availableTypes = ALL_NEED_TYPES.filter((t) => !existingTypes.includes(t))

  const handleAdd = async () => {
    if (!selectedType) return
    await createNeed.mutateAsync({
      projectId,
      type: selectedType,
      note: note.trim() || null,
    })
    setSelectedType(null)
    setNote('')
    setShowAdd(false)
  }

  const handleUpdate = async (needId: string) => {
    await updateNeed.mutateAsync({
      projectId,
      needId,
      note: editNote.trim() || null,
    })
    setEditingId(null)
    setEditNote('')
  }

  const handleDelete = async (needId: string) => {
    await deleteNeed.mutateAsync({ projectId, needId })
  }

  if (isLoading) return null

  return (
    <div className="space-y-4">
      {needs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {needs.map((need) => (
            <div
              key={need.id}
              className="group relative flex items-start gap-3 border border-white/[0.08] bg-white/[0.02] px-4 py-3 hover:border-[#B6F34A]/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B6F34A]">
                    {NEED_TYPE_LABELS[need.type]}
                  </span>
                  {need.interestCount > 0 && (
                    <span className="text-[9px] font-mono text-[#555B55] border border-white/[0.06] px-1.5 py-0.5">
                      {need.interestCount} {need.interestCount === 1 ? 'person' : 'people'}
                    </span>
                  )}
                </div>
                {need.note && (
                  <p className="text-[12px] text-[#8A8F89] leading-relaxed">{need.note}</p>
                )}
              </div>

              {isOwner && (
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(need.id)
                      setEditNote(need.note || '')
                    }}
                    className="p-1 text-[#555B55] hover:text-[#B6F34A] transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(need.id)}
                    className="p-1 text-[#555B55] hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-[#B6F34A]/20 bg-[#B6F34A]/[0.02] p-4">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-2">
                Note (optional, max 280 chars)
              </label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value.slice(0, 280))}
                rows={2}
                className="w-full bg-transparent border border-white/[0.08] p-3 text-[13px] text-[#F5F7F2] placeholder-[#303530] outline-none resize-none focus:border-[#B6F34A]/30 transition-colors"
                placeholder="What specifically do you need help with?"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-[#303530] font-mono">{editNote.length}/280</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingId(null); setEditNote('') }}
                    className="text-[11px] uppercase tracking-wider text-[#555B55] hover:text-[#8A8F89] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editingId && handleUpdate(editingId)}
                    disabled={updateNeed.isPending}
                    className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-colors disabled:opacity-30"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add button / form */}
      {isOwner && !showAdd && availableTypes.length > 0 && (
        <motion.button
          onClick={() => setShowAdd(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-[#555B55] hover:text-[#B6F34A] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add a need
        </motion.button>
      )}

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-[#B6F34A]/20 bg-[#B6F34A]/[0.02] p-5 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">
                  What do you need?
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-2 text-[12px] font-medium border transition-all duration-200 ${
                        selectedType === type
                          ? 'border-[#B6F34A]/50 bg-[#B6F34A]/[0.08] text-[#F5F7F2]'
                          : 'border-white/[0.06] text-[#8A8F89] hover:border-white/[0.12]'
                      }`}
                    >
                      {NEED_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              {selectedType && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-2">
                    Note (optional, max 280 chars)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 280))}
                    rows={2}
                    className="w-full bg-transparent border border-white/[0.08] p-3 text-[13px] text-[#F5F7F2] placeholder-[#303530] outline-none resize-none focus:border-[#B6F34A]/30 transition-colors"
                    placeholder="What specifically do you need help with?"
                  />
                  <p className="mt-1 text-right text-[10px] text-[#303530] font-mono">{note.length}/280</p>
                </motion.div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => { setShowAdd(false); setSelectedType(null); setNote('') }}
                  className="text-[11px] uppercase tracking-wider text-[#555B55] hover:text-[#8A8F89] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!selectedType || createNeed.isPending}
                  className="px-5 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {createNeed.isPending ? 'Adding...' : 'Add need'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
