import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface DiscoverSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function DiscoverSearch({ value, onChange, placeholder = 'Search projects...' }: DiscoverSearchProps) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease }}
      className="relative"
    >
      <div
        className="flex items-center gap-3 border px-4 py-3 transition-all duration-300 bg-white/[0.02]"
        style={{
          borderColor: focused ? 'rgba(182,243,74,0.4)' : 'rgba(255,255,255,0.06)',
          boxShadow: focused ? '0 0 20px rgba(182,243,74,0.06)' : 'none',
        }}
      >
        <Search className="w-4 h-4 text-[#555B55] shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[14px] text-[#F5F7F2] placeholder-[#303530] outline-none min-w-0"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-[#555B55] hover:text-[#8A8F89] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
