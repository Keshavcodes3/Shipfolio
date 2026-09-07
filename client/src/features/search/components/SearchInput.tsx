import { useRef, useEffect, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
  autoFocus?: boolean
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onKeyDown, placeholder = 'Search projects, builders, technologies...', autoFocus = false }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = ref || internalRef

    useEffect(() => {
      if (autoFocus) {
        const el = (inputRef as React.RefObject<HTMLInputElement>).current
        el?.focus()
      }
    }, [autoFocus, inputRef])

    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555B55]" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/[0.06] pl-12 pr-12 py-4 text-[15px] text-[#F5F7F2] placeholder-[#555B55] outline-none focus:border-[#B6F34A]/30 transition-colors duration-200"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555B55] hover:text-[#F5F7F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput
