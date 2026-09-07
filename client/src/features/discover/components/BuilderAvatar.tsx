interface BuilderAvatarProps {
  letter: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-[13px]',
  lg: 'w-14 h-14 text-[16px]',
}

export default function BuilderAvatar({ letter, size = 'md' }: BuilderAvatarProps) {
  return (
    <div className={`${sizes[size]} rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#8A8F89] font-mono font-bold shrink-0`}>
      {letter}
    </div>
  )
}
