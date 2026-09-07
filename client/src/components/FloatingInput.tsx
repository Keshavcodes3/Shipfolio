import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type FloatingInputProps = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  icon?: React.ReactNode
  showPasswordToggle?: boolean
}

export default function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon,
  showPasswordToggle = false,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && showPassword ? 'text' : type
  const hasValue = value.length > 0

  return (
    <div className="relative">
      <div className={`relative border-b transition-colors duration-300 ${focused ? 'border-[#B6F34A]/70' : 'border-white/[0.10]'}`}>
        {icon && (
          <div className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? 'text-[#8A8F89]' : 'text-[#555B55]'}`}>
            {icon}
          </div>
        )}
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          autoComplete={id === 'username' ? 'username' : id === 'email' ? 'email' : type === 'password' ? 'new-password' : 'off'}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`peer w-full bg-transparent pb-3 pt-6 min-h-[48px] text-[14px] text-[#F5F7F2] outline-none placeholder:text-transparent ${icon ? 'pl-8' : ''} ${showPasswordToggle ? 'pr-10' : ''}`}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute transition-all duration-200 ${icon ? 'left-8' : 'left-0'} ${focused || hasValue ? 'top-1 text-[9px] uppercase tracking-[0.2em] text-[#555B55]' : 'top-1/2 -translate-y-1/2 text-[14px] text-[#8A8F89]'}`}
        >
          {label}
        </label>
        {showPasswordToggle && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((c) => !c)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#555B55] transition-colors duration-200 hover:text-[#F5F7F2]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
