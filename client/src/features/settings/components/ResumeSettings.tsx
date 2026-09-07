import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, GripVertical, GraduationCap, Briefcase } from 'lucide-react'
import {
  useEducation,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
  useReorderEducation,
  useExperience,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  useReorderExperience,
  useUpdateProfile,
} from '../../../lib/hooks'
import { useAuth } from '../../auth/hooks/useAuth'

const ease = [0.22, 1, 0.36, 1] as const

interface EducationForm {
  id?: string
  institution: string
  degree: string
  fieldOfStudy: string
  startYear: string
  endYear: string
  description: string
}

interface ExperienceForm {
  id?: string
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
  techInput: string
  technologies: string[]
}

const emptyEducation: EducationForm = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startYear: '',
  endYear: '',
  description: '',
}

const emptyExperience: ExperienceForm = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  description: '',
  techInput: '',
  technologies: [],
}

export default function ResumeSettings() {
  const { user, refreshUser } = useAuth()

  const { data: eduEntries = [] } = useEducation()
  const createEdu = useCreateEducation()
  const updateEdu = useUpdateEducation()
  const deleteEdu = useDeleteEducation()
  const reorderEdu = useReorderEducation()

  const { data: expEntries = [] } = useExperience()
  const createExp = useCreateExperience()
  const updateExp = useUpdateExperience()
  const deleteExp = useDeleteExperience()
  const reorderExp = useReorderExperience()

  const updateProfile = useUpdateProfile()

  const [linkedin, setLinkedin] = useState((user as any)?.linkedinUrl ?? '')
  const [educations, setEducations] = useState<EducationForm[]>([])
  const [experiences, setExperiences] = useState<ExperienceForm[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeSection, setActiveSection] = useState<'education' | 'experience'>('education')

  useEffect(() => {
    if (eduEntries.length > 0 && educations.length === 0) {
      setEducations(
        eduEntries.map((e) => ({
          id: e.id,
          institution: e.institution,
          degree: e.degree ?? '',
          fieldOfStudy: e.fieldOfStudy ?? '',
          startYear: String(e.startYear),
          endYear: e.endYear != null ? String(e.endYear) : '',
          description: e.description ?? '',
        }))
      )
    }
  }, [eduEntries])

  useEffect(() => {
    if (expEntries.length > 0 && experiences.length === 0) {
      setExperiences(
        expEntries.map((e) => ({
          id: e.id,
          company: e.company,
          role: e.role,
          startDate: e.startDate.split('T')[0],
          endDate: e.endDate ? e.endDate.split('T')[0] : '',
          description: e.description ?? '',
          techInput: '',
          technologies: e.technologies,
        }))
      )
    }
  }, [expEntries])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSaveLinkedin = async () => {
    try {
      await updateProfile.mutateAsync({ linkedinUrl: linkedin || null })
      refreshUser()
      showMessage('success', 'LinkedIn saved.')
    } catch {
      showMessage('error', 'Failed to save LinkedIn.')
    }
  }

  const handleAddEducation = () => {
    setEducations([...educations, { ...emptyEducation }])
  }

  const handleRemoveEducation = async (index: number) => {
    const entry = educations[index]
    const updated = educations.filter((_, i) => i !== index)
    setEducations(updated)
    if (entry.id) {
      try {
        await deleteEdu.mutateAsync(entry.id)
      } catch {
        showMessage('error', 'Failed to delete education entry.')
      }
    }
  }

  const handleEducationChange = (index: number, field: keyof EducationForm, value: string) => {
    setEducations(educations.map((e, i) => (i === index ? { ...e, [field]: value } : e)))
  }

  const handleSaveEducations = async () => {
    try {
      const ids: string[] = []
      for (const edu of educations) {
        if (!edu.institution.trim()) continue
        const data = {
          institution: edu.institution,
          degree: edu.degree || null,
          fieldOfStudy: edu.fieldOfStudy || null,
          startYear: parseInt(edu.startYear) || new Date().getFullYear(),
          endYear: edu.endYear ? parseInt(edu.endYear) : null,
          description: edu.description || null,
        }
        if (edu.id) {
          await updateEdu.mutateAsync({ id: edu.id, ...data })
          ids.push(edu.id)
        } else {
          const created = await createEdu.mutateAsync(data)
          ids.push(created.id)
        }
      }
      if (ids.length > 1) {
        await reorderEdu.mutateAsync(ids)
      }
      showMessage('success', 'Education saved.')
    } catch {
      showMessage('error', 'Failed to save education.')
    }
  }

  const handleAddExperience = () => {
    setExperiences([...experiences, { ...emptyExperience }])
  }

  const handleRemoveExperience = async (index: number) => {
    const entry = experiences[index]
    const updated = experiences.filter((_, i) => i !== index)
    setExperiences(updated)
    if (entry.id) {
      try {
        await deleteExp.mutateAsync(entry.id)
      } catch {
        showMessage('error', 'Failed to delete experience entry.')
      }
    }
  }

  const handleExperienceChange = (index: number, field: keyof ExperienceForm, value: string) => {
    setExperiences(experiences.map((e, i) => (i === index ? { ...e, [field]: value } : e)))
  }

  const addTechToExp = (index: number) => {
    const exp = experiences[index]
    const tech = exp.techInput.trim()
    if (tech && !exp.technologies.includes(tech)) {
      setExperiences(
        experiences.map((e, i) =>
          i === index
            ? { ...e, technologies: [...e.technologies, tech], techInput: '' }
            : e
        )
      )
    }
  }

  const removeTechFromExp = (expIndex: number, techIndex: number) => {
    setExperiences(
      experiences.map((e, i) =>
        i === expIndex
          ? { ...e, technologies: e.technologies.filter((_, ti) => ti !== techIndex) }
          : e
      )
    )
  }

  const handleSaveExperiences = async () => {
    try {
      const ids: string[] = []
      for (const exp of experiences) {
        if (!exp.company.trim() || !exp.role.trim()) continue
        const data = {
          company: exp.company,
          role: exp.role,
          startDate: exp.startDate || new Date().toISOString(),
          endDate: exp.endDate || null,
          description: exp.description || null,
          technologies: exp.technologies,
        }
        if (exp.id) {
          await updateExp.mutateAsync({ id: exp.id, ...data })
          ids.push(exp.id)
        } else {
          const created = await createExp.mutateAsync(data)
          ids.push(created.id)
        }
      }
      if (ids.length > 1) {
        await reorderExp.mutateAsync(ids)
      }
      showMessage('success', 'Experience saved.')
    } catch {
      showMessage('error', 'Failed to save experience.')
    }
  }

  const isSaving = createEdu.isPending || updateEdu.isPending || createExp.isPending || updateExp.isPending

  return (
    <div className="space-y-6">
      {/* LinkedIn */}
      <div className="border border-white/[0.06] p-6">
        <h3 className="text-[13px] font-bold tracking-[-0.01em] text-[#F5F7F2] mb-4">
          LinkedIn Profile
        </h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-[11px] uppercase tracking-[0.12em] text-[#555B55] font-mono mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
              className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveLinkedin}
            disabled={updateProfile.isPending}
            className="px-4 py-2 bg-white/[0.06] border border-white/[0.08] text-[12px] uppercase tracking-[0.1em] text-[#F5F7F2] hover:bg-white/[0.1] transition-colors disabled:opacity-50 font-mono"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save'}
          </motion.button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 border-b border-white/[0.06]">
        <button
          onClick={() => setActiveSection('education')}
          className={`flex items-center gap-2 px-4 py-3 text-[12px] uppercase tracking-[0.1em] font-mono transition-colors ${
            activeSection === 'education'
              ? 'text-[#B6F34A] border-b-2 border-[#B6F34A]'
              : 'text-[#555B55] hover:text-[#8A8F89]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Education
        </button>
        <button
          onClick={() => setActiveSection('experience')}
          className={`flex items-center gap-2 px-4 py-3 text-[12px] uppercase tracking-[0.1em] font-mono transition-colors ${
            activeSection === 'experience'
              ? 'text-[#B6F34A] border-b-2 border-[#B6F34A]'
              : 'text-[#555B55] hover:text-[#8A8F89]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Experience
        </button>
      </div>

      {/* Education Section */}
      {activeSection === 'education' && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {educations.map((edu, i) => (
              <motion.div
                key={edu.id ?? `new-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease }}
                className="border border-white/[0.06] p-5 relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-[#303530]" />
                    <span className="text-[11px] font-mono text-[#555B55]">
                      {edu.id ? `Entry ${i + 1}` : 'New Entry'}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveEducation(i)}
                    className="text-[#555B55] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(i, 'institution', e.target.value)}
                      placeholder="University of ..."
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(i, 'degree', e.target.value)}
                      placeholder="B.S., M.S., Ph.D."
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleEducationChange(i, 'fieldOfStudy', e.target.value)}
                      placeholder="Computer Science"
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Start Year *
                    </label>
                    <input
                      type="number"
                      value={edu.startYear}
                      onChange={(e) => handleEducationChange(i, 'startYear', e.target.value)}
                      placeholder="2020"
                      min="1900"
                      max="2099"
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      End Year
                    </label>
                    <input
                      type="number"
                      value={edu.endYear}
                      onChange={(e) => handleEducationChange(i, 'endYear', e.target.value)}
                      placeholder="Present"
                      min="1900"
                      max="2099"
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Description
                    </label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => handleEducationChange(i, 'description', e.target.value)}
                      placeholder="Activities, achievements, relevant coursework..."
                      rows={2}
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddEducation}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.08] text-[12px] uppercase tracking-[0.1em] text-[#8A8F89] hover:text-[#F5F7F2] hover:bg-white/[0.1] transition-colors font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Education
            </motion.button>

            {educations.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveEducations}
                disabled={isSaving}
                className="px-4 py-2 bg-[#B6F34A] text-black text-[12px] uppercase tracking-[0.1em] font-bold hover:bg-[#a3e03a] transition-colors disabled:opacity-50 font-mono"
              >
                {isSaving ? 'Saving...' : 'Save Education'}
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {activeSection === 'experience' && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id ?? `new-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease }}
                className="border border-white/[0.06] p-5 relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-[#303530]" />
                    <span className="text-[11px] font-mono text-[#555B55]">
                      {exp.id ? `Entry ${i + 1}` : 'New Entry'}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveExperience(i)}
                    className="text-[#555B55] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(i, 'company', e.target.value)}
                      placeholder="Acme Inc."
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Role *
                    </label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(i, 'role', e.target.value)}
                      placeholder="Software Engineer"
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(i, 'startDate', e.target.value)}
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(i, 'endDate', e.target.value)}
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(i, 'description', e.target.value)}
                      placeholder="What did you build? What impact did you have?"
                      rows={2}
                      className="w-full bg-transparent border border-white/[0.08] text-[13px] text-[#F5F7F2] px-3 py-2 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.12em] text-[#303530] font-mono mb-1">
                      Technologies
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {exp.technologies.map((tech, ti) => (
                        <span
                          key={ti}
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-[#8A8F89] bg-white/[0.06] border border-white/[0.08] px-2 py-0.5"
                        >
                          {tech}
                          <button
                            onClick={() => removeTechFromExp(i, ti)}
                            className="text-[#555B55] hover:text-red-400 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={exp.techInput}
                        onChange={(e) => handleExperienceChange(i, 'techInput', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTechToExp(i)
                          }
                        }}
                        placeholder="Add technology..."
                        className="flex-1 bg-transparent border border-white/[0.08] text-[12px] text-[#F5F7F2] px-3 py-1.5 placeholder-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addTechToExp(i)}
                        className="px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] text-[11px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors font-mono"
                      >
                        Add
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddExperience}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.08] text-[12px] uppercase tracking-[0.1em] text-[#8A8F89] hover:text-[#F5F7F2] hover:bg-white/[0.1] transition-colors font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Experience
            </motion.button>

            {experiences.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveExperiences}
                disabled={isSaving}
                className="px-4 py-2 bg-[#B6F34A] text-black text-[12px] uppercase tracking-[0.1em] font-bold hover:bg-[#a3e03a] transition-colors disabled:opacity-50 font-mono"
              >
                {isSaving ? 'Saving...' : 'Save Experience'}
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Feedback message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-[12px] font-mono ${
              message.type === 'success' ? 'text-[#B6F34A]' : 'text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
